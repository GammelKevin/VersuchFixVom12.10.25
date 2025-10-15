import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import './init-db';

// Track visitor
export async function POST(request: NextRequest) {
  try {
    // Improved IP address detection for various environments
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
    const xClientIp = request.headers.get('x-client-ip');

    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    const data = await request.json();
    const { page, sessionId } = data;

    let ip: string;

    // In development: Generate fake IPs for better visualization
    if (process.env.NODE_ENV === 'development') {
      // Use session ID to generate consistent fake IP per session
      if (sessionId) {
        const hash = sessionId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const octet1 = 192;
        const octet2 = 168;
        const octet3 = (hash % 10) + 1;
        const octet4 = (hash % 250) + 1;
        ip = `${octet1}.${octet2}.${octet3}.${octet4}`;
      } else {
        // Random IP for visualization
        ip = `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 250) + 1}`;
      }
    } else {
      // Production: Use real IP detection
      ip = forwardedFor?.split(',')[0]?.trim() ||
           realIp ||
           cfConnectingIp ||
           xClientIp ||
           '127.0.0.1';
    }

    // Insert visitor record
    await query(
      `INSERT INTO visitor_stats (ip_address, user_agent, page_visited, referrer, session_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [ip, userAgent, page || '/', referer, sessionId]
    );

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];

    // Check if IP visited today
    const existingVisitResult = await query(
      `SELECT id FROM visitor_stats
       WHERE ip_address = $1 AND DATE(visit_time) = $2
       LIMIT 1`,
      [ip, today]
    );

    if (existingVisitResult.rows.length === 0) {
      // New unique visitor today
      await query(
        `INSERT INTO daily_stats (date, total_visits, unique_visitors, gallery_views)
         VALUES ($1, 1, 1, 0)
         ON CONFLICT(date) DO UPDATE SET
         total_visits = daily_stats.total_visits + 1,
         unique_visitors = daily_stats.unique_visitors + 1`,
        [today]
      );
    } else {
      // Returning visitor
      await query(
        `INSERT INTO daily_stats (date, total_visits, unique_visitors, gallery_views)
         VALUES ($1, 1, 0, 0)
         ON CONFLICT(date) DO UPDATE SET
         total_visits = daily_stats.total_visits + 1`,
        [today]
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

// Get visitor statistics
export async function GET() {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const thisYear = now.getFullYear().toString();

    // Today's stats
    const todayStatsResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as unique_visitors,
              COUNT(*) as total_visits
       FROM visitor_stats
       WHERE DATE(visit_time) = $1`,
      [today]
    );

    // This month's stats
    const monthStatsResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as unique_visitors,
              COUNT(*) as total_visits
       FROM visitor_stats
       WHERE TO_CHAR(visit_time, 'YYYY-MM') = $1`,
      [thisMonth]
    );

    // This year's stats
    const yearStatsResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as unique_visitors,
              COUNT(*) as total_visits
       FROM visitor_stats
       WHERE TO_CHAR(visit_time, 'YYYY') = $1`,
      [thisYear]
    );

    // All time stats
    const allTimeStatsResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as unique_visitors,
              COUNT(*) as total_visits
       FROM visitor_stats`
    );

    // Recent visitors (last 50, excluding admin pages)
    const recentVisitorsResult = await query(
      `SELECT ip_address, page_visited, visit_time,
              CASE
                WHEN user_agent LIKE '%Mobile%' THEN 'Mobile'
                WHEN user_agent LIKE '%Tablet%' THEN 'Tablet'
                ELSE 'Desktop'
              END as device_type
       FROM visitor_stats
       WHERE page_visited NOT LIKE '/admin%'
         AND page_visited != '/login'
       ORDER BY visit_time DESC
       LIMIT 50`
    );

    // Top pages (excluding admin pages)
    const topPagesResult = await query(
      `SELECT page_visited, COUNT(*) as visits
       FROM visitor_stats
       WHERE page_visited NOT LIKE '/admin%'
         AND page_visited != '/login'
       GROUP BY page_visited
       ORDER BY visits DESC
       LIMIT 10`
    );

    // Hourly distribution for today
    const hourlyStatsResult = await query(
      `SELECT TO_CHAR(visit_time, 'HH24') as hour,
              COUNT(*) as visits
       FROM visitor_stats
       WHERE DATE(visit_time) = $1
       GROUP BY hour
       ORDER BY hour`,
      [today]
    );

    return NextResponse.json({
      success: true,
      data: {
        today: todayStatsResult.rows[0] || { unique_visitors: 0, total_visits: 0 },
        month: monthStatsResult.rows[0] || { unique_visitors: 0, total_visits: 0 },
        year: yearStatsResult.rows[0] || { unique_visitors: 0, total_visits: 0 },
        allTime: allTimeStatsResult.rows[0] || { unique_visitors: 0, total_visits: 0 },
        recentVisitors: recentVisitorsResult.rows,
        topPages: topPagesResult.rows,
        hourlyStats: hourlyStatsResult.rows
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

// Reset statistics
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmReset = searchParams.get('confirm');

    if (confirmReset !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Confirmation required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM visitor_stats');
    await query('DELETE FROM daily_stats');

    return NextResponse.json({
      success: true,
      message: 'All visitor statistics have been reset'
    });

  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset statistics' },
      { status: 500 }
    );
  }
}

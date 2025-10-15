import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Database path
const DB_PATH = path.resolve(process.cwd(), "restaurant.db");

async function getDatabase() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });
}

export async function GET() {
  try {
    const db = await getDatabase();

    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get monthly visits (excluding admin)
    const monthlyVisits = await db.get(
      `SELECT COUNT(*) as count FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND (page IS NULL OR page NOT LIKE '/admin%')`,
      [thirtyDaysAgo.toISOString()]
    );

    // Get total all-time visits (excluding admin)
    const totalVisits = await db.get(
      `SELECT COUNT(*) as count FROM page_visit
       WHERE page IS NULL OR page NOT LIKE '/admin%'`
    );

    // Get average visit time (excluding admin)
    const avgVisitTime = await db.get(
      `SELECT AVG(duration) as avg_duration FROM page_visit
       WHERE duration IS NOT NULL
       AND (page IS NULL OR page NOT LIKE '/admin%')`
    );

    // Get weekly visits data for chart (last 7 days)
    const weeklyVisits = await db.all(
      `SELECT
        DATE(timestamp) as date,
        COUNT(*) as visits
       FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND (page IS NULL OR page NOT LIKE '/admin%')
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [sevenDaysAgo.toISOString()]
    );

    // Get device statistics (last 30 days)
    const deviceStats = await db.all(
      `SELECT
        CASE
          WHEN operating_system LIKE '%iOS%' OR operating_system LIKE '%Android%' THEN 'mobile'
          WHEN operating_system LIKE '%Windows%' OR operating_system LIKE '%Mac%' OR operating_system LIKE '%Linux%' THEN 'desktop'
          ELSE 'tablet'
        END as device_type,
        COUNT(*) as count
       FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND (page IS NULL OR page NOT LIKE '/admin%')
       GROUP BY device_type`,
      [thirtyDaysAgo.toISOString()]
    );

    // Calculate percentages for device types
    const totalDeviceCount = deviceStats.reduce((sum, stat) => sum + (stat.count || 0), 0);
    const devicePercentages = {
      mobile: 0,
      desktop: 0,
      tablet: 0
    };

    if (totalDeviceCount > 0) {
      deviceStats.forEach(stat => {
        const percentage = Math.round((stat.count / totalDeviceCount) * 100);
        devicePercentages[stat.device_type as keyof typeof devicePercentages] = percentage;
      });
    }

    // Get browser statistics (last 30 days)
    const browserStats = await db.all(
      `SELECT
        browser,
        COUNT(*) as count
       FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND browser IS NOT NULL
       AND (page IS NULL OR page NOT LIKE '/admin%')
       GROUP BY browser
       ORDER BY count DESC
       LIMIT 5`,
      [thirtyDaysAgo.toISOString()]
    );

    // Get hourly activity pattern (average for last 30 days)
    const hourlyPattern = await db.all(
      `SELECT
        strftime('%H', timestamp) as hour,
        COUNT(*) as visits
       FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND (page IS NULL OR page NOT LIKE '/admin%')
       GROUP BY hour
       ORDER BY hour`,
      [thirtyDaysAgo.toISOString()]
    );

    // Get unique visitors count (last 30 days)
    const uniqueVisitors = await db.get(
      `SELECT COUNT(DISTINCT ip_address) as count
       FROM page_visit
       WHERE datetime(timestamp) >= datetime(?)
       AND (page IS NULL OR page NOT LIKE '/admin%')`,
      [thirtyDaysAgo.toISOString()]
    );

    // Get bounce rate approximation (single page visits)
    const bounceRate = await db.get(
      `SELECT
        ROUND(
          CAST(COUNT(DISTINCT CASE WHEN visit_count = 1 THEN ip_address END) AS FLOAT) /
          CAST(COUNT(DISTINCT ip_address) AS FLOAT) * 100,
          1
        ) as rate
       FROM (
         SELECT
           ip_address,
           COUNT(*) as visit_count
         FROM page_visit
         WHERE datetime(timestamp) >= datetime(?)
         AND (page IS NULL OR page NOT LIKE '/admin%')
         GROUP BY ip_address, DATE(timestamp)
       )`,
      [thirtyDaysAgo.toISOString()]
    );

    // Get returning visitors percentage
    const returningVisitors = await db.get(
      `SELECT
        ROUND(
          CAST(COUNT(DISTINCT CASE WHEN visit_days > 1 THEN ip_address END) AS FLOAT) /
          CAST(COUNT(DISTINCT ip_address) AS FLOAT) * 100,
          1
        ) as percentage
       FROM (
         SELECT
           ip_address,
           COUNT(DISTINCT DATE(timestamp)) as visit_days
         FROM page_visit
         WHERE datetime(timestamp) >= datetime(?)
         AND (page IS NULL OR page NOT LIKE '/admin%')
         GROUP BY ip_address
       )`,
      [thirtyDaysAgo.toISOString()]
    );

    await db.close();

    return NextResponse.json({
      success: true,
      data: {
        weeklyVisits: weeklyVisits || [],
        monthlyVisits: monthlyVisits?.count || 0,
        totalVisits: totalVisits?.count || 0,
        averageVisitTime: Math.round(avgVisitTime?.avg_duration || 0),
        deviceStats: devicePercentages,
        browserStats: browserStats || [],
        hourlyPattern: hourlyPattern || [],
        uniqueVisitors: uniqueVisitors?.count || 0,
        bounceRate: bounceRate?.rate || 0,
        returningVisitorsPercentage: returningVisitors?.percentage || 0
      }
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch historical statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

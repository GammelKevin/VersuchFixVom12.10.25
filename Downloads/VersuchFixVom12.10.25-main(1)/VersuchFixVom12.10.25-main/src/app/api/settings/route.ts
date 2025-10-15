import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Fetch settings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const key = searchParams.get('key');

    let sql = 'SELECT * FROM site_settings';
    const params: string[] = [];

    if (key) {
      sql += ' WHERE setting_key = $1';
      params.push(key);
    } else if (category) {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY category, setting_key';

    const result = await query(sql, params.length > 0 ? params : undefined);

    // Convert array of settings to object for easier access
    const settingsObj: { [key: string]: string } = {};
    result.rows.forEach((row) => {
      settingsObj[row.setting_key] = row.setting_value;
    });

    return NextResponse.json({
      success: true,
      data: {
        settings: settingsObj,
        raw: result.rows
      }
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session
    const sessionResult = await query(
      'SELECT user_id FROM user_sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const userId = sessionResult.rows[0].user_id;
    const body = await request.json();

    // Support updating single setting or multiple settings
    const updates = Array.isArray(body) ? body : [body];

    // Update each setting
    for (const update of updates) {
      const { key, value } = update;

      if (!key) {
        return NextResponse.json(
          { success: false, message: 'Setting key is required' },
          { status: 400 }
        );
      }

      await query(
        `UPDATE site_settings
         SET setting_value = $1,
             updated_at = CURRENT_TIMESTAMP,
             updated_by = $2
         WHERE setting_key = $3`,
        [value, userId, key]
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updates.length} setting(s) updated successfully`
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new setting (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session
    const sessionResult = await query(
      'SELECT user_id FROM user_sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const userId = sessionResult.rows[0].user_id;
    const body = await request.json();
    const { key, value, category, description, type = 'text' } = body;

    if (!key || !category) {
      return NextResponse.json(
        { success: false, message: 'Key and category are required' },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO site_settings (setting_key, setting_value, category, description, setting_type, updated_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [key, value, category, description, type, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Setting created successfully'
    });

  } catch (error) {
    console.error('Settings create error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create setting',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { query } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';

// German weekday order for proper sorting
const WEEKDAY_ORDER: { [key: string]: number } = {
  Montag: 1,
  Dienstag: 2,
  Mittwoch: 3,
  Donnerstag: 4,
  Freitag: 5,
  Samstag: 6,
  Sonntag: 7,
};

export async function GET() {
  try {
    // Get opening hours
    const result = await query(`
      SELECT
        id,
        day_name as day,
        open_time_1,
        close_time_1,
        open_time_2,
        close_time_2,
        is_closed as closed
      FROM opening_hours
      ORDER BY day_of_week
    `);

    const openingHours = result.rows;

    // Sort by weekday order
    const sortedHours = openingHours
      .map((hours) => ({
        ...hours,
        is_today: isToday(hours.day),
      }))
      .sort(
        (a, b) => (WEEKDAY_ORDER[a.day] || 999) - (WEEKDAY_ORDER[b.day] || 999),
      );

    return NextResponse.json({
      success: true,
      data: sortedHours,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch opening hours",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.day) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Update the opening hours
    await query(
      `UPDATE opening_hours
       SET open_time_1 = $1,
           close_time_1 = $2,
           open_time_2 = $3,
           close_time_2 = $4,
           is_closed = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [
        body.open_time_1 || null,
        body.close_time_1 || null,
        body.open_time_2 || null,
        body.close_time_2 || null,
        body.closed || false,
        body.id,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Öffnungszeiten erfolgreich aktualisiert",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Fehler beim Aktualisieren der Öffnungszeiten",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

function isToday(dayName: string): boolean {
  const days = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const today = new Date().getDay();
  return days[today] === dayName;
}

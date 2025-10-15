import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyAdminAuth } from "@/lib/auth";

// GET: Get vacation settings
export async function GET() {
  try {
    const result = await query(
      "SELECT * FROM vacation_settings ORDER BY id DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          is_active: false,
          start_date: null,
          end_date: null,
          message: "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching vacation settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch vacation settings",
      },
      { status: 500 }
    );
  }
}

// PUT: Update vacation settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { is_active, start_date, end_date, message } = body;

    // Validation
    if (is_active) {
      if (!start_date || !end_date) {
        return NextResponse.json(
          {
            success: false,
            error: "Start und End-Datum sind erforderlich wenn Urlaubsmodus aktiv ist",
          },
          { status: 400 }
        );
      }

      // Check if end_date >= start_date
      if (new Date(end_date) < new Date(start_date)) {
        return NextResponse.json(
          {
            success: false,
            error: "End-Datum muss nach dem Start-Datum liegen",
          },
          { status: 400 }
        );
      }
    }

    // Update or insert
    const result = await query(
      `INSERT INTO vacation_settings (id, is_active, start_date, end_date, message, updated_at)
       VALUES (1, $1, $2, $3, $4, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         is_active = $1,
         start_date = $2,
         end_date = $3,
         message = $4,
         updated_at = NOW()
       RETURNING *`,
      [
        is_active,
        is_active ? start_date : null,
        is_active ? end_date : null,
        message || "",
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Urlaubsmodus erfolgreich aktualisiert",
    });
  } catch (error) {
    console.error("Error updating vacation settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update vacation settings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

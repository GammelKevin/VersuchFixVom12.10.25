import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import crypto from "crypto";

// POST: Log user consent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { consent, version, timestamp } = body;

    // Generate consent ID (stored in localStorage on client)
    const consentId =
      crypto.randomBytes(16).toString("hex") + "-" + Date.now();

    // Get IP address (pseudonymized with SHA-256)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // Get User Agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Store consent in database
    await query(
      `INSERT INTO user_consents (consent_id, consent_given, consent_timestamp, banner_version, user_agent, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (consent_id)
       DO UPDATE SET
         consent_given = $2,
         consent_timestamp = $3,
         banner_version = $4,
         user_agent = $5,
         ip_hash = $6`,
      [
        consentId,
        JSON.stringify(consent),
        timestamp,
        version,
        userAgent,
        ipHash,
      ]
    );

    return NextResponse.json({
      success: true,
      consentId,
      message: "Consent logged successfully",
    });
  } catch (error) {
    console.error("Error logging consent:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to log consent",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

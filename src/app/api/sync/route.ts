import { NextRequest, NextResponse } from "next/server";
import { syncSurveysToMySQL, checkMySQLConnection } from "@/lib/sync-mysql";
import { Survey } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const surveys: Survey[] = await request.json();

    if (!surveys || !Array.isArray(surveys)) {
      return NextResponse.json(
        { error: "Invalid surveys data" },
        { status: 400 }
      );
    }

    // Check if MySQL is available
    const isMySQLAvailable = await checkMySQLConnection();

    if (!isMySQLAvailable) {
      return NextResponse.json(
        {
          success: false,
          syncedCount: 0,
          failedCount: 0,
          errors: ["MySQL database is not available"],
        },
        { status: 503 }
      );
    }

    // Sync surveys to MySQL
    const syncResult = await syncSurveysToMySQL(surveys);

    return NextResponse.json({
      success: syncResult.success,
      syncedCount: syncResult.synced,
      failedCount: syncResult.failed,
      errors: syncResult.errors,
    });
  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json(
      {
        success: false,
        syncedCount: 0,
        failedCount: 0,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isMySQLAvailable = await checkMySQLConnection();

    return NextResponse.json({
      available: isMySQLAvailable,
    });
  } catch (error) {
    console.error("MySQL connection check error:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}

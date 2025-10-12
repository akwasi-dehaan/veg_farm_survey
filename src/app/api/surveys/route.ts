import { NextRequest, NextResponse } from "next/server";
import { Survey } from "@/lib/types";
import { getConnection } from "@/lib/mysql";

export async function POST(request: NextRequest) {
  const connection = await getConnection();

  try {
    const survey: Survey = await request.json();

    // Validate required fields
    if (!survey.surveyId || !survey.respondentName || !survey.enumeratorName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add server-side metadata
    const serverSurvey: Survey = {
      ...survey,
      timestamp: new Date().toISOString(),
      syncStatus: "synced",
      syncedAt: new Date().toISOString(),
    };

    // Store the survey in MySQL
    await connection.execute(
      `INSERT INTO surveys (id, survey_data, status, enumerator_id, location) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        serverSurvey.surveyId,
        JSON.stringify(serverSurvey),
        "synced",
        serverSurvey.enumeratorName,
        serverSurvey.farmLocation || null,
      ]
    );

    return NextResponse.json(
      {
        message: "Survey saved successfully",
        survey: serverSurvey,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function GET(request: NextRequest) {
  const connection = await getConnection();

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM surveys";
    let params: any[] = [];

    if (status && ["draft", "submitted", "synced"].includes(status)) {
      query += " WHERE status = ?";
      params.push(status);
    }

    query += " ORDER BY created_at DESC";

    const rows = await connection.query(query, params);
    const surveys = rows.map((row: any) => JSON.parse(row.survey_data));

    return NextResponse.json({
      surveys: surveys,
      total: surveys.length,
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function PUT(request: NextRequest) {
  const connection = await getConnection();

  try {
    const { surveyId, ...updateData } = await request.json();

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID is required" },
        { status: 400 }
      );
    }

    // Check if survey exists
    const existingRows = await connection.query(
      "SELECT * FROM surveys WHERE id = ?",
      [surveyId]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Update the survey
    const updatedSurvey = {
      ...JSON.parse(existingRows[0].survey_data),
      ...updateData,
      syncedAt: new Date().toISOString(),
    };

    await connection.execute(
      `UPDATE surveys 
       SET survey_data = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [JSON.stringify(updatedSurvey), surveyId]
    );

    return NextResponse.json({
      message: "Survey updated successfully",
      survey: updatedSurvey,
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function DELETE(request: NextRequest) {
  const connection = await getConnection();

  try {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get("surveyId");

    if (!surveyId) {
      return NextResponse.json(
        { error: "Survey ID is required" },
        { status: 400 }
      );
    }

    // Check if survey exists
    const existingRows = await connection.query(
      "SELECT * FROM surveys WHERE id = ?",
      [surveyId]
    );

    if (existingRows.length === 0) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    // Delete the survey
    await connection.execute("DELETE FROM surveys WHERE id = ?", [surveyId]);

    return NextResponse.json({
      message: "Survey deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting survey:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

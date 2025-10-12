import { Survey } from "./types";
import { getConnection } from "./mysql";

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

// Sync surveys from IndexedDB to MySQL
export const syncSurveysToMySQL = async (
  surveys: Survey[]
): Promise<SyncResult> => {
  const result: SyncResult = {
    success: true,
    synced: 0,
    failed: 0,
    errors: [],
  };

  if (surveys.length === 0) {
    return result;
  }

  const connection = await getConnection();

  try {
    for (const survey of surveys) {
      try {
        // Check if survey already exists in MySQL
        const existingRows = await connection.query(
          "SELECT id FROM surveys WHERE id = ?",
          [survey.surveyId]
        );

        if (existingRows.length > 0) {
          // Update existing survey
          await connection.execute(
            `UPDATE surveys 
             SET survey_data = ?, updated_at = CURRENT_TIMESTAMP, synced_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [JSON.stringify(survey), survey.surveyId]
          );
        } else {
          // Insert new survey
          // Map syncStatus to valid ENUM values
          const mapSyncStatus = (status: string | undefined): string => {
            switch (status) {
              case "pending":
                return "pending";
              case "failed":
                return "failed";
              case "synced":
                return "synced";
              default:
                return "synced";
            }
          };

          await connection.execute(
            `INSERT INTO surveys (id, survey_data, status, enumerator_id, location, synced_at) 
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
              survey.surveyId,
              JSON.stringify(survey),
              mapSyncStatus(survey.syncStatus),
              survey.enumeratorName || null,
              survey.location || null,
            ]
          );
        }

        result.synced++;
      } catch (error) {
        result.failed++;
        result.errors.push(
          `Failed to sync survey ${survey.surveyId}: ${error}`
        );
        console.error(`Error syncing survey ${survey.surveyId}:`, error);
      }
    }

    if (result.failed > 0) {
      result.success = false;
    }
  } catch (error) {
    result.success = false;
    result.errors.push(`Database connection error: ${error}`);
    console.error("Sync error:", error);
  } finally {
    await connection.end();
  }

  return result;
};

// Get surveys from MySQL
export const getSurveysFromMySQL = async (): Promise<Survey[]> => {
  const connection = await getConnection();

  try {
    const rows = await connection.query(
      "SELECT survey_data FROM surveys ORDER BY created_at DESC"
    );

    return rows.map((row: any) => JSON.parse(row.survey_data));
  } catch (error) {
    console.error("Error fetching surveys from MySQL:", error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Check if MySQL is available
export const checkMySQLConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.query("SELECT 1");
    await connection.end();
    return true;
  } catch (error) {
    console.error("MySQL connection check failed:", error);
    return false;
  }
};

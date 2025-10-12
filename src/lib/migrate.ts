import { initializeDatabase, testConnection } from "./mysql";

// Database migration script
export const runMigrations = async (): Promise<void> => {
  console.log("Starting database migrations...");

  try {
    // First, try to create the database if it doesn't exist
    const { getConnection } = await import("./mysql");
    const connection = await getConnection();

    try {
      // Try to create the database
      await connection.execute(
        `CREATE DATABASE IF NOT EXISTS ${
          process.env.DB_NAME || "youth_farming_survey"
        }`
      );
      console.log("Database created or already exists");
    } catch (dbError) {
      console.log("Database creation skipped or failed:", dbError);
    }

    await connection.end();

    // Test connection to the specific database
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Cannot connect to database");
    }

    console.log("Database connection successful");

    // Initialize schema
    await initializeDatabase();

    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migrations completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration failed:", error);
      process.exit(1);
    });
}

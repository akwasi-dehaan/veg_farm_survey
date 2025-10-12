import mysql from "mysql2/promise";

// Create database script
export const createDatabase = async (): Promise<void> => {
  console.log("Creating database...");

  try {
    // Connect without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    // Create database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${
        process.env.DB_NAME || "youth_farming_survey"
      }`
    );
    console.log("Database created successfully");

    await connection.end();
  } catch (error) {
    console.error("Failed to create database:", error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  createDatabase()
    .then(() => {
      console.log("Database creation completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database creation failed:", error);
      process.exit(1);
    });
}

import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "youth_farming_survey",
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Database connection interface
export interface DatabaseConnection {
  query: (sql: string, params?: any[]) => Promise<any[]>;
  execute: (sql: string, params?: any[]) => Promise<any>;
  end: () => Promise<void>;
}

// Get connection from pool
export const getConnection = async (): Promise<DatabaseConnection> => {
  const connection = await pool.getConnection();

  return {
    query: async (sql: string, params?: any[]) => {
      const [rows] = await connection.execute(sql, params);
      return rows as any[];
    },
    execute: async (sql: string, params?: any[]) => {
      const [result] = await connection.execute(sql, params);
      return result;
    },
    end: async () => {
      connection.release();
    },
  };
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await getConnection();
    await connection.query("SELECT 1");
    await connection.end();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
};

// Initialize database schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    const connection = await getConnection();

    // Create surveys table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS surveys (
        id VARCHAR(36) PRIMARY KEY,
        survey_data JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        synced_at TIMESTAMP NULL,
        status ENUM('draft', 'pending', 'submitted', 'synced', 'failed') DEFAULT 'draft',
        enumerator_id VARCHAR(100),
        location VARCHAR(255),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_enumerator_id (enumerator_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await connection.end();
    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Close all connections
export const closeConnections = async (): Promise<void> => {
  await pool.end();
};

export default pool;

import { Survey } from "./types";

const DB_NAME = "YouthFarmingSurveyDB";
const DB_VERSION = 3; // Further increased version to force upgrade
const STORE_NAME = "surveys";

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = (event.target as IDBOpenDBRequest).transaction;

      // Delete existing store if it exists to avoid conflicts
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      // Create new store
      const store = db.createObjectStore(STORE_NAME, { keyPath: "surveyId" });
      store.createIndex("timestamp", "timestamp", { unique: false });
      store.createIndex("syncStatus", "syncStatus", { unique: false });

      console.log("Database upgraded to version", DB_VERSION);
    };

    request.onblocked = () => {
      console.warn("Database upgrade blocked. Please close other tabs.");
    };
  });
}

export async function saveSurvey(survey: Survey): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.put(survey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSurveys(): Promise<Survey[]> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getSurveyById(surveyId: string): Promise<Survey | null> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readonly");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(surveyId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  const db = await openDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(surveyId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSurveyCounts(): Promise<{
  total: number;
  pending: number;
  synced: number;
  failed: number;
}> {
  const surveys = await getAllSurveys();
  return {
    total: surveys.length,
    pending: surveys.filter((s) => s.syncStatus === "pending").length,
    synced: surveys.filter((s) => s.syncStatus === "synced").length,
    failed: surveys.filter((s) => s.syncStatus === "failed").length,
  };
}

// Clear all data from IndexedDB
export async function clearDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log("Database cleared successfully");
      resolve();
    };

    request.onerror = () => {
      console.error("Failed to clear database:", request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn("Database deletion blocked. Please close other tabs.");
      reject(new Error("Database deletion blocked"));
    };
  });
}

// Check if database exists and get its version
export async function getDatabaseInfo(): Promise<{
  exists: boolean;
  version: number;
}> {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME);

    request.onsuccess = () => {
      const db = request.result;
      const version = db.version;
      db.close();
      resolve({ exists: true, version });
    };

    request.onerror = () => {
      resolve({ exists: false, version: 0 });
    };
  });
}

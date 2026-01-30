// web-based/lib/db.ts
import { openDB, DBSchema } from 'idb';
import { Project } from '../types';

interface CrystalDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
  };
}

const DB_NAME = 'crystal-brain-db';
const STORE_NAME = 'projects';

export const initDB = async () => {
  return openDB<CrystalDB>(DB_NAME, 1, {
    upgrade(db) {
      // Create the 'projects' store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

// --- CRUD OPERATIONS ---

// 1. GET ALL PROJECTS
export const getAllProjects = async (): Promise<Project[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// 2. SAVE (Create or Update)
export const saveProject = async (project: Project) => {
  const db = await initDB();
  return db.put(STORE_NAME, project);
};

// 3. DELETE
export const deleteProject = async (id: string) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

// 4. SEED (Initial Mock Data)
// We use this so your app isn't empty the first time you load it
export const seedInitialData = async (initialProjects: Project[]) => {
  const db = await initDB();
  const count = await db.count(STORE_NAME);
  if (count === 0) {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    await Promise.all(initialProjects.map(p => tx.store.put(p)));
    await tx.done;
    return true; // Seeded
  }
  return false; // Already exists
};
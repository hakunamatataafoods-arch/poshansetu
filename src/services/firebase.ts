/**
 * Firebase Realtime Database Synchronization Service
 * Configured with https://poshan-setu-default-rtdb.firebaseio.com/
 * AWC Path: awc_awvad04 (04 Vadtal Centre, Taluka Anand)
 */

declare global {
  interface Window {
    firebase?: any;
  }
}

export const AWC_PATH = "awc_awvad04";
const FIREBASE_CONFIG = {
  databaseURL: "https://poshan-setu-default-rtdb.firebaseio.com/"
};

let dbInstance: any = null;
let isInitialized = false;

export function initFirebaseRTDB() {
  if (isInitialized) return dbInstance;
  try {
    if (typeof window !== 'undefined' && window.firebase) {
      if (!window.firebase.apps || window.firebase.apps.length === 0) {
        window.firebase.initializeApp(FIREBASE_CONFIG);
      }
      dbInstance = window.firebase.database();
      isInitialized = true;
      console.log('PoshanSetu Firebase RTDB initialized for AWC:', AWC_PATH);
    }
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
  return dbInstance;
}

// Local storage keys for offline resilience
const STORAGE_PREFIX = 'poshansetu_';

export function saveLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('Local storage write warning', e);
  }
}

export function loadLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (e) {
    return fallback;
  }
}

interface QueuedAction {
  id: string;
  path: string;
  data: any;
  timestamp: number;
}

export function queueOfflineSync(path: string, data: any) {
  const queue = loadLocal<QueuedAction[]>('sync_queue', []);
  queue.push({
    id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    path,
    data,
    timestamp: Date.now()
  });
  saveLocal('sync_queue', queue);
}

export function getOfflineQueueCount(): number {
  const queue = loadLocal<QueuedAction[]>('sync_queue', []);
  return queue.length;
}

export async function syncOfflineQueue(): Promise<{ success: boolean; syncedCount: number }> {
  const queue = loadLocal<QueuedAction[]>('sync_queue', []);
  if (queue.length === 0) return { success: true, syncedCount: 0 };

  const db = initFirebaseRTDB();
  if (!db) {
    return { success: false, syncedCount: 0 };
  }

  let synced = 0;
  const remaining: QueuedAction[] = [];

  for (const item of queue) {
    try {
      await db.ref(item.path).push({
        ...item.data,
        syncedAt: new Date().toISOString()
      });
      synced++;
    } catch (err) {
      console.warn('Error syncing item:', item, err);
      remaining.push(item);
    }
  }

  saveLocal('sync_queue', remaining);
  return { success: remaining.length === 0, syncedCount: synced };
}

export async function pushFirebaseData(subPath: string, payload: any, isOnline = true): Promise<boolean> {
  const fullPath = `${AWC_PATH}/${subPath}`;
  if (!isOnline) {
    queueOfflineSync(fullPath, payload);
    return false; // queued locally
  }

  const db = initFirebaseRTDB();
  if (!db) {
    queueOfflineSync(fullPath, payload);
    return false;
  }

  try {
    await db.ref(fullPath).push({
      ...payload,
      recordedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.warn('Direct RTDB push failed, queuing offline:', err);
    queueOfflineSync(fullPath, payload);
    return false;
  }
}

export async function updateFirebaseInventory(inventoryData: Record<string, number>, isOnline = true) {
  const fullPath = `${AWC_PATH}/inventory`;
  if (!isOnline) {
    queueOfflineSync(fullPath, inventoryData);
    return;
  }
  const db = initFirebaseRTDB();
  if (!db) {
    queueOfflineSync(fullPath, inventoryData);
    return;
  }
  try {
    await db.ref(fullPath).set({
      ...inventoryData,
      lastUpdated: new Date().toISOString()
    });
  } catch (err) {
    queueOfflineSync(fullPath, inventoryData);
  }
}

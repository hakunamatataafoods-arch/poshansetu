/**
 * Firebase Realtime Database Synchronization Service
 * Supports both Firebase JS SDK and direct HTTPS REST API with live connectivity diagnostics.
 * AWC Path: awc_awvad04 (04 Vadtal Centre, Taluka Anand)
 */

declare global {
  interface Window {
    firebase?: any;
  }
}

export const AWC_PATH = "awc_awvad04";
export const DEFAULT_RTDB_URL = "https://poshan-setu-default-rtdb.firebaseio.com";
const STORAGE_RTDB_URL_KEY = 'poshansetu_custom_rtdb_url';
const STORAGE_PREFIX = 'poshansetu_';

export function getDatabaseURL(): string {
  try {
    const saved = localStorage.getItem(STORAGE_RTDB_URL_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_RTDB_URL;
}

export function setDatabaseURL(url: string): string {
  const cleaned = url.trim().replace(/\/+$/, '');
  try {
    localStorage.setItem(STORAGE_RTDB_URL_KEY, cleaned);
    isInitialized = false;
    dbInstance = null;
    initFirebaseRTDB();
  } catch (e) {
    console.warn('Could not save database URL to local storage', e);
  }
  return cleaned;
}

export function resetDatabaseURL(): string {
  try {
    localStorage.removeItem(STORAGE_RTDB_URL_KEY);
    isInitialized = false;
    dbInstance = null;
    initFirebaseRTDB();
  } catch (e) {}
  return DEFAULT_RTDB_URL;
}

let dbInstance: any = null;
let isInitialized = false;

export function initFirebaseRTDB() {
  if (isInitialized && dbInstance) return dbInstance;
  const currentUrl = getDatabaseURL();

  try {
    if (typeof window !== 'undefined' && window.firebase) {
      // Reinitialize if url changed or no apps
      if (window.firebase.apps && window.firebase.apps.length > 0) {
        try {
          dbInstance = window.firebase.app().database(currentUrl);
          isInitialized = true;
          return dbInstance;
        } catch (e) {
          // continue
        }
      }

      window.firebase.initializeApp({ databaseURL: currentUrl });
      dbInstance = window.firebase.database();
      isInitialized = true;
      console.log('PoshanSetu Firebase RTDB initialized for URL:', currentUrl);
    }
  } catch (err) {
    console.warn('Firebase initialization notice (will use REST fallback):', err);
  }
  return dbInstance;
}

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

/**
 * Tests the live Firebase Realtime Database connection via direct REST endpoint
 */
export async function testDatabaseConnection(customUrl?: string): Promise<{
  success: boolean;
  status: 'connected' | 'permission_denied' | 'not_found' | 'offline';
  message: string;
  latencyMs?: number;
}> {
  const targetUrl = (customUrl || getDatabaseURL()).trim().replace(/\/+$/, '');
  const startTime = Date.now();
  const pingUrl = `${targetUrl}/${AWC_PATH}/_ping.json`;

  try {
    // Attempt REST PUT to test write & read permission
    const pingPayload = {
      pingAt: new Date().toISOString(),
      client: 'PoshanSetu Mobile App',
      awc: '04-Vadtal'
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(pingUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pingPayload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (res.ok) {
      return {
        success: true,
        status: 'connected',
        message: `Database online and connected! Response time: ${latency}ms. All changes sync live.`,
        latencyMs: latency
      };
    }

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        status: 'permission_denied',
        message: 'Permission Denied: Your Firebase database security rules are locked. In Firebase Console > Realtime Database > Rules, change rules to: { ".read": true, ".write": true }'
      };
    }

    if (res.status === 404) {
      return {
        success: false,
        status: 'not_found',
        message: 'Database Not Found (404): Please verify that you created a Realtime Database (not Firestore) in Firebase Console, and that the URL is typed correctly.'
      };
    }

    return {
      success: false,
      status: 'offline',
      message: `Firebase returned HTTP status ${res.status}. Check your Firebase Console configuration.`
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        success: false,
        status: 'offline',
        message: 'Connection timed out (6s). Please check your internet connection or verify the database URL.'
      };
    }
    return {
      success: false,
      status: 'offline',
      message: `Could not connect to ${targetUrl}. Ensure CORS or network isn't blocking, and database is active.`
    };
  }
}

/**
 * Pushes data to Firebase using SDK with automatic HTTPS REST API fallback
 */
export async function pushFirebaseData(subPath: string, payload: any, isOnline = true): Promise<boolean> {
  const fullPath = `${AWC_PATH}/${subPath}`;
  const recordWithTimestamp = {
    ...payload,
    recordedAt: new Date().toISOString()
  };

  if (!isOnline) {
    queueOfflineSync(fullPath, recordWithTimestamp);
    return false;
  }

  const dbUrl = getDatabaseURL();

  // Try 1: Direct REST API (guaranteed fast and reliable across browsers and iframe environments)
  try {
    const res = await fetch(`${dbUrl}/${fullPath}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordWithTimestamp)
    });

    if (res.ok) {
      saveLocal('last_synced_time', new Date().toISOString());
      return true;
    }
  } catch (fetchErr) {
    // REST attempt failed, fallback to SDK
  }

  // Try 2: Firebase JS SDK
  const db = initFirebaseRTDB();
  if (db) {
    try {
      await db.ref(fullPath).push(recordWithTimestamp);
      saveLocal('last_synced_time', new Date().toISOString());
      return true;
    } catch (err) {
      console.warn('Firebase SDK push notice:', err);
    }
  }

  // If both failed, queue offline
  queueOfflineSync(fullPath, recordWithTimestamp);
  return false;
}

/**
 * Updates full inventory snapshot on Firebase using REST PUT and SDK
 */
export async function updateFirebaseInventory(inventoryData: Record<string, number>, isOnline = true): Promise<boolean> {
  const fullPath = `${AWC_PATH}/inventory`;
  const payload = {
    ...inventoryData,
    lastUpdated: new Date().toISOString()
  };

  if (!isOnline) {
    queueOfflineSync(fullPath, payload);
    return false;
  }

  const dbUrl = getDatabaseURL();

  // Direct REST PUT
  try {
    const res = await fetch(`${dbUrl}/${fullPath}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      saveLocal('last_synced_time', new Date().toISOString());
      return true;
    }
  } catch (e) {}

  // SDK fallback
  const db = initFirebaseRTDB();
  if (db) {
    try {
      await db.ref(fullPath).set(payload);
      saveLocal('last_synced_time', new Date().toISOString());
      return true;
    } catch (err) {
      queueOfflineSync(fullPath, payload);
      return false;
    }
  }

  queueOfflineSync(fullPath, payload);
  return false;
}

/**
 * Flushes the local offline queue to Firebase
 */
export async function syncOfflineQueue(): Promise<{ success: boolean; syncedCount: number }> {
  const queue = loadLocal<QueuedAction[]>('sync_queue', []);
  if (queue.length === 0) return { success: true, syncedCount: 0 };

  const dbUrl = getDatabaseURL();
  let synced = 0;
  const remaining: QueuedAction[] = [];

  for (const item of queue) {
    let itemSynced = false;

    // Try REST
    try {
      const res = await fetch(`${dbUrl}/${item.path}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item.data,
          syncedAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        itemSynced = true;
        synced++;
      }
    } catch (e) {}

    if (!itemSynced) {
      remaining.push(item);
    }
  }

  saveLocal('sync_queue', remaining);
  if (synced > 0) {
    saveLocal('last_synced_time', new Date().toISOString());
  }
  return { success: remaining.length === 0, syncedCount: synced };
}

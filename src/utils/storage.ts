import { MagazineProject, PhotoAsset } from '../types';

const DB_NAME = 'MStudioMagazineStore';
const STORE_NAME = 'appData';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves project state and photo assets to IndexedDB (falling back to localStorage).
 */
export async function saveProjectToStorage(
  magazine: MagazineProject,
  photoAssets: PhotoAsset[]
): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(magazine, 'currentProject');
    store.put(photoAssets, 'currentPhotoAssets');

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
    return true;
  } catch (e) {
    console.warn('IndexedDB save failed, attempting LocalStorage fallback...', e);
    try {
      localStorage.setItem('mstudio_current_project', JSON.stringify(magazine));
      localStorage.setItem('mstudio_photo_assets', JSON.stringify(photoAssets));
      return true;
    } catch (err) {
      console.error('LocalStorage save failed:', err);
      return false;
    }
  }
}

/**
 * Loads project state and photo assets from IndexedDB or LocalStorage.
 */
export async function loadProjectFromStorage(): Promise<{
  magazine: MagazineProject;
  photoAssets: PhotoAsset[];
} | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const magReq = store.get('currentProject');
    const photosReq = store.get('currentPhotoAssets');

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });

    if (magReq.result) {
      return {
        magazine: magReq.result as MagazineProject,
        photoAssets: (photosReq.result as PhotoAsset[]) || [],
      };
    }
  } catch (e) {
    console.warn('IndexedDB load failed, attempting LocalStorage fallback...', e);
  }

  // LocalStorage Fallback
  try {
    const localMag = localStorage.getItem('mstudio_current_project');
    const localPhotos = localStorage.getItem('mstudio_photo_assets');
    if (localMag) {
      return {
        magazine: JSON.parse(localMag),
        photoAssets: localPhotos ? JSON.parse(localPhotos) : [],
      };
    }
  } catch (err) {
    console.error('LocalStorage load failed:', err);
  }

  return null;
}

/**
 * Clears saved project storage to restore default magazine.
 */
export async function clearProjectStorage(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('mstudio_current_project');
  localStorage.removeItem('mstudio_photo_assets');
}

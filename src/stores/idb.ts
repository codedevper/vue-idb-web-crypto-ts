import { openDB } from 'idb'

const DB_NAME = 'CryptoVaultDB'
const STORE_NAME = 'CryptoVaultStore'

// ฟังก์ชันเปิดฐานข้อมูล IndexedDB
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

// บันทึก Private Key ที่เข้ารหัส
export async function saveEncryptedKey(id: string, encryptedKey: string, iv: string) {
  const db = await getDB()
  await db.put(STORE_NAME, { id, encryptedKey, iv })
}

// โหลด Private Key ที่เข้ารหัส
export async function loadEncryptedKey(id: string) {
  const db = await getDB()
  return await db.get(STORE_NAME, id)
}

// ลบข้อมูล
export async function deleteKey(id: string) {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

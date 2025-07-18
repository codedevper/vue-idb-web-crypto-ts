async function encryptPrivateKey(key: string, password: string) {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  const derivedKey = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt'],
  )

  const ivArray = window.crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivArray },
    derivedKey,
    enc.encode(key),
  )

  return {
    encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...ivArray)),
  }
}

async function decryptPrivateKey(encryptedKey: string, iv: string, password: string) {
  const enc = new TextEncoder()
  const dec = new TextDecoder()

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  const derivedKey = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  )

  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: new Uint8Array(
        atob(iv)
          .split('')
          .map((c) => c.charCodeAt(0)),
      ),
    },
    derivedKey,
    new Uint8Array(
      atob(encryptedKey)
        .split('')
        .map((c) => c.charCodeAt(0)),
    ),
  )

  return dec.decode(decrypted)
}

export { encryptPrivateKey, decryptPrivateKey }

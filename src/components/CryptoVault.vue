<script setup lang="ts">
import { ref } from 'vue'
import { saveEncryptedKey, loadEncryptedKey, deleteKey } from '@/stores/idb'
import { encryptPrivateKey, decryptPrivateKey } from '@/utils/crypto'

const password = ref('')
const privateKey = ref('')
const encryptedKey = ref<string | null>(null)
const decryptedKey = ref<string | null>(null)

async function saveKey() {
  if (!privateKey.value || !password.value) {
    alert('กรุณากรอก Private Key และรหัสผ่าน!')
    return
  }

  const { encryptedKey: encKey, iv } = await encryptPrivateKey(privateKey.value, password.value)
  await saveEncryptedKey('user-key', encKey, iv)
  encryptedKey.value = encKey
  alert('🔐 Private Key ถูกเข้ารหัสและบันทึกใน IndexedDB แล้ว!')
}

async function loadKey() {
  const data = await loadEncryptedKey('user-key')

  if (!data) {
    alert('❌ ไม่พบข้อมูลที่เข้ารหัส!')
    return
  }

  try {
    const key = await decryptPrivateKey(data.encryptedKey, data.iv, password.value)
    decryptedKey.value = key
    alert('🔓 ถอดรหัส Private Key สำเร็จ!')
  } catch (error: any) {
    alert('❌ รหัสผ่านไม่ถูกต้องหรือข้อมูลเสียหาย!')
  }
}

async function deleteStoredKey() {
  await deleteKey('user-key')
  encryptedKey.value = null
  decryptedKey.value = null
  alert('🗑️ ลบ Private Key สำเร็จ!')
}
</script>

<template>
  <div class="container">
    <h2>🔐 Vue 3 + TypeScript - IndexedDB + Web Crypto</h2>

    <label>รหัสผ่าน:</label>
    <input v-model="password" type="password" placeholder="ใส่รหัสผ่าน" />

    <label>Private Key:</label>
    <input v-model="privateKey" type="text" placeholder="ใส่ Private Key" />

    <button @click="saveKey">🔒 เข้ารหัส & บันทึก</button>
    <button @click="loadKey">🔓 ถอดรหัส</button>
    <button @click="deleteStoredKey">🗑️ ลบ</button>

    <div v-if="encryptedKey">
      <h3>🔐 Private Key ที่เข้ารหัส:</h3>
      <textarea v-model="encryptedKey" readonly></textarea>
    </div>

    <div v-if="decryptedKey">
      <h3>🔓 Private Key ที่ถอดรหัส:</h3>
      <textarea v-model="decryptedKey" readonly></textarea>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
input {
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  border-radius: 5px;
}
button {
  margin: 8px;
  padding: 10px;
  cursor: pointer;
}
textarea {
  width: 100%;
  height: 100px;
  margin: 8px 0;
}
</style>

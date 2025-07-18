<template>
  <div>
    <h1>Login</h1>
    <div v-if="isBiometricSupported">
      <button @click="authenticateWithBiometric">Authenticate with Fingerprint</button>
    </div>
    <div v-else>
      <input v-model="pin" type="password" placeholder="Enter PIN" />
      <button @click="authenticateWithPin">Login with PIN</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'

export default {
  name: 'LoginPage',
  setup() {
    const pin = ref('')
    const isBiometricSupported = ref(false)

    onMounted(() => {
      // ตรวจสอบว่ามีการรองรับ Biometric Authentication หรือไม่
      if ('PublicKeyCredential' in window) {
        isBiometricSupported.value = true
      }
    })

    const authenticateWithBiometric = async () => {
      try {
        const result = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array([1, 2, 3]), // แค่ตัวอย่าง, ต้องปรับตามการตั้งค่าเซิร์ฟเวอร์
            allowCredentials: [],
            userVerification: 'required',
          },
        })
        console.log('Biometric Authentication successful', result)
      } catch (error) {
        console.error('Biometric Authentication failed', error)
      }
    }

    const authenticateWithPin = () => {
      if (pin.value === '1234') {
        // เปลี่ยนเป็นการตรวจสอบ PIN ที่ถูกต้อง
        console.log('PIN Authentication successful')
        alert('PIN Authentication successful')
      } else {
        console.error('Invalid PIN')
      }
    }

    return {
      pin,
      authenticateWithBiometric,
      authenticateWithPin,
      isBiometricSupported,
    }
  },
}
</script>

<style scoped>
/* Styling your login page */
button {
  margin-top: 10px;
}
</style>

import { Capacitor } from '@capacitor/core'

export const useVaultFactory = (): any => {
  const createVault = () => Capacitor.isNativePlatform()

  return { createVault }
}

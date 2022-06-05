import { Dispatch, SetStateAction, useEffect, useState } from "react"

/**
 * React hook for choosing the active vault for the given user (address).
 * @param address the address of the user.
 * @param vaultAddresses the list of vaults in which the user participates.
 * @returns the address of the vault that's currently active, or null.
 */
const useCurrentVaultAddress = (address: string | null, vaultAddresses: string[]): [string | null, Dispatch<SetStateAction<string | null>>] => {
  const [currentVaultAddress, setCurrentVaultAddress] = useState<string | null>(null)
  
  // reset the current vault address when the user changes
  useEffect(() => {
    setCurrentVaultAddress(null)
  }, [address])
  
  // auto-select vault if it's the only one
  useEffect(() => {
    if (vaultAddresses.length === 1) {
      setCurrentVaultAddress(vaultAddresses[0])
    }
  }, [vaultAddresses])

  return [currentVaultAddress, setCurrentVaultAddress]
}

export default useCurrentVaultAddress

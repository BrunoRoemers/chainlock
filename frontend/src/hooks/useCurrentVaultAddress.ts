import { Dispatch, SetStateAction, useEffect, useState } from "react"

/**
 * React hook for choosing the active vault for the given user (address).
 * @param address the address of the user.
 * @param vaultAddresses the list of vaults in which the user participates.
 * @returns the address of the vault that's currently active, or undefined if no vault is currently active.
 */
const useCurrentVaultAddress = (
  address: string | undefined,
  vaultAddresses: string[],
  autoSelectOneAndOnly: boolean = false
): [string | undefined, Dispatch<SetStateAction<string | undefined>>] => {
  const [currentVaultAddress, setCurrentVaultAddress] = useState<string | undefined>()
  
  // reset the current vault address when the user changes
  useEffect(() => {
    setCurrentVaultAddress(undefined)
  }, [address])
  
  // auto-select vault if it's the only one
  useEffect(() => {
    if (autoSelectOneAndOnly && vaultAddresses.length === 1) {
      setCurrentVaultAddress(vaultAddresses[0])
    }
  }, [autoSelectOneAndOnly, vaultAddresses])

  return [currentVaultAddress, setCurrentVaultAddress]
}

export default useCurrentVaultAddress

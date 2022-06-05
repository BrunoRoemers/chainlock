import { useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface"

// TODO implement
const useVaultAddresses = (wallet: Wallet | null, address: string | null) => {
  const [ vaultAddresses, setVaultAddresses ] = useState<string[]>([])

  // TODO temp
  useEffect(() => {
    if (wallet && address) {
      if (address === '0xAEF1bf9A5413caD02A69cDc1FF07c26c5A429264') {
        setVaultAddresses(['0xC615b9c8A95dEC05D31fB6317Bca4B7019cfFa27'])
      } else {
        setVaultAddresses([])
      }
    }
  }, [wallet, address])

  return vaultAddresses
}

export default useVaultAddresses

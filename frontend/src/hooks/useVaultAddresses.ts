import { useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface"

// TODO temp
const addressTofakeVaultAddresses: {[address: string]: string[]} = {
  '0xaef1bf9a5413cad02a69cdc1ff07c26c5a429264': [
    '0xc615b9c8a95dec05d31fb6317bca4b7019cffa27'
  ],
  '0xd14c391361ade0e98396c203228220ce52c6b8e3': [
    '0x20595033332Ff63968a62a3C678e63fd46E7e534',
    '0xd013ef6fece839223cf9ebfb6b86be70fa2b1994',
    '0xd410682bc60d8a85f022440874c0d86e3ae6bbf7'
  ]
}

// TODO implement
const useVaultAddresses = (wallet: Wallet | null, address: string | null) => {
  const [ vaultAddresses, setVaultAddresses ] = useState<string[]>([])

  // TODO temp
  useEffect(() => {
    if (wallet && address) {
      const fakeVaultAddresses = addressTofakeVaultAddresses[address]
      if (fakeVaultAddresses) {
        setVaultAddresses(fakeVaultAddresses)
      } else {
        setVaultAddresses([])
      }
    }
  }, [wallet, address])

  return vaultAddresses
}

export default useVaultAddresses

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
  ],
  '0x9cedf9e8358f18567ee0e72558ed86c84f2238a8': []
}

// TODO implement
const useVaultAddresses = (wallet: Wallet | undefined, address: string | undefined) => {
  const [ vaultAddresses, setVaultAddresses ] = useState<string[]>([])

  // TODO temp
  // find all vaults in which the user takes part...
  useEffect(() => {
    if (wallet && address) {
      const fakeVaultAddresses = addressTofakeVaultAddresses[address]
      if (fakeVaultAddresses) {
        setVaultAddresses(fakeVaultAddresses)
      } else {
        setVaultAddresses([
          // TODO some addresses that everyone can see...
          '0x6d6faa770073810629c63729a6e428c46b9e0cd4',
          '0xb05b34b3ca20660ee00e679c9ab20c09eb4e68a1',
          '0x07721f699a1f434983b2c15db719e6d235ba936e',
          '0x32c0edf1a4d69db492b17341764d041ddb643016'
        ])
      }
    }
  }, [wallet, address])

  // unset the vault addresses
  useEffect(() => {
    if (!wallet || !address) {
      setVaultAddresses([])
    }
  }, [wallet, address])

  return vaultAddresses
}

export default useVaultAddresses

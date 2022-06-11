import { useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface"

/**
 * React hook to get the public key (base64 encoded) of the given address (via the given wallet).
 * @param wallet the wallet that should be used to get the public key.
 * @param address the address for which the public key should be obtained.
 * @returns the public key, or undefined.
 */
const usePublicKeyBase64 = (wallet: Wallet | undefined, address: string | undefined): string | undefined => {
  const [ pk, setPk ] = useState<string | undefined>();

  useEffect(() => {
    if (wallet && address) {
      wallet.getPublicKeyBase64(address)
        .then(newPk => setPk(newPk))
        .catch(e => console.error(`error occurred when trying to get public key from address ${address}`))
    }
  }, [wallet, address])

  return pk;
}

export default usePublicKeyBase64

import { useEffect, useState } from "react"
import Wallet from "../objects/Wallet.interface";

/**
 * React hook for getting the address that's currently active in the given wallet.
 * @param wallet the wallet.
 * @returns an ethereum address, or null.
 */
const useAddress = (wallet: Wallet | null): string | null => {
  const [address, setAddress] = useState<string | null>(null);

  // populate address when metamask loads
  useEffect(() => {
    if (wallet !== null) {
      wallet.getCurrentAddress()
        .then(newAddress => setAddress(newAddress))
        .catch(e => console.error('error occurred when trying to read eth address:', e))
    }
  }, [wallet])

  // detect address changes
  useEffect(() => {
    if (wallet !== null) {
      // NOTE: keep reference to function instance so it can be deregistered
      const listener = (newAddress: string | null) => setAddress(newAddress)

      wallet.onAddressChange(listener)

      return () => wallet.removeAddressChangeListener(listener)
    }
  }, [wallet])

  return address;
}

export default useAddress

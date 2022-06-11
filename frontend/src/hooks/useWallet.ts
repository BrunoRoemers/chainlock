import { useState } from "react";
import MetamaskWallet from "../objects/MetamaskWallet";
import Wallet from "../objects/Wallet.interface";
import useRawMetamask, { RawMetamask } from "./useRawMetamask"

const wrapInWallet = (obj: RawMetamask | undefined) => obj && new MetamaskWallet(obj);

const getRawMetamask = (mm: MetamaskWallet | undefined) => mm?.getMetamaskObj();

/**
 * React hook for getting a {@link Wallet} instance.
 * Currently only supports metamask as wallet provider.
 * @returns a wallet or undefined.
 */
const useWallet = (): Wallet | undefined => {
  const rawMetamask = useRawMetamask();
  
  // NOTE: wrapInWallet() will only be called during initial render
  const [ wallet, setWallet ] = useState<MetamaskWallet | undefined>(() => wrapInWallet(rawMetamask));

  // create a new wallet object whenever rawMetamask changes
  if (rawMetamask !== getRawMetamask(wallet)) {
    setWallet(wrapInWallet(rawMetamask));
  }

  return wallet;
}

export default useWallet

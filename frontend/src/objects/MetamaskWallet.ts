import { encryptSafely } from "@metamask/eth-sig-util";
import { RawMetamask } from "../hooks/useRawMetamask";
import Ref from "./Ref";
import Wallet from "./Wallet.interface";

export default class MetamaskWallet implements Wallet {

  constructor(
    private mm: RawMetamask
  ) {}

  async requestAddressAccess(): Promise<string | null> {
    const r = await this.mm.request({ method: 'eth_requestAccounts' });
    return r.length <= 0 ? null : r[0]
  }

  async getCurrentAddress(): Promise<string | null> {
    const r = await this.mm.request({method: 'eth_accounts'})
    return r.length <= 0 ? null : r[0]
  }

  private onAccountsChangedRefs = new Ref<
    (newAddress: string | null) => void,
    (r: string[]) => void
  >();

  onAddressChange(innerCallback: (newAddress: string | null) => void): void {
    const outerCallback = (r: string[]) => {
      const newAddress = r.length <= 0 ? null : r[0]
      innerCallback(newAddress);
    }

    this.onAccountsChangedRefs.add(innerCallback, outerCallback);

    this.mm.on('accountsChanged', outerCallback)
  }

  removeAddressChangeListener(innerCallback: (newAddress: string | null) => void): void {
    const outerCallback = this.onAccountsChangedRefs.getAndRemove(innerCallback);

    if (outerCallback !== undefined) {
      this.mm.removeListener('accountsChanged', outerCallback);
    }
  }

  async getPublicKeyBase64(address: string): Promise<string> {
    return await this.mm.request({
      method: 'eth_getEncryptionPublicKey',
      params: [address]
    })
  }

  async encryptWithPublicKey(address: string, message: string): Promise<string> {
    // TODO
    const pkb64 = await this.getPublicKeyBase64(address)

    // TODO this makes the app crash, configure node.js polyfills via webpack
    const enc = encryptSafely({
      publicKey: pkb64,
      data: message,
      version: 'x25519-xsalsa20-poly1305'
    })

    console.log('enc', enc)

    console.log('pkb64', pkb64)

    return Promise.resolve('TODO');
  }

  decryptWithPrivateKey(address: string, cyphertext: string): Promise<string> {
    // TODO
    return Promise.resolve('TODO');
  }


  getMetamaskObj(): RawMetamask {
    return this.mm;
  }

}

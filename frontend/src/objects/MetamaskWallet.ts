import { encrypt, EthEncryptedData } from "@metamask/eth-sig-util";
import { RawMetamask } from "../hooks/useRawMetamask";
import Ref from "./Ref";
import Wallet from "./Wallet.interface";

export default class MetamaskWallet implements Wallet {

  constructor(
    private mm: RawMetamask
  ) {}

  async requestAddressAccess(): Promise<string | undefined> {
    const r = await this.mm.request({ method: 'eth_requestAccounts' })
    return r.length <= 0 ? undefined : r[0]
  }

  async getCurrentAddress(): Promise<string | undefined> {
    const r = await this.mm.request({method: 'eth_accounts'})
    return r.length <= 0 ? undefined : r[0]
  }

  private onAccountsChangedRefs = new Ref<
    (newAddress: string | undefined) => void,
    (r: string[]) => void
  >();

  onAddressChange(innerCallback: (newAddress: string | undefined) => void): void {
    const outerCallback = (r: string[]) => {
      const newAddress = r.length <= 0 ? undefined : r[0]
      innerCallback(newAddress);
    }

    this.onAccountsChangedRefs.add(innerCallback, outerCallback);

    this.mm.on('accountsChanged', outerCallback)
  }

  removeAddressChangeListener(innerCallback: (newAddress: string | undefined) => void): void {
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

  async encryptWithPublicKey(publicKeyBase64: string, message: string): Promise<EthEncryptedData> {
    const encryptedData = encrypt({
      publicKey: publicKeyBase64,
      data: message,
      version: 'x25519-xsalsa20-poly1305'
    })
    return Promise.resolve(encryptedData);
  }

  private encryptedDataToHexString(encryptedData: EthEncryptedData): string {
    return `0x${Buffer.from(JSON.stringify(encryptedData), 'utf8').toString('hex')}`;
  }

  async decryptWithPrivateKey(address: string, encryptedData: EthEncryptedData): Promise<string> {
    const message = await this.mm.request({
      method: 'eth_decrypt',
      params: [
        this.encryptedDataToHexString(encryptedData),
        address
      ]
    })
    return Promise.resolve(message);
  }


  getMetamaskObj(): RawMetamask {
    return this.mm;
  }

}

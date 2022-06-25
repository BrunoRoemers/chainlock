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

  async createTransaction(address: string, rawData: string): Promise<string> {
    const transactionParameters = {
      nonce: '0x00', // ignored by MetaMask
      // gasPrice: '0x09184e72a000', // customizable by user during MetaMask confirmation.
      // gas: '0x2710', // customizable by user during MetaMask confirmation.
      to: '0x5C58D62b1485e1c8C774dca115409d58e78e7B23', // Required except during contract publications.
      from: address, // must match user's active address.
      // value: '0x00', // Only required to send ether to the recipient from the initiating external account.
      data: rawData, // Optional, but used for defining smart contract creation and interaction.
      // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    };
    
    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash: string = await this.mm.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
      
    });

    return txHash;

  }

  getMetamaskObj(): RawMetamask {
    return this.mm;
  }
  

}

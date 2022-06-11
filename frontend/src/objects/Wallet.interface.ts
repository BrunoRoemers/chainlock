import { EthEncryptedData } from "@metamask/eth-sig-util";

export default interface Wallet {

  /**
   * Request an address from the wallet.
   */
  requestAddressAccess(): Promise<string | undefined>

  /**
   * Get the address that's currently in use (if any).
   */
  getCurrentAddress(): Promise<string | undefined>

  /**
   * Register a function that will be called every time the current address changes.
   * Do not forget to unregister the function with {@link removeAddressChangeListener}
   * when it's no longer needed.
   * @param callback the function.
   */
  onAddressChange(callback: (newAddress: string | undefined) => void): void

  /**
   * Unregister a function that is being called every time the current address changes.
   * The function should've been registered first with {@link onAddressChange}.
   * @param callback the function. 
   */
  removeAddressChangeListener(callback: (newAddress: string | undefined) => void): void

  // TODO
  getPublicKeyBase64(address: string): Promise<string>;

  // TODO
  encryptWithPublicKey(publicKeyBase64: string, message: string): Promise<EthEncryptedData>;

  // TODO
  decryptWithPrivateKey(address: string, encryptedData: EthEncryptedData): Promise<string>;
  
}

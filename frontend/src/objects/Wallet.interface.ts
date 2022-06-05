export default interface Wallet {

  /**
   * Request an address from the wallet.
   */
  requestAddressAccess(): Promise<string | null>

  /**
   * Get the address that's currently in use (if any).
   */
  getCurrentAddress(): Promise<string | null>

  /**
   * Register a function that will be called every time the current address changes.
   * Do not forget to unregister the function with {@link removeAddressChangeListener}
   * when it's no longer needed.
   * @param callback the function.
   */
  onAddressChange(callback: (newAddress: string | null) => void): void

  /**
   * Unregister a function that is being called every time the current address changes.
   * The function should've been registered first with {@link onAddressChange}.
   * @param callback the function. 
   */
  removeAddressChangeListener(callback: (newAddress: string | null) => void): void

  // TODO
  getPublicKeyBase64(address: string): Promise<string>;

  // TODO
  encryptWithPublicKey(address: string, message: string): Promise<string>;

  // TODO
  decryptWithPrivateKey(address: string, cyphertext: string): Promise<string>;
  
}

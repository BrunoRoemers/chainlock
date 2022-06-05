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

  getMetamaskObj(): RawMetamask {
    return this.mm;
  }

}

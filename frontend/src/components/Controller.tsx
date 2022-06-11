import { useCallback } from "react"
import useAddress from "../hooks/useAddress"
import useCurrentVaultAddress from "../hooks/useCurrentVaultAddress"
import useVaultAddresses from "../hooks/useVaultAddresses"
import useVaultKeyPair from "../hooks/useVaultKeyPair"
import useWallet from "../hooks/useWallet"
import Address from "./atoms/Address"
import Button from "./atoms/Button"
import ConnectMetamask from "./pages/ConnectMetamask"
import FirstVault from "./pages/FirstVault"
import InstallMetamask from "./pages/InstallMetamask"
import SelectVault from "./pages/SelectVault"
import WaitOnVaultPrivateKeyDecrypt from "./pages/WaitOnVaultPrivateKeyDecrypt"

const Controller = () => {
  const wallet = useWallet()
  const address = useAddress(wallet)
  const vaultAddresses = useVaultAddresses(wallet, address)
  const [ currentVaultAddress, setCurrentVaultAddress ] = useCurrentVaultAddress(address, vaultAddresses)
  const goToVaultSelect = useCallback(() => setCurrentVaultAddress(null), [setCurrentVaultAddress])
  const { vaultKeyPair } = useVaultKeyPair(wallet, address, currentVaultAddress, { onDialogCancel: goToVaultSelect })

  if (!wallet) {
    return (
      <InstallMetamask/>
    )
  }

  if (!address) {
    return (
      <ConnectMetamask wallet={wallet}/>
    )
  }

  if (vaultAddresses.length <= 0) {
    return (
      <FirstVault/>
    )
  }

  if (!currentVaultAddress) {
    return (
      <SelectVault
        address={address}
        vaultAddresses={vaultAddresses}
        onSelect={va => setCurrentVaultAddress(va)}
      />
    )
  }

  if (!vaultKeyPair) {
    return (
      <WaitOnVaultPrivateKeyDecrypt
        vaultAddress={currentVaultAddress}
      />
    )
  }

  return (
    <div>
      <div>hello <Address>{address}</Address></div>
      <div>
        you're looking at vault: <Address named>{currentVaultAddress}</Address>
        {' '}
        <Button onClick={() => goToVaultSelect()}>select different vault</Button>
      </div>
    </div>
  )
}

export default Controller

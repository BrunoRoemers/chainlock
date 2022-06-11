import { useCallback } from "react"
import useAddress from "../hooks/useAddress"
import useCurrentVaultAddress from "../hooks/useCurrentVaultAddress"
import useVaultAddresses from "../hooks/useVaultAddresses"
import useVaultKeyPair from "../hooks/useVaultKeyPair"
import useWallet from "../hooks/useWallet"
import Dashboard from "./Dashboard"
import ConnectMetamask from "./pages/ConnectMetamask"
import FirstVault from "./pages/FirstVault"
import InstallMetamask from "./pages/InstallMetamask"
import SelectVault from "./pages/SelectVault"
import WaitOnVaultPrivateKeyDecrypt from "./pages/WaitOnVaultPrivateKeyDecrypt"

const Controller = () => {
  const wallet = useWallet()
  const [ address, setAddress ] = useAddress(wallet)
  const connectWallet = useCallback((newAddress: string) => setAddress(newAddress), [setAddress])
  const disconnectWallet = useCallback(() => setAddress(undefined), [setAddress])
  const vaultAddresses = useVaultAddresses(wallet, address)
  const [ currentVaultAddress, setCurrentVaultAddress ] = useCurrentVaultAddress(address, vaultAddresses)
  const goToVaultSelect = useCallback(() => setCurrentVaultAddress(undefined), [setCurrentVaultAddress])
  const { vaultKeyPair } = useVaultKeyPair(wallet, address, currentVaultAddress, { onDialogCancel: goToVaultSelect })

  if (!wallet) {
    return (
      <InstallMetamask/>
    )
  }

  if (!address) {
    return (
      <ConnectMetamask
        wallet={wallet}
        connectedAddress={address}
        onConnect={(newAddress?: string) => newAddress && connectWallet(newAddress)}
      />
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
    <Dashboard
      wallet={wallet}
      address={address}
      vaultAddress={currentVaultAddress}
      vaultKeyPair={vaultKeyPair}
      goToVaultSelect={goToVaultSelect}
      disconnectWallet={disconnectWallet}
    />
  )
}

export default Controller

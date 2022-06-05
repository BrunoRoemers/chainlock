import useAddress from "../hooks/useAddress"
import useCurrentVaultAddress from "../hooks/useCurrentVaultAddress"
import useVaultAddresses from "../hooks/useVaultAddresses"
import useWallet from "../hooks/useWallet"
import Address from "./atoms/Address"
import Button from "./atoms/Button"
import ConnectMetamask from "./pages/ConnectMetamask"
import FirstVault from "./pages/FirstVault"
import InstallMetamask from "./pages/InstallMetamask"
import SelectVault from "./pages/SelectVault"

const Controller = () => {
  const wallet = useWallet()
  const address = useAddress(wallet)
  const vaultAddresses = useVaultAddresses(wallet, address)
  const [ currentVaultAddress, setCurrentVaultAddress ] = useCurrentVaultAddress(address, vaultAddresses)

  if (wallet === null) {
    return (
      <InstallMetamask/>
    )
  }

  if (address === null) {
    return (
      <ConnectMetamask wallet={wallet}/>
    )
  }

  if (vaultAddresses.length <= 0) {
    return (
      <FirstVault/>
    )
  }

  if (currentVaultAddress === null) {
    return (
      <SelectVault
        address={address}
        vaultAddresses={vaultAddresses}
        onSelect={va => setCurrentVaultAddress(va)}
      />
    )
  }

  return (
    <div>
      <div>hello <Address>{address}</Address></div>
      <div>
        you're looking at vault: <Address named>{currentVaultAddress}</Address>
        {' '}
        <Button onClick={() => setCurrentVaultAddress(null)}>select different vault</Button>
      </div>
    </div>
  )
}

export default Controller

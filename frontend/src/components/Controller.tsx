import { useState } from "react"
import useAddress from "../hooks/useAddress"
import useVaultAddresses from "../hooks/useVaultAddresses"
import useWallet from "../hooks/useWallet"
import ConnectMetamask from "./pages/ConnectMetamask"
import FirstVault from "./pages/FirstVault"
import InstallMetamask from "./pages/InstallMetamask"
import SelectVault from "./pages/SelectVault"

const Controller = () => {
  const wallet = useWallet()
  const address = useAddress(wallet)
  const vaultAddresses = useVaultAddresses(wallet, address)
  const [ currentVaultAddress, setCurrentVaultAddress ] = useState<string | null>(null)

  if (wallet === null) {
    return (
      <InstallMetamask/>
    )
  }

  if (address === null) {
    return (
      <ConnectMetamask/>
    )
  }

  if (vaultAddresses.length <= 0) {
    return (
      <FirstVault/>
    )
  }

  if (currentVaultAddress === null) {
    return (
      <SelectVault/>
    )
  }

  return (
    <div>
      hello: {address}
      you're looking at vault: {currentVaultAddress}
      (<button onClick={() => setCurrentVaultAddress(null)}>select different vault</button>)
    </div>
  )
}

export default Controller

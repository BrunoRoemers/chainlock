import Wallet from "../objects/Wallet.interface"
import Header from "./molecules/Header"

interface Props {
  wallet: Wallet
  address: string
  vaultAddress: string
  vaultKeyPair: CryptoKeyPair
  goToVaultSelect: () => void
  disconnectWallet: () => void
}

const Dashboard = ({
  wallet, address, vaultAddress, vaultKeyPair, goToVaultSelect, disconnectWallet
}: Props) => {
  return (
    <div>
      <Header
        walletAddress={address}
        onDisconnectWallet={disconnectWallet}
        vaultAddress={vaultAddress}
        onChangeVault={goToVaultSelect}
      />
      <div>
        TODO
      </div>
    </div>
  )
}

export default Dashboard

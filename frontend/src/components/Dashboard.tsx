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
        TODO: here you'll be able to store passwords in Chainlock, view them and share them with other people (addresses) in the vault.
      </div>
    </div>
  )
}

export default Dashboard

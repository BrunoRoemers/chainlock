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
      <div className="bg-[#2b3f4a] h-screen p-20">
        <p className="text-3xl font-bold text-white">Your vaults</p>
      </div>
    </div>
  )
}

export default Dashboard

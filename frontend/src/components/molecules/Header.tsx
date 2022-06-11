import FrameLogo from "../atoms/FrameLogo"
import HeaderCurrentVault from "./HeaderCurrentVault"
import HeaderCurrentWallet from "./HeaderCurrentWallet"

interface Props {
  walletAddress: string
  onDisconnectWallet: () => void
  vaultAddress: string
  onChangeVault: () => void
}

const Header = ({walletAddress, onDisconnectWallet, vaultAddress, onChangeVault}: Props) => {
  return (
    <div className="flex items-center bg-gray-800 text-white p-2">
      <div className="pr-2">
        <FrameLogo/>
      </div>
      <div className="grow flex justify-end">
        <div>
          <HeaderCurrentVault
            vaultAddress={vaultAddress}
            onChangeVault={onChangeVault}
          />
        </div>
        <div className="pl-3">
          <HeaderCurrentWallet
            walletAddress={walletAddress}
            onDisconnectWallet={onDisconnectWallet}
          />
        </div>
      </div>
    </div>
  )
}

export default Header

import Wallet from "../../objects/Wallet.interface"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import WalletButton from "../molecules/WalletButton"

interface Props {
  wallet: Wallet
  address?: string
}

const ConnectMetamask = ({wallet, address}: Props) => {
  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <WalletButton wallet={wallet} address={address}/>
      </FrameMessage>
    </Frame>
  )
}

export default ConnectMetamask

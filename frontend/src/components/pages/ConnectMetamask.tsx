import Wallet from "../../objects/Wallet.interface"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import WalletButton from "../molecules/WalletButton"

interface Props {
  wallet: Wallet
}

const ConnectMetamask = ({wallet}: Props) => {
  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <WalletButton wallet={wallet}/>
      </FrameMessage>
    </Frame>
  )
}

export default ConnectMetamask

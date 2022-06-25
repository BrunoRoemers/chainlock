import Address from "../atoms/Address"
import Button from "../atoms/Button"

interface Props {
  walletAddress: string
  onDisconnectWallet: () => void
}

const HeaderCurrentWallet = ({walletAddress, onDisconnectWallet}: Props) => {
  return (
    <div className="flex text-[#333] text-sm p-2">
      <div className="flex flex-col p-2 bg-[#e8cd8e] rounded-md">
        <span className="self-end text-xs ">active wallet</span>
        <Address named>{walletAddress}</Address>
      </div>
      <Button
        className="self-stretch p-1 bg-lime-700 hover:bg-lime-800 rounded-r-md"
        onClick={onDisconnectWallet}
      >disconnect</Button>
    </div>
  )
}

export default HeaderCurrentWallet

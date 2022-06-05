import { useState } from "react";
import useAddress from "../hooks/useAddress";
import Wallet from "../objects/Wallet.interface"

interface Props {
  wallet: Wallet
}

const WalletButton = ({ wallet }: Props) => {
  const address = useAddress(wallet);
  const [ isDisabled, setIsDisabled ] = useState(false);

  const handleClick = () => {
    setIsDisabled(true)
    wallet.requestAddressAccess().finally(() => setIsDisabled(false))
  }

  const renderButton = () => (
    <button disabled={isDisabled} onClick={handleClick}>connect metamask</button>
  )

  const renderConnected = () => (
    <p>connected: {address}</p>
  )

  if (address === null) {
    return renderButton();
  } else {
    return renderConnected();
  }
}

export default WalletButton

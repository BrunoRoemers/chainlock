import { useState } from "react";
import useAddress from "../../hooks/useAddress";
import Wallet from "../../objects/Wallet.interface"
import Button from "../atoms/Button";

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
    <Button disabled={isDisabled} onClick={handleClick}>connect metamask</Button>
  )

  const renderWaiting = () => (
    <Button disabled={true}>waiting...</Button>
  )

  const renderConnected = () => (
    <Button disabled={true}>connected: {address}</Button>
  )

  if (isDisabled === true) {
    return renderWaiting();
  } else if (address === null) {
    return renderButton();
  } else {
    return renderConnected();
  }
}

export default WalletButton

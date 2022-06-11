import { useState } from "react";
import Wallet from "../../objects/Wallet.interface"
import Address from "../atoms/Address";
import Button from "../atoms/Button";

interface Props {
  wallet: Wallet
  address?: string 
}

const WalletButton = ({ wallet, address }: Props) => {
  const [ isDisabled, setIsDisabled ] = useState(false);

  const handleClick = () => {
    setIsDisabled(true)
    // TODO address needs to be set again in the parent component
    wallet.requestAddressAccess().finally(() => setIsDisabled(false))
  }

  if (isDisabled === true) {
    return <Button disabled={true}>waiting...</Button>
  } else if (!address) {
    return <Button disabled={isDisabled} onClick={handleClick}>connect Metamask</Button>
  } else {
    return <Button disabled={true}>connected: <Address clickable={false}>{address}</Address></Button>;
  }
}

export default WalletButton

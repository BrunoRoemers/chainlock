import { useState } from "react";
import useAddress from "../../hooks/useAddress";
import Wallet from "../../objects/Wallet.interface"
import Address from "../atoms/Address";
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

  if (isDisabled === true) {
    return <Button disabled={true}>waiting...</Button>
  } else if (address === null) {
    return <Button disabled={isDisabled} onClick={handleClick}>connect Metamask</Button>
  } else {
    return <Button disabled={true}>connected: <Address clickable={false}>{address}</Address></Button>;
  }
}

export default WalletButton

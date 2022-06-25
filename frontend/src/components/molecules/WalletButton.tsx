import { useState } from "react";
import Wallet from "../../objects/Wallet.interface"
import lock from "../../utils/hooks/lock";
import Address from "../atoms/Address";
import Button from "../atoms/Button";

interface Props {
  wallet: Wallet
  connectedAddress?: string
  availableAddress?: string
  onConnect?: (newAddress: string | undefined) => void
}

const WalletButton = ({ wallet, connectedAddress, availableAddress, onConnect }: Props) => {
  const [ isDisabled, setIsDisabled ] = useState(false);
  
  const handleClick = () => {
    lock(setIsDisabled, async () => {
      const newAddress = await wallet.requestAddressAccess()
      onConnect && onConnect(newAddress)
    })
  }

  // the button is disabled
  if (isDisabled === true) {
    return <Button disabled={true}>waiting...</Button>
  }

  // we are "connected"
  if (connectedAddress) {
    return <Button disabled={true}>connected: <Address clickable={false}>{connectedAddress}</Address></Button>
  }

  // we are "disconnected", but the user has been "connected" before
  if (availableAddress) {
    return <Button onClick={handleClick}>Connect to <Address clickable={false}>{availableAddress}</Address></Button>
  }
  
  // the user has never connected before
  return <Button onClick={handleClick}>Connect wallet</Button>
}

export default WalletButton

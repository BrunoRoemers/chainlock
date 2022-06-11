import useAddress from "../../hooks/useAddress"
import Wallet from "../../objects/Wallet.interface"
import Address from "../atoms/Address"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import WalletButton from "../molecules/WalletButton"

interface Props {
  wallet: Wallet
  connectedAddress?: string
  onConnect?: () => void
}

const ConnectMetamask = ({wallet, connectedAddress, onConnect}: Props) => {
  // NOTE: The first time a user connects to our dApp, no address will be available,
  //       so Metamask asks the user which one(s) to use. No dApp can ask Metamask to disconnect
  //       (the user needs to initiate an actual disconnect inside the Metamask GUI),
  //       but we can pretend to "disconnect" by forgetting that the user provided us with an address.
  //       Even if we forget the user address (in the controller), Metamask will still provide
  //       it to us via RPC call "eth_accounts" (which never prompts).
  //       We show this address in the GUI, if present, to cause less surprise for the user.
  // NOTE: When Metamask is locked, no address is available either.
  const [ availableAddress ] = useAddress(wallet)

  console.log('connectedAddress', connectedAddress)
  console.log('availableAddress', availableAddress)

  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <WalletButton
          wallet={wallet}
          connectedAddress={connectedAddress}
          availableAddress={availableAddress}
          onConnect={onConnect}
        />
        {!connectedAddress && availableAddress && (
          <>
            <p className="mt-2 text-gray-600 text-sm">
              Since you have connected to Chainlock before, Metamask will automatically connect to address <Address>{availableAddress}</Address> when you click the button above.
            </p>
            <p className="mt-2 text-gray-600 text-sm">To use a different address, open Metamask and select the address you want to use.
              In the top-left corner of the Metamask window, you'll see "connected" if you have used this address in Chainlock before,
              or "disconnected" if you haven't used this address in Chainlock yet. Use these buttons to connect new addresses and/or
              revoke permissions on previous addresses.
            </p>
          </>
        )}
      </FrameMessage>
    </Frame>
  )
}

export default ConnectMetamask

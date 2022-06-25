import useAddress from "../../hooks/useAddress"
import Wallet from "../../objects/Wallet.interface"
import Address from "../atoms/Address"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import WalletButton from "../molecules/WalletButton"
import vaultImage from "../../images/vault.png"

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
    <div className="container-index h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 h-screen">
        <div className="justify-center pl-20 pr-10 pt-20 sm:pt-40">
          <div className="">
            <p className="font-bold text-5xl text-[#333]">Chainlock</p>
            <p className="font-medium text-[#333] text-l mt-10">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
            <p className="font-medium  text-[#333] text-l mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          </div>
          <div className="mt-0">
            <Frame>
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
          </div>
        </div>
        <div className="img-background flex justify-center pt-10 hidden md:block">
          <img className="px-40 pt-0 md:p-20 drop-shadow-6xl" src={vaultImage} />
        </div>
        </div>
    </div>
  )
}

export default ConnectMetamask

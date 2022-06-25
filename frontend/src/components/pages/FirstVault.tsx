import { ENGINE_METHOD_CIPHERS } from "constants"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import Wallet from "../../objects/Wallet.interface";

interface Props {
  wallet: Wallet
  connectedAddress: string
}

const FirstVault = ({wallet, connectedAddress}: Props) => {

  async function createVault () {
    // TODO fix
    // const provider = ethers.providers.JsonRpcUrlProvider("https://eth-rinkeby.alchemyapi.io/v2/yEcDJq4Tty6Uf2MNOpqUTeZlBUP_aAZ9")
    // const signer = provider.getSigner()

    // const contract = ethers.Contract(
    //   "0x5C58D62b1485e1c8C774dca115409d58e78e7B23",
    //   "",
    //   signer
    // )
    // let tx = {
    //   to: "0x5C58D62b1485e1c8C774dca115409d58e78e7B23",
    //   from: signer.getAddress(),
    //   data: contract.createVault(),
    //   value: 0
    // }
    const txHash = await wallet.createTransaction(connectedAddress, "aaa");
    
    console.log("tx hash", txHash);
  }

  

  return (
    <div className="bg-[#2b3f4a] h-screen grid grid-flex grid-cols-3 gap-6">
      <div></div>
      <div className="text-white text-center">
        <Frame>
        <FrameMessage>
          <p className="text-5xl font-bold mb-6">Welcome</p>
          <p>Create your first vault</p>
          <button onClick={createVault} className="mt-14 bg-[#e8cd8e] text-[#333] py-3 px-10 rounded-xl">Create vault</button>
        </FrameMessage>
        </Frame>
      </div>
      <div></div>
    </div>
  )
}

export default FirstVault

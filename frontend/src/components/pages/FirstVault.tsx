import { ENGINE_METHOD_CIPHERS } from "constants"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"

const FirstVault = () => {

  async function createVault () {
    
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

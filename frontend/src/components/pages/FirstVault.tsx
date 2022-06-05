import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"

const FirstVault = () => {
  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <p>[TODO] create or join your first vault</p>
      </FrameMessage>
    </Frame>
  )
}

export default FirstVault

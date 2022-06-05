import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"
import Link from "../atoms/Link"

const InstallMetamask = () => {
  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <p>Metamask does not seem to be installed in this browser.</p>
        <p>You can download it from <Link href="https://metamask.io">https://metamask.io</Link> and come back to this page when ready.</p>
      </FrameMessage>
    </Frame>
  )
}

export default InstallMetamask

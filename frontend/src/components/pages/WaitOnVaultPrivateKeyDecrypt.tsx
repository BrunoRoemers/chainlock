import Address from "../atoms/Address"
import Button from "../atoms/Button"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"

interface Props {
  /**
   * The address of the vault that is being decrypted.
   */
  vaultAddress: string
  /**
   * This function is called whenever the user wants to go back to the previous screen.
   */
  onBack?: () => void,
}

const WaitOnVaultPrivateKeyDecrypt = ({onBack, vaultAddress}: Props) => {
  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <p>Use Metamask to decrypt vault:</p>
        <Address named>{vaultAddress}</Address>
        <p className="mt-2">If you cannot see a Metamask dialog, click on the "fox" icon in your browser.</p>
        <p className="mt-2 text-gray-600">To go back to vault selection, cancel the decrypt request.</p>

        <h1 className="mt-6 font-bold">Q: Why do I have to decrypt anything with my wallet?</h1>
        <p className="mt-2">
          A: We store your passwords on-chain so you'll never lose them.
          Of course we don't do that in plain text, because then everybody would be able to steal your passwords.
          The only way to see your passwords is to decrypt them with your wallet.
        </p>

        <h1 className="mt-6 font-bold">Q: What's inside the encrypted message?</h1>
        <p className="mt-2">
          A: Metamask allows you to inspect the decrypted message before you pass it on to Chainlock.
          It looks like gibberish but it is the <b>really important secret</b> that Chainlock needs
          to manage your passwords. As a matter of fact, anyone with that secret can freely access
          your passwords, so it is very important that you never share, copy, screenshot or record it.
          Contrary to your recovery phrase, you don't need to back up the secret because Chainlock
          stores it on-chain (encrypted by your wallet).
        </p>
        
        <h1 className="mt-6 font-bold">Q: Does Chainlock know my recovery phrase?</h1>
        <p className="mt-2">
          A: Definitely no. Metamask never shares your seed phrase, recorvery phrase or private key with anyone, including us.
          We ask Metamask to encrypt/decrypt your passwords with your wallet key pair,
          but it is impossible for us to access your private key.
        </p>

        <h1 className="mt-6 font-bold">Q: What if I lose my recovery phrase?</h1>
        <p className="mt-2">
          A: Prevent that at all costs. You'll lose all your coins, tokens, NFTs... in your wallet.
          You will also lose access to all the passwords in your Chainlock vault(s).
        </p>

        {onBack && (<p className="mt-2"><Button onClick={() =>onBack()}>back</Button></p>)}
      </FrameMessage>
    </Frame>
  )
}

export default WaitOnVaultPrivateKeyDecrypt

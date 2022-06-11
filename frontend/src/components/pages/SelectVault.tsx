import Address from "../atoms/Address"
import Frame from "../atoms/Frame"
import FrameLogo from "../atoms/FrameLogo"
import FrameMessage from "../atoms/FrameMessage"

interface Props {
  address: string
  vaultAddresses: string[]
  onSelect?: (vaultAddress: string) => void
}

const CHOOSE_A_VAULT = 'choose a vault...'

const SelectVault = ({address, vaultAddresses, onSelect}: Props) => {
  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (onSelect) {
      onSelect(e.target.value)
    }
  }

  return (
    <Frame>
      <FrameLogo/>
      <FrameMessage>
        <p>Hi, <Address named>{address}</Address> 👋</p>
        <p className="mt-2">Select which vault to use:</p>
        <select
          className="mt-6 bg-white rounded-md px-2 py-1 min-w-[50%] max-w-full font-mono"
          onChange={onChange}
          defaultValue={CHOOSE_A_VAULT}
        >
          <option disabled={true}>{CHOOSE_A_VAULT}</option>
          {vaultAddresses.map(vaultAddress => (
            <option key={vaultAddress} value={vaultAddress}>
              <Address plainText={true} named={true}>{vaultAddress}</Address>
            </option>
          ))}
        </select>
        <p className="mt-6 text-gray-600">Next, Metamask will ask you to decrypt the vault.</p>
      </FrameMessage>
    </Frame>
  )
}

export default SelectVault

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
        <p>Hi, <Address>{address}</Address> 👋</p>
        <p>select which vault to use</p>
        <select
          className="mt-2 bg-white rounded-md px-2 py-1 min-w-[50%] max-w-full font-mono"
          onChange={onChange}
          defaultValue={CHOOSE_A_VAULT}
        >
          <option disabled={true}>{CHOOSE_A_VAULT}</option>
          {vaultAddresses.map(vaultAddress => (
            <option key={vaultAddress} value={vaultAddress}>
              DAO Brussels (<Address plainText={true}>{vaultAddress}</Address>)
            </option>
          ))}
        </select>
      </FrameMessage>
    </Frame>
  )
}

export default SelectVault

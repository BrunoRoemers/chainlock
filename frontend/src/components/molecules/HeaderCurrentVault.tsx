import Address from "../atoms/Address"
import Button from "../atoms/Button"

interface Props {
  vaultAddress: string
  onChangeVault: () => void
}

const HeaderCurrentVault = ({vaultAddress, onChangeVault}: Props) => {
  return (
    <div className="flex text-[#333] text-sm p-2">
      <div className="flex flex-col p-2 bg-[#e8cd8e] rounded-l-md">
        <span className="self-end text-xs text-[#333]">active vault</span>
        <Address named>{vaultAddress}</Address>
      </div>
      <Button
        className="self-stretch p-1 bg-amber-600 hover:bg-amber-700 rounded-r-md"
        onClick={onChangeVault}
      >change</Button>
    </div>
  )
}

export default HeaderCurrentVault

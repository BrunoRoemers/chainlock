import getDeterministicAddressName from "../../utils/getDeterministicAddressName"
import isAddress from "../../utils/isAddress"
import substringAfter from "../../utils/substring-after"

interface Props {
  children: string
  plainText?: boolean
  clickable?: boolean
  named?: boolean
}

const Address = ({
  children,
  plainText = false,
  clickable = true,
  named = false,
}: Props) => {
  if (!isAddress(children)) {
    console.error(`'${children}' is not a valid address`)
    return (
      <span className="text-red-600">['{children}' is not a valid address]</span>
    )
  }
  
  const uppercaseAddress = children.toUpperCase()
  const bareUppercaseAddress = substringAfter(uppercaseAddress, '0X')

  const first4 = bareUppercaseAddress.slice(0, 4)
  const last4 = bareUppercaseAddress.slice(-4)

  const shortAddress = ['0x', first4, '...', last4].join('')

  const name = named ? getDeterministicAddressName(uppercaseAddress) : undefined

  const getLabel = (shortAddress: string, name?: string): string =>
    name ? `${name} (${shortAddress})` : shortAddress

  if (plainText) {
    return getLabel(shortAddress, name) as any
  }

  if (clickable) {
    return (
      <a
        className="font-medium hover:underline cursor-default hover:cursor-pointer"
        href={`https://etherscan.io/address/0x${bareUppercaseAddress}`}
        target="_blank" rel="noreferrer"
      >{getLabel(shortAddress, name)}</a>
    )
  }

  return (
    <span className="font-medium">{getLabel(shortAddress, name)}</span>
  )
}

export default Address

import substringAfter from "../../utils/substring-after"

interface Props {
  children: string
  plainText?: boolean
  clickable?: boolean
}

const Address = ({children, plainText = false, clickable = true}: Props) => {
  const uppercaseValue = children.toUpperCase()
  const bareUppercaseValue = substringAfter(uppercaseValue, '0X')

  if (bareUppercaseValue.length !== 40) {
    console.error(`'${children}' is not a valid address`)
    return (
      <span className="text-red-600">['{children}' is not a valid address]</span>
    )
  }

  const first4 = bareUppercaseValue.slice(0, 4)
  const last4 = bareUppercaseValue.slice(-4)

  const shortAddress = ['0x', first4, '...', last4].join('')

  if (plainText) {
    return shortAddress as any
  }

  if (clickable) {
    return (
      <a
        className="font-medium hover:underline cursor-default hover:cursor-pointer"
        href={`https://etherscan.io/address/0x${bareUppercaseValue}`}
        target="_blank" rel="noreferrer"
      >{shortAddress}</a>
    )
  }

  return (
    <span className="font-medium">{shortAddress}</span>
  )
}

export default Address

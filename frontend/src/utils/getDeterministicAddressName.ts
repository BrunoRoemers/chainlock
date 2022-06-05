import dn from "docker-names"
import isAddress from "./isAddress"
import substringAfter from "./substring-after"

/**
 * Create a name for the address.
 * Providing the same address should always result in the same name.
 * @param address the address.
 * @returns the generated name of the address.
 */
const getDeterministicAddressName = (address: string): string | undefined => {
  if (!isAddress(address)) {
    console.error(`'${address}' is not a valid address`)
    return
  }

  const bareAddress = substringAfter(address.toLowerCase(), '0x')

  const seed1 = parseInt(bareAddress.slice(0, 20), 16)
  const seed2 = parseInt(bareAddress.slice(20, 40), 16)

  const adjective = dn.adjectives[seed1 % dn.adjectives.length]
  const surname = dn.surnames[seed2 % dn.surnames.length]

  return `${adjective}-${surname}`
}

export default getDeterministicAddressName

/**
 * Check if the given string is an ethereum address:
 * - optionally starts with 0x
 * - case doesn't matter
 * - 40 characters long (without leading 0x)
 * @param str the string that needs to be checked.
 * @returns true if the string is an ethereum address, false otherwise.
 */
const isAddress = (str: string) => /^(0x)?[a-f0-9]{40}$/i.test(str)

export default isAddress

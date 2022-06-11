import uglyStringToArrayBuffer from "./ugly/uglyStringToArrayBuffer"

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8_import
const importPublicKeyBase64 = async (publicKeyBase64: string): Promise<CryptoKey> => {
  const publicKeyString = window.atob(publicKeyBase64)

  const publicKeyArrayBuffer = uglyStringToArrayBuffer(publicKeyString)

  return window.crypto.subtle.importKey(
    'spki',
    publicKeyArrayBuffer,
    {
      // NOTE: same values as key generation
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false, // not extractable
    ["encrypt"] // vault public key can only be used to encrypt passwords
  )
}

export default importPublicKeyBase64

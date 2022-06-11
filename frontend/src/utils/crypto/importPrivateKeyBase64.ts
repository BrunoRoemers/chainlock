import uglyStringToArrayBuffer from "./ugly/uglyStringToArrayBuffer"

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey#pkcs_8_import
const importPrivateKeyBase64 = async (privateKeyBase64: string): Promise<CryptoKey> => {
  const privateKeyString = window.atob(privateKeyBase64)

  const privateKeyArrayBuffer = uglyStringToArrayBuffer(privateKeyString)

  return window.crypto.subtle.importKey(
    'pkcs8',
    privateKeyArrayBuffer,
    {
      // NOTE: same values as key generation
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false, // not extractable
    ["decrypt"] // vault private key can only be used to decrypt passwords
  )
}

export default importPrivateKeyBase64

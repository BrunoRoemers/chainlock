import uglyArrayBufferToString from "./ugly/uglyArrayBufferToString";

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey#pkcs_8_export
const exportPrivateKeyBase64 = async (keyPair: CryptoKeyPair) => {
  const privateKeyArrayBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  const privateKeyString = uglyArrayBufferToString(privateKeyArrayBuffer)

  const privateKeyBase64 = window.btoa(privateKeyString);

  return privateKeyBase64;
}

export default exportPrivateKeyBase64

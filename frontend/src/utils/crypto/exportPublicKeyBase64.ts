import uglyArrayBufferToString from "./ugly/uglyArrayBufferToString";

// adapted from: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/exportKey#subjectpublickeyinfo_export
const exportPublicKeyBase64 = async (keyPair: CryptoKeyPair) => {
  const publicKeyArrayBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);

  const publicKeyString = uglyArrayBufferToString(publicKeyArrayBuffer)

  const publicKeyBase64 = window.btoa(publicKeyString);

  return publicKeyBase64;
}

export default exportPublicKeyBase64

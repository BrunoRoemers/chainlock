const exportPrivateKeyJwk = async (keyPair: CryptoKeyPair): Promise<JsonWebKey> => {
  return await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
}

export default exportPrivateKeyJwk

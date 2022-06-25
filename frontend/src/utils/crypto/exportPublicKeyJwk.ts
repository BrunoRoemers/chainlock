const exportPublicKeyJwk = async (keyPair: CryptoKeyPair): Promise<JsonWebKey> => {
  return await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
}

export default exportPublicKeyJwk

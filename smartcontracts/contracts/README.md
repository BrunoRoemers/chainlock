## Vault

### Requirements Phase 1
- add yourself to a vault
  - this implies storing a private key (encrypted) and public key inside the vault
- get a password
- store a password
- share a password = store for other user

### Requirements Phase 2
- remove yourself from a vault
- [admin] remove other people from the vault
- vote on people joining the vault




## Cryptography

### Generate key pair

```
window.crypto.subtle.generateKey({
  name: "RSA-OAEP",
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256"
}, true, ["encrypt", "decrypt"])
```

### Extract public key from generated key pair

currently: `spki` => base64

possibilities: SubjectPublicKeyInfo (spki), JSON Web Key

### Extract private key from generated key pair

currently: `pkcs8` => base64

possibilities: PKCS#8, JSON Web Key


### Encrypted version of private key


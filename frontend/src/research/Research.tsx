import { EthEncryptedData } from '@metamask/eth-sig-util';
import React, { useEffect, useState } from 'react';
import WalletButton from '../components/molecules/WalletButton';
import useAddress from '../hooks/useAddress';
import usePublicKeyBase64 from '../hooks/usePublicKeyBase64';
import useWallet from '../hooks/useWallet';
import exportPrivateKeyBase64 from '../utils/crypto/exportPrivateKeyBase64';
import exportPublicKeyBase64 from '../utils/crypto/exportPublicKeyBase64';

interface ExportedKeyPair {
  privateKey: string
  publicKey: string
}

const Research = () => {
  const wallet = useWallet();
  const [ address ] = useAddress(wallet);
  const walletPublicKeyBase64 = usePublicKeyBase64(wallet, address);

  const [ vaultKeyPair, setExportedKeyPair ] = useState<ExportedKeyPair | undefined>()
  const [ vaultEncryptedPrivateKey, setVaultEncryptedPrivateKey ] = useState<EthEncryptedData | undefined>()
  const [ vaultDecryptedPrivateKey, setVaultDecryptedPrivateKey ] = useState<string | undefined>()

  // generate an RSA key pair on load
  useEffect(() => {
    (async () => {
      const kp = await window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      }, true, ["encrypt", "decrypt"])

      const privateKeyBase64 = await exportPrivateKeyBase64(kp);
      const publicKeyBase64 = await exportPublicKeyBase64(kp);

      setExportedKeyPair({
        privateKey: privateKeyBase64,
        publicKey: publicKeyBase64,
      })
    })()
  }, [])

  // simulate joining a vault
  useEffect(() => {
    (async () => {
      if (wallet && walletPublicKeyBase64 && vaultKeyPair) {
        console.log("ENCRYPTING...")
        setVaultEncryptedPrivateKey(
          // NOTE: encrypt the private key of the vault with the public key of the wallet
          //       => the result can safely be stored on-chain
          //       => at a later date, the result can be downloaded and decrypted with the wallet
          //       => access to vault
          await wallet.encryptWithPublicKey(walletPublicKeyBase64, vaultKeyPair.privateKey)
        )
      }
    })()
  }, [wallet, walletPublicKeyBase64, vaultKeyPair])

  // simulating unlocking the vault at a later date
  useEffect(() => {
    (async () => {
      if (wallet && address && vaultEncryptedPrivateKey) {
        setVaultDecryptedPrivateKey(
          await wallet.decryptWithPrivateKey(address, vaultEncryptedPrivateKey)
        )
      }
    })()
  }, [wallet, address, vaultEncryptedPrivateKey])

  console.log('wallet', wallet);
  console.log('address', address);
  console.log('walletPublicKeyBase64', walletPublicKeyBase64);
  console.log('vaultKeyPair', vaultKeyPair);
  console.log('vaultEncryptedPrivateKey', vaultEncryptedPrivateKey);
  console.log('vaultDecryptedPrivateKey', vaultDecryptedPrivateKey);

  if (!wallet) {
    return (
      <p>waiting for metamask... (<a href='https://metamask.io/'>download</a>)</p>
    )
  }

  return (
    <WalletButton wallet={wallet} connectedAddress={address}/>
  )
}

export default Research;

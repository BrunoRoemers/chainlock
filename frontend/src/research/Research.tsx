import { EthEncryptedData } from '@metamask/eth-sig-util';
import React, { useEffect, useState } from 'react';
import WalletButton from '../components/molecules/WalletButton';
import useAddress from '../hooks/useAddress';
import usePublicKeyBase64 from '../hooks/usePublicKeyBase64';
import useWallet from '../hooks/useWallet';

const Research = () => {
  const wallet = useWallet();
  const address = useAddress(wallet);
  const pkb64 = usePublicKeyBase64(wallet, address);

  const [ message ] = useState<string>('hello world')
  const [ encryptedData, setEncryptedData ] = useState<EthEncryptedData | null>(null)
  const [ decryptedData, setDecryptedData ] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      if (wallet && pkb64) {
        setEncryptedData(
          await wallet.encryptWithPublicKey(pkb64, message)
        )
      }
    })()
  }, [wallet, pkb64, message])

  useEffect(() => {
    (async () => {
      if (wallet && address && encryptedData) {
        setDecryptedData(
          await wallet.decryptWithPrivateKey(address, encryptedData)
        )
      }
    })()
  }, [wallet, address, encryptedData])

  console.log('wallet', wallet);
  console.log('address', address);
  console.log('pkb64', pkb64);
  console.log('message', message);
  console.log('encrypted data', encryptedData);
  console.log('decrypted data', decryptedData);

  if (wallet === null) {
    return (
      <p>waiting for metamask... (<a href='https://metamask.io/'>download</a>)</p>
    )
  }

  return (
    <WalletButton wallet={wallet}/>
  )
}

export default Research;

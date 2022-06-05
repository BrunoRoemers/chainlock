import React from 'react';
import WalletButton from '../components/WalletButton';
import useAddress from '../hooks/useAddress';
import useWallet from '../hooks/useWallet';

const Research = () => {
  const wallet = useWallet();
  const address = useAddress(wallet);

  // TODO temp
  // if (wallet && address) {
  //   console.log('address', address)
  //   wallet.encryptWithPublicKey(address, 'asdf')
  // }

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

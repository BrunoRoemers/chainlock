import React from 'react';
import WalletButton from '../components/WalletButton';
import useWallet from '../hooks/useWallet';

const Research = () => {
  const wallet = useWallet();

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

import React from 'react';
import useAddress from '../hooks/useAddress';
import useWallet from '../hooks/useWallet';

const Research = () => {
  const wallet = useWallet();
  const address = useAddress(wallet);

  if (wallet === null) {
    return (
      <p>waiting for metamask... (<a href='https://metamask.io/'>download</a>)</p>
    )
  } else if (address === null) {
    return (
      <p>TODO connect wallet</p>
    )
  } else {
    return (
      <p>connected: {address}</p>
    );
  }
}

export default Research;

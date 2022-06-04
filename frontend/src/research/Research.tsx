import React from 'react';
import useMetamask from '../hooks/useMetamask';

const Research = () => {
  const mm = useMetamask();

  if (mm == null) {
    return (
      <p>waiting for metamask... (<a href='https://metamask.io/'>download</a>)</p>
    )
  } else {
    return (
      <p>research</p>
    );
  }
}

export default Research;

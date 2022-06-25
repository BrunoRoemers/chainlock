// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Vault.sol";

contract VaultFactory {

  event VaultCreated(address creator, address vaultAddress);

  address[] public vaults;

  function createVault() external returns(address) {
    Vault vault = new Vault(msg.sender);
    address vaultAddress = address(vault);
    vaults.push(vaultAddress);
    emit VaultCreated(msg.sender, vaultAddress);
    return vaultAddress;
  }
  
}

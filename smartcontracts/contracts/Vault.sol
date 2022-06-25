// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "hardhat/console.sol";

contract Vault {

  struct Member {
    string encryptedPrivateKey;
    string publicKey;
    uint[] passwords;
  }

  struct Password {
    string encryptedUsername;
    string encryptedPassword;
  }

  /**
   list of addresses that are allowed to join this vault as a member
   */
  mapping(address => bool) public pendingMembers;

  /**
   All members currently in the vault, their private key, public key and passwords
   */
  mapping(address => Member) members;

  /**
   All passwords currently in the vault.
   NOTE: the same password may be encrypted multiple times (for different members).
   */
  Password[] passwords;

  /**
   Group passwords that belong to the same account together.
   */
  mapping(string => Password[]) passwordsByAccount;

  constructor() {
    // the creator of the contract needs to be a pending member to bootstrap the vault
    pendingMembers[msg.sender] = true;
  }

  modifier onlyPendingMember {
    require(pendingMembers[msg.sender], "not a pending member");
    _;
  }

  function isMember(address addr) public view returns(bool) {
    return bytes(members[addr].publicKey).length > 0;
  }

  modifier onlyMember {
    // address is a member if its public key is in the vault
    require(isMember(msg.sender), "not a member");
    _;
  }

  function addPendingMember(address addr) public onlyMember {
    pendingMembers[addr] = true;
  }

  function joinVault(
    string calldata encryptedPrivateKey,
    string calldata publicKey
  ) external onlyPendingMember {
    pendingMembers[msg.sender] = false;
    members[msg.sender] = Member(encryptedPrivateKey, publicKey, new uint[](0));
  }

  function getOwnEncryptedPrivateKey() external view onlyMember returns(string memory) {
    return members[msg.sender].encryptedPrivateKey;
  }

  function getPublicKey(address addr) external view onlyMember returns(string memory) {
    return members[addr].publicKey;
  }

  // TODO
  // function storePassword(string label, string ) {
  //   // create password
  //   passwords.push(Password())
    
  //   // add password to member

  //   // add password to label
  // }
  
}

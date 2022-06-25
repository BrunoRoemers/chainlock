// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "hardhat/console.sol";

contract Vault {

  event AccountCreated(address creator, uint accountId);

  event SecretCreated(address creator, address receiver, uint accountId, uint secretId);

  struct Member {
    string encryptedPrivateKey;
    string publicKey;
    uint[] secretIds;
  }

  struct Account {
    string identifier;
  }

  struct Secret {
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
  mapping(address => Member) public members;

  /**
   All secrets currently in the vault.
   NOTE: the same password may be encrypted multiple times (for different members), resulting in multiple secrets.
   */
  Secret[] public secrets;

  /**
   All accounts currently in the vault.
   E.g. Twiter, Gmail, webhosting...
   NOTE: no duplicate check on the identifiers.
   */
  Account[] public accounts;

  /**
   Group all members by account.
   Given the accounts in your vault, you can look up who else has access to that account.
   */
  mapping(uint => address[]) public membersByAccount;

  constructor(address firstPendingMember) {
    // we need one pending member to bootstrap the vault
    pendingMembers[firstPendingMember] = true;
  }

  modifier onlyPendingMember {
    require(pendingMembers[msg.sender], "sender not a pending member");
    _;
  }

  function isMember(address addr) public view returns(bool) {
    return bytes(members[addr].publicKey).length > 0;
  }

  modifier onlyMember {
    // address is a member if its public key is in the vault
    require(isMember(msg.sender), "sender not a member");
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

  /**
   Create the account and return the account id.
   */
  function createAccount(
    string calldata identifier
  ) external onlyMember returns(uint) {
    accounts.push(Account(identifier));
    uint accountId = accounts.length - 1;
    emit AccountCreated(msg.sender, accountId);
    return accountId;
  }

  // NOTE: every member can store a secret for another member
  function storeSecret(
    address member,
    uint accountId,
    string calldata encryptedUsername,
    string calldata encryptedPassword
  ) external onlyMember returns(uint) {
    require(isMember(member), "recipient not a member");
    require(accounts.length > accountId, "account does not exist");

    // create secret
    secrets.push(Secret(encryptedUsername, encryptedPassword));
    uint secretId = secrets.length - 1;

    // add secret to member
    members[member].secretIds.push(secretId);

    // add member to account
    // FIXME: this may add duplicates
    membersByAccount[accountId].push(member);
    
    // emit event
    emit SecretCreated(msg.sender, member, accountId, secretId);

    return secretId;
  }

  function getOwnSecretIds() external view onlyMember returns(uint[] memory) {
    return members[msg.sender].secretIds;
  }

  function getMembersByAccountId(uint accountId) external view onlyMember returns(address[] memory) {
    return membersByAccount[accountId];
  }

  // // NOTE: any member can only remove secrets belonging to themselves
  // function removeSecret(
  //   uint accountId
  // ) external onlyMember {

  //   // TODO unlinking is good enough for now,
  //   //      but how can we actually remove an element from the Secrets array?
  // }
  
}

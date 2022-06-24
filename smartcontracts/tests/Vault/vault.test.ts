import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Vault } from "../../typechain";

describe("Vault", () => {
  let signers: SignerWithAddress[];
  let deployer: SignerWithAddress;
  let vaultContract: Vault;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    deployer = signers[0];
    const vaultFactory = await ethers.getContractFactory("Vault");
    vaultContract = await vaultFactory.connect(deployer).deploy();
    await vaultContract.deployed();
  });

  describe("constructor", () => {
    it("should add deployer as pending member", async () => {
      const deployerAddress = await deployer.getAddress();
      expect(await vaultContract.pendingMembers(deployerAddress)).to.be.true;
    });
  });

  describe("addPendingMember", () => {
    beforeEach(async () => {
      await vaultContract
        .connect(deployer)
        .joinVault("fakePrivKey", "fakePubKey");
    });

    it("member should be able to add a new pending member", async () => {
      const newAddress = await signers[1].getAddress();
      expect(await vaultContract.pendingMembers(newAddress)).to.be.false;
      await vaultContract.connect(deployer).addPendingMember(newAddress);
      expect(await vaultContract.pendingMembers(newAddress)).to.be.true;
    });

    it("member should NOT be able to add itself as a new pending member", async () => {
      const selfAddress = await deployer.getAddress();
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.false;
      await vaultContract.connect(deployer).addPendingMember(selfAddress);
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.true;
    });

    it("non-member should NOT be able to add a new pending member", async () => {
      const newAddress = await signers[2].getAddress();
      expect(await vaultContract.pendingMembers(newAddress)).to.be.false;
      await expect(
        vaultContract.connect(signers[1]).addPendingMember(newAddress)
      ).to.be.revertedWith("not a member");
      expect(await vaultContract.pendingMembers(newAddress)).to.be.false;
    });

    it("non-member should NOT be able to add itself as a new pending member", async () => {
      const selfAddress = await signers[1].getAddress();
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.false;
      await expect(
        vaultContract.connect(signers[1]).addPendingMember(selfAddress)
      ).to.be.revertedWith("not a member");
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.false;
    });
  });

  describe("with members, pending members and outsiders", () => {
    let member1: SignerWithAddress;
    let pendingMember1: SignerWithAddress;
    let outsider1: SignerWithAddress;

    beforeEach(async () => {
      // member 1
      member1 = deployer;
      await vaultContract
        .connect(deployer)
        .joinVault("fakePrivKey", "fakePubKey");

      // pending member 1
      pendingMember1 = signers[1];
      await vaultContract
        .connect(member1)
        .addPendingMember(await pendingMember1.getAddress());

      // outsider 1
      outsider1 = signers[2];
    });

    describe("isMember", () => {
      it("returns false when address is an outsider", async () => {
        expect(await vaultContract.isMember(await outsider1.getAddress())).to.be
          .false;
      });

      it("returns false when address is a pending member", async () => {
        expect(await vaultContract.isMember(await pendingMember1.getAddress()))
          .to.be.false;
      });

      it("returns true when address is a member", async () => {
        expect(await vaultContract.isMember(await member1.getAddress())).to.be
          .true;
      });
    });

    describe("joinVault", () => {
      it("pending member should be able to join vault", async () => {
        expect(await vaultContract.isMember(await pendingMember1.getAddress()))
          .to.be.false;

        await vaultContract
          .connect(pendingMember1)
          .joinVault("fakePrivKey", "fakePubKey");

        expect(await vaultContract.isMember(await pendingMember1.getAddress()))
          .to.be.true;
      });

      it("outsider should NOT be able to join vault", async () => {
        expect(await vaultContract.isMember(await outsider1.getAddress())).to.be
          .false;

        await expect(
          vaultContract
            .connect(outsider1)
            .joinVault("fakePrivKey", "fakePubKey")
        ).to.be.revertedWith("not a pending member");

        expect(await vaultContract.isMember(await outsider1.getAddress())).to.be
          .false;
      });

      it("member should NOT be able to join vault again", async () => {
        expect(await vaultContract.isMember(await member1.getAddress())).to.be
          .true;

        await expect(
          vaultContract.connect(member1).joinVault("fakePrivKey", "fakePubKey")
        ).to.be.revertedWith("not a pending member");

        expect(await vaultContract.isMember(await member1.getAddress())).to.be
          .true;
      });
    });
  });
});

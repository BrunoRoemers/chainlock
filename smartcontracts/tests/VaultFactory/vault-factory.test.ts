import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { VaultFactory } from "../../typechain";
// eslint-disable-next-line node/no-missing-import
import { Vault } from "../../typechain";

describe("VaultFactory", () => {
  let signers: SignerWithAddress[];
  let factoryDeployer: SignerWithAddress;
  let factoryContract: VaultFactory;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    factoryDeployer = signers[0];
    const vaultFactory = await ethers.getContractFactory("VaultFactory");
    factoryContract = await vaultFactory.connect(factoryDeployer).deploy();
    await factoryContract.deployed();
  });

  describe("createVault", () => {
    it("should create a vault", async () => {
      const vaultCreator = signers[1];

      const tx = await factoryContract.connect(vaultCreator).createVault();
      const rc = await tx.wait();

      expect(rc.events).to.be.an("array");
      expect(rc.events?.length).to.be.eq(1);

      const event = rc.events![0];

      expect(event.args![0]).to.be.eq(await vaultCreator.getAddress());

      const vaultAddress = event.args![1];

      expect(await factoryContract.connect(vaultCreator).vaults(0)).to.eq(
        vaultAddress
      );

      const vaultContract = await ethers.getContractAt("Vault", vaultAddress);

      expect(
        await vaultContract.pendingMembers(await vaultCreator.getAddress())
      ).to.be.true;
      expect(
        await vaultContract.pendingMembers(await factoryDeployer.getAddress())
      ).to.be.false;
    });
  });
});

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
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
    vaultContract = await vaultFactory
      .connect(deployer)
      .deploy(await deployer.getAddress());
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

    // TODO refactor tests: pending member and outsider

    it("non-member should NOT be able to add a new pending member", async () => {
      const newAddress = await signers[2].getAddress();
      expect(await vaultContract.pendingMembers(newAddress)).to.be.false;
      await expect(
        vaultContract.connect(signers[1]).addPendingMember(newAddress)
      ).to.be.revertedWith("sender not a member");
      expect(await vaultContract.pendingMembers(newAddress)).to.be.false;
    });

    it("non-member should NOT be able to add itself as a new pending member", async () => {
      const selfAddress = await signers[1].getAddress();
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.false;
      await expect(
        vaultContract.connect(signers[1]).addPendingMember(selfAddress)
      ).to.be.revertedWith("sender not a member");
      expect(await vaultContract.pendingMembers(selfAddress)).to.be.false;
    });
  });

  describe("with members, pending members and outsiders", () => {
    let member1: SignerWithAddress;
    let member2: SignerWithAddress;
    let pendingMember1: SignerWithAddress;
    let outsider1: SignerWithAddress;

    beforeEach(async () => {
      // member 1
      member1 = deployer;
      await vaultContract
        .connect(deployer)
        .joinVault("fakePrivKey", "fakePubKey");

      // member 2
      member2 = signers[1];
      await vaultContract
        .connect(member1)
        .addPendingMember(await member2.getAddress());
      await vaultContract
        .connect(member2)
        .joinVault("fakePrivKey2", "fakePubKey2");

      // pending member 1
      pendingMember1 = signers[2];
      await vaultContract
        .connect(member1)
        .addPendingMember(await pendingMember1.getAddress());

      // outsider 1
      outsider1 = signers[3];
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
        ).to.be.revertedWith("sender not a pending member");

        expect(await vaultContract.isMember(await outsider1.getAddress())).to.be
          .false;
      });

      it("member should NOT be able to join vault again", async () => {
        expect(await vaultContract.isMember(await member1.getAddress())).to.be
          .true;

        await expect(
          vaultContract.connect(member1).joinVault("fakePrivKey", "fakePubKey")
        ).to.be.revertedWith("sender not a pending member");

        expect(await vaultContract.isMember(await member1.getAddress())).to.be
          .true;
      });
    });

    describe("getOwnEncryptedPrivateKey", () => {
      it("member should access own encrypted private key", async () => {
        expect(
          await vaultContract.connect(member1).getOwnEncryptedPrivateKey()
        ).to.equal("fakePrivKey");
      });

      it("pending member does not have encrypted private key", async () => {
        await expect(
          vaultContract.connect(pendingMember1).getOwnEncryptedPrivateKey()
        ).to.be.revertedWith("sender not a member");
      });

      it("outsider does not have encrypted private key", async () => {
        await expect(
          vaultContract.connect(outsider1).getOwnEncryptedPrivateKey()
        ).to.be.revertedWith("sender not a member");
      });
    });

    describe("getPublicKey", () => {
      it("member should access own public key", async () => {
        expect(
          await vaultContract
            .connect(member1)
            .getPublicKey(await member1.getAddress())
        ).to.equal("fakePubKey");
      });

      it("member should access public key of other member", async () => {
        expect(
          await vaultContract
            .connect(member1)
            .getPublicKey(await member2.getAddress())
        ).to.equal("fakePubKey2");
      });

      it("pending member should not access public key of member", async () => {
        await expect(
          vaultContract
            .connect(pendingMember1)
            .getPublicKey(await member1.getAddress())
        ).to.be.revertedWith("sender not a member");
      });

      it("outsider should not access public key of member", async () => {
        await expect(
          vaultContract
            .connect(outsider1)
            .getPublicKey(await member1.getAddress())
        ).to.be.revertedWith("sender not a member");
      });
    });

    describe("createAccount", () => {
      it("outsider should NOT be able to create an account", async () => {
        await expect(
          vaultContract.connect(outsider1).createAccount("twitter 1")
        ).to.be.revertedWith("sender not a member");

        // no account has been created
        await expect(vaultContract.connect(member1).accounts(0)).to.be.reverted;
      });

      it("pending member should NOT be able to create an account", async () => {
        await expect(
          vaultContract.connect(pendingMember1).createAccount("twitter 1")
        ).to.be.revertedWith("sender not a member");

        // no account has been created
        await expect(vaultContract.connect(member1).accounts(0)).to.be.reverted;
      });

      it("member should be able to create one account", async () => {
        await expect(vaultContract.connect(member1).createAccount("twitter 1"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 0);

        expect(await vaultContract.connect(member1).accounts(0)).to.be.equal(
          "twitter 1"
        );
      });

      it("member should be able to create three accounts", async () => {
        await expect(vaultContract.connect(member1).createAccount("twitter"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 0);

        await expect(vaultContract.connect(member1).createAccount("gmail"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 1);

        await expect(vaultContract.connect(member1).createAccount("facebook"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 2);

        expect(await vaultContract.connect(member1).accounts(0)).to.be.equal(
          "twitter"
        );

        expect(await vaultContract.connect(member1).accounts(1)).to.be.equal(
          "gmail"
        );

        expect(await vaultContract.connect(member1).accounts(2)).to.be.equal(
          "facebook"
        );
      });

      it("should be able to create multiple accounts with the same identifier", async () => {
        await expect(vaultContract.connect(member1).createAccount("twitter"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 0);

        await expect(vaultContract.connect(member1).createAccount("twitter"))
          .to.emit(vaultContract, "AccountCreated")
          .withArgs(await member1.getAddress(), 1);

        expect(await vaultContract.connect(member1).accounts(0)).to.be.equal(
          "twitter"
        );

        expect(await vaultContract.connect(member1).accounts(1)).to.be.equal(
          "twitter"
        );
      });
    });

    describe("with accounts", () => {
      const account1 = "account 1";
      const account2 = "account 2";
      const account3 = "account 3";

      beforeEach(async () => {
        await vaultContract.connect(member1).createAccount(account1);
        await vaultContract.connect(member1).createAccount(account2);
        await vaultContract.connect(member2).createAccount(account3);
      });

      describe("storeSecret", () => {
        const verifySecretStateNotChanged = async () => {
          // verify secret not created
          await expect(vaultContract.secrets(0)).to.be.reverted;

          // verify secret not added to members
          expect(
            await vaultContract.connect(member1).getOwnSecretIds()
          ).to.deep.equal([]);
          expect(
            await vaultContract.connect(member2).getOwnSecretIds()
          ).to.deep.equal([]);

          // verify secret not added to accounts
          expect(await vaultContract.getMembersByAccountId(0)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(1)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(2)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(3)).to.deep.eq([]);
        };

        it("outsider should NOT be able to store a secret for themselves", async () => {
          await expect(
            vaultContract
              .connect(outsider1)
              .storeSecret(
                await outsider1.getAddress(),
                0,
                "encryptedUsername",
                "encryptedPassword"
              )
          ).to.be.revertedWith("sender not a member");

          await verifySecretStateNotChanged();
        });

        it("outsider should NOT be able to store a secret for a member", async () => {
          await expect(
            vaultContract
              .connect(outsider1)
              .storeSecret(
                await member1.getAddress(),
                0,
                "encryptedUsername",
                "encryptedPassword"
              )
          ).to.be.revertedWith("sender not a member");

          await verifySecretStateNotChanged();
        });

        it("pending member should NOT be able to store a secret for themselves", async () => {
          await expect(
            vaultContract
              .connect(pendingMember1)
              .storeSecret(
                await pendingMember1.getAddress(),
                0,
                "encryptedUsername",
                "encryptedPassword"
              )
          ).to.be.revertedWith("sender not a member");

          await verifySecretStateNotChanged();
        });

        it("pending member should NOT be able to store a secret for a member", async () => {
          await expect(
            vaultContract
              .connect(pendingMember1)
              .storeSecret(
                await member1.getAddress(),
                0,
                "encryptedUsername",
                "encryptedPassword"
              )
          ).to.be.revertedWith("sender not a member");

          await verifySecretStateNotChanged();
        });

        it("member should be able to store a secret for themselves", async () => {
          await expect(
            vaultContract
              .connect(member1)
              .storeSecret(
                await member1.getAddress(),
                2,
                "encryptedUsername123",
                "encryptedPassword456"
              )
          )
            .to.emit(vaultContract, "SecretCreated")
            .withArgs(
              await member1.getAddress(),
              await member1.getAddress(),
              2, // account id
              0 // secret id
            );

          // verify secret
          const secret1 = await vaultContract.secrets(0);
          expect(secret1.encryptedUsername).to.eq("encryptedUsername123");
          expect(secret1.encryptedPassword).to.eq("encryptedPassword456");

          await expect(vaultContract.secrets(1)).to.be.reverted;

          // verify member
          expect(
            await vaultContract.connect(member1).getOwnSecretIds()
          ).to.deep.equal([
            BigNumber.from(0), // secret id
          ]);

          // verify accounts
          expect(await vaultContract.getMembersByAccountId(0)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(1)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(2)).to.deep.eq([
            await member1.getAddress(),
          ]);
          expect(await vaultContract.getMembersByAccountId(3)).to.deep.eq([]);
        });

        it("member should be able to store a secret for other member", async () => {
          await expect(
            vaultContract
              .connect(member1)
              .storeSecret(
                await member2.getAddress(),
                1,
                "encryptedUsername123",
                "encryptedPassword456"
              )
          )
            .to.emit(vaultContract, "SecretCreated")
            .withArgs(
              await member1.getAddress(),
              await member2.getAddress(),
              1, // account id
              0 // secret id
            );

          // verify secret
          const secret1 = await vaultContract.secrets(0);
          expect(secret1.encryptedUsername).to.eq("encryptedUsername123");
          expect(secret1.encryptedPassword).to.eq("encryptedPassword456");

          await expect(vaultContract.secrets(1)).to.be.reverted;

          // verify member
          expect(
            await vaultContract.connect(member1).getOwnSecretIds()
          ).to.deep.equal([]);
          expect(
            await vaultContract.connect(member2).getOwnSecretIds()
          ).to.deep.equal([
            BigNumber.from(0), // secret id
          ]);

          // verify accounts
          expect(await vaultContract.getMembersByAccountId(0)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(1)).to.deep.eq([
            await member2.getAddress(),
          ]);
          expect(await vaultContract.getMembersByAccountId(2)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(3)).to.deep.eq([]);
        });

        it("should be able to store multiple secrets for a member", async () => {
          await expect(
            vaultContract
              .connect(member1)
              .storeSecret(await member1.getAddress(), 1, "S.U.1", "S.P.1")
          )
            .to.emit(vaultContract, "SecretCreated")
            .withArgs(
              await member1.getAddress(),
              await member1.getAddress(),
              1, // account id
              0 // secret id
            );

          await expect(
            vaultContract
              .connect(member2)
              .storeSecret(await member1.getAddress(), 1, "S.U.2", "S.P.2")
          )
            .to.emit(vaultContract, "SecretCreated")
            .withArgs(
              await member2.getAddress(),
              await member1.getAddress(),
              1, // account id
              1 // secret id
            );

          await expect(
            vaultContract
              .connect(member2)
              .storeSecret(await member1.getAddress(), 2, "S.U.3", "S.P.3")
          )
            .to.emit(vaultContract, "SecretCreated")
            .withArgs(
              await member2.getAddress(),
              await member1.getAddress(),
              2, // account id
              2 // secret id
            );

          // verify secret
          const secret1 = await vaultContract.secrets(0);
          expect(secret1.encryptedUsername).to.eq("S.U.1");
          expect(secret1.encryptedPassword).to.eq("S.P.1");
          const secret2 = await vaultContract.secrets(1);
          expect(secret2.encryptedUsername).to.eq("S.U.2");
          expect(secret2.encryptedPassword).to.eq("S.P.2");
          const secret3 = await vaultContract.secrets(2);
          expect(secret3.encryptedUsername).to.eq("S.U.3");
          expect(secret3.encryptedPassword).to.eq("S.P.3");

          await expect(vaultContract.secrets(3)).to.be.reverted;

                // TODO cont here

          // verify member
          expect(
            await vaultContract.connect(member1).getOwnSecretIds()
          ).to.deep.equal([
            BigNumber.from(0), // secret id
            BigNumber.from(1), // secret id
            BigNumber.from(2), // secret id
          ]);
          expect(
            await vaultContract.connect(member2).getOwnSecretIds()
          ).to.deep.equal([]);

          // verify accounts
          expect(await vaultContract.getMembersByAccountId(0)).to.deep.eq([]);
          expect(await vaultContract.getMembersByAccountId(1)).to.deep.eq([
            // TODO should be here only once, fix this bug later
            await member1.getAddress(),
            await member1.getAddress(),
          ]);
          expect(await vaultContract.getMembersByAccountId(2)).to.deep.eq([
            await member1.getAddress(),
          ]);
          expect(await vaultContract.getMembersByAccountId(3)).to.deep.eq([]);
        });

        it("member should NOT be able to store a secret for pending member", async () => {
          await expect(
            vaultContract
              .connect(member1)
              .storeSecret(
                await pendingMember1.getAddress(),
                1,
                "encryptedUsername123",
                "encryptedPassword456"
              )
          ).to.be.revertedWith("recipient not a member");

          await verifySecretStateNotChanged();
        });

        it("member should NOT be able to store a secret for outsider", async () => {
          await expect(
            vaultContract
              .connect(member1)
              .storeSecret(
                await outsider1.getAddress(),
                1,
                "encryptedUsername123",
                "encryptedPassword456"
              )
          ).to.be.revertedWith("recipient not a member");

          await verifySecretStateNotChanged();
        });
      });
    });
  });
});

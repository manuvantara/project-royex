import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("RoyaltyPaymentPool", function () {
  const RXRC2_ROLE =
    "0x77c6a04230ad617eb59ec90dad8c70a66f2f87f5d791cd2603e1d73ba16d4a96";
  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

  const ROYALTY_TO_MINT = 100n;
  const USDC_TO_MINT = 1000n * 10n ** 18n;

  const DEPOSIT_AMOUNT = USDC_TO_MINT / 10n;
  const DEPOSIT_AMOUNT_OVERFLOW = 2n ** 128n;

  const WITHDRAWAL_AMOUNT = 20n * 10n ** 18n;

  async function deployRoyaltyPaymentPoolFixture() {
    const [owner, investor, distributor, ...otherAccounts] =
      await ethers.getSigners();

    const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
    const royaltyToken = await RoyaltyToken.deploy(owner.address);

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy(owner.address);

    const RoyaltyPaymentPool =
      await ethers.getContractFactory("RoyaltyPaymentPool");
    const royaltyPaymentPool = await RoyaltyPaymentPool.deploy(
      owner.address,
      royaltyToken.getAddress(),
      stablecoin.getAddress(),
    );

    await royaltyToken.grantRole(RXRC2_ROLE, royaltyPaymentPool.getAddress());

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  async function approveDepositFixture() {
    const {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    } = await loadFixture(deployRoyaltyPaymentPoolFixture);

    await stablecoin.mint(distributor.address, USDC_TO_MINT);
    await stablecoin
      .connect(distributor)
      .approve(royaltyPaymentPool.getAddress(), USDC_TO_MINT);

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  async function initialDepositFixture() {
    const {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    } = await loadFixture(approveDepositFixture);

    await royaltyPaymentPool.depositRoyalties(
      distributor.address,
      DEPOSIT_AMOUNT,
    );

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  async function checkpointedDepositFixture() {
    const {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    } = await loadFixture(approveDepositFixture);

    await royaltyToken.mint(investor, ROYALTY_TO_MINT);
    await royaltyPaymentPool.depositRoyalties(
      distributor.address,
      DEPOSIT_AMOUNT,
    );

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  async function multipleDeposistsFixture() {
    const {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    } = await loadFixture(approveDepositFixture);

    await royaltyToken.mint(investor, ROYALTY_TO_MINT);
    await royaltyPaymentPool.depositRoyalties(
      distributor.address,
      DEPOSIT_AMOUNT * 2n,
    );

    await royaltyToken.mint(investor, ROYALTY_TO_MINT);
    await royaltyPaymentPool.depositRoyalties(
      distributor.address,
      DEPOSIT_AMOUNT,
    );

    await royaltyToken.mint(investor, ROYALTY_TO_MINT);
    await royaltyPaymentPool.depositRoyalties(
      distributor.address,
      DEPOSIT_AMOUNT / 2n,
    );

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  async function withdrawalFixture() {
    const {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    } = await loadFixture(checkpointedDepositFixture);

    await royaltyPaymentPool
      .connect(investor)
      .withdrawRoyalties(1n, WITHDRAWAL_AMOUNT);

    return {
      royaltyToken,
      stablecoin,
      royaltyPaymentPool,
      owner,
      investor,
      distributor,
      otherAccounts,
    };
  }

  describe("Deployment", function () {
    it("should set stable coin and royalty token", async function () {
      const { royaltyPaymentPool } = await loadFixture(
        deployRoyaltyPaymentPoolFixture,
      );

      expect(await royaltyPaymentPool.royaltyToken()).not.to.be.equal(
        NULL_ADDRESS,
      );
      expect(await royaltyPaymentPool.stablecoin()).not.to.be.equal(
        NULL_ADDRESS,
      );
    });

    context("checkpoint", function () {
      it("should revert if called not by a royalty pool", async function () {
        const { royaltyToken, owner } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(royaltyToken.connect(owner).checkpoint()).to.be.reverted;
      });
    });
  });

  describe("Royalties deposit", function () {
    context("approval", function () {
      it("should revert if the deposit amount is more than approved", async function () {
        const { royaltyPaymentPool, owner, distributor } = await loadFixture(
          approveDepositFixture,
        );

        await expect(
          royaltyPaymentPool.depositRoyalties(owner.address, DEPOSIT_AMOUNT),
        ).to.be.reverted;
        await expect(
          royaltyPaymentPool.depositRoyalties(
            distributor.address,
            USDC_TO_MINT + 500n,
          ),
        ).to.be.reverted;
      });
    });

    context("invalid deposit amount", function () {
      it("should revert if the deposit amount is zero", async function () {
        const { royaltyPaymentPool, owner } = await loadFixture(
          approveDepositFixture,
        );

        await expect(royaltyPaymentPool.depositRoyalties(owner.address, 0n)).to
          .be.reverted;
      });

      it("should revert if the deposit amount is higher than uint128 max value", async function () {
        const { royaltyPaymentPool, stablecoin, distributor } =
          await loadFixture(approveDepositFixture);

        await stablecoin.mint(distributor.address, DEPOSIT_AMOUNT_OVERFLOW);
        await stablecoin
          .connect(distributor)
          .approve(royaltyPaymentPool.getAddress(), DEPOSIT_AMOUNT_OVERFLOW);

        await expect(
          royaltyPaymentPool.depositRoyalties(
            distributor.address,
            DEPOSIT_AMOUNT_OVERFLOW,
          ),
        ).to.be.reverted;
      });
    });

    context("success", function () {
      it("should emit RoyaltiesDeposited event with proper parameters", async function () {
        const { royaltyPaymentPool, distributor } = await loadFixture(
          approveDepositFixture,
        );

        await expect(
          royaltyPaymentPool.depositRoyalties(
            distributor.address,
            DEPOSIT_AMOUNT,
          ),
        )
          .to.emit(royaltyPaymentPool, "RoyaltiesDeposited")
          .withArgs(distributor.address, DEPOSIT_AMOUNT);
      });

      it("should update balances", async function () {
        const { stablecoin, royaltyPaymentPool, distributor } =
          await loadFixture(initialDepositFixture);

        expect(await stablecoin.balanceOf(distributor.address)).to.equal(
          USDC_TO_MINT - DEPOSIT_AMOUNT,
        );
        expect(
          await stablecoin.balanceOf(royaltyPaymentPool.getAddress()),
        ).to.equal(DEPOSIT_AMOUNT);
      });
    });
  });

  describe("Royalties withdrawal", function () {
    context("checkpoint", function () {
      it("should revert if the checkpoint key provided is zero", async function () {
        const { royaltyPaymentPool, royaltyToken } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(
          royaltyPaymentPool.withdrawRoyalties(0n, WITHDRAWAL_AMOUNT),
        ).to.be.revertedWithCustomError(royaltyToken, "InvalidCheckpoint");
      });

      it("should revert if the checkpoint key provided is in the future", async function () {
        const { royaltyPaymentPool, royaltyToken } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(
          royaltyPaymentPool.withdrawRoyalties(1n, WITHDRAWAL_AMOUNT),
        )
          .to.be.revertedWithCustomError(royaltyToken, "NonexistentCheckpoint")
          .withArgs(1n, 0n);
      });

      it("should update the checkpoint key in case of success", async function () {
        const { royaltyToken } = await loadFixture(multipleDeposistsFixture);

        expect(await royaltyToken.getCurrentCheckpointKey()).to.equal(3n);
      });
    });

    context("amount", function () {
      it("should revert if the withdrawal amount is zero", async function () {
        const { royaltyPaymentPool } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(
          royaltyPaymentPool.withdrawRoyalties(1n, 0n),
        ).to.be.revertedWithCustomError(royaltyPaymentPool, "InvalidAmount");
      });

      it("should revert if the withdrawal amount is higher than avaliable to withdraw", async function () {
        const { royaltyPaymentPool, investor } = await loadFixture(
          checkpointedDepositFixture,
        );

        await expect(
          royaltyPaymentPool
            .connect(investor)
            .withdrawRoyalties(1n, WITHDRAWAL_AMOUNT + DEPOSIT_AMOUNT),
        )
          .to.be.revertedWithCustomError(
            royaltyPaymentPool,
            "ExcessiveWithdrawalAmount",
          )
          .withArgs(WITHDRAWAL_AMOUNT + DEPOSIT_AMOUNT, DEPOSIT_AMOUNT);
      });

      it(`should revert if the withdrawal amount is higher than possible at the 
      provided checkpoint with multiple checkpoints`, async function () {
        const { royaltyPaymentPool, investor } = await loadFixture(
          multipleDeposistsFixture,
        );

        await expect(
          royaltyPaymentPool
            .connect(investor)
            .withdrawRoyalties(3n, DEPOSIT_AMOUNT),
        ).to.be.reverted;
      });
    });

    context("royalty rate", function () {
      it("should revert if the royalty rate is zero", async function () {
        const { royaltyPaymentPool } = await loadFixture(initialDepositFixture);

        await expect(
          royaltyPaymentPool.withdrawRoyalties(1n, 100n),
        ).to.be.revertedWithCustomError(
          royaltyPaymentPool,
          "InsufficientRoyaltyRate",
        );
      });
    });

    context("success", function () {
      it("should emit RoyaltiesWithdrawn event with proper parameters in case of success", async function () {
        const { investor, royaltyPaymentPool } = await loadFixture(
          checkpointedDepositFixture,
        );

        await expect(
          royaltyPaymentPool
            .connect(investor)
            .withdrawRoyalties(1n, WITHDRAWAL_AMOUNT),
        )
          .to.emit(royaltyPaymentPool, "RoyaltiesWithdrawn")
          .withArgs(1n, investor.address, WITHDRAWAL_AMOUNT);
      });

      it("should update balances in case of success", async function () {
        const { stablecoin, royaltyPaymentPool, investor } =
          await loadFixture(withdrawalFixture);

        expect(await stablecoin.balanceOf(investor.address))
          .to.equal(WITHDRAWAL_AMOUNT)
          .to.equal(
            (
              await royaltyPaymentPool.getRoyaltyPaymentDetails(
                1n,
                investor.address,
              )
            ).amountWithdrawn,
          );
        expect(
          await stablecoin.balanceOf(royaltyPaymentPool.getAddress()),
        ).to.equal(DEPOSIT_AMOUNT - WITHDRAWAL_AMOUNT);
      });

      it("should withdraw the expected amount of royalties and update balances with multiple checkpoints", async function () {
        const { stablecoin, royaltyPaymentPool, investor } = await loadFixture(
          multipleDeposistsFixture,
        );

        await royaltyPaymentPool
          .connect(investor)
          .withdrawRoyalties(1n, WITHDRAWAL_AMOUNT * 2n);
        expect(WITHDRAWAL_AMOUNT * 2n).to.equal(
          (
            await royaltyPaymentPool.getRoyaltyPaymentDetails(
              1n,
              investor.address,
            )
          ).amountWithdrawn,
        );

        await royaltyPaymentPool
          .connect(investor)
          .withdrawRoyalties(2n, WITHDRAWAL_AMOUNT);
        expect(WITHDRAWAL_AMOUNT).to.equal(
          (
            await royaltyPaymentPool.getRoyaltyPaymentDetails(
              2n,
              investor.address,
            )
          ).amountWithdrawn,
        );

        await royaltyPaymentPool
          .connect(investor)
          .withdrawRoyalties(3n, WITHDRAWAL_AMOUNT / 2n);

        expect(WITHDRAWAL_AMOUNT / 2n).to.equal(
          (
            await royaltyPaymentPool.getRoyaltyPaymentDetails(
              3n,
              investor.address,
            )
          ).amountWithdrawn,
        );

        expect(await stablecoin.balanceOf(investor.address)).to.equal(
          WITHDRAWAL_AMOUNT * 2n + WITHDRAWAL_AMOUNT + WITHDRAWAL_AMOUNT / 2n,
        );

        expect(
          await stablecoin.balanceOf(royaltyPaymentPool.getAddress()),
        ).to.equal(
          DEPOSIT_AMOUNT * 2n +
            DEPOSIT_AMOUNT +
            DEPOSIT_AMOUNT / 2n -
            WITHDRAWAL_AMOUNT * 2n -
            WITHDRAWAL_AMOUNT -
            WITHDRAWAL_AMOUNT / 2n,
        );
      });
    });
  });

  describe("Get royalty payment details", function () {
    context("checkpoint", function () {
      it("should revert if the checkpoint key provided is zero", async function () {
        const { royaltyPaymentPool, royaltyToken, owner } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(
          royaltyPaymentPool.getRoyaltyPaymentDetails(0n, owner.address),
        ).to.be.revertedWithCustomError(royaltyToken, "InvalidCheckpoint");
      });

      it("should revert if the checkpoint key provided is in the future", async function () {
        const { royaltyPaymentPool, royaltyToken, owner } = await loadFixture(
          deployRoyaltyPaymentPoolFixture,
        );

        await expect(
          royaltyPaymentPool.getRoyaltyPaymentDetails(1n, owner.address),
        )
          .to.be.revertedWithCustomError(royaltyToken, "NonexistentCheckpoint")
          .withArgs(1n, 0n);
      });

      it("should not revert in case of balance and total supply equal to zero", async function () {
        const { royaltyPaymentPool, owner } = await loadFixture(
          initialDepositFixture,
        );

        await expect(
          royaltyPaymentPool.getRoyaltyPaymentDetails(1n, owner.address),
        ).not.to.be.reverted;
      });

      it("should return correct royalty payment details", async function () {
        const { royaltyPaymentPool, royaltyToken, investor } =
          await loadFixture(checkpointedDepositFixture);

        const [
          royaltyDeposit,
          royaltyBalance,
          royaltyTotalSupply,
          amountWithdrawn,
        ] = await royaltyPaymentPool
          .connect(investor)
          .getRoyaltyPaymentDetails(1n, investor.address);

        expect(royaltyDeposit).to.equal(DEPOSIT_AMOUNT);
        expect(royaltyBalance).to.equal(
          await royaltyToken.balanceOfAt(investor.address, 1n),
        );
        expect(royaltyTotalSupply).to.equal(
          await royaltyToken.totalSupplyAt(1n),
        );
        expect(amountWithdrawn).to.equal(0n);
      });

      it("should return correct royalty payment details after the withdrawal", async function () {
        const { royaltyPaymentPool, royaltyToken, investor } =
          await loadFixture(withdrawalFixture);

        const [
          royaltyDeposit,
          royaltyBalance,
          royaltyTotalSupply,
          amountWithdrawn,
        ] = await royaltyPaymentPool
          .connect(investor)
          .getRoyaltyPaymentDetails(1n, investor.address);

        expect(royaltyDeposit).to.equal(DEPOSIT_AMOUNT);
        expect(royaltyBalance).to.equal(
          await royaltyToken.balanceOfAt(investor.address, 1n),
        );
        expect(royaltyTotalSupply).to.equal(
          await royaltyToken.totalSupplyAt(1n),
        );
        expect(amountWithdrawn).to.equal(WITHDRAWAL_AMOUNT);
      });
    });
  });
});

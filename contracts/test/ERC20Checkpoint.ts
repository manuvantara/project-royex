import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC20Checkpoint", function () {
  const INITIAL_SUPPLY = 100n;
  const INITIAL_CHECKPOINT_KEY = 1n;
  const SECOND_CHECKPOINT_KEY = 2n;
  const SECOND_CHECKPOINT_KEYS = [2n, 3n, 4n];
  const RXRC2_ROLE =
    "0x77c6a04230ad617eb59ec90dad8c70a66f2f87f5d791cd2603e1d73ba16d4a96";

  async function deployERC20CheckpointFixture() {
    const [initialHolder, recipient, other, ...otherAccounts] =
      await ethers.getSigners();

    const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
    const royaltyToken = await RoyaltyToken.deploy(initialHolder.address);
    await royaltyToken.mint(initialHolder.address, INITIAL_SUPPLY);
    await royaltyToken.grantRole(RXRC2_ROLE, initialHolder.address);

    return { royaltyToken, initialHolder, recipient, other, otherAccounts };
  }

  async function initialCheckpointFixture() {
    const { royaltyToken, initialHolder, recipient, other } = await loadFixture(
      deployERC20CheckpointFixture,
    );
    await expect(royaltyToken.checkpoint())
      .to.emit(royaltyToken, "Checkpoint")
      .withArgs(INITIAL_CHECKPOINT_KEY);

    return { royaltyToken, initialHolder, recipient, other };
  }

  describe("checkpoint", function () {
    it("emits a checkpoint event", async function () {
      const { royaltyToken } = await loadFixture(deployERC20CheckpointFixture);

      await expect(royaltyToken.checkpoint())
        .to.emit(royaltyToken, "Checkpoint")
        .withArgs(1n);
    });

    it("creates increasing checkpoint keys, starting from 1", async function () {
      const { royaltyToken } = await loadFixture(deployERC20CheckpointFixture);
      for (const key of [1n, 2n, 3n, 4n, 5n]) {
        await expect(royaltyToken.checkpoint())
          .to.emit(royaltyToken, "Checkpoint")
          .withArgs(key);
      }
    });

    it("should revert if value for mint, burn or transfer exceeds uint128 max value", async function () {
      const { royaltyToken, initialHolder } = await loadFixture(
        deployERC20CheckpointFixture,
      );

      await expect(
        royaltyToken.mint(initialHolder.address, 2n ** 128n),
      ).to.be.revertedWithCustomError(
        royaltyToken,
        "SafeCastOverflowedUintDowncast",
      );
    });
  });

  describe("totalSupplyAt", function () {
    it("reverts with a checkpoint key of 0", async function () {
      const { royaltyToken } = await loadFixture(deployERC20CheckpointFixture);

      await expect(royaltyToken.totalSupplyAt(0)).to.be.revertedWithCustomError(
        royaltyToken,
        "InvalidCheckpoint",
      );
    });

    it("reverts with a not-yet-created checkpoint key", async function () {
      const { royaltyToken } = await loadFixture(deployERC20CheckpointFixture);

      await expect(royaltyToken.totalSupplyAt(1))
        .to.be.revertedWithCustomError(royaltyToken, "NonexistentCheckpoint")
        .withArgs(1n, 0n);
    });

    context("with initial checkpoint", function () {
      context("with no supply changes after the checkpoint", function () {
        it("returns the current total supply", async function () {
          const { royaltyToken } = await loadFixture(initialCheckpointFixture);
          expect(
            await royaltyToken.totalSupplyAt(INITIAL_CHECKPOINT_KEY),
          ).to.be.equal(INITIAL_SUPPLY);
        });
      });

      context("with supply changes after the checkpoint", function () {
        async function supplyChangesAfterTheCheckpointFixture() {
          const { royaltyToken, initialHolder, other } = await loadFixture(
            initialCheckpointFixture,
          );

          await royaltyToken.mint(other, 50n);
          await royaltyToken.mint(initialHolder, 50n);

          return { royaltyToken };
        }

        it("returns the total supply before the changes", async function () {
          const { royaltyToken } = await loadFixture(
            supplyChangesAfterTheCheckpointFixture,
          );
          expect(
            await royaltyToken.totalSupplyAt(INITIAL_CHECKPOINT_KEY),
          ).to.be.equal(INITIAL_SUPPLY);
        });

        context("with a second checkpoint after supply changes", function () {
          it("checkpoints return the supply before and after the changes", async function () {
            const { royaltyToken } = await loadFixture(
              supplyChangesAfterTheCheckpointFixture,
            );
            await expect(royaltyToken.checkpoint())
              .to.emit(royaltyToken, "Checkpoint")
              .withArgs(SECOND_CHECKPOINT_KEY);

            expect(
              await royaltyToken.totalSupplyAt(INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(INITIAL_SUPPLY);

            expect(
              await royaltyToken.totalSupplyAt(SECOND_CHECKPOINT_KEY),
            ).to.be.equal(await royaltyToken.totalSupply());
          });
        });

        context("with multiple checkpoints after supply changes", function () {
          it("all posterior checkpoints return the supply after the changes", async function () {
            const { royaltyToken } = await loadFixture(
              supplyChangesAfterTheCheckpointFixture,
            );

            for (const key of SECOND_CHECKPOINT_KEYS) {
              await expect(royaltyToken.checkpoint())
                .to.emit(royaltyToken, "Checkpoint")
                .withArgs(BigInt(key));
            }
            expect(
              await royaltyToken.totalSupplyAt(INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(INITIAL_SUPPLY);

            const currentSupply = await royaltyToken.totalSupply();

            for (const key of SECOND_CHECKPOINT_KEYS) {
              expect(await royaltyToken.totalSupplyAt(key)).to.be.equal(
                currentSupply,
              );
            }
          });
        });
      });
    });
  });

  describe("balanceOfAt", function () {
    it("reverts with a snapshot id of 0", async function () {
      const { royaltyToken, other } = await loadFixture(
        deployERC20CheckpointFixture,
      );
      await expect(
        royaltyToken.balanceOfAt(other.address, 0),
      ).to.be.revertedWithCustomError(royaltyToken, "InvalidCheckpoint");
    });

    it("reverts with a not-yet-created snapshot id", async function () {
      const { royaltyToken, other } = await loadFixture(
        deployERC20CheckpointFixture,
      );
      await expect(royaltyToken.balanceOfAt(other, 1))
        .to.be.revertedWithCustomError(royaltyToken, "NonexistentCheckpoint")
        .withArgs(1n, 0n);
    });

    context("with initial checkpoint", function () {
      context("with no balance changes after the checkpoint", function () {
        it("returns the current balance for all accounts", async function () {
          const { royaltyToken, initialHolder, recipient, other } =
            await loadFixture(initialCheckpointFixture);

          expect(
            await royaltyToken.balanceOfAt(
              initialHolder.address,
              INITIAL_CHECKPOINT_KEY,
            ),
          ).to.be.equal(INITIAL_SUPPLY);
          expect(
            await royaltyToken.balanceOfAt(
              recipient.address,
              INITIAL_CHECKPOINT_KEY,
            ),
          ).to.be.equal(0n);
          expect(
            await royaltyToken.balanceOfAt(
              other.address,
              INITIAL_CHECKPOINT_KEY,
            ),
          ).to.be.equal(0n);
        });
      });

      context("with balance changes after the checkpoint", function () {
        async function balanceChangesAfterTheCheckpointFixture() {
          const { royaltyToken, initialHolder, recipient, other } =
            await loadFixture(initialCheckpointFixture);

          await royaltyToken.transfer(recipient, 10n);
          await royaltyToken.mint(other, 50n);
          await royaltyToken.mint(initialHolder, 20n);

          return { royaltyToken, initialHolder, recipient, other };
        }

        it("returns the balances before the changes", async function () {
          const { royaltyToken, initialHolder, recipient, other } =
            await loadFixture(balanceChangesAfterTheCheckpointFixture);

          expect(
            await royaltyToken.balanceOfAt(
              initialHolder,
              INITIAL_CHECKPOINT_KEY,
            ),
          ).to.be.equal(INITIAL_SUPPLY);
          expect(
            await royaltyToken.balanceOfAt(recipient, INITIAL_CHECKPOINT_KEY),
          ).to.be.equal(0n);
          expect(
            await royaltyToken.balanceOfAt(other, INITIAL_CHECKPOINT_KEY),
          ).to.be.equal(0n);
        });

        context("with a second checkpoint after supply changes", function () {
          it("checkpoints return the balances before and after the changes", async function () {
            const { royaltyToken, initialHolder, recipient, other } =
              await loadFixture(balanceChangesAfterTheCheckpointFixture);

            await expect(royaltyToken.checkpoint())
              .to.emit(royaltyToken, "Checkpoint")
              .withArgs(SECOND_CHECKPOINT_KEY);
            expect(
              await royaltyToken.balanceOfAt(
                initialHolder,
                INITIAL_CHECKPOINT_KEY,
              ),
            ).to.be.equal(INITIAL_SUPPLY);
            expect(
              await royaltyToken.balanceOfAt(recipient, INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(0n);
            expect(
              await royaltyToken.balanceOfAt(other, INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(0n);

            expect(
              await royaltyToken.balanceOfAt(
                initialHolder,
                SECOND_CHECKPOINT_KEY,
              ),
            ).to.be.equal(await royaltyToken.balanceOf(initialHolder));
            expect(
              await royaltyToken.balanceOfAt(recipient, SECOND_CHECKPOINT_KEY),
            ).to.be.equal(await royaltyToken.balanceOf(recipient));
            expect(
              await royaltyToken.balanceOfAt(other, SECOND_CHECKPOINT_KEY),
            ).to.be.equal(await royaltyToken.balanceOf(other));
          });
        });

        context("with multiple snapshots after supply changes", function () {
          it("all posterior snapshots return the supply after the changes", async function () {
            const { royaltyToken, initialHolder, recipient, other } =
              await loadFixture(balanceChangesAfterTheCheckpointFixture);

            for (const key of SECOND_CHECKPOINT_KEYS) {
              await expect(royaltyToken.checkpoint())
                .to.emit(royaltyToken, "Checkpoint")
                .withArgs(BigInt(key));
            }

            expect(
              await royaltyToken.totalSupplyAt(INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(INITIAL_SUPPLY);
            expect(
              await royaltyToken.balanceOfAt(
                initialHolder,
                INITIAL_CHECKPOINT_KEY,
              ),
            ).to.be.equal(INITIAL_SUPPLY);
            expect(
              await royaltyToken.balanceOfAt(recipient, INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(0n);
            expect(
              await royaltyToken.balanceOfAt(other, INITIAL_CHECKPOINT_KEY),
            ).to.be.equal(0n);

            for (const id of SECOND_CHECKPOINT_KEYS) {
              expect(
                await royaltyToken.balanceOfAt(initialHolder, id),
              ).to.be.equal(await royaltyToken.balanceOf(initialHolder));
              expect(await royaltyToken.balanceOfAt(recipient, id)).to.be.equal(
                await royaltyToken.balanceOf(recipient),
              );
              expect(await royaltyToken.balanceOfAt(other, id)).to.be.equal(
                await royaltyToken.balanceOf(other),
              );
            }
          });
        });
      });
    });
  });
});

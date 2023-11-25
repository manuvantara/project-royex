import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AutomatedRoyaltyMarketMaker", function () {
  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
  const ROYALTY_TOKEN_TO_MINT = ethers.parseEther("20");
  const STABLECOIN_TO_MINT = ethers.parseEther("10");
  const ROYALTY_TOKEN_AMOUNT = ethers.parseEther("5");
  const HUGE_ROYALTY_TOKEN_AMOUNT = ethers.parseEther("25");

  async function deployRoyaltyExchangeFixture() {
    const [owner, trader, ...otherAccounts] = await ethers.getSigners();

    const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
    const royaltyToken = await RoyaltyToken.deploy(owner.address);

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy(owner.address);

    const RoyaltyExchange = await ethers.getContractFactory("RoyaltyExchange");
    const royaltyExchange = await RoyaltyExchange.deploy(
      owner.address,
      royaltyToken.getAddress(),
      stablecoin.getAddress(),
    );

    return {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    };
  }

  async function approvedInitialLiquidity() {
    const {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    } = await loadFixture(deployRoyaltyExchangeFixture);

    await royaltyToken.mint(owner.address, ROYALTY_TOKEN_TO_MINT);
    await stablecoin.mint(owner.address, STABLECOIN_TO_MINT);

    await royaltyToken.approve(
      royaltyExchange.getAddress(),
      ROYALTY_TOKEN_TO_MINT,
    );
    await stablecoin.approve(royaltyExchange.getAddress(), STABLECOIN_TO_MINT);

    return {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    };
  }

  async function providedInitialLiquidity() {
    const {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    } = await loadFixture(approvedInitialLiquidity);

    await royaltyExchange.provideInitialLiquidity(
      ROYALTY_TOKEN_TO_MINT,
      STABLECOIN_TO_MINT,
    );

    return {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    };
  }

  async function buy() {
    const {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    } = await loadFixture(providedInitialLiquidity);

    const royaltyTokenAmount = ROYALTY_TOKEN_AMOUNT;
    const desiredStablecoinAmount =
      await royaltyExchange.calculateStablecoinAmount(true, royaltyTokenAmount);
    const priceSlippage = 50;

    return {
      royaltyTokenAmount,
      desiredStablecoinAmount,
      priceSlippage,
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    };
  }

  async function sell() {
    const {
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    } = await loadFixture(providedInitialLiquidity);

    const royaltyTokenAmount = ROYALTY_TOKEN_AMOUNT;
    const desiredStablecoinAmount =
      await royaltyExchange.calculateStablecoinAmount(
        false,
        royaltyTokenAmount,
      );
    const priceSlippage = 50;

    return {
      royaltyTokenAmount,
      desiredStablecoinAmount,
      priceSlippage,
      royaltyToken,
      stablecoin,
      royaltyExchange,
      owner,
      trader,
      otherAccounts,
    };
  }

  describe("Deployment", function () {
    it("should set royalty token and stable coin addresses", async function () {
      const { royaltyToken, stablecoin, royaltyExchange } = await loadFixture(
        deployRoyaltyExchangeFixture,
      );

      expect(await royaltyExchange.royaltyToken()).not.to.equal(NULL_ADDRESS);
      expect(await royaltyExchange.stablecoin()).not.to.equal(NULL_ADDRESS);
      expect(await stablecoin.balanceOf(royaltyExchange.getAddress())).to.equal(
        0n,
      );
      expect(
        await royaltyToken.balanceOf(royaltyExchange.getAddress()),
      ).to.equal(0n);
    });

    context("initial liquidity", function () {
      it("should revert if providing zero liquidity", async function () {
        const { royaltyExchange } = await loadFixture(
          deployRoyaltyExchangeFixture,
        );

        await expect(
          royaltyExchange.provideInitialLiquidity(0, 0),
        ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");

        await expect(
          royaltyExchange.provideInitialLiquidity(0, 1),
        ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");

        await expect(
          royaltyExchange.provideInitialLiquidity(1, 0),
        ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");
      });

      it("should revert if non-owner tries to provide liquidity", async function () {
        const { royaltyExchange, otherAccounts } = await loadFixture(
          deployRoyaltyExchangeFixture,
        );

        await expect(
          royaltyExchange
            .connect(otherAccounts[0])
            .provideInitialLiquidity(1, 2),
        ).to.be.reverted;
      });

      it("should revert if owner tries to provide liquidity with insufficient allowance", async function () {
        const { royaltyExchange } = await loadFixture(
          deployRoyaltyExchangeFixture,
        );

        await expect(royaltyExchange.provideInitialLiquidity(1, 2)).to.be
          .reverted;
      });

      it("should emit InitialLiquidityProvided event with proper params", async function () {
        const { royaltyExchange } = await loadFixture(approvedInitialLiquidity);

        await expect(
          royaltyExchange.provideInitialLiquidity(
            ROYALTY_TOKEN_TO_MINT,
            STABLECOIN_TO_MINT,
          ),
        )
          .to.emit(royaltyExchange, "InitialLiquidityProvided")
          .withArgs(ROYALTY_TOKEN_TO_MINT, STABLECOIN_TO_MINT);
      });

      it("should revert if the liquidity has already been provided", async function () {
        const { royaltyExchange } = await loadFixture(providedInitialLiquidity);

        await expect(
          royaltyExchange.provideInitialLiquidity(
            ROYALTY_TOKEN_TO_MINT,
            STABLECOIN_TO_MINT,
          ),
        ).to.be.revertedWithCustomError(
          royaltyExchange,
          "InitialLiquidityAlreadyProvided",
        );
      });

      it("should update balances and reserves in case of success", async function () {
        const { owner, royaltyExchange, royaltyToken, stablecoin } =
          await loadFixture(providedInitialLiquidity);

        expect(
          await royaltyToken.balanceOf(royaltyExchange.getAddress()),
        ).to.equal(ROYALTY_TOKEN_TO_MINT);
        expect(
          await stablecoin.balanceOf(royaltyExchange.getAddress()),
        ).to.equal(STABLECOIN_TO_MINT);
        expect(await royaltyToken.balanceOf(owner.address)).to.equal(0n);
        expect(await stablecoin.balanceOf(owner.address)).to.equal(0n);

        expect(await royaltyExchange.royaltyTokenReserve()).to.equal(
          ROYALTY_TOKEN_TO_MINT,
        );
        expect(await royaltyExchange.stablecoinReserve()).to.equal(
          STABLECOIN_TO_MINT,
        );
      });
    });
  });

  describe("Calculate stablecoin amount", function () {
    it("should correctly calculate stablecoin amount for buy", async function () {
      const { royaltyExchange } = await loadFixture(providedInitialLiquidity);

      const stablecoinAmount =
        (1003n * ROYALTY_TOKEN_AMOUNT * STABLECOIN_TO_MINT) /
        (1000n * ROYALTY_TOKEN_TO_MINT - 1003n * ROYALTY_TOKEN_AMOUNT);

      expect(
        await royaltyExchange.calculateStablecoinAmount(
          true,
          ROYALTY_TOKEN_AMOUNT,
        ),
      ).to.equal(stablecoinAmount);
    });

    it("should correctly calculate stablecoin amount for sell", async function () {
      const { royaltyExchange } = await loadFixture(providedInitialLiquidity);

      const stablecoinAmount =
        (997n * ROYALTY_TOKEN_AMOUNT * STABLECOIN_TO_MINT) /
        (1000n * ROYALTY_TOKEN_TO_MINT + 997n * ROYALTY_TOKEN_AMOUNT);

      expect(
        await royaltyExchange.calculateStablecoinAmount(
          false,
          ROYALTY_TOKEN_AMOUNT,
        ),
      ).to.equal(stablecoinAmount);
    });

    it("should revert if trade exceeds reserves", async function () {
      const { royaltyExchange } = await loadFixture(providedInitialLiquidity);

      await expect(
        royaltyExchange.calculateStablecoinAmount(
          true,
          HUGE_ROYALTY_TOKEN_AMOUNT,
        ),
      )
        .to.be.revertedWithCustomError(royaltyExchange, "ReserveExceeded")
        .withArgs(HUGE_ROYALTY_TOKEN_AMOUNT, ROYALTY_TOKEN_TO_MINT);
    });

    it("should revert if zero was provided as royalty token amount", async function () {
      const { royaltyExchange } = await loadFixture(providedInitialLiquidity);

      await expect(
        royaltyExchange.calculateStablecoinAmount(false, 0n),
      ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");
    });
  });

  describe("Buy", function () {
    it("should revert in case of insufficient allowance", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
      } = await loadFixture(buy);

      await expect(
        royaltyExchange
          .connect(trader)
          .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      ).to.be.reverted;
    });

    it("should revert if trader tries to buy more royalty tokens than present in the reserve", async function () {
      const { priceSlippage, royaltyExchange, trader } = await loadFixture(buy);

      await expect(
        royaltyExchange
          .connect(trader)
          .buy(HUGE_ROYALTY_TOKEN_AMOUNT, 1n, priceSlippage),
      )
        .to.be.revertedWithCustomError(royaltyExchange, "ReserveExceeded")
        .withArgs(HUGE_ROYALTY_TOKEN_AMOUNT, ROYALTY_TOKEN_TO_MINT);
    });

    it("should revert if zero was provided as royalty token amount", async function () {
      const {
        royaltyExchange,
        stablecoin,
        trader,
        desiredStablecoinAmount,
        priceSlippage,
      } = await loadFixture(buy);

      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      await expect(
        royaltyExchange
          .connect(trader)
          .buy(0n, desiredStablecoinAmount, priceSlippage),
      ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");
    });

    it("should update balances and reserves in case of success", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
        royaltyToken,
      } = await loadFixture(buy);

      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      const Sin =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT - royaltyTokenAmount);
      const S0 = await royaltyExchange.stablecoinReserve();
      const S1 = S0 + Sin;

      const R0 = await royaltyExchange.royaltyTokenReserve();
      const R1 = R0 - royaltyTokenAmount;

      await royaltyExchange
        .connect(trader)
        .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      expect(await royaltyToken.balanceOf(trader.address)).to.equal(
        royaltyTokenAmount,
      );
      expect(await stablecoin.balanceOf(trader.address)).to.equal(0n);

      expect(
        await royaltyToken.balanceOf(royaltyExchange.getAddress()),
      ).to.equal(ROYALTY_TOKEN_TO_MINT - royaltyTokenAmount);
      expect(await stablecoin.balanceOf(royaltyExchange.getAddress())).to.equal(
        STABLECOIN_TO_MINT + desiredStablecoinAmount,
      );

      expect(await royaltyExchange.royaltyTokenReserve()).to.equal(R1);
      expect(await royaltyExchange.stablecoinReserve()).to.equal(S1);
    });

    it("should emit RoyaltyTokenBought with proper params", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
      } = await loadFixture(buy);

      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      const Sin =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT - royaltyTokenAmount);
      const S0 = await royaltyExchange.stablecoinReserve();
      const S1 = S0 + Sin;

      const R0 = await royaltyExchange.royaltyTokenReserve();
      const R1 = R0 - royaltyTokenAmount;

      await expect(
        royaltyExchange
          .connect(trader)
          .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      )
        .to.emit(royaltyExchange, "RoyaltyTokenBought")
        .withArgs(
          trader.address,
          royaltyTokenAmount,
          desiredStablecoinAmount,
          R1,
          S1,
        );
    });
  });

  describe("Sell", function () {
    it("should revert in case of insufficient allowance", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
      } = await loadFixture(sell);

      await expect(
        royaltyExchange
          .connect(trader)
          .sell(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      ).to.be.reverted;
    });

    it("should revert if zero was provided as royalty token amount", async function () {
      const {
        royaltyTokenAmount,
        royaltyExchange,
        royaltyToken,
        trader,
        desiredStablecoinAmount,
        priceSlippage,
      } = await loadFixture(sell);

      await royaltyToken.mint(trader.address, royaltyTokenAmount);
      await royaltyToken
        .connect(trader)
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);

      await expect(
        royaltyExchange
          .connect(trader)
          .sell(0n, desiredStablecoinAmount, priceSlippage),
      ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");
    });

    it("should update balances and reserves in case of success", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
        royaltyToken,
      } = await loadFixture(sell);

      await royaltyToken.mint(trader.address, royaltyTokenAmount);
      await royaltyToken
        .connect(trader)
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);

      const Sout =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT + royaltyTokenAmount);
      const S0 = await royaltyExchange.stablecoinReserve();
      const S1 = S0 - Sout;

      const R0 = await royaltyExchange.royaltyTokenReserve();
      const R1 = R0 + royaltyTokenAmount;

      await royaltyExchange
        .connect(trader)
        .sell(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      expect(await royaltyToken.balanceOf(trader.address)).to.equal(0n);
      expect(await stablecoin.balanceOf(trader.address)).to.equal(
        desiredStablecoinAmount,
      );

      expect(
        await royaltyToken.balanceOf(royaltyExchange.getAddress()),
      ).to.equal(ROYALTY_TOKEN_TO_MINT + royaltyTokenAmount);
      expect(await stablecoin.balanceOf(royaltyExchange.getAddress())).to.equal(
        STABLECOIN_TO_MINT - desiredStablecoinAmount,
      );

      expect(await royaltyExchange.royaltyTokenReserve()).to.equal(R1);
      expect(await royaltyExchange.stablecoinReserve()).to.equal(S1);
    });

    it("should emit RoyaltyTokenSold with proper params", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        royaltyToken,
      } = await loadFixture(sell);

      await royaltyToken.mint(trader.address, royaltyTokenAmount);
      await royaltyToken
        .connect(trader)
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);

      const Sout =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT + royaltyTokenAmount);
      const S0 = await royaltyExchange.stablecoinReserve();
      const S1 = S0 - Sout;

      const R0 = await royaltyExchange.royaltyTokenReserve();
      const R1 = R0 + royaltyTokenAmount;

      await expect(
        royaltyExchange
          .connect(trader)
          .sell(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      )
        .to.emit(royaltyExchange, "RoyaltyTokenSold")
        .withArgs(
          trader.address,
          royaltyTokenAmount,
          desiredStablecoinAmount,
          R1,
          S1,
        );
    });
  });

  describe("Unclaimed trading fee", function () {
    it("should update unclaimed trading fee", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
        royaltyToken,
      } = await loadFixture(buy);

      // buy

      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      const Sin =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT - royaltyTokenAmount);

      await royaltyExchange
        .connect(trader)
        .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      const unclaimedFeeAfterBuy = desiredStablecoinAmount - Sin;
      expect(await royaltyExchange.tradingFeeRevenue()).to.equal(
        unclaimedFeeAfterBuy,
      );

      // sell

      await royaltyToken
        .connect(trader)
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);

      const desiredSellStablecoinAmount =
        await royaltyExchange.calculateStablecoinAmount(
          false,
          royaltyTokenAmount,
        );

      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      const Sout =
        (royaltyTokenAmount * (await royaltyExchange.stablecoinReserve())) /
        ((await royaltyExchange.royaltyTokenReserve()) + royaltyTokenAmount);

      await royaltyExchange
        .connect(trader)
        .sell(royaltyTokenAmount, desiredSellStablecoinAmount, priceSlippage);

      expect(await royaltyExchange.tradingFeeRevenue()).to.equal(
        unclaimedFeeAfterBuy + Sout - desiredSellStablecoinAmount,
      );
    });

    it("should not allow non-owner to view unclaimed trading fee and withdraw it", async function () {
      const { royaltyExchange, trader } = await loadFixture(
        deployRoyaltyExchangeFixture,
      );

      await expect(
        royaltyExchange
          .connect(trader)
          .collectTradingFeeRevenue(1n, trader.address),
      ).to.be.reverted;
    });

    it("should revert if zero was provided as an amount to withdraw", async function () {
      const { royaltyExchange, owner } = await loadFixture(
        deployRoyaltyExchangeFixture,
      );

      await expect(
        royaltyExchange.collectTradingFeeRevenue(0n, owner.address),
      ).to.be.revertedWithCustomError(royaltyExchange, "InvalidAmount");
    });

    it("should revert if tried to withdraw amount higher than accumulated unclaimed trading fee", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
        owner,
      } = await loadFixture(buy);

      // buy

      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      const Sin =
        (royaltyTokenAmount * STABLECOIN_TO_MINT) /
        (ROYALTY_TOKEN_TO_MINT - royaltyTokenAmount);

      await royaltyExchange
        .connect(trader)
        .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      const unclaimedFeeAfterBuy = desiredStablecoinAmount - Sin;
      expect(await royaltyExchange.tradingFeeRevenue()).to.equal(
        unclaimedFeeAfterBuy,
      );

      await expect(
        royaltyExchange.collectTradingFeeRevenue(
          unclaimedFeeAfterBuy + 1n,
          owner.address,
        ),
      ).to.be.reverted;
    });
  });

  describe("Price slippage", function () {
    it("should revert if price slipped for buy", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        stablecoin,
        otherAccounts,
      } = await loadFixture(buy);

      // other account buys which affects the price
      await stablecoin.mint(otherAccounts[0].address, desiredStablecoinAmount);
      await stablecoin
        .connect(otherAccounts[0])
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);
      await royaltyExchange
        .connect(otherAccounts[0])
        .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      // trader tries to buy
      await stablecoin.mint(trader.address, desiredStablecoinAmount);
      await stablecoin
        .connect(trader)
        .approve(royaltyExchange.getAddress(), desiredStablecoinAmount);

      await expect(
        royaltyExchange
          .connect(trader)
          .buy(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      ).to.be.revertedWithCustomError(royaltyExchange, "PriceSlipped");
    });

    it("should revert if price slipped for sell", async function () {
      const {
        royaltyTokenAmount,
        desiredStablecoinAmount,
        priceSlippage,
        royaltyExchange,
        trader,
        royaltyToken,
        otherAccounts,
      } = await loadFixture(sell);

      // other account sells which affects the price
      await royaltyToken.mint(otherAccounts[0].address, royaltyTokenAmount);
      await royaltyToken
        .connect(otherAccounts[0])
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);
      await royaltyExchange
        .connect(otherAccounts[0])
        .sell(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage);

      await royaltyToken.mint(trader.address, royaltyTokenAmount);
      await royaltyToken
        .connect(trader)
        .approve(royaltyExchange.getAddress(), royaltyTokenAmount);
      await expect(
        royaltyExchange
          .connect(trader)
          .sell(royaltyTokenAmount, desiredStablecoinAmount, priceSlippage),
      ).to.be.revertedWithCustomError(royaltyExchange, "PriceSlipped");
    });
  });
});

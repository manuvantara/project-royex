import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("OtcMarket", function () {
  const ROYALTY_TOKEN_TO_MINT = ethers.parseEther("20");
  const STABLECOIN_TO_MINT = ethers.parseEther("10");

  async function deployOtcMarketFixture() {
    const [owner, seller, buyer, ...otherAccounts] = await ethers.getSigners();

    const RoyaltyToken = await ethers.getContractFactory("RoyaltyToken");
    const royaltyToken = await RoyaltyToken.deploy(owner.address);

    const Stablecoin = await ethers.getContractFactory("Stablecoin");
    const stablecoin = await Stablecoin.deploy(owner.address);

    const OtcMarket = await ethers.getContractFactory("OtcMarket");
    const otcMarket = await OtcMarket.deploy(
      owner.address,
      royaltyToken.getAddress(),
      stablecoin.getAddress(),
    );

    return {
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    };
  }

  async function approveRoyaltyToken() {
    const {
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    } = await loadFixture(deployOtcMarketFixture);

    await royaltyToken.mint(seller.address, ROYALTY_TOKEN_TO_MINT);
    await royaltyToken
      .connect(seller)
      .approve(otcMarket.getAddress(), ROYALTY_TOKEN_TO_MINT);

    return {
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    };
  }

  async function createOffer() {
    const {
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    } = await loadFixture(approveRoyaltyToken);

    const offerId = await otcMarket.hashOffer(
      seller.address,
      ROYALTY_TOKEN_TO_MINT,
      STABLECOIN_TO_MINT,
    );

    await otcMarket
      .connect(seller)
      .createOffer(ROYALTY_TOKEN_TO_MINT, STABLECOIN_TO_MINT);

    return {
      offerId,
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    };
  }

  async function approveStablecoin() {
    const {
      offerId,
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    } = await loadFixture(createOffer);

    await stablecoin.mint(buyer.address, STABLECOIN_TO_MINT);
    await stablecoin
      .connect(buyer)
      .approve(otcMarket.getAddress(), STABLECOIN_TO_MINT);

    return {
      offerId,
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    };
  }

  async function acceptOffer() {
    const {
      offerId,
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    } = await loadFixture(approveStablecoin);

    await otcMarket.connect(buyer).acceptOffer(offerId);

    return {
      offerId,
      royaltyToken,
      stablecoin,
      otcMarket,
      owner,
      seller,
      buyer,
      otherAccounts,
    };
  }

  describe("Deployment", function () {
    it("should set royalty token and stable coin addresses", async function () {
      const { otcMarket } = await loadFixture(deployOtcMarketFixture);

      expect(await otcMarket.royaltyToken()).not.to.equal(ethers.ZeroAddress);
      expect(await otcMarket.stablecoin()).not.to.equal(ethers.ZeroAddress);
    });
  });

  describe("Trading fee revenue", function () {
    it("should not allow non-owner to view unclaimed trading fee and withdraw it", async function () {
      const { otcMarket, otherAccounts } = await loadFixture(
        deployOtcMarketFixture,
      );

      await expect(
        otcMarket
          .connect(otherAccounts[0])
          .collectTradingFeeRevenue(1n, otherAccounts[0].address),
      ).to.be.reverted;
    });

    it("should revert if zero was provided as an amount to withdraw", async function () {
      const { otcMarket, owner } = await loadFixture(deployOtcMarketFixture);

      await expect(
        otcMarket.collectTradingFeeRevenue(0n, owner.address),
      ).to.be.revertedWithCustomError(otcMarket, "InvalidAmount");
    });

    it("should revert if tried to withdraw amount that exceeds trading fee", async function () {
      const { otcMarket, owner } = await loadFixture(acceptOffer);

      await expect(
        otcMarket.collectTradingFeeRevenue(
          ethers.parseEther("3"),
          owner.address,
        ),
      )
        .to.be.revertedWithCustomError(
          otcMarket,
          "InsufficientTradingFeeRevenue",
        )
        .withArgs(ethers.parseEther("3"), ethers.parseEther("1"));
    });

    it("should update trading fee revenue after buy", async function () {
      const { otcMarket } = await loadFixture(acceptOffer);

      expect(await otcMarket.tradingFeeRevenue()).to.equal(
        ethers.parseEther("1"),
      );
    });

    it("should update trading fee revenue after withdrawal", async function () {
      const { otcMarket, owner } = await loadFixture(acceptOffer);

      await otcMarket.collectTradingFeeRevenue(
        ethers.parseEther("0.75"),
        owner.address,
      );

      expect(await otcMarket.tradingFeeRevenue()).to.equal(
        ethers.parseEther("0.25"),
      );
    });
  });

  describe("Create offer", function () {
    context("amount", function () {
      it("should not create offer in case of insufficient allowance", async function () {
        const { otcMarket } = await loadFixture(deployOtcMarketFixture);

        await expect(otcMarket.createOffer(10n, 20n)).to.be.reverted;
      });

      it("should not create offer with zero as a royalty token amount", async function () {
        const { otcMarket } = await loadFixture(deployOtcMarketFixture);

        await expect(
          otcMarket.createOffer(0n, 20n),
        ).to.be.revertedWithCustomError(otcMarket, "InvalidAmount");
      });

      it("should not create offer with zero as a stablecoin amount", async function () {
        const { otcMarket } = await loadFixture(deployOtcMarketFixture);

        await expect(
          otcMarket.createOffer(20n, 0n),
        ).to.be.revertedWithCustomError(otcMarket, "InvalidAmount");
      });

      it("should not create offer with a royalty token amount less than 1 * 10^18", async function () {
        const { otcMarket } = await loadFixture(deployOtcMarketFixture);

        await expect(otcMarket.createOffer(10n, 20n))
          .to.be.revertedWithCustomError(
            otcMarket,
            "InsufficientStablecoinAmount",
          )
          .withArgs(20n, ethers.parseEther("1"));
      });
    });

    context("success", function () {
      it("should transfer royalty token amount and update balances", async function () {
        const { royaltyToken, otcMarket, seller } =
          await loadFixture(createOffer);

        expect(await royaltyToken.balanceOf(seller.address)).to.equal(0n);
        expect(await royaltyToken.balanceOf(otcMarket.getAddress())).to.equal(
          ROYALTY_TOKEN_TO_MINT,
        );
      });

      it("should add offer to offers list", async function () {
        const { offerId, otcMarket, seller } = await loadFixture(createOffer);

        const offer = await otcMarket.offers(offerId);

        expect(offer.seller).to.equal(seller.address);
        expect(offer.royaltyTokenAmount).to.equal(ROYALTY_TOKEN_TO_MINT);
        expect(offer.stablecoinAmount).to.equal(STABLECOIN_TO_MINT);
      });

      it("should emit OfferCreated event with proper params", async function () {
        const { otcMarket, seller } = await loadFixture(approveRoyaltyToken);

        const offerId = await otcMarket.hashOffer(
          seller.address,
          ROYALTY_TOKEN_TO_MINT,
          STABLECOIN_TO_MINT,
        );

        await expect(
          otcMarket
            .connect(seller)
            .createOffer(ROYALTY_TOKEN_TO_MINT, STABLECOIN_TO_MINT),
        )
          .to.emit(otcMarket, "OfferCreated")
          .withArgs(
            offerId,
            seller.address,
            ROYALTY_TOKEN_TO_MINT,
            STABLECOIN_TO_MINT,
          );
      });
    });
  });

  describe("Cancel offer", function () {
    it("should not allow non-seller to cancel the offer", async function () {
      const { offerId, otcMarket, seller, otherAccounts } =
        await loadFixture(createOffer);

      await expect(otcMarket.connect(otherAccounts[0]).cancelOffer(offerId))
        .to.be.revertedWithCustomError(
          otcMarket,
          "UnauthorizedOfferCancellation",
        )
        .withArgs(otherAccounts[0].address, seller.address);
    });

    it("should not allow to cancel the non-existent offer", async function () {
      const { otcMarket, seller } = await loadFixture(createOffer);

      await expect(otcMarket.connect(seller).cancelOffer(1n))
        .to.be.revertedWithCustomError(otcMarket, "OfferNotFound")
        .withArgs(1n);
    });

    context("success", function () {
      it("should emit OfferCancelled event", async function () {
        const { offerId, otcMarket, seller } = await loadFixture(createOffer);

        await expect(otcMarket.connect(seller).cancelOffer(offerId))
          .to.emit(otcMarket, "OfferCancelled")
          .withArgs(offerId);
      });

      it("should remove offers from the offers list", async function () {
        const { offerId, otcMarket, seller } = await loadFixture(createOffer);

        await otcMarket.connect(seller).cancelOffer(offerId);

        expect((await otcMarket.offers(offerId)).seller).to.equal(
          ethers.ZeroAddress,
        );
      });
    });
  });

  describe("Accept offer", function () {
    it("should not accept an offer in case of insufficient allowance", async function () {
      const { offerId, otcMarket, buyer } = await loadFixture(createOffer);

      await expect(otcMarket.connect(buyer).acceptOffer(offerId)).to.be
        .reverted;
    });

    it("should not allow to accept the non-existent offer", async function () {
      const { otcMarket, buyer } = await loadFixture(approveStablecoin);

      await expect(otcMarket.connect(buyer).acceptOffer(1n))
        .to.be.revertedWithCustomError(otcMarket, "OfferNotFound")
        .withArgs(1n);
    });

    context("success", function () {
      it("should update balances", async function () {
        const { royaltyToken, stablecoin, otcMarket, buyer, seller } =
          await loadFixture(acceptOffer);

        expect(await stablecoin.balanceOf(buyer.address)).to.equal(0n);
        expect(await royaltyToken.balanceOf(buyer.address)).to.equal(
          ROYALTY_TOKEN_TO_MINT,
        );

        expect(await stablecoin.balanceOf(otcMarket.getAddress())).to.equal(
          ethers.parseEther("1"),
        );
        expect(await stablecoin.balanceOf(seller.address)).to.equal(
          ethers.parseEther("9"),
        );
        expect(await royaltyToken.balanceOf(otcMarket.getAddress())).to.equal(
          0n,
        );
      });

      it("should emit OfferAccepted event", async function () {
        const { offerId, otcMarket, buyer } =
          await loadFixture(approveStablecoin);

        await expect(otcMarket.connect(buyer).acceptOffer(offerId))
          .to.emit(otcMarket, "OfferAccepted")
          .withArgs(offerId, buyer.address);
      });

      it("should remove offers from the offers list", async function () {
        const { otcMarket, offerId, buyer } = await loadFixture(acceptOffer);

        expect(
          (await otcMarket.connect(buyer).offers(offerId)).seller,
        ).to.equal(ethers.ZeroAddress);
      });
    });
  });
});

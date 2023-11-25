from sqlmodel import Field, SQLModel
from pydantic import condecimal, constr

from decimal import Decimal


class ContractBase(SQLModel):
    contract_address: constr(max_length=42) = Field(primary_key=True)
    royalty_token_symbol: constr(max_length=11)

    latest_block_number: int = Field(default=0)


class ElementBase(SQLModel):
    contract_address: constr(max_length=42) = Field(primary_key=True)


class EventBase(SQLModel):
    contract_address: constr(max_length=42) = Field(primary_key=True)
    block_timestamp: int = Field(primary_key=True)

    def __getitem__(self, item):
        return getattr(self, item)


class RoyaltyToken(SQLModel, table=True):
    __tablename__ = "royalty_tokens"

    symbol: constr(max_length=11) = Field(primary_key=True)
    name: str = Field(max_length=250)
    contract_address: constr(max_length=42)


class RoyaltyPaymentPool(ContractBase, table=True):
    __tablename__ = "royalty_payment_pools"


class StakeholderCollective(ContractBase, table=True):
    __tablename__ = "stakeholder_collectives"


class StakeholderCollectiveProposal(ElementBase, table=True):
    __tablename__ = "stakeholder_collective_proposals"

    proposal_id: constr(max_length=100) = Field(primary_key=True)

    proposer: constr(max_length=42)
    title: str = Field(max_length=250)
    description: str = Field(max_length=4000)

    votes_for: condecimal(max_digits=78, decimal_places=0) = Field(default=0)
    votes_against: condecimal(max_digits=78, decimal_places=0) = Field(default=0)
    votes_abstain: condecimal(max_digits=78, decimal_places=0) = Field(default=0)

    is_executed: bool = Field(default=False)


class OtcMarket(ContractBase, table=True):
    __tablename__ = "otc_markets"


class OtcMarketOffer(ElementBase, table=True):
    __tablename__ = "otc_market_offers"

    offer_id: constr(max_length=77) = Field(primary_key=True)

    seller: constr(max_length=42)
    royalty_token_amount: condecimal(max_digits=78, decimal_places=0)
    stablecoin_amount: condecimal(max_digits=78, decimal_places=0)


class OtcMarketFloorPriceChangedEvent(EventBase, table=True):
    __tablename__ = "otc_market_floor_price_changed_events"

    floor_price: condecimal(max_digits=78, decimal_places=18)

    class Config:
        arbitrary_types_allowed = True


class OtcMarketOfferAcceptedEvent(EventBase, table=True):
    __tablename__ = "otc_market_offer_accepted_events"

    offer_id: constr(max_length=77) = Field(primary_key=True)

    seller: constr(max_length=42)
    royalty_token_amount: condecimal(max_digits=78, decimal_places=0)
    stablecoin_amount: condecimal(max_digits=78, decimal_places=0)
    buyer: constr(max_length=42)

    class Config:
        arbitrary_types_allowed = True


class RoyaltyTokenTradedEvent(EventBase):
    trader: constr(max_length=42)
    royalty_token_amount: condecimal(max_digits=78, decimal_places=0)
    stablecoin_amount: condecimal(max_digits=78, decimal_places=0)
    updated_royalty_token_reserve: condecimal(max_digits=78, decimal_places=0)
    updated_stablecoin_reserve: condecimal(max_digits=78, decimal_places=0)


class RoyaltyTokenSoldEvent(RoyaltyTokenTradedEvent, table=True):
    __tablename__ = "royalty_token_sold_events"

    class Config:
        arbitrary_types_allowed = True


class RoyaltyTokenBoughtEvent(RoyaltyTokenTradedEvent, table=True):
    __tablename__ = "royalty_token_bought_events"

    class Config:
        arbitrary_types_allowed = True


class InitialRoyaltyOffering(ContractBase, table=True):
    __tablename__ = "initial_royalty_offerings"

    offering_date: int


class RoyaltyExchange(ContractBase, table=True):
    __tablename__ = "royalty_exchanges"


class RoyaltyPoolWithdrawnEvent(EventBase, table=True):
    __tablename__ = "royalty_pool_withdrawn_events"

    checkpoint_key: condecimal(max_digits=78, decimal_places=0)
    investor: constr(max_length=42)
    amount: condecimal(max_digits=78, decimal_places=0)


class RoyaltyPoolDepositedEvent(EventBase, table=True):
    __tablename__ = "royalty_pool_deposited_events"

    sender: constr(max_length=42)
    deposit: condecimal(max_digits=78, decimal_places=0)


class InitialRoyaltyBoughtEvent(EventBase, table=True):
    __tablename__ = "initial_royalty_tokens_bought_events"

    amount: condecimal(max_digits=78, decimal_places=0)
    royalty_token_reserve: condecimal(max_digits=78, decimal_places=0)
    stablecoin_reserve: condecimal(max_digits=78, decimal_places=0)

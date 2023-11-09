from sqlmodel import Field, SQLModel
from pydantic import condecimal, constr

from typing import Optional
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

    proposal_id: constr(max_length=77) = Field(primary_key=True)

    proposer: constr(max_length=42)
    title: str = Field(max_length=250)
    description: str = Field(max_length=4000)

    votes_for: Decimal = Field(default=Decimal("0"))
    votes_against: Decimal = Field(default=Decimal("0"))
    votes_abstain: Decimal = Field(default=Decimal("0"))

    is_executed: bool = Field(default=False)


class OtcMarket(ContractBase, table=True):
    __tablename__ = "otc_markets"


class OtcMarketOffer(ElementBase, table=True):
    __tablename__ = "otc_market_offers"

    offer_id: constr(max_length=77) = Field(primary_key=True)

    seller: constr(max_length=42)
    royalty_token_amount: Decimal
    stablecoin_amount: Decimal


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


class InitialRoyaltyOffering(ContractBase, table=True):
    __tablename__ = "initial_royalty_offerings"


class RoyaltyExchange(ContractBase, table=True):
    __tablename__ = "royalty_exchanges"

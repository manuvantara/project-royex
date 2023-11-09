from pydantic import BaseModel, Field
from typing import List, Optional


def to_camel(string: str) -> str:
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


class Response(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class TimeSeriesDataPoint(Response):
    timestamp: int
    value: int


class ValueIndicator(Response):
    current: TimeSeriesDataPoint
    recent_values_dataset: Optional[List[TimeSeriesDataPoint]] = None


class GetRoyaltyIncomeResponse(Response):
    reported: ValueIndicator
    deposited: ValueIndicator


class RoyaltyToken(Response):
    royalty_token_symbol: str
    price: ValueIndicator | None


class GetRoyaltyOffering(Response):
    offering_date: int
    offering_price: int
    royalty_token_reserve: ValueIndicator
    stablecoin_reserve: ValueIndicator


class Deposit(Response):
    distributor: str  # address
    checkpoint_key: int
    amount: int


class GetEstimatedPortfolioValue(Response):
    on_otc_market: ValueIndicator
    at_royalty_exchange: ValueIndicator


class Offer(Response):
    seller: str
    royalty_token_amount: int
    stablecoin_amount: int


class ProposalVotes(Response):
    pro: int
    contra: int
    abstain: int


class ProposalInfo(Response):
    proposal_id: str
    proposer: str
    title: str
    voting_date: int
    voting_deadline: int
    votes: ProposalVotes
    is_executed: bool


class ProposalDescription(Response):
    description: str
    targets: list[str]
    values: list[int]
    signatures: list[str]
    calldatas: list[str]


class Proposal(Response):
    info: ProposalInfo
    description: ProposalDescription


class GetTradingVolume(Response):
    otc_market: ValueIndicator
    royalty_exchange: ValueIndicator

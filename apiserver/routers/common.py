from pydantic import BaseModel
from typing import List


def to_camel(string: str) -> str:
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


class Response(BaseModel):
    class Config:
        alias_generator = to_camel
        populate_by_name = True


class TimeSeriesDataPoint(Response):
    timestamp: int
    value: int


class ValueIndicator(Response):
    current: TimeSeriesDataPoint
    recent_values_dataset: List[TimeSeriesDataPoint]


class GetRoyaltyIncomeResponse(Response):
    reported: int
    deposited: int
    
class RoyaltyToken(Response):
    royalty_token_symbol: str
    price: ValueIndicator | None
    deposited_royalty_income: ValueIndicator

class GetRoyaltyOffering(Response):
    offering_date: int
    offering_price: int
    royalty_token_reserve: ValueIndicator
    stablecoin_reserve: ValueIndicator
    
class Deposit(Response):
    distributor: str # address
    checkpointKey: int
    amount: int
    
class GetEstimatedPortfolioValue(Response):
    on_otc_market: ValueIndicator
    at_royalty_exchange: ValueIndicator
    
class Offer(Response):
    seller: str
    royalty_token_amount: int
    stablecoin_amount: int

class ShortenProposal(Response):
    proposal_id: str
    proposer: str
    title: str
    voting_date: int
    voting_deadline: int
    votes: dict
    is_executed: bool

class Proposal(ShortenProposal):
    description: str
    targets: list[str]
    values: list[int]
    signatures: list[str]
    calldatas: list[str]

class GetTradingVolume(Response):
    otc_market: ValueIndicator
    royalty_exchange: ValueIndicator
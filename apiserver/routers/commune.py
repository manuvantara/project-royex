from pydantic import BaseModel, condecimal
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
    value: condecimal(max_digits=156, decimal_places=78)


class ValueIndicator(Response):
    current: TimeSeriesDataPoint
    recent_values_dataset: Optional[List[TimeSeriesDataPoint]] = None


class GetRoyaltyIncomeResponse(Response):
    reported: ValueIndicator
    deposited: ValueIndicator


class RoyaltyToken(Response):
    symbol: str
    price: ValueIndicator | None
    deposited_royalty_income: ValueIndicator | None


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
    offer_id: str
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
    # voting_date: int
    # voting_deadline: int
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


class RoyaltySum:
    count: int
    price: float
    timestamp: int

    def __init__(self, count, price, timestamp) -> None:
        self.count = count
        self.price = price
        self.timestamp = timestamp

    def __repr__(self) -> str:
        return f"RoyaltySum(count={self.count}, price={self.price}, timestamp={self.timestamp})"

    def __str__(self) -> str:
        return f"RoyaltySum(count={self.count}, price={self.price}, timestamp={self.timestamp})"

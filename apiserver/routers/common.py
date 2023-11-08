from pydantic import BaseModel
from typing import List


def to_camel(string: str) -> str:
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


class CamelModel(BaseModel):
    class Config:
        alias_generator = to_camel
        populate_by_name = True


class TimeSeriesDataPoint(CamelModel):
    timestamp: int
    value: int


class ValueIndicator(CamelModel):
    current: TimeSeriesDataPoint
    recent_values_dataset: List[TimeSeriesDataPoint]


class GetRoyaltyIncomeResponse(CamelModel):
    reported: int
    deposited: int
    
class Deposit(CamelModel):
    distributor: str # address
    checkpointKey: int
    amount: int
    
class GetEstimatedPortfolioValue(CamelModel):
    on_otc_market: ValueIndicator
    at_royalty_exchange: ValueIndicator
    
class Offer(CamelModel):
    seller: str
    royalty_token_amount: int
    stablecoin_amount: int

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel
from typing import List

from sqlmodel import Session, select
from fastapi import Depends
from apiserver.database import get_session

from apiserver.database.models import (
    EventBase,
    OtcMarketFloorPriceChangedEvent,
    OtcMarketOfferAcceptedEvent,
    RoyaltyTokenTradedEvent,
)


def to_camel(string: str) -> str:
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


class Response(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class TimeSeriesDataPoint(Response):
    timestamp: float
    value: str


class BaseValueIndicator(Response):
    current: TimeSeriesDataPoint
    recent_values_dataset: List[TimeSeriesDataPoint]


class GetRoyaltyIncomeResponse(Response):
    reported: BaseValueIndicator
    deposited: BaseValueIndicator


class RoyaltyToken(Response):
    symbol: str
    price: BaseValueIndicator | None
    deposited_royalty_income: BaseValueIndicator | None


class GetRoyaltyOffering(Response):
    offering_date: int
    offering_price: int
    royalty_token_reserve: BaseValueIndicator
    stablecoin_reserve: BaseValueIndicator


class Deposit(Response):
    distributor: str  # address
    checkpoint_key: int
    amount: int


class GetEstimatedPortfolioValue(Response):
    on_otc_market: BaseValueIndicator
    at_royalty_exchange: BaseValueIndicator


class Offer(Response):
    offer_id: str
    seller: str
    royalty_token_amount: str
    stablecoin_amount: str


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
    otc_market: BaseValueIndicator
    royalty_exchange: BaseValueIndicator


def ValueIndicator(
    recent_values_dataset: List[TimeSeriesDataPoint],
) -> BaseValueIndicator:
    current = recent_values_dataset[-1]

    return BaseValueIndicator(
        current=current,
        recent_values_dataset=recent_values_dataset,
    )


def CumulativeValueIndicator(
    recent_values_dataset: List[TimeSeriesDataPoint],
) -> BaseValueIndicator:
    cumulative_volume = sum(
        Decimal(indicator.value) for indicator in recent_values_dataset
    )

    current = TimeSeriesDataPoint(
        timestamp=recent_values_dataset[-1].timestamp, value=str(cumulative_volume)
    )

    return BaseValueIndicator(
        current=current,
        recent_values_dataset=recent_values_dataset,
    )


# TODO: CLEAN THIS SHIT
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


def generate_bar_chart(
    *,
    events: List[OtcMarketOfferAcceptedEvent] | List[RoyaltyTokenTradedEvent],
    target: str,
    lower_bound: datetime,
    upper_bound: datetime,
) -> List[TimeSeriesDataPoint]:
    lower_bound_timestamp = int(lower_bound.timestamp())
    upper_bound_timestamp = int(upper_bound.timestamp())

    recent_values_dataset = []

    for timestamp in range(lower_bound_timestamp, upper_bound_timestamp, 3600):
        cumulative_volume = Decimal("0")

        for event in events:
            if (
                event.block_timestamp >= timestamp
                and event.block_timestamp < timestamp + 3600
            ):
                # TODO: Raise an error if target is not a decimal
                cumulative_volume += event[target]
            else:
                continue

        recent_values_dataset.append(
            TimeSeriesDataPoint(timestamp=timestamp, value=str(cumulative_volume))
        )

    return recent_values_dataset


def generate_line_chart(
    *,
    events: List[OtcMarketFloorPriceChangedEvent] | List[RoyaltyTokenTradedEvent],
    target: str,
    lower_bound: datetime,
    upper_bound: datetime,
    previous_value: Decimal = Decimal("0"),
) -> List[TimeSeriesDataPoint]:
    lower_bound_timestamp = int(lower_bound.timestamp())
    upper_bound_timestamp = int(upper_bound.timestamp())

    recent_values_dataset = []

    for timestamp in range(lower_bound_timestamp, upper_bound_timestamp, 3600):
        for event in events:
            if (
                event.block_timestamp >= timestamp
                and event.block_timestamp < timestamp + 3600
            ):
                previous_value = event[target]
            else:
                continue

        recent_values_dataset.append(
            TimeSeriesDataPoint(timestamp=timestamp, value=str(previous_value))
        )

    return recent_values_dataset


def calculate_value_indicator(
    *,
    recent_values_dataset: List[TimeSeriesDataPoint],
    upper_bound: datetime,
) -> BaseValueIndicator:
    cumulative_volume = sum(Decimal(value.value) for value in recent_values_dataset)

    current = TimeSeriesDataPoint(
        timestamp=upper_bound.timestamp(), value=str(cumulative_volume)
    )

    return BaseValueIndicator(
        current=current,
        recent_values_dataset=recent_values_dataset,
    )


def fetch_events(
    *,
    contract_address: str,
    lower_bound: datetime,
    upper_bound: datetime,
    session: Session = Depends(get_session),
    Event: type[EventBase],
) -> List[EventBase]:
    statement = select(Event).where(
        (Event.contract_address == contract_address)
        & (Event.block_timestamp >= lower_bound.timestamp())
        & (Event.block_timestamp <= upper_bound.timestamp())
    )
    results = session.exec(statement)
    return results.all()

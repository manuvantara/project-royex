from typing import List
from apiserver.routers.commune import (
    GetEstimatedPortfolioValue,
    GetRoyaltyIncomeResponse,
    ValueIndicator,
    TimeSeriesDataPoint,
    RoyaltyToken,
)
from fastapi import APIRouter

router = APIRouter()


@router.get("/{stakeholder_address}/estimated-value")
def get_estimated_portfolio_value(
    stakeholder_address: str,
) -> GetEstimatedPortfolioValue:  # address
    return GetEstimatedPortfolioValue(
        on_otc_market=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=10, value=6640),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1, value=320),
                TimeSeriesDataPoint(timestamp=2, value=540),
                TimeSeriesDataPoint(timestamp=3, value=1259),
                TimeSeriesDataPoint(timestamp=4, value=3247),
                TimeSeriesDataPoint(timestamp=5, value=3524),
                TimeSeriesDataPoint(timestamp=6, value=4512),
                TimeSeriesDataPoint(timestamp=7, value=5409),
                TimeSeriesDataPoint(timestamp=8, value=6470),
                TimeSeriesDataPoint(timestamp=9, value=6598),
            ],
        ),
        at_royalty_exchange=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=10, value=4023),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1, value=547),
                TimeSeriesDataPoint(timestamp=2, value=654),
                TimeSeriesDataPoint(timestamp=3, value=745),
                TimeSeriesDataPoint(timestamp=4, value=854),
                TimeSeriesDataPoint(timestamp=5, value=965),
                TimeSeriesDataPoint(timestamp=6, value=1066),
                TimeSeriesDataPoint(timestamp=7, value=1542),
                TimeSeriesDataPoint(timestamp=8, value=1654),
                TimeSeriesDataPoint(timestamp=9, value=1765),
                TimeSeriesDataPoint(timestamp=10, value=3267),
            ],
        ),
    )


@router.get("/{stakeholder_address}/royalty-income")
def calculate_royalty_income(
    stakeholder_address: str,
) -> GetRoyaltyIncomeResponse:  # address
    return GetRoyaltyIncomeResponse(
        reported=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=0, value=0),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
            ],
        ),
        deposited=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=0, value=0),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
            ],
        ),
    )


@router.get("/{stakeholder_address}/public-royalty-tokens")
def fetch_public_royalty_tokens(
    stakeholder_address: str,
) -> List[RoyaltyToken]:  # address
    return []


@router.get("/{stakeholder_address}/private-royalty-tokens")
def fetch_private_royalty_tokens(
    stakeholder_address: str,
) -> List[RoyaltyToken]:  # address
    return []

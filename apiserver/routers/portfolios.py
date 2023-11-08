from typing import List
from common import (
    GetEstimatedPortfolioValue,
    GetRoyaltyIncomeResponse,
    ValueIndicator,
    TimeSeriesDataPoint,
    RoyaltyToken,
)
from fastapi import APIRouter

router = APIRouter()


@router.get("/portfolios/{stakeholder_address}/estimated-value")
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
            ]
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
            ]
        )
    )


@router.get("/portfolios/{stakeholder_address}/royalty-income")
def calculate_royalty_income(stakeholder_address: str) -> GetRoyaltyIncomeResponse:  # address
    return GetRoyaltyIncomeResponse(reported=3256, deposited=3255)

@router.get("/portfolios/{stakeholder_address}/public-royalty-tokens")
def fetch_public_royalty_tokens(stakeholder_address: str) -> List[RoyaltyToken]:  # address
    mock_royalty_tokens: List[RoyaltyToken] = [
        RoyaltyToken(
            royalty_token_symbol="OVN",
            royalty_token_address="0x000000000000000000000000000000000000000a",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=10, value=543),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1, value=234),
                    TimeSeriesDataPoint(timestamp=2, value=251),
                    TimeSeriesDataPoint(timestamp=3, value=250),
                    TimeSeriesDataPoint(timestamp=4, value=274),
                    TimeSeriesDataPoint(timestamp=5, value=312),
                    TimeSeriesDataPoint(timestamp=6, value=349),
                    TimeSeriesDataPoint(timestamp=7, value=378),
                    TimeSeriesDataPoint(timestamp=8, value=402),
                    TimeSeriesDataPoint(timestamp=9, value=427),
                    TimeSeriesDataPoint(timestamp=10, value=540)
                ]
            )
        )
    ]

    return mock_royalty_tokens

@router.get("/portfolios/{stakeholder_address}/private-royalty-tokens")
def fetch_private_royalty_tokens(stakeholder_address: str) -> List[RoyaltyToken]:  # address
    mock_royalty_tokens: List[RoyaltyToken] = [
        RoyaltyToken(
            royalty_token_symbol="SRD",
            royalty_token_address="0x000000000000000000000000000000000000000b",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=10, value=678),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1, value=234),
                    TimeSeriesDataPoint(timestamp=2, value=215),
                    TimeSeriesDataPoint(timestamp=3, value=205),
                    TimeSeriesDataPoint(timestamp=4, value=247),
                    TimeSeriesDataPoint(timestamp=5, value=321),
                    TimeSeriesDataPoint(timestamp=6, value=376),
                    TimeSeriesDataPoint(timestamp=7, value=387),
                    TimeSeriesDataPoint(timestamp=8, value=420),
                    TimeSeriesDataPoint(timestamp=9, value=427),
                    TimeSeriesDataPoint(timestamp=10, value=678)
                ]
            )
        )
    ]

    return mock_royalty_tokens
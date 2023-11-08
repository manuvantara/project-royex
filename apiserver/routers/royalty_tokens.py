from apiserver.routers.common import ValueIndicator, RoyaltyToken, TimeSeriesDataPoint
from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str: #address
    return "0x0A7d13ed41AfE5A7ac1c4e289e6f0B3a57F8A6147"

@router.get("/{royalty_token_symbol}/public")
def fetch_public(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=522),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=220),
                    TimeSeriesDataPoint(timestamp=91, value=212),
                    TimeSeriesDataPoint(timestamp=92, value=232),
                    TimeSeriesDataPoint(timestamp=93, value=289),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=379),
                    TimeSeriesDataPoint(timestamp=96, value=378),
                    TimeSeriesDataPoint(timestamp=97, value=432),
                    TimeSeriesDataPoint(timestamp=98, value=457),
                    TimeSeriesDataPoint(timestamp=99, value=521),
                ]
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=237),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=225),
                    TimeSeriesDataPoint(timestamp=91, value=232),
                    TimeSeriesDataPoint(timestamp=92, value=247),
                    TimeSeriesDataPoint(timestamp=93, value=298),
                    TimeSeriesDataPoint(timestamp=94, value=325),
                    TimeSeriesDataPoint(timestamp=95, value=397),
                    TimeSeriesDataPoint(timestamp=96, value=387),
                    TimeSeriesDataPoint(timestamp=97, value=423),
                    TimeSeriesDataPoint(timestamp=98, value=476),
                    TimeSeriesDataPoint(timestamp=99, value=513),
                ]
            )
        )
    ]

@router.get("/{royalty_token_symbol}/private")
def fetch_private(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=427),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=220),
                    TimeSeriesDataPoint(timestamp=91, value=212),
                    TimeSeriesDataPoint(timestamp=92, value=223),
                    TimeSeriesDataPoint(timestamp=93, value=289),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=379),
                    TimeSeriesDataPoint(timestamp=96, value=386),
                    TimeSeriesDataPoint(timestamp=97, value=432),
                    TimeSeriesDataPoint(timestamp=98, value=457),
                    TimeSeriesDataPoint(timestamp=99, value=437),
                ]
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=973),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=225),
                    TimeSeriesDataPoint(timestamp=91, value=232),
                    TimeSeriesDataPoint(timestamp=92, value=247),
                    TimeSeriesDataPoint(timestamp=93, value=298),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=456),
                    TimeSeriesDataPoint(timestamp=96, value=598),
                    TimeSeriesDataPoint(timestamp=97, value=627),
                    TimeSeriesDataPoint(timestamp=98, value=786),
                    TimeSeriesDataPoint(timestamp=99, value=892),
                ]
            )
        )
    ]
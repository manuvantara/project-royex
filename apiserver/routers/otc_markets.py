from typing import List
from apiserver.routers.common import Offer, ValueIndicator, TimeSeriesDataPoint
from fastapi import APIRouter

router = APIRouter()


@router.get("/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> str:  # address
    return "0xD38713ed41AfE1A7ac1c3D039e6f0B3a57F8A3261"


@router.get("/{royalty_id}/floor-price")
def get_floor_price(royalty_id: str) -> ValueIndicator:  # address
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=100, value=345),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=90, value=244),
            TimeSeriesDataPoint(timestamp=91, value=255),
            TimeSeriesDataPoint(timestamp=92, value=276),
            TimeSeriesDataPoint(timestamp=93, value=245),
            TimeSeriesDataPoint(timestamp=94, value=234),
            TimeSeriesDataPoint(timestamp=95, value=255),
            TimeSeriesDataPoint(timestamp=96, value=276),
            TimeSeriesDataPoint(timestamp=97, value=269),
            TimeSeriesDataPoint(timestamp=98, value=278),
            TimeSeriesDataPoint(timestamp=99, value=302),
        ]
    )


@router.get("/{royalty_id}/trading-volume")
def get_trading_volume(royalty_id: str) -> ValueIndicator:  # address
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=10, value=1342),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=1, value=302),
            TimeSeriesDataPoint(timestamp=2, value=342),
            TimeSeriesDataPoint(timestamp=3, value=352),
            TimeSeriesDataPoint(timestamp=4, value=430),
            TimeSeriesDataPoint(timestamp=5, value=571),
            TimeSeriesDataPoint(timestamp=6, value=878),
            TimeSeriesDataPoint(timestamp=7, value=997),
            TimeSeriesDataPoint(timestamp=8, value=1124),
            TimeSeriesDataPoint(timestamp=9, value=1233),
        ]
    )


@router.get("/{royalty_id}/offers'")
def get_trading_volume(royalty_id: str) -> List[Offer]:  # address
    return [
        Offer(
            seller="0x000000000000000000000000000000000000000d",
            royalty_token_amount=100,
            stablecoin_amount=125,
        ),
        Offer(
            seller="0x000000000000000000000000000000000000000e",
            royalty_token_amount=200,
            stablecoin_amount=205,
        )
    ]
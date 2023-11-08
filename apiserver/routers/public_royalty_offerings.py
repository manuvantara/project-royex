from typing import List
from apiserver.routers.common import (
    ValueIndicator,
    RoyaltyToken,
    GetRoyaltyOffering,
    TimeSeriesDataPoint,
)
from fastapi import APIRouter

router = APIRouter()

@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str: #address
    return "0xF3F713ed41AfE1A7ac1c4e239e6f0B3a57F8A4761"

@router.get("/{royalty_token_symbol}")
def get_royalty_offering(royalty_token_symbol: str) -> GetRoyaltyOffering:
    return GetRoyaltyOffering(
        offeringDate=100,
        offeringPrice=235,
        royaltyTokenReserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=100, value=235),
            recentValuesDataset=[
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
            ],
        ),
        stablecoinReserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=100, value=235),
            recentValuesDataset=[
                TimeSeriesDataPoint(timestamp=90, value=220),
                TimeSeriesDataPoint(timestamp=91, value=232),
                TimeSeriesDataPoint(timestamp=92, value=247),
                TimeSeriesDataPoint(timestamp=93, value=298),
                TimeSeriesDataPoint(timestamp=94, value=325),
                TimeSeriesDataPoint(timestamp=95, value=397),
                TimeSeriesDataPoint(timestamp=96, value=387),
                TimeSeriesDataPoint(timestamp=97, value=423),
                TimeSeriesDataPoint(timestamp=98, value=476),
                TimeSeriesDataPoint(timestamp=99, value=513),
            ],
        )
    )

@router.get("/{royalty_token_symbol}/live")
def fetch_live(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royaltyTokenSymbol="KLS",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=522),
                recentValuesDataset=[
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
            depositedRoyaltyIncome=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=237),
                recentValuesDataset=[
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
        ),
        RoyaltyToken(
            royaltyTokenSymbol="SRD",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=533),
                recentValuesDataset=[
                    TimeSeriesDataPoint(timestamp=90, value=206),
                    TimeSeriesDataPoint(timestamp=91, value=224),
                    TimeSeriesDataPoint(timestamp=92, value=201),
                    TimeSeriesDataPoint(timestamp=93, value=214),
                    TimeSeriesDataPoint(timestamp=94, value=218),
                    TimeSeriesDataPoint(timestamp=95, value=199),
                    TimeSeriesDataPoint(timestamp=96, value=335),
                    TimeSeriesDataPoint(timestamp=97, value=442),
                    TimeSeriesDataPoint(timestamp=98, value=457),
                    TimeSeriesDataPoint(timestamp=99, value=512),
                ]
            ),
            depositedRoyaltyIncome=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=282),
                recentValuesDataset=[
                    TimeSeriesDataPoint(timestamp=90, value=125),
                    TimeSeriesDataPoint(timestamp=91, value=150),
                    TimeSeriesDataPoint(timestamp=92, value=155),
                    TimeSeriesDataPoint(timestamp=93, value=103),
                    TimeSeriesDataPoint(timestamp=94, value=76),
                    TimeSeriesDataPoint(timestamp=95, value=101),
                    TimeSeriesDataPoint(timestamp=96, value=117),
                    TimeSeriesDataPoint(timestamp=97, value=135),
                    TimeSeriesDataPoint(timestamp=98, value=250),
                    TimeSeriesDataPoint(timestamp=99, value=275),
                ]
            )
        )
    ]

@router.get("/{royalty_token_symbol}/live")
def fetch_upcoming(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royaltyTokenSymbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=325),
                recentValuesDataset=[
                    TimeSeriesDataPoint(timestamp=90, value=202),
                    TimeSeriesDataPoint(timestamp=91, value=221),
                    TimeSeriesDataPoint(timestamp=92, value=232),
                    TimeSeriesDataPoint(timestamp=93, value=298),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=379),
                    TimeSeriesDataPoint(timestamp=96, value=378),
                    TimeSeriesDataPoint(timestamp=97, value=412),
                    TimeSeriesDataPoint(timestamp=98, value=305),
                    TimeSeriesDataPoint(timestamp=99, value=325),
                ]
            ),
            depositedRoyaltyIncome=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=33),
                recentValuesDataset=[]
            )
        )
    ]
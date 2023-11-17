from typing import List

from fastapi import APIRouter

from apiserver.routers.commune import (
    ValueIndicator,
    RoyaltyToken,
    GetRoyaltyOffering,
    TimeSeriesDataPoint,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str:  # address
    return "0xF3F713ed41AfE1A7ac1c4e239e6f0B3a57F8A4761"


@router.get("/{royalty_token_symbol}")
def get_royalty_offering(royalty_token_symbol: str) -> GetRoyaltyOffering:
    return GetRoyaltyOffering(
        offering_date=100,
        offering_price=235,
        royalty_token_reserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=18500),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=14000),
                TimeSeriesDataPoint(timestamp=1700245496, value=16000),
                TimeSeriesDataPoint(timestamp=1700241896, value=17000),
                TimeSeriesDataPoint(timestamp=1700238296, value=24000),
                TimeSeriesDataPoint(timestamp=1700234696, value=32000),
                TimeSeriesDataPoint(timestamp=1700231096, value=9000),
                TimeSeriesDataPoint(timestamp=1700227496, value=45000),
                TimeSeriesDataPoint(timestamp=1700223896, value=46000),
                TimeSeriesDataPoint(timestamp=1700220296, value=51000),
                TimeSeriesDataPoint(timestamp=1700216696, value=18500),
                TimeSeriesDataPoint(timestamp=1700213096, value=19000),
                TimeSeriesDataPoint(timestamp=1700209496, value=18000),
                TimeSeriesDataPoint(timestamp=1700205896, value=19000),
                TimeSeriesDataPoint(timestamp=1700202296, value=18000),
                TimeSeriesDataPoint(timestamp=1700198696, value=17000),
                TimeSeriesDataPoint(timestamp=1700195096, value=15000),
                TimeSeriesDataPoint(timestamp=1700191496, value=13000),
                TimeSeriesDataPoint(timestamp=1700187896, value=12000),
                TimeSeriesDataPoint(timestamp=1700184296, value=66000),
                TimeSeriesDataPoint(timestamp=1700180696, value=55000),
                TimeSeriesDataPoint(timestamp=1700177096, value=35000),
                TimeSeriesDataPoint(timestamp=1700173496, value=20000),
                TimeSeriesDataPoint(timestamp=1700169896, value=45000),
            ],
        ),
        stablecoin_reserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=18500),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=23000),
                TimeSeriesDataPoint(timestamp=1700245496, value=76000),
                TimeSeriesDataPoint(timestamp=1700241896, value=67000),
                TimeSeriesDataPoint(timestamp=1700238296, value=32000),
                TimeSeriesDataPoint(timestamp=1700234696, value=42000),
                TimeSeriesDataPoint(timestamp=1700231096, value=73000),
                TimeSeriesDataPoint(timestamp=1700227496, value=23000),
                TimeSeriesDataPoint(timestamp=1700223896, value=22000),
                TimeSeriesDataPoint(timestamp=1700220296, value=31000),
                TimeSeriesDataPoint(timestamp=1700216696, value=60500),
                TimeSeriesDataPoint(timestamp=1700213096, value=55000),
                TimeSeriesDataPoint(timestamp=1700209496, value=63000),
                TimeSeriesDataPoint(timestamp=1700205896, value=62000),
                TimeSeriesDataPoint(timestamp=1700202296, value=65000),
                TimeSeriesDataPoint(timestamp=1700198696, value=34000),
                TimeSeriesDataPoint(timestamp=1700195096, value=35000),
                TimeSeriesDataPoint(timestamp=1700191496, value=73000),
                TimeSeriesDataPoint(timestamp=1700187896, value=72000),
                TimeSeriesDataPoint(timestamp=1700184296, value=12000),
                TimeSeriesDataPoint(timestamp=1700180696, value=25000),
                TimeSeriesDataPoint(timestamp=1700177096, value=27000),
                TimeSeriesDataPoint(timestamp=1700173496, value=40000),
                TimeSeriesDataPoint(timestamp=1700169896, value=24000),
            ],
        ),
    )


@router.get("/{royalty_token_symbol}/live")
def fetch_live(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol="RT-00000001",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=1.84),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=1.85),
                    TimeSeriesDataPoint(timestamp=1700245496, value=1.83),
                    TimeSeriesDataPoint(timestamp=1700241896, value=1.79),
                    TimeSeriesDataPoint(timestamp=1700238296, value=1.81),
                    TimeSeriesDataPoint(timestamp=1700234696, value=1.87),
                    TimeSeriesDataPoint(timestamp=1700231096, value=1.82),
                    TimeSeriesDataPoint(timestamp=1700227496, value=1.80),
                    TimeSeriesDataPoint(timestamp=1700223896, value=1.78),
                    TimeSeriesDataPoint(timestamp=1700220296, value=1.88),
                    TimeSeriesDataPoint(timestamp=1700216696, value=1.97),
                    TimeSeriesDataPoint(timestamp=1700213096, value=1.65),
                    TimeSeriesDataPoint(timestamp=1700209496, value=1.56),
                    TimeSeriesDataPoint(timestamp=1700205896, value=1.52),
                    TimeSeriesDataPoint(timestamp=1700202296, value=1.26),
                    TimeSeriesDataPoint(timestamp=1700198696, value=1.12),
                    TimeSeriesDataPoint(timestamp=1700195096, value=1.09),
                    TimeSeriesDataPoint(timestamp=1700191496, value=1.081),
                    TimeSeriesDataPoint(timestamp=1700187896, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700184296, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700180696, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700177096, value=1.07),
                    TimeSeriesDataPoint(timestamp=1700173496, value=1.065),
                    TimeSeriesDataPoint(timestamp=1700169896, value=1.05),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=100),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=101),
                    TimeSeriesDataPoint(timestamp=1700245496, value=95),
                    TimeSeriesDataPoint(timestamp=1700241896, value=98),
                    TimeSeriesDataPoint(timestamp=1700238296, value=123),
                    TimeSeriesDataPoint(timestamp=1700234696, value=112),
                    TimeSeriesDataPoint(timestamp=1700231096, value=109),
                    TimeSeriesDataPoint(timestamp=1700227496, value=107),
                    TimeSeriesDataPoint(timestamp=1700223896, value=105),
                    TimeSeriesDataPoint(timestamp=1700220296, value=163),
                    TimeSeriesDataPoint(timestamp=1700216696, value=155),
                    TimeSeriesDataPoint(timestamp=1700213096, value=145),
                    TimeSeriesDataPoint(timestamp=1700209496, value=125),
                    TimeSeriesDataPoint(timestamp=1700205896, value=130),
                    TimeSeriesDataPoint(timestamp=1700202296, value=132),
                    TimeSeriesDataPoint(timestamp=1700198696, value=131),
                    TimeSeriesDataPoint(timestamp=1700195096, value=126),
                    TimeSeriesDataPoint(timestamp=1700191496, value=179),
                    TimeSeriesDataPoint(timestamp=1700187896, value=187),
                    TimeSeriesDataPoint(timestamp=1700184296, value=132),
                    TimeSeriesDataPoint(timestamp=1700180696, value=133),
                    TimeSeriesDataPoint(timestamp=1700177096, value=134),
                    TimeSeriesDataPoint(timestamp=1700173496, value=125),
                    TimeSeriesDataPoint(timestamp=1700169896, value=110),
                ],
            ),
        )
    ]


@router.get("/{royalty_token_symbol}/live")
def fetch_upcoming(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=325),
                recent_values_dataset=[
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
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=33),
                recent_values_dataset=[],
            ),
        )
    ]

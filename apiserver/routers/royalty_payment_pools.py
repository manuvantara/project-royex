from typing import List

from fastapi import APIRouter

from apiserver.routers.commune import (
    TimeSeriesDataPoint,
    ValueIndicator,
    Deposit,
    GetRoyaltyIncomeResponse,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str:  # address
    return "0x02651afe41AfE1A7ac1c3D039e6f0B3a57F8AfEd7"


@router.get("/{royalty_token_symbol}/royalty-income")
def get_royalty_income(royalty_token_symbol: str) -> GetRoyaltyIncomeResponse:
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


@router.get("/{royalty_token_symbol}/deposits")
def fetch_deposits(royalty_token_symbol: str) -> List[Deposit]:
    return [
        Deposit(
            distributor="0x0ecfA66e77d95Cc1484617eb496e6eb49EAbdA96",
            checkpoint_key=1,
            amount=100,
        ),
        Deposit(
            distributor="0xC37713ef41Aff1A7ac1c3D02f6f0B3a57F8A3091",
            checkpoint_key=2,
            amount=15,
        ),
    ]

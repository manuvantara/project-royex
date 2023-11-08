from apiserver.routers.common import Deposit, GetRoyaltyIncomeResponse
from fastapi import APIRouter
from typing import List

router = APIRouter()


@router.get("/royalty-payment-pools/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> None:  # address
    return "0x02651afe41AfE1A7ac1c3D039e6f0B3a57F8AfEd7"


@router.get("/royalty-payment-pools/{royalty_id}/royalty-income")
def get_royalty_income(royalty_id: str) -> GetRoyaltyIncomeResponse:
    return GetRoyaltyIncomeResponse(
        reported=8461,
        deposited=7824
    )


@router.get("/royalty-payment-pools/{royalty_id}/deposits")
def fetch_deposits(royalty_id: str) -> List[Deposit]:
    return [
        Deposit(
            distributor="0x0ecfA66e77d95Cc1484617eb496e6eb49EAbdA96",
            checkpointKey=1,
            amount=100
        ),
        Deposit(
            distributor="0xC37713ef41Aff1A7ac1c3D02f6f0B3a57F8A3091",
            checkpointKey=2,
            amount=15
        )
    ]
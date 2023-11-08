from typing import List
from apiserver.common import Deposit, GetRoyaltyIncomeResponse
from fastapi import APIRouter

router = APIRouter()


@router.get("/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> None:  # address
    pass


@router.get("/{royalty_id}/royalty-income")
def get_royalty_income(royalty_id: str) -> GetRoyaltyIncomeResponse:
    pass


@router.get("/{royalty_id}/deposits")
def fetch_deposits(royalty_id: str) -> List[Deposit]:
    pass

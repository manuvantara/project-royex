from typing import List
from apiserver.common import Offer, ValueIndicator
from fastapi import APIRouter

router = APIRouter()


@router.get("/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> str:  # address
    return "XYZ"


@router.get("/{royalty_id}/floor-price")
def get_floor_price(royalty_id: str) -> ValueIndicator:  # address
    pass


@router.get("/{royalty_id}/trading-volume")
def get_trading_volume(royalty_id: str) -> ValueIndicator:  # address
    pass


@router.get("/{royalty_id}/offers'")
def get_trading_volume(royalty_id: str) -> List[Offer]:  # address
    pass

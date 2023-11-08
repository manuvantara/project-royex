from apiserver.common import ValueIndicator
from fastapi import APIRouter

router = APIRouter()


@router.get("/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> None: #address
    pass


@router.get("/{royalty_id}/price")
def get_price(royalty_id: str) -> ValueIndicator:
    pass


@router.get("/{royalty_id}/trading-volume")
def get_trading_volume(royalty_id: str) -> ValueIndicator:
    pass

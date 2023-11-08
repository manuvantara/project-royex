from apiserver.common import GetRoyaltyIncomeResponse, ValueIndicator
from fastapi import APIRouter

router = APIRouter()

# Must be updated every time individual royalty's trading volume is updated.
@router.get("/otc-market-trading-volume")
def get_otc_market_trading_volume() -> ValueIndicator:
    pass

@router.get("/royalty-exchange-trading-volume")
def get_royalty_exchange_trading_volume() -> ValueIndicator:
    pass

@router.get("/royalty-income")
def get_royalty_income_per_protocol() -> GetRoyaltyIncomeResponse:
    pass

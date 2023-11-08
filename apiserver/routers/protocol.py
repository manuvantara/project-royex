from apiserver.routers.common import (
    GetRoyaltyIncomeResponse,
    ValueIndicator,
    GetTradingVolume,
    TimeSeriesDataPoint,
)
from fastapi import APIRouter

router = APIRouter()

# Must be updated every time individual royalty's trading volume is updated.
@router.get("/protocol/trading-volume")
def get_trading_volume() -> GetTradingVolume:
    return GetTradingVolume(
        otc_market=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=10, value=1250),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1, value=100),
                TimeSeriesDataPoint(timestamp=2, value=255),
                TimeSeriesDataPoint(timestamp=3, value=304),
                TimeSeriesDataPoint(timestamp=4, value=430),
                TimeSeriesDataPoint(timestamp=5, value=571),
                TimeSeriesDataPoint(timestamp=6, value=878),
                TimeSeriesDataPoint(timestamp=7, value=997),
                TimeSeriesDataPoint(timestamp=8, value=1124),
                TimeSeriesDataPoint(timestamp=9, value=1233),
            ]
        ),
        royalty_exchanges=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=10, value=5467),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1, value=450),
                TimeSeriesDataPoint(timestamp=2, value=455),
                TimeSeriesDataPoint(timestamp=3, value=543),
                TimeSeriesDataPoint(timestamp=4, value=657),
                TimeSeriesDataPoint(timestamp=5, value=789),
                TimeSeriesDataPoint(timestamp=6, value=1830),
                TimeSeriesDataPoint(timestamp=7, value=2354),
                TimeSeriesDataPoint(timestamp=8, value=3854),
                TimeSeriesDataPoint(timestamp=9, value=5037),
            ]
        )
    )

@router.get("/protocol/royalty-income")
def get_royalty_income_per_protocol() -> GetRoyaltyIncomeResponse:
    return GetRoyaltyIncomeResponse(
        reported=3250,
        deposited=3178
    )
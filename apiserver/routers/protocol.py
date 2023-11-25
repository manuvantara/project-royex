from time import time
import numpy as np

from fastapi import APIRouter, Depends
from requests import Session

from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    OtcMarketOfferAcceptedEvent,
    RoyaltyTokenBoughtEvent,
    RoyaltyPoolDepositedEvent,
)

from apiserver.routers.commune import (
    GetRoyaltyIncomeResponse,
    GetTradingVolume,
    ValueIndicator,
    TimeSeriesDataPoint,
)

router = APIRouter()


# Must be updated every time individual royalty's trading volume is updated.
@router.get("/trading-volume")
def get_trading_volume(session: Session = Depends(get_session)) -> GetTradingVolume:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    otc_volumes = np.array([])
    exchange_volumes = np.array([])

    for hour in hour_timestamps:
        statement = select(OtcMarketOfferAcceptedEvent.stablecoin_amount).where(
            OtcMarketOfferAcceptedEvent.block_timestamp <= int(hour),
        )
        otc_market_volume = sum(session.exec(statement).all())

        statement = select(RoyaltyPoolDepositedEvent.deposit).where(
            RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
        )
        deposited_volume = sum(session.exec(statement).all())

        statement = select(RoyaltyTokenBoughtEvent.stablecoin_amount).where(
            RoyaltyTokenBoughtEvent.block_timestamp <= int(hour),
        )
        royalty_volume = sum(session.exec(statement).all())

        otc_volumes = np.append(otc_volumes, otc_market_volume)
        exchange_volumes = np.append(exchange_volumes, deposited_volume + royalty_volume)

    return GetTradingVolume(
        otc_market=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=hour_timestamps[0], value=otc_volumes[0]),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=otc_volumes[i])
                for i in range(1, len(otc_volumes))
            ]
        ),
        royalty_exchange=ValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=exchange_volumes[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=exchange_volumes[i])
                for i in range(1, len(exchange_volumes))
            ]
        )
    )


@router.get("/royalty-income")
def get_royalty_income_per_protocol(session: Session = Depends(get_session)) -> GetRoyaltyIncomeResponse:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_volumes = np.array([])

    for hour in hour_timestamps:
        statement = select(RoyaltyPoolDepositedEvent.deposit).where(
            RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
        )
        deposited_volume = sum(session.exec(statement).all())

        hour_volumes = np.append(hour_volumes, deposited_volume)

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
            current=TimeSeriesDataPoint(timestamp=hour_timestamps[0], value=hour_volumes[0]),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=hour_volumes[i])
                for i in range(1, len(hour_volumes))
            ] 
        )
    )

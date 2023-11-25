from datetime import datetime
from decimal import Decimal
import random
from time import time
from typing import List
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session
from apiserver.database import models

from apiserver.database.models import (
    OtcMarketOfferAcceptedEvent,
    RoyaltyTokenBoughtEvent,
    RoyaltyPoolDepositedEvent,
)

from apiserver.routers.commune import (
    GetRoyaltyIncomeResponse,
    GetTradingVolume,
    BaseValueIndicator,
    TimeSeriesDataPoint,
)

from apiserver.routers import otc_markets, royalty_exchanges

router = APIRouter()


# Must be updated every time individual royalty's trading volume is updated.
@router.get("/trading-volume")
def get_trading_volume(*, session: Session = Depends(get_session)) -> GetTradingVolume:
    return GetTradingVolume(
        otc_market=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=datetime.now().timestamp(),
                value=str(random.randint(400, 1200)),
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=datetime.now().timestamp(),
                    value=str(random.randint(0, 742)),
                )
                for hour in range(24)
            ],
        ),
        royalty_exchange=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=datetime.now().timestamp(),
                value=str(random.randint(400, 1200)),
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=datetime.now().timestamp(),
                    value=str(random.randint(0, 742)),
                )
                for hour in range(24)
            ],
        ),
    )

    statement = select(models.RoyaltyToken).where(
        (models.RoyaltyExchange.royalty_token_symbol == models.RoyaltyToken.symbol)
    )
    results = session.exec(statement)

    public_royalty_tokens = results.all().copy()

    statement = select(models.RoyaltyToken)
    results = session.exec(statement)

    royalty_tokens = results.all().copy()

    otc_markets_trading_volume_indicators: List[BaseValueIndicator] = []

    for royalty_token in royalty_tokens:
        indicator = otc_markets.get_trading_volume(
            royalty_token_symbol=royalty_token.symbol,
            session=session,
        )
        otc_markets_trading_volume_indicators.append(indicator)

    x = sum(
        Decimal(volume.current.value)
        for volume in otc_markets_trading_volume_indicators
    )

    # for element in zip([indicator.recent_values_dataset for indicator in otc_markets_trading_volume_indicators]):
    #     for value in element:
    #         if value:
    #             x += sum(Decimal(volume.value) for volume in value)
    y: List[TimeSeriesDataPoint] = []
    # for indicator in otc_markets_trading_volume_indicators:
    #     if indicator.recent_values_dataset:
    #         m = sum()
    #         for i in range(len(indicator.recent_values_dataset) - 1):

    for i in range(24):
        r = Decimal("0")
        t = 0
        for indicator in otc_markets_trading_volume_indicators:
            if indicator.recent_values_dataset:
                r += Decimal(indicator.recent_values_dataset[i].value)
                t = indicator.recent_values_dataset[i].timestamp
        y.append(TimeSeriesDataPoint(timestamp=t, value=str(r)))

    return BaseValueIndicator(
        current=TimeSeriesDataPoint(
            timestamp=int(time()),
            value=str(x),
        ),
        recent_values_dataset=y,
    )
    # try:
    #     royalty_tokens = results.all()
    # except exc.NoResultFound:
    #     raise HTTPException(
    #         status_code=404,
    #         detail="Royalty Tokens Not Found",
    # current_timestamp = int(time())
    # hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    # otc_volumes = np.array([])
    # exchange_volumes = np.array([])

    # for hour in hour_timestamps:
    #     statement = select(OtcMarketOfferAcceptedEvent.stablecoin_amount).where(
    #         OtcMarketOfferAcceptedEvent.block_timestamp <= int(hour),
    #     )
    #     otc_market_volume = sum(session.exec(statement).all())

    #     statement = select(RoyaltyPoolDepositedEvent.deposit).where(
    #         RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
    #     )
    #     deposited_volume = sum(session.exec(statement).all())

    #     statement = select(RoyaltyTokenBoughtEvent.stablecoin_amount).where(
    #         RoyaltyTokenBoughtEvent.block_timestamp <= int(hour),
    #     )
    #     royalty_volume = sum(session.exec(statement).all())

    #     otc_volumes = np.append(otc_volumes, otc_market_volume)
    #     exchange_volumes = np.append(exchange_volumes, deposited_volume + royalty_volume)

    # return GetTradingVolume(
    #     otc_market=ValueIndicator(
    #         current=TimeSeriesDataPoint(timestamp=hour_timestamps[0], value=otc_volumes[0]),
    #         recent_values_dataset=[
    #             TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=otc_volumes[i])
    #             for i in range(1, len(otc_volumes))
    #         ]
    #     ),
    #     royalty_exchange=ValueIndicator(
    #         current=TimeSeriesDataPoint(
    #             timestamp=hour_timestamps[0], value=exchange_volumes[0]
    #         ),
    #         recent_values_dataset=[
    #             TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=exchange_volumes[i])
    #             for i in range(1, len(exchange_volumes))
    #         ]
    #     )
    # )


@router.get("/royalty-income")
def get_royalty_income_per_protocol(
    session: Session = Depends(get_session),
) -> GetRoyaltyIncomeResponse:
    return GetRoyaltyIncomeResponse(
        reported=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=datetime.now().timestamp(), value="0"
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=datetime.now().timestamp(), value="0")
                for hour in range(24)
            ],
        ),
        deposited=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=datetime.now().timestamp(),
                value=str(random.randint(400, 1200)),
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=datetime.now().timestamp(),
                    value=str(random.randint(0, 742)),
                )
                for hour in range(24)
            ],
        ),
    )

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
        reported=BaseValueIndicator(
            current=TimeSeriesDataPoint(timestamp=0, value=0),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
            ],
        ),
        deposited=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=hour_volumes[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=hour_volumes[i])
                for i in range(1, len(hour_volumes))
            ],
        ),
    )

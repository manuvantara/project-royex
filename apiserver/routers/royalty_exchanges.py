from typing import List, Optional

from time import time
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from apiserver.routers.commune import TimeSeriesDataPoint, ValueIndicator

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.routers.commune import Offer, ValueIndicator, TimeSeriesDataPoint

from apiserver.database.models import (
    RoyaltyExchange,
    RoyaltyTokenSoldEvent,
    RoyaltyTokenBoughtEvent,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *,
    royalty_token_symbol: str,
    session: Session = Depends(get_session)
) -> str:  # address
    statement = select(RoyaltyExchange).where(
        RoyaltyExchange.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Royalty Exchange Not Found",
        )

    return royalty_token.contract_address


@router.get("/{royalty_token_symbol}/price")
def get_price(royalty_token_symbol: str, session: Session = Depends(get_session)) -> ValueIndicator:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_prices = np.array([])

    last_price = 0
    for hour in hour_timestamps:
        statement = select(RoyaltyTokenSoldEvent.block_timestamp, 
                           RoyaltyTokenSoldEvent.updated_stablecoin_reserve, 
                           RoyaltyTokenSoldEvent.updated_royalty_token_reserve).where(
            RoyaltyTokenSoldEvent.contract_address == royalty_token_symbol,
            RoyaltyTokenSoldEvent.block_timestamp <= int(hour),
        ).order_by(RoyaltyTokenSoldEvent.block_timestamp.desc())

        sold = session.exec(statement).first()

        statement = select(RoyaltyTokenBoughtEvent.block_timestamp,
                           RoyaltyTokenBoughtEvent.updated_stablecoin_reserve,
                           RoyaltyTokenBoughtEvent.updated_royalty_token_reserve).where(
            RoyaltyTokenBoughtEvent.contract_address == royalty_token_symbol,
            RoyaltyTokenBoughtEvent.block_timestamp <= int(hour),
        ).order_by(RoyaltyTokenBoughtEvent.block_timestamp.desc())

        bought = session.exec(statement).first()

        if sold and bought:
            latest_operation = sold if sold.block_timestamp > bought.block_timestamp else bought
            latest_price = latest_operation.updated_stablecoin_reserve / latest_operation.updated_royalty_token_reserve
            hour_prices = np.append(hour_prices, latest_price)
            last_price = latest_price
        else:
            hour_prices = np.append(hour_prices, last_price)

    return ValueIndicator(
        current=TimeSeriesDataPoint(
            timestamp=hour_timestamps[0], value=hour_prices[0]
        ),
        recent_values_dataset=[
            TimeSeriesDataPoint(
                timestamp=hour_timestamps[i], value=hour_prices[i]
            )
            for i in range(1, len(hour_prices))
        ],
    )
@router.get("/{royalty_token_symbol}/trading-volume")
def get_trading_volume(royalty_token_symbol: str) -> ValueIndicator:
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=10, value=1342),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=1, value=320),
            TimeSeriesDataPoint(timestamp=2, value=324),
            TimeSeriesDataPoint(timestamp=3, value=325),
            TimeSeriesDataPoint(timestamp=4, value=430),
            TimeSeriesDataPoint(timestamp=5, value=581),
            TimeSeriesDataPoint(timestamp=6, value=898),
            TimeSeriesDataPoint(timestamp=7, value=979),
            TimeSeriesDataPoint(timestamp=8, value=1124),
            TimeSeriesDataPoint(timestamp=9, value=1343),
        ],
    )

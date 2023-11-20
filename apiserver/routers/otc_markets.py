from typing import List, Optional

from time import time
import numpy as np

from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.routers.commune import Offer, ValueIndicator, TimeSeriesDataPoint

from apiserver.database.models import (
    OtcMarket,
    OtcMarketFloorPriceChangedEvent,
    OtcMarketOffer,
    OtcMarketOfferAcceptedEvent,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> Optional[str]:
    statement = select(OtcMarket).where(
        OtcMarket.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )

    return royalty_token.contract_address


@router.get("/{royalty_token_symbol}/floor-price")
def get_floor_price(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> ValueIndicator:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_prices = np.array([])

    statement = select(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_token_symbol) # For last 24 hours
    otc_market = session.exec(statement).first()
    if otc_market is None:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )

    last_price = 0
    for hour in hour_timestamps:
        statement = select(
                OtcMarketFloorPriceChangedEvent.block_timestamp,
                OtcMarketFloorPriceChangedEvent.floor_price,
            ).where(
                OtcMarketFloorPriceChangedEvent.contract_address
                == otc_market.contract_address,
                OtcMarketFloorPriceChangedEvent.block_timestamp <= int(hour),
            ).order_by(OtcMarketFloorPriceChangedEvent.block_timestamp.desc())        
        latest_price = session.exec(statement).first()

        if latest_price:
            hour_prices = np.append(hour_prices, latest_price.floor_price)
            last_price = latest_price.floor_price
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
def get_trading_volume(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> ValueIndicator:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_volumes = np.array([])

    statement = select(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_token_symbol)
    otc_market = session.exec(statement).first()
    if otc_market is None:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )

    last_volume = 0
    for hour in hour_timestamps:
        statement = select(
                OtcMarketOfferAcceptedEvent.block_timestamp,
                OtcMarketOfferAcceptedEvent.stablecoin_amount,
            ).where(
                OtcMarketOfferAcceptedEvent.contract_address
                == otc_market.contract_address,
                OtcMarketOfferAcceptedEvent.block_timestamp <= int(hour)
            ).order_by(OtcMarketOfferAcceptedEvent.block_timestamp.desc())
        
        latest_volume = session.exec(statement)

        if len(latest_volume.all()) > 0:
            volume_sum = sum([stablecoin_amount for _, stablecoin_amount in latest_volume])
            hour_volumes = np.append(hour_volumes, volume_sum)
            last_volume = volume_sum
        else:
            hour_volumes = np.append(hour_volumes, last_volume)

    return ValueIndicator(
        current=TimeSeriesDataPoint(
            timestamp=hour_timestamps[0], value=hour_volumes[0]
        ),
        recent_values_dataset=[
            TimeSeriesDataPoint(
                timestamp=hour_timestamps[i], value=hour_volumes[i]
            )
            for i in range(1, len(hour_volumes))
        ],
    )


@router.get("/{royalty_token_symbol}/offers")
def fetch_offers(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> List[Offer]:
    statement = select(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_token_symbol)
    otc_market = session.exec(statement).one()
    if otc_market is None:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )

    statement = select(OtcMarketOffer).where(OtcMarketOffer.contract_address == otc_market.contract_address)
    offers = session.exec(statement)
    if len(offers) == 0:
        raise HTTPException(
            status_code=404,
            detail="Offers Not Found",
        )

    return [
        Offer(
            seller=offer.seller,
            royalty_token_amount=offer.royalty_token_amount,
            stablecoin_amount=offer.stablecoin_amount,
        )
        for offer in offers
    ]
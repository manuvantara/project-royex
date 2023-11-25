from datetime import datetime, timedelta
from time import time
from typing import List

import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    OtcMarket,
    OtcMarketFloorPriceChangedEvent,
    OtcMarketOffer,
    OtcMarketOfferAcceptedEvent,
)
from apiserver.routers.commune import (
    Offer,
    ValueIndicator,
    TimeSeriesDataPoint,
    calculate_value_indicator,
    generate_recent_values_dataset,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> str:
    statement = select(OtcMarket).where(
        OtcMarket.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        otc_market = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )
    except exc.MultipleResultsFound:
        raise HTTPException(
            status_code=500,
            detail="Multiple OTC Market Found",
        )

    return otc_market.contract_address


@router.get("/{royalty_token_symbol}/floor-price")
def get_floor_price(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> ValueIndicator:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_prices = np.array([])

    statement = select(OtcMarket).where(
        OtcMarket.royalty_token_symbol == royalty_token_symbol
    )  # For last 24 hours
    otc_market = session.exec(statement).first()
    if otc_market is None:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Not Found",
        )

    last_price = 0
    for hour in hour_timestamps:
        statement = (
            select(
                OtcMarketFloorPriceChangedEvent.block_timestamp,
                OtcMarketFloorPriceChangedEvent.floor_price,
            )
            .where(
                OtcMarketFloorPriceChangedEvent.contract_address
                == otc_market.contract_address,
                OtcMarketFloorPriceChangedEvent.block_timestamp <= int(hour),
            )
            .order_by(OtcMarketFloorPriceChangedEvent.block_timestamp.desc())
        )
        latest_price = session.exec(statement).first()

        if latest_price:
            hour_prices = np.append(hour_prices, latest_price.floor_price)
            last_price = latest_price.floor_price
        else:
            hour_prices = np.append(hour_prices, last_price)

    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=hour_timestamps[0], value=hour_prices[0]),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=hour_timestamps[i], value=hour_prices[i])
            for i in range(1, len(hour_prices))
        ],
    )


@router.get("/{royalty_token_symbol}/trading-volume")
def get_trading_volume(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> ValueIndicator:
    upper_bound = datetime.now()
    lower_bound = upper_bound.replace(hour=0, minute=0, second=0) - timedelta(hours=24)

    # TODO: If Royalty Token is not found, raise 404 error
    statement = select(OtcMarketOfferAcceptedEvent).where(
        (OtcMarket.royalty_token_symbol == royalty_token_symbol)
        & (OtcMarketOfferAcceptedEvent.contract_address == OtcMarket.contract_address)
        & (OtcMarketOfferAcceptedEvent.block_timestamp >= lower_bound.timestamp())
    )
    results = session.exec(statement)

    events = results.all()

    recent_values_dataset = generate_recent_values_dataset(
        events=events,
        target="stablecoin_amount",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return calculate_value_indicator(
        recent_values_dataset=recent_values_dataset,
        upper_bound=upper_bound,
    )


@router.get("/{royalty_token_symbol}/offers")
def fetch_offers(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> List[Offer]:
    statement = select(OtcMarketOffer).where(
        (OtcMarket.royalty_token_symbol == royalty_token_symbol)
        & (OtcMarketOffer.contract_address == OtcMarket.contract_address)
    )
    results = session.exec(statement)

    try:
        offers = results.all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="OTC Market Offers Not Found",
        )

    return [
        Offer(
            offer_id=offer.offer_id,
            seller=offer.seller,
            royalty_token_amount=offer.royalty_token_amount,
            stablecoin_amount=offer.stablecoin_amount,
        )
        for offer in offers
    ]

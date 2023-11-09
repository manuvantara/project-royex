from typing import List
from apiserver.database.models import (
    RoyaltyToken, 
    OtcMarket, 
    OtcMarketOffer,
    OtcMarketOfferAcceptedEvent,
    OtcMarketFloorPriceChangedEvent, 
)
from apiserver.database import engine
from sqlmodel import Session
from apiserver.routers.common import Offer, ValueIndicator, TimeSeriesDataPoint
from fastapi import APIRouter
import numpy as np
import time

router = APIRouter()


@router.get("/{royalty_id}/contract-address")
def get_contract_address(royalty_id: str) -> str:  # address
    with Session(engine) as session:
        royalty_token = session.query(RoyaltyToken.contract_address).where(RoyaltyToken.symbol == royalty_id).one()
        return royalty_token.contract_address


@router.get("/{royalty_id}/floor-price")
def get_floor_price(royalty_id: str) -> ValueIndicator:  # address
    with Session(engine) as session:
        current_timestamp = int(time.time())
        otc_market = session.query(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_id).one()
        last_prices = session.query(OtcMarketFloorPriceChangedEvent.block_timestamp, OtcMarketFloorPriceChangedEvent.floor_price).where(
                OtcMarketFloorPriceChangedEvent.contract_address == otc_market.contract_address,
                OtcMarketFloorPriceChangedEvent.block_timestamp >= current_timestamp - 24 * 3600
            ).order_by(OtcMarketFloorPriceChangedEvent.block_timestamp.desc()
        ) # For last 24 hours

        last_event = last_prices.first()

        return ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=last_event.block_timestamp, value=last_event.floor_price),
            recent_values_dataset=[TimeSeriesDataPoint(timestamp=event.block_timestamp, value=event.floor_price) for event in last_prices[1:]]
        )


@router.get("/{royalty_id}/trading-volume")
def get_trading_volume(royalty_id: str) -> ValueIndicator:  # address
    with Session(engine) as session:
        current_timestamp = int(time.time())
        otc_market = session.query(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_id).one()
        otc_market_accepted_offers = session.query(OtcMarketOfferAcceptedEvent).where(
                OtcMarketOfferAcceptedEvent.contract_address == otc_market.contract_address
            ).order_by(OtcMarketOfferAcceptedEvent.block_timestamp
        ) # For last 24 hours

        cumulative_sum = np.cumsum([event.stablecoin_amount for event in otc_market_accepted_offers])
        timestamps = np.array([event.block_timestamp for event in otc_market_accepted_offers])

        cumsum_last_24_hours = [
            np.array([cumulative_sum[i], timestamps[i]])
            for i in range(len(cumulative_sum))
            if timestamps[i] >= current_timestamp - 24 * 3600
        ]

        cumsum_last_24_hours.sort(key=lambda x: x[1], reverse=True)
        last_event = cumsum_last_24_hours[0]

        print([TimeSeriesDataPoint(timestamp=event[1], value=event[0]) for event in cumsum_last_24_hours[1:]])

        return ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=last_event[1], value=last_event[0]),
            recent_values_dataset=[TimeSeriesDataPoint(timestamp=event[1], value=event[0]) for event in cumsum_last_24_hours[1:]]
        )


@router.get("/{royalty_id}/offers")
def fetch_offers(royalty_id: str) -> List[Offer]:  # address
    with Session(engine) as session:
        otc_market = session.query(OtcMarket).where(OtcMarket.royalty_token_symbol == royalty_id).one()
        offers = session.query(OtcMarketOffer).where(
            OtcMarketOffer.contract_address == otc_market.contract_address
        )

        return [
            Offer(
                seller=offer.seller,
                royalty_token_amount=offer.royalty_token_amount,
                stablecoin_amount=offer.stablecoin_amount
            ) for offer in offers
        ]
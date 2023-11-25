from datetime import datetime, timedelta
from typing import List, cast

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
    BaseValueIndicator,
    ValueIndicator,
    CumulativeValueIndicator,
    fetch_events,
    generate_bar_chart,
    generate_line_chart,
    Offer,
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
) -> BaseValueIndicator:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    upper_bound = datetime.now()
    lower_bound = upper_bound.replace(minute=0, second=0) - timedelta(hours=23)

    events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=OtcMarketFloorPriceChangedEvent,
    )
    events = cast(List[OtcMarketFloorPriceChangedEvent], events)

    recent_values_dataset = generate_line_chart(
        events=events,
        target="floor_price",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return ValueIndicator(recent_values_dataset)


@router.get("/{royalty_token_symbol}/trading-volume")
def get_trading_volume(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> BaseValueIndicator:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    upper_bound = datetime.now()
    lower_bound = upper_bound.replace(minute=0, second=0) - timedelta(hours=23)

    events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=OtcMarketOfferAcceptedEvent,
    )
    events = cast(List[OtcMarketOfferAcceptedEvent], events)

    recent_values_dataset = generate_bar_chart(
        events=events,
        target="stablecoin_amount",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return CumulativeValueIndicator(recent_values_dataset)


@router.get("/{royalty_token_symbol}/offers")
def fetch_offers(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> List[Offer]:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    statement = select(OtcMarketOffer).where(
        (OtcMarketOffer.contract_address == contract_address)
    )
    results = session.exec(statement)

    offers = results.all()

    return [
        Offer(
            offer_id=offer.offer_id,
            seller=offer.seller,
            royalty_token_amount=offer.royalty_token_amount,
            stablecoin_amount=offer.stablecoin_amount,
        )
        for offer in offers
    ]

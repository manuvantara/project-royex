from datetime import datetime, timedelta
from time import time
from typing import List, cast
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    RoyaltyExchange,
    RoyaltyTokenSoldEvent,
    RoyaltyTokenBoughtEvent,
    RoyaltyTokenTradedEvent,
)
from apiserver.routers.commune import (
    BaseValueIndicator,
    TimeSeriesDataPoint,
    ValueIndicator,
    calculate_value_indicator,
    fetch_events,
    generate_bar_chart,
    generate_line_chart,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
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
    except exc.MultipleResultsFound:
        raise HTTPException(
            status_code=500,
            detail="Multiple Royalty Exchange Found",
        )

    return royalty_token.contract_address


@router.get("/{royalty_token_symbol}/price")
def get_price(
    royalty_token_symbol: str, *, session: Session = Depends(get_session)
) -> BaseValueIndicator:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    upper_bound = datetime.now()
    lower_bound = upper_bound.replace(minute=0, second=0) - timedelta(hours=23)

    royalty_token_bought_events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=RoyaltyTokenBoughtEvent,
    )
    royalty_token_bought_events = cast(
        List[RoyaltyTokenTradedEvent], royalty_token_bought_events
    )

    royalty_token_sold_events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=RoyaltyTokenSoldEvent,
    )
    royalty_token_sold_events = cast(
        List[RoyaltyTokenTradedEvent], royalty_token_sold_events
    )

    events = royalty_token_bought_events + royalty_token_sold_events

    recent_values_dataset = generate_line_chart(
        events=events,
        target="stablecoin_amount",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return ValueIndicator(recent_values_dataset)


@router.get("/{royalty_token_symbol}/trading-volume")
def get_trading_volume(
    royalty_token_symbol: str, *, session: Session = Depends(get_session)
) -> BaseValueIndicator:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    upper_bound = datetime.now()
    lower_bound = upper_bound.replace(minute=0, second=0) - timedelta(hours=23)

    royalty_token_bought_events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=RoyaltyTokenBoughtEvent,
    )
    royalty_token_bought_events = cast(
        List[RoyaltyTokenTradedEvent], royalty_token_bought_events
    )

    royalty_token_sold_events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=RoyaltyTokenSoldEvent,
    )
    royalty_token_sold_events = cast(
        List[RoyaltyTokenTradedEvent], royalty_token_sold_events
    )

    events = royalty_token_bought_events + royalty_token_sold_events

    recent_values_dataset = generate_bar_chart(
        events=events,
        target="stablecoin_amount",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return calculate_value_indicator(
        recent_values_dataset=recent_values_dataset,
        upper_bound=upper_bound,
    )

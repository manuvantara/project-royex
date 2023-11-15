from typing import List, Optional

# *

from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.routers.commune import Offer, ValueIndicator, TimeSeriesDataPoint

from apiserver.database.models import (
    OtcMarket,
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
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=0, value=0),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=0, value=0),
            TimeSeriesDataPoint(timestamp=0, value=0),
            TimeSeriesDataPoint(timestamp=0, value=0),
        ],
    )


@router.get("/{royalty_token_symbol}/trading-volume")
def get_trading_volume(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> ValueIndicator:
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=0, value=0),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=0, value=0),
            TimeSeriesDataPoint(timestamp=0, value=0),
            TimeSeriesDataPoint(timestamp=0, value=0),
        ],
    )


@router.get("/{royalty_token_symbol}/offers")
def fetch_offers(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> List[Offer]:
    return [Offer(seller="pantemon", royalty_token_amount=100, stablecoin_amount=100)]

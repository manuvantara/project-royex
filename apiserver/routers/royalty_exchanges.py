from fastapi import APIRouter, Depends, HTTPException

from apiserver.routers.commune import TimeSeriesDataPoint, ValueIndicator

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.routers.commune import Offer, ValueIndicator, TimeSeriesDataPoint

from apiserver.database.models import (
    RoyaltyExchange
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
def get_price(royalty_token_symbol: str) -> ValueIndicator:
    return ValueIndicator(
        current=TimeSeriesDataPoint(timestamp=100, value=543),
        recent_values_dataset=[
            TimeSeriesDataPoint(timestamp=90, value=234),
            TimeSeriesDataPoint(timestamp=91, value=251),
            TimeSeriesDataPoint(timestamp=92, value=250),
            TimeSeriesDataPoint(timestamp=93, value=274),
            TimeSeriesDataPoint(timestamp=94, value=312),
            TimeSeriesDataPoint(timestamp=95, value=349),
            TimeSeriesDataPoint(timestamp=96, value=378),
            TimeSeriesDataPoint(timestamp=97, value=402),
            TimeSeriesDataPoint(timestamp=98, value=427),
            TimeSeriesDataPoint(timestamp=99, value=540),
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

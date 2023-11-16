from typing import List

from time import time
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from apiserver.routers.commune import Deposit, GetRoyaltyIncomeResponse, TimeSeriesDataPoint, ValueIndicator

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.routers.commune import ValueIndicator, TimeSeriesDataPoint

from apiserver.database.models import (
    RoyaltyExchange,
    RoyaltyTokenSoldEvent,
    RoyaltyTokenBoughtEvent,
    RoyaltyPaymentPool
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str, session: Session = Depends(get_session)) -> str:  # address
    statement = select(RoyaltyPaymentPool).where(
        RoyaltyPaymentPool.royalty_token_symbol == royalty_token_symbol
    )

    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Royalty Payment Pool Not Found",
        )

    return royalty_token.contract_address


@router.get("/{royalty_token_symbol}/royalty-income")
def get_royalty_income(royalty_token_symbol: str) -> GetRoyaltyIncomeResponse:
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
            current=TimeSeriesDataPoint(timestamp=0, value=0),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
                TimeSeriesDataPoint(timestamp=0, value=0),
            ],
        ),
    )


@router.get("/{royalty_token_symbol}/deposits")
def fetch_deposits(royalty_token_symbol: str) -> List[Deposit]:
    return [
        Deposit(
            distributor="0x0ecfA66e77d95Cc1484617eb496e6eb49EAbdA96",
            checkpoint_key=1,
            amount=100,
        ),
        Deposit(
            distributor="0xC37713ef41Aff1A7ac1c3D02f6f0B3a57F8A3091",
            checkpoint_key=2,
            amount=15,
        ),
    ]

from typing import List

from fastapi import APIRouter

from typing import Dict, List

from time import time
import numpy as np

from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    InitialRoyaltyOffering
)

from apiserver.routers.commune import (
    ValueIndicator,
    RoyaltyToken,
    GetRoyaltyOffering,
    TimeSeriesDataPoint,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, 
    royalty_token_symbol: str,
    session: Session = Depends(get_session)
) -> str:  # address
    statement = select(InitialRoyaltyOffering).where(
        InitialRoyaltyOffering.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Initial Royalty Offering Not Found",
        )

    return royalty_token.contract_address


@router.get("/{royalty_token_symbol}")
def get_royalty_offering(
    *, 
    royalty_token_symbol: str,
    session: Session = Depends(get_session)
) -> GetRoyaltyOffering:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    royalty_reserve = np.array([])
    stablecoin_reserve = np.array([])

    for hour in hour_timestamps:
        statement = select(InitialRoyaltyOffering).where(
            InitialRoyaltyOffering.royalty_token_symbol == royalty_token_symbol,
            InitialRoyaltyOffering.offering_date <= int(hour)
        ).order_by(InitialRoyaltyOffering.offering_date.desc())
        latest = session.exec(statement).first()

        royalty_reserve = np.append(latest.royalty_token_reserve, 0)
        stablecoin_reserve = np.append(stablecoin_reserve, 0)

    return GetRoyaltyOffering(
        offering_date=100,
        offering_price=235,
        royalty_token_reserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=100, value=235),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=90, value=220),
                TimeSeriesDataPoint(timestamp=91, value=212),
                TimeSeriesDataPoint(timestamp=92, value=232),
                TimeSeriesDataPoint(timestamp=93, value=289),
                TimeSeriesDataPoint(timestamp=94, value=352),
                TimeSeriesDataPoint(timestamp=95, value=379),
                TimeSeriesDataPoint(timestamp=96, value=378),
                TimeSeriesDataPoint(timestamp=97, value=432),
                TimeSeriesDataPoint(timestamp=98, value=457),
                TimeSeriesDataPoint(timestamp=99, value=521),
            ],
        ),
        stablecoin_reserve=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=100, value=235),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=90, value=220),
                TimeSeriesDataPoint(timestamp=91, value=232),
                TimeSeriesDataPoint(timestamp=92, value=247),
                TimeSeriesDataPoint(timestamp=93, value=298),
                TimeSeriesDataPoint(timestamp=94, value=325),
                TimeSeriesDataPoint(timestamp=95, value=397),
                TimeSeriesDataPoint(timestamp=96, value=387),
                TimeSeriesDataPoint(timestamp=97, value=423),
                TimeSeriesDataPoint(timestamp=98, value=476),
                TimeSeriesDataPoint(timestamp=99, value=513),
            ],
        ),
    )


@router.get("/{royalty_token_symbol}/live")
def fetch_live(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol="KLS",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=522),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=220),
                    TimeSeriesDataPoint(timestamp=91, value=212),
                    TimeSeriesDataPoint(timestamp=92, value=232),
                    TimeSeriesDataPoint(timestamp=93, value=289),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=379),
                    TimeSeriesDataPoint(timestamp=96, value=378),
                    TimeSeriesDataPoint(timestamp=97, value=432),
                    TimeSeriesDataPoint(timestamp=98, value=457),
                    TimeSeriesDataPoint(timestamp=99, value=521),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=282),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=125),
                    TimeSeriesDataPoint(timestamp=91, value=150),
                    TimeSeriesDataPoint(timestamp=92, value=155),
                    TimeSeriesDataPoint(timestamp=93, value=103),
                    TimeSeriesDataPoint(timestamp=94, value=76),
                    TimeSeriesDataPoint(timestamp=95, value=101),
                    TimeSeriesDataPoint(timestamp=96, value=117),
                    TimeSeriesDataPoint(timestamp=97, value=135),
                    TimeSeriesDataPoint(timestamp=98, value=250),
                    TimeSeriesDataPoint(timestamp=99, value=275),
                ],
            ),
        ),
        RoyaltyToken(
            royalty_token_symbol="SRD",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=533),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=206),
                    TimeSeriesDataPoint(timestamp=91, value=224),
                    TimeSeriesDataPoint(timestamp=92, value=201),
                    TimeSeriesDataPoint(timestamp=93, value=214),
                    TimeSeriesDataPoint(timestamp=94, value=218),
                    TimeSeriesDataPoint(timestamp=95, value=199),
                    TimeSeriesDataPoint(timestamp=96, value=335),
                    TimeSeriesDataPoint(timestamp=97, value=442),
                    TimeSeriesDataPoint(timestamp=98, value=457),
                    TimeSeriesDataPoint(timestamp=99, value=512),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=282),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=125),
                    TimeSeriesDataPoint(timestamp=91, value=150),
                    TimeSeriesDataPoint(timestamp=92, value=155),
                    TimeSeriesDataPoint(timestamp=93, value=103),
                    TimeSeriesDataPoint(timestamp=94, value=76),
                    TimeSeriesDataPoint(timestamp=95, value=101),
                    TimeSeriesDataPoint(timestamp=96, value=117),
                    TimeSeriesDataPoint(timestamp=97, value=135),
                    TimeSeriesDataPoint(timestamp=98, value=250),
                    TimeSeriesDataPoint(timestamp=99, value=275),
                ],
            ),
        ),
    ]


@router.get("/{royalty_token_symbol}/upcoming")
def fetch_upcoming(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=325),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=90, value=202),
                    TimeSeriesDataPoint(timestamp=91, value=221),
                    TimeSeriesDataPoint(timestamp=92, value=232),
                    TimeSeriesDataPoint(timestamp=93, value=298),
                    TimeSeriesDataPoint(timestamp=94, value=352),
                    TimeSeriesDataPoint(timestamp=95, value=379),
                    TimeSeriesDataPoint(timestamp=96, value=378),
                    TimeSeriesDataPoint(timestamp=97, value=412),
                    TimeSeriesDataPoint(timestamp=98, value=305),
                    TimeSeriesDataPoint(timestamp=99, value=325),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=100, value=33),
                recent_values_dataset=[],
            ),
        )
    ]

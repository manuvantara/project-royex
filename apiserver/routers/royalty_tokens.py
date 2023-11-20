import random
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database import models
from apiserver.routers import commune

router = APIRouter()


@router.get("/{symbol}/contract-address")
def get_contract_address(
    *, symbol: str, session: Session = Depends(get_session)
) -> Optional[str]:
    statement = select(models.RoyaltyToken).where(models.RoyaltyToken.symbol == symbol)
    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Royalty Token Not Found",
        )

    return royalty_token.contract_address


@router.get("/public")
def fetch_public(
    *, session: Session = Depends(get_session)
) -> List[commune.RoyaltyToken]:
    statement = select(models.RoyaltyToken).where(
        (models.RoyaltyExchange.royalty_token_symbol == models.RoyaltyToken.symbol)
    )
    results = session.exec(statement)

    try:
        public_royalty_tokens = results.all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Public Royalty Tokens Not Found",
        )

    # TODO: implement recent values datasets

    return [
        commune.RoyaltyToken(
            symbol=royalty_token.symbol,
            price=commune.ValueIndicator(
                current=commune.TimeSeriesDataPoint(timestamp=100, value=522),
                recent_values_dataset=[
                    commune.TimeSeriesDataPoint(
                        timestamp=hour * 3600, value=random.randint(0, 742)
                    )
                    for hour in range(24)
                ],
            ),
            deposited_royalty_income=commune.ValueIndicator(
                current=commune.TimeSeriesDataPoint(timestamp=100, value=237),
                recent_values_dataset=[
                    commune.TimeSeriesDataPoint(
                        timestamp=hour * 3600, value=random.randint(0, 880)
                    )
                    for hour in range(24)
                ],
            ),
        )
        for royalty_token in public_royalty_tokens
    ]


@router.get("/private")
def fetch_private(
    *, session: Session = Depends(get_session)
) -> List[commune.RoyaltyToken]:
    statement = select(models.RoyaltyToken).where(
        (models.RoyaltyExchange.royalty_token_symbol != models.RoyaltyToken.symbol)
    )
    results = session.exec(statement)

    try:
        private_royalty_tokens = results.all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Private Royalty Tokens Not Found",
        )

    # TODO: implement recent values datasets

    return [
        commune.RoyaltyToken(
            symbol=royalty_token.symbol,
            price=commune.ValueIndicator(
                current=commune.TimeSeriesDataPoint(timestamp=100, value=522),
                recent_values_dataset=[
                    commune.TimeSeriesDataPoint(
                        timestamp=hour * 3600, value=random.randint(0, 742)
                    )
                    for hour in range(24)
                ],
            ),
            deposited_royalty_income=commune.ValueIndicator(
                current=commune.TimeSeriesDataPoint(timestamp=100, value=237),
                recent_values_dataset=[
                    commune.TimeSeriesDataPoint(
                        timestamp=hour * 3600, value=random.randint(0, 880)
                    )
                    for hour in range(24)
                ],
            ),
        )
        for royalty_token in private_royalty_tokens
    ]

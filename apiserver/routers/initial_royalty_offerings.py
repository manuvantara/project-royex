from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database import models
from apiserver.routers import commune, royalty_payment_pools

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> str:  # address
    statement = select(models.InitialRoyaltyOffering).where(
        models.InitialRoyaltyOffering.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        royalty_token = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Initial Royalty Offering Not Found",
        )
    except exc.MultipleResultsFound:
        raise HTTPException(
            status_code=500,
            detail="Multiple Initial Royalty Offering Found",
        )

    return royalty_token.contract_address


@router.get("/live")
def fetch_live(
    *, session: Session = Depends(get_session)
) -> List[commune.PrivateRoyaltyToken]:
    upper_bound = datetime.now()

    statement = select(models.RoyaltyToken).where(
        (
            models.InitialRoyaltyOffering.royalty_token_symbol
            == models.RoyaltyToken.symbol
        )
        & (models.InitialRoyaltyOffering.offering_date <= upper_bound.timestamp())
    )
    results = session.exec(statement)

    royalty_tokens = results.all()

    return [
        commune.PrivateRoyaltyToken(
            symbol=royalty_token.symbol,
            deposited_royalty_income=royalty_payment_pools.get_royalty_income(
                royalty_token.symbol, session=session
            ).deposited,
        )
        for royalty_token in royalty_tokens
    ]


@router.get("/upcoming")
def fetch_upcoming(
    *, session: Session = Depends(get_session)
) -> List[commune.PrivateRoyaltyToken]:
    upper_bound = datetime.now()

    statement = select(models.RoyaltyToken).where(
        (
            models.InitialRoyaltyOffering.royalty_token_symbol
            == models.RoyaltyToken.symbol
        )
        & (models.InitialRoyaltyOffering.offering_date > upper_bound.timestamp())
    )
    results = session.exec(statement)

    royalty_tokens = results.all()

    return [
        commune.PrivateRoyaltyToken(
            symbol=royalty_token.symbol,
            deposited_royalty_income=royalty_payment_pools.get_royalty_income(
                royalty_token.symbol, upper_bound=upper_bound, session=session
            ).deposited,
        )
        for royalty_token in royalty_tokens
    ]

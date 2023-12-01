from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database import models
from apiserver.routers import commune, royalty_payment_pools, royalty_exchanges

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
    except exc.MultipleResultsFound:
        raise HTTPException(
            status_code=500,
            detail="Multiple Royalty Token Found",
        )

    return royalty_token.contract_address


@router.get("/public")
def fetch_public(
    *, session: Session = Depends(get_session)
) -> List[commune.PublicRoyaltyToken]:
    upper_bound = datetime.now()

    statement = select(models.RoyaltyToken).where(
        (models.RoyaltyExchange.royalty_token_symbol == models.RoyaltyToken.symbol)
    )
    results = session.exec(statement)

    royalty_tokens = results.all()

    return [
        commune.PublicRoyaltyToken(
            symbol=royalty_token.symbol,
            price=royalty_exchanges.get_price(royalty_token.symbol, session=session),
            deposited_royalty_income=royalty_payment_pools.get_royalty_income(
                royalty_token.symbol, upper_bound=upper_bound, session=session
            ).deposited,
        )
        for royalty_token in royalty_tokens
    ]


@router.get("/private")
def fetch_private(
    *, session: Session = Depends(get_session)
) -> List[commune.PrivateRoyaltyToken]:
    upper_bound = datetime.now()

    statement = select(models.RoyaltyToken).where(
        (models.RoyaltyExchange.royalty_token_symbol != models.RoyaltyToken.symbol)
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

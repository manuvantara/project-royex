from typing import Dict, List

from time import time
import numpy as np

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    InitialRoyaltyOffering,
    RoyaltyExchange,
    RoyaltyTokenBoughtEvent,
    RoyaltyTokenSoldEvent,
    RoyaltyPoolDepositedEvent,
    RoyaltyPaymentPool
)

from apiserver.routers.commune import (
    ValueIndicator,
    RoyaltyToken,
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

def get_royalty_token(session: Session, is_live: bool) -> List[RoyaltyToken]:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)

    statement = None
    if is_live:
        statement = select(InitialRoyaltyOffering).where(
            InitialRoyaltyOffering.offering_date <= current_timestamp
        )
    else:
        statement = select(InitialRoyaltyOffering).where(
            InitialRoyaltyOffering.offering_date > current_timestamp
        )

    initial_royalty_offerings = session.exec(statement).all()
    if len(initial_royalty_offerings) == 0:
        raise HTTPException(
            status_code=404,
            detail="Initial Royalty Offerings Not Found",
        )
    
    royalty_symbols: List[str] = tuple(set([initial_royalty_offering.royalty_token_symbol for initial_royalty_offering in initial_royalty_offerings]))
    royalty_prices: Dict[str, List] = dict(zip(royalty_symbols, [[] for _ in range(len(royalty_symbols))]))
    deposits: Dict[str, List] = dict(zip(royalty_symbols, [[] for _ in range(len(royalty_symbols))]))

    for hour in hour_timestamps:
        for royalty_symbol in royalty_symbols:
            statement = select(RoyaltyExchange).where(
                RoyaltyExchange.royalty_token_symbol == royalty_symbol,
            )
            royalty_exchange = session.exec(statement).one()
            if royalty_exchange.contract_address is None:
                raise HTTPException(
                    status_code=404,
                    detail="Royalty Exchange Not Found",
                )

            statement = select(RoyaltyPaymentPool).where(
                RoyaltyPaymentPool.royalty_token_symbol == royalty_symbol
            )
            royalty_payment_pool = session.exec(statement).one()
            if royalty_payment_pool.contract_address is None:
                raise HTTPException(
                    status_code=404,
                    detail="Royalty Payment Pool Not Found",
                )

            statement = select(RoyaltyTokenSoldEvent).where(
                RoyaltyTokenSoldEvent.contract_address == royalty_exchange.contract_address,
                RoyaltyTokenSoldEvent.block_timestamp <= int(hour)
            ).order_by(RoyaltyTokenSoldEvent.block_timestamp.desc())
            royalty_token_sold_event = session.exec(statement).first()
            if royalty_token_sold_event == None:
                raise HTTPException(
                    status_code=404,
                    detail="Royalty Token Sold Event Not Found",
                )

            statement = select(RoyaltyTokenBoughtEvent).where(
                RoyaltyTokenBoughtEvent.contract_address == royalty_exchange.contract_address,
                RoyaltyTokenBoughtEvent.block_timestamp <= int(hour)
            ).order_by(RoyaltyTokenBoughtEvent.block_timestamp.desc())
            royalty_token_bought_event = session.exec(statement).first()
            if royalty_token_bought_event == None:
                raise HTTPException(
                    status_code=404,
                    detail="Royalty Token Bought Event Not Found",
                )

            statement = select(RoyaltyPoolDepositedEvent).where(
                RoyaltyPoolDepositedEvent.contract_address == royalty_payment_pool.contract_address,
                RoyaltyPoolDepositedEvent.block_timestamp <= int(hour)
            )
            royalty_pool_deposited_events = session.exec(statement).all()

            transaction = royalty_token_sold_event if royalty_token_sold_event.block_timestamp > royalty_token_bought_event.block_timestamp else royalty_token_bought_event
            deposit = sum([deposit.deposit for deposit in royalty_pool_deposited_events])

            royalty_prices[royalty_symbol].append(transaction.royalty_token_amount / transaction.stablecoin_amount)
            deposits[royalty_symbol].append(deposit)

    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0],
                    value=royalty_prices[royalty_symbol][0],
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i],
                        value=royalty_prices[royalty_symbol][i],
                    )
                    for i in range(len(royalty_prices[royalty_symbol]))
                ]
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0],
                    value=deposits[royalty_symbol][0],
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i],
                        value=deposits[royalty_symbol][i],
                    )
                    for i in range(len(deposits[royalty_symbol]))
                ]
            )
        )
        for royalty_symbol in royalty_symbols
    ]

@router.get("/live")
def fetch_live(
    *,
    session: Session = Depends(get_session)
) -> List[RoyaltyToken]:
    return get_royalty_token(session, is_live=True)


@router.get("/upcoming")
def fetch_upcoming(
    *,
    session: Session = Depends(get_session)
) -> List[RoyaltyToken]:
    return get_royalty_token(session, is_live=False)
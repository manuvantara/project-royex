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
    RoyaltyPaymentPool,
    RoyaltyPoolDepositedEvent,
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
def get_royalty_income(royalty_token_symbol: str, session: Session = Depends(get_session)) -> GetRoyaltyIncomeResponse:
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_deposits = np.array([])

    statement = select(RoyaltyPaymentPool.contract_address).where(
        RoyaltyPaymentPool.royalty_token_symbol == royalty_token_symbol
    )
    royalty_pool_contract = session.exec(statement).one()
    if royalty_pool_contract is None:
        raise HTTPException(
            status_code=404,
            detail="Royalty Payment Pool Not Found",
        )

    for hour in hour_timestamps:
        statement = select(RoyaltyPoolDepositedEvent.block_timestamp,
                           RoyaltyPoolDepositedEvent.deposit).where(
            RoyaltyPoolDepositedEvent.contract_address == royalty_pool_contract,
            RoyaltyPoolDepositedEvent.block_timestamp <= int(hour)
        ).order_by(RoyaltyPoolDepositedEvent.block_timestamp.desc())

        deposits = session.exec(statement).all()

        if len(deposits) > 0:
            deposit_amounts = [d.deposit for d in deposits]
            hour_deposits = np.append(hour_deposits, sum(deposit_amounts))
        else:
            hour_deposits = np.append(hour_deposits, 0)

    return GetRoyaltyIncomeResponse(
        reported=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=0, value=0),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700177341, value=0),
                TimeSeriesDataPoint(timestamp=1700178341, value=0),
                TimeSeriesDataPoint(timestamp=1700187341, value=0),
            ],
        ),
        deposited=ValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=hour_deposits[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=hour_timestamps[i], value=hour_deposits[i]
                )
                for i in range(1, len(hour_deposits))
            ],
        )
    )


@router.get("/{royalty_token_symbol}/deposits")
def fetch_deposits(royalty_token_symbol: str, session: Session = Depends(get_session)) -> List[Deposit]:
    statement = select(RoyaltyPaymentPool.contract_address).where(
        RoyaltyPaymentPool.royalty_token_symbol == royalty_token_symbol
    )

    royalty_pool_contract = session.exec(statement).one()
    if royalty_pool_contract is None:
        raise HTTPException(
            status_code=404,
            detail="Royalty Payment Pool Not Found",
        )

    statement = select(RoyaltyPoolDepositedEvent).where(
        RoyaltyPoolDepositedEvent.contract_address == royalty_pool_contract
    ).order_by(RoyaltyPoolDepositedEvent.block_timestamp.desc())

    deposits = session.exec(statement)

    return [
        Deposit(
            distributor=d.sender,
            checkpoint_key=d.block_timestamp,
            amount=d.deposit,
        )
        for d in deposits
    ]

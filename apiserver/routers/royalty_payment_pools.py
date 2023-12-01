from datetime import datetime, timedelta
from typing import List, cast

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    RoyaltyPaymentPool,
    RoyaltyPoolDepositedEvent,
)
from apiserver.routers.commune import (
    TimeSeriesDataPoint,
    BaseValueIndicator,
    GetRoyaltyIncomeResponse,
    fetch_events,
    generate_bar_chart,
    Deposit,
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    royalty_token_symbol: str, *, session: Session = Depends(get_session)
) -> str:  # address
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
    except exc.MultipleResultsFound:
        raise HTTPException(
            status_code=500,
            detail="Multiple Royalty Payment Pool Found",
        )

    return royalty_token.contract_address


# TODO: Split into two endpoints (reported and deposited)
@router.get("/{royalty_token_symbol}/royalty-income")
def get_royalty_income(
    royalty_token_symbol: str,
    *,
    upper_bound: datetime = datetime.now(),
    session: Session = Depends(get_session)
) -> GetRoyaltyIncomeResponse:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    lower_bound = upper_bound.replace(minute=0, second=0) - timedelta(hours=23)

    events = fetch_events(
        contract_address=contract_address,
        lower_bound=lower_bound,
        upper_bound=upper_bound,
        session=session,
        Event=RoyaltyPoolDepositedEvent,
    )
    events = cast(List[RoyaltyPoolDepositedEvent], events)

    recent_values_dataset = generate_bar_chart(
        events=events,
        target="deposit",
        lower_bound=lower_bound,
        upper_bound=upper_bound,
    )

    return GetRoyaltyIncomeResponse(
        reported=BaseValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=recent_values_dataset[-1].timestamp,
                value=str(0),
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=recent_values_dataset[i].timestamp,
                    value=str(0),
                )
                for i in range(24)
            ],
        ),
        deposited=BaseValueIndicator(
            current=recent_values_dataset[-1],
            recent_values_dataset=recent_values_dataset,
        ),
    )


@router.get("/{royalty_token_symbol}/deposits")
def fetch_deposits(
    royalty_token_symbol: str, *, session: Session = Depends(get_session)
) -> List[Deposit]:
    contract_address = get_contract_address(
        royalty_token_symbol=royalty_token_symbol, session=session
    )

    statement = select(RoyaltyPoolDepositedEvent).where(
        (RoyaltyPoolDepositedEvent.contract_address == contract_address)
    )
    results = session.exec(statement)

    deposits = results.all()

    return [
        Deposit(
            distributor=deposit.sender,
            checkpoint_key=deposit.block_timestamp,
            amount=deposit.deposit,
        )
        for deposit in deposits
    ]

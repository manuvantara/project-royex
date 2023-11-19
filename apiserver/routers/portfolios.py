from typing import Dict, List

from time import time
import numpy as np

from fastapi import APIRouter, Depends
from requests import Session

from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    OtcMarketOfferAcceptedEvent,
    RoyaltyExchange,
    RoyaltyTokenBoughtEvent,
    RoyaltyTokenSoldEvent,
    RoyaltyPaymentPool,
    RoyaltyPoolDepositedEvent,
    InitialRoyaltyOffering,
    RoyaltyToken as RoyaltyTokenModel,
)

from apiserver.routers.commune import (
    GetEstimatedPortfolioValue,
    GetRoyaltyIncomeResponse,
    RoyaltyToken,
    ValueIndicator,
    TimeSeriesDataPoint,
    RoyaltySum,
)


router = APIRouter()

def get_stakeholder_royalties(stakeholder_address: str, hour_timestamps: np.ndarray, session: Session) -> List:
    royalties: Dict[str, RoyaltySum] = {}
    otc_royalties: Dict[str, RoyaltySum] = {}

    exchange_values = np.array([])
    otc_values = np.array([])

    for hour in hour_timestamps:
        statement = select(OtcMarketOfferAcceptedEvent).where(
            OtcMarketOfferAcceptedEvent.buyer == stakeholder_address,
            OtcMarketOfferAcceptedEvent.block_timestamp <= int(hour),
        ).order_by(OtcMarketOfferAcceptedEvent.block_timestamp)
        offers_accepted = session.exec(statement).all()

        statement = select(OtcMarketOfferAcceptedEvent).where(
            OtcMarketOfferAcceptedEvent.seller == stakeholder_address,
            OtcMarketOfferAcceptedEvent.block_timestamp <= int(hour),
        ).order_by(OtcMarketOfferAcceptedEvent.block_timestamp)
        offers_sold = session.exec(statement).all()

        offers = offers_accepted + offers_sold
        offers = sorted(offers, key=lambda x: x.block_timestamp)

        statement = select(RoyaltyTokenBoughtEvent).where(
            RoyaltyTokenBoughtEvent.trader == stakeholder_address,
            RoyaltyTokenBoughtEvent.block_timestamp <= int(hour),
        ).order_by(RoyaltyTokenBoughtEvent.block_timestamp)
        royalties_bought = session.exec(statement).all()

        statement = select(RoyaltyTokenSoldEvent).where(
            RoyaltyTokenSoldEvent.trader == stakeholder_address,
            RoyaltyTokenSoldEvent.block_timestamp <= int(hour),
        ).order_by(RoyaltyTokenSoldEvent.block_timestamp)
        royalties_sold = session.exec(statement).all()

        royalties_transfered = royalties_bought + royalties_sold
        royalties_transfered = sorted(royalties_transfered, key=lambda x: x.block_timestamp)
        
        for royalty in royalties_transfered:
            statement = select(RoyaltyExchange).where(
                RoyaltyExchange.contract_address == royalty.contract_address
            )
            royalty_exchange = session.exec(statement).one()

            change = royalty.royalty_token_amount if isinstance(royalty, RoyaltyTokenBoughtEvent) else -royalty.royalty_token_amount
            current_sum = royalties.get(royalty_exchange.royalty_token_symbol, 0)

            royalties[royalty_exchange.royalty_token_symbol] = RoyaltySum(
                count = current_sum.count + change if current_sum else change,
                price = royalty.royalty_token_amount / royalty.stablecoin_amount,
                timestamp = royalty.block_timestamp
            )

        exchange_incomes = np.array([r.price * r.count for r in royalties.values()])
        otc_incomes = np.array([r.price * r.count for r in otc_royalties.values()])

        exchange_values = np.append(exchange_values, np.sum(exchange_incomes))
        otc_values = np.append(otc_values, np.sum(otc_incomes))

    return [exchange_values, otc_values, royalties, otc_royalties]

@router.get("/{stakeholder_address}/estimated-value")
def get_estimated_portfolio_value(
    stakeholder_address: str,
    session: Session = Depends(get_session),
) -> GetEstimatedPortfolioValue:  # address
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    
    exchange_values, otc_values = get_stakeholder_royalties(stakeholder_address, hour_timestamps, session)

    return GetEstimatedPortfolioValue(
        on_otc_market=ValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=otc_values[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=hour_timestamps[i], value=otc_values[i]
                )
                for i in range(1, len(otc_values))
            ],
        ),
        at_royalty_exchange=ValueIndicator(
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=exchange_values[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=hour_timestamps[i], value=exchange_values[i]
                )
                for i in range(1, len(exchange_values))
            ],
        )
    )


@router.get("/{stakeholder_address}/royalty-income")
def calculate_royalty_income(
    stakeholder_address: str,
    session: Session = Depends(get_session),
) -> GetRoyaltyIncomeResponse:  # address
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)
    hour_incomes = np.array([])

    exchange_values, otc_values, royalties, otc_royalties = get_stakeholder_royalties(stakeholder_address, hour_timestamps, session)
    royalty_symbols = tuple(set(dict(otc_royalties, **royalties).keys()))

    for hour in hour_timestamps:
        royalty_income = 0

        for royalty_symbol in royalty_symbols:
            statement = select(RoyaltyPaymentPool).where(
                RoyaltyPaymentPool.royalty_token_symbol == royalty_symbol
            )
            royalty_pool = session.exec(statement).one()

            statement = select(RoyaltyPoolDepositedEvent).where(
                RoyaltyPoolDepositedEvent.contract_address == royalty_pool.contract_address,
                RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
            )
            deposits = session.exec(statement).all()

            for deposit in deposits:
                royalty_income += deposit.deposit

        hour_incomes = np.append(hour_incomes, royalty_income)

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
            current=TimeSeriesDataPoint(
                timestamp=hour_timestamps[0], value=hour_incomes[0]
            ),
            recent_values_dataset=[
                TimeSeriesDataPoint(
                    timestamp=hour_timestamps[i], value=hour_incomes[i]
                )
                for i in range(1, len(hour_incomes))
            ],
        ),
    )


@router.get("/{stakeholder_address}/public-royalty-tokens")
def fetch_public_royalty_tokens(
    stakeholder_address: str,
    session: Session = Depends(get_session),
) -> List[RoyaltyToken]:  # address
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)

    exchange_values, otc_values, royalties, otc_royalties = get_stakeholder_royalties(stakeholder_address, hour_timestamps, session)
    deposited_values = np.array([])
    
    offerings = session.exec(select(InitialRoyaltyOffering.royalty_token_symbol)).all()
    royalty_symbols = tuple(set(dict(otc_royalties, **royalties).keys()))

    for hour in hour_timestamps:
        statement = select(RoyaltyPaymentPool).where(
            RoyaltyPaymentPool.royalty_token_symbol.in_(royalty_symbols)
        )
        royalty_pools = session.exec(statement).all()

        for royalty_pool in royalty_pools:
            statement = select(RoyaltyPoolDepositedEvent.deposit).where(
                RoyaltyPoolDepositedEvent.contract_address == royalty_pool.contract_address,
                RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
            )
            deposits = session.exec(statement).all()
            deposit_sum = sum([deposit for deposit in deposits])

            deposited_values = np.append(deposited_values, deposit_sum)

    royalty_tokens = session.exec(select(RoyaltyTokenModel)).all()
    print('-'*75)
    print(royalty_tokens)
    print(offerings)
    print(royalty_symbols)

    return [
        RoyaltyToken(
            royalty_token_symbol=token.symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0], value=exchange_values[0]
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i], value=exchange_values[i]
                    )
                    for i in range(1, len(exchange_values))
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0], value=royalties[token.symbol].count * royalties[token.symbol].price
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i], value=deposited_values[i]
                    )
                    for i in range(1, len(deposited_values))
                ]
            )
        )
        for token in royalty_tokens
        if token.symbol in royalty_symbols
        and token.symbol not in offerings
    ]


@router.get("/{stakeholder_address}/private-royalty-tokens")
def fetch_private_royalty_tokens(
    stakeholder_address: str,
    session: Session = Depends(get_session),
) -> List[RoyaltyToken]:  # address
    current_timestamp = int(time())
    hour_timestamps = np.arange(current_timestamp, current_timestamp - 24 * 3600, -3600)

    exchange_values, otc_values, royalties, otc_royalties = get_stakeholder_royalties(stakeholder_address, hour_timestamps, session)
    deposited_values = np.array([])
    
    offerings = session.exec(select(InitialRoyaltyOffering.royalty_token_symbol)).all()
    royalty_symbols = tuple(set(dict(otc_royalties, **royalties).keys()))

    for hour in hour_timestamps:
        statement = select(RoyaltyPaymentPool).where(
            RoyaltyPaymentPool.royalty_token_symbol.in_(royalty_symbols)
        )
        royalty_pools = session.exec(statement).all()

        for royalty_pool in royalty_pools:
            statement = select(RoyaltyPoolDepositedEvent.deposit).where(
                RoyaltyPoolDepositedEvent.contract_address == royalty_pool.contract_address,
                RoyaltyPoolDepositedEvent.block_timestamp <= int(hour),
            )
            deposits = session.exec(statement).all()
            deposit_sum = sum([deposit for deposit in deposits])

            deposited_values = np.append(deposited_values, deposit_sum)

    royalty_tokens = session.exec(select(RoyaltyTokenModel)).all()
    print('-'*75)
    print(royalty_tokens)
    print(offerings)
    print(royalty_symbols)

    return [
        RoyaltyToken(
            royalty_token_symbol=token.symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0], value=exchange_values[0]
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i], value=exchange_values[i]
                    )
                    for i in range(1, len(exchange_values))
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(
                    timestamp=hour_timestamps[0], value=royalties[token.symbol].count * royalties[token.symbol].price
                ),
                recent_values_dataset=[
                    TimeSeriesDataPoint(
                        timestamp=hour_timestamps[i], value=deposited_values[i]
                    )
                    for i in range(1, len(deposited_values))
                ]
            )
        )
        for token in royalty_tokens
        if token.symbol in royalty_symbols
        and token.symbol in offerings
    ]
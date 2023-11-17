from typing import List
from apiserver.routers.commune import (
    GetEstimatedPortfolioValue,
    GetRoyaltyIncomeResponse,
    ValueIndicator,
    TimeSeriesDataPoint,
    RoyaltyToken,
)
from fastapi import APIRouter

router = APIRouter()


@router.get("/{stakeholder_address}/estimated-value")
def get_estimated_portfolio_value(
    stakeholder_address: str,
) -> GetEstimatedPortfolioValue:  # address
    return GetEstimatedPortfolioValue(
        on_otc_market=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=0.6),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=0.5),
                TimeSeriesDataPoint(timestamp=1700245496, value=0.5),
                TimeSeriesDataPoint(timestamp=1700241896, value=0.5),
                TimeSeriesDataPoint(timestamp=1700238296, value=0.5),
                TimeSeriesDataPoint(timestamp=1700234696, value=0.5),
                TimeSeriesDataPoint(timestamp=1700231096, value=0.75),
                TimeSeriesDataPoint(timestamp=1700227496, value=0.76),
                TimeSeriesDataPoint(timestamp=1700223896, value=0.74),
                TimeSeriesDataPoint(timestamp=1700220296, value=0.73),
                TimeSeriesDataPoint(timestamp=1700216696, value=0.70),
                TimeSeriesDataPoint(timestamp=1700213096, value=0.68),
                TimeSeriesDataPoint(timestamp=1700209496, value=1),
                TimeSeriesDataPoint(timestamp=1700205896, value=1),
                TimeSeriesDataPoint(timestamp=1700202296, value=1.1),
                TimeSeriesDataPoint(timestamp=1700198696, value=1),
                TimeSeriesDataPoint(timestamp=1700195096, value=1),
                TimeSeriesDataPoint(timestamp=1700191496, value=1.2),
                TimeSeriesDataPoint(timestamp=1700187896, value=1),
                TimeSeriesDataPoint(timestamp=1700184296, value=1),
                TimeSeriesDataPoint(timestamp=1700180696, value=1.23),
                TimeSeriesDataPoint(timestamp=1700177096, value=1.54),
                TimeSeriesDataPoint(timestamp=1700173496, value=1.78),
                TimeSeriesDataPoint(timestamp=1700169896, value=2.05),
            ],
        ),
        at_royalty_exchange=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=0.63),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=0.55),
                TimeSeriesDataPoint(timestamp=1700245496, value=0.5),
                TimeSeriesDataPoint(timestamp=1700241896, value=0.48),
                TimeSeriesDataPoint(timestamp=1700238296, value=0.5),
                TimeSeriesDataPoint(timestamp=1700234696, value=0.65),
                TimeSeriesDataPoint(timestamp=1700231096, value=0.77),
                TimeSeriesDataPoint(timestamp=1700227496, value=0.73),
                TimeSeriesDataPoint(timestamp=1700223896, value=0.74),
                TimeSeriesDataPoint(timestamp=1700220296, value=0.73),
                TimeSeriesDataPoint(timestamp=1700216696, value=0.75),
                TimeSeriesDataPoint(timestamp=1700213096, value=0.67),
                TimeSeriesDataPoint(timestamp=1700209496, value=1),
                TimeSeriesDataPoint(timestamp=1700205896, value=1),
                TimeSeriesDataPoint(timestamp=1700202296, value=1.1),
                TimeSeriesDataPoint(timestamp=1700198696, value=0.9),
                TimeSeriesDataPoint(timestamp=1700195096, value=0.8),
                TimeSeriesDataPoint(timestamp=1700191496, value=1.2),
                TimeSeriesDataPoint(timestamp=1700187896, value=1.1),
                TimeSeriesDataPoint(timestamp=1700184296, value=1.2),
                TimeSeriesDataPoint(timestamp=1700180696, value=1.23),
                TimeSeriesDataPoint(timestamp=1700177096, value=1.25),
                TimeSeriesDataPoint(timestamp=1700173496, value=1.75),
                TimeSeriesDataPoint(timestamp=1700169896, value=2.08),
            ],
        ),
    )


@router.get("/{stakeholder_address}/royalty-income")
def calculate_royalty_income(
    stakeholder_address: str,
) -> GetRoyaltyIncomeResponse:  # address
    return GetRoyaltyIncomeResponse(
        reported=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=19000),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=15000),
                TimeSeriesDataPoint(timestamp=1700245496, value=17000),
                TimeSeriesDataPoint(timestamp=1700241896, value=16000),
                TimeSeriesDataPoint(timestamp=1700238296, value=23000),
                TimeSeriesDataPoint(timestamp=1700234696, value=35000),
                TimeSeriesDataPoint(timestamp=1700231096, value=8500),
                TimeSeriesDataPoint(timestamp=1700227496, value=44000),
                TimeSeriesDataPoint(timestamp=1700223896, value=45000),
                TimeSeriesDataPoint(timestamp=1700220296, value=52000),
                TimeSeriesDataPoint(timestamp=1700216696, value=17500),
                TimeSeriesDataPoint(timestamp=1700213096, value=20000),
                TimeSeriesDataPoint(timestamp=1700209496, value=17000),
                TimeSeriesDataPoint(timestamp=1700205896, value=21000),
                TimeSeriesDataPoint(timestamp=1700202296, value=19000),
                TimeSeriesDataPoint(timestamp=1700198696, value=18000),
                TimeSeriesDataPoint(timestamp=1700195096, value=15500),
                TimeSeriesDataPoint(timestamp=1700191496, value=14500),
                TimeSeriesDataPoint(timestamp=1700187896, value=11500),
                TimeSeriesDataPoint(timestamp=1700184296, value=65500),
                TimeSeriesDataPoint(timestamp=1700180696, value=54500),
                TimeSeriesDataPoint(timestamp=1700177096, value=36000),
                TimeSeriesDataPoint(timestamp=1700173496, value=22300),
                TimeSeriesDataPoint(timestamp=1700169896, value=46800),
            ],
        ),
        deposited=ValueIndicator(
            current=TimeSeriesDataPoint(timestamp=1700252696, value=18500),
            recent_values_dataset=[
                TimeSeriesDataPoint(timestamp=1700249096, value=14000),
                TimeSeriesDataPoint(timestamp=1700245496, value=16000),
                TimeSeriesDataPoint(timestamp=1700241896, value=17000),
                TimeSeriesDataPoint(timestamp=1700238296, value=24000),
                TimeSeriesDataPoint(timestamp=1700234696, value=32000),
                TimeSeriesDataPoint(timestamp=1700231096, value=9000),
                TimeSeriesDataPoint(timestamp=1700227496, value=45000),
                TimeSeriesDataPoint(timestamp=1700223896, value=46000),
                TimeSeriesDataPoint(timestamp=1700220296, value=51000),
                TimeSeriesDataPoint(timestamp=1700216696, value=18500),
                TimeSeriesDataPoint(timestamp=1700213096, value=19000),
                TimeSeriesDataPoint(timestamp=1700209496, value=18000),
                TimeSeriesDataPoint(timestamp=1700205896, value=19000),
                TimeSeriesDataPoint(timestamp=1700202296, value=18000),
                TimeSeriesDataPoint(timestamp=1700198696, value=17000),
                TimeSeriesDataPoint(timestamp=1700195096, value=15000),
                TimeSeriesDataPoint(timestamp=1700191496, value=13000),
                TimeSeriesDataPoint(timestamp=1700187896, value=12000),
                TimeSeriesDataPoint(timestamp=1700184296, value=66000),
                TimeSeriesDataPoint(timestamp=1700180696, value=55000),
                TimeSeriesDataPoint(timestamp=1700177096, value=35000),
                TimeSeriesDataPoint(timestamp=1700173496, value=20000),
                TimeSeriesDataPoint(timestamp=1700169896, value=45000),
            ],
        )
    )


@router.get("/{stakeholder_address}/public-royalty-tokens")
def fetch_public_royalty_tokens(
    stakeholder_address: str,
) -> List[RoyaltyToken]:  # address
    return [
        RoyaltyToken(
            royalty_token_symbol="RT-00000001",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=0.64),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=0.58),
                    TimeSeriesDataPoint(timestamp=1700245496, value=0.51),
                    TimeSeriesDataPoint(timestamp=1700241896, value=0.49),
                    TimeSeriesDataPoint(timestamp=1700238296, value=0.51),
                    TimeSeriesDataPoint(timestamp=1700234696, value=0.67),
                    TimeSeriesDataPoint(timestamp=1700231096, value=0.78),
                    TimeSeriesDataPoint(timestamp=1700227496, value=0.71),
                    TimeSeriesDataPoint(timestamp=1700223896, value=0.76),
                    TimeSeriesDataPoint(timestamp=1700220296, value=0.73),
                    TimeSeriesDataPoint(timestamp=1700216696, value=0.74),
                    TimeSeriesDataPoint(timestamp=1700213096, value=0.76),
                    TimeSeriesDataPoint(timestamp=1700209496, value=1),
                    TimeSeriesDataPoint(timestamp=1700205896, value=1.1),
                    TimeSeriesDataPoint(timestamp=1700202296, value=1.12),
                    TimeSeriesDataPoint(timestamp=1700198696, value=0.91),
                    TimeSeriesDataPoint(timestamp=1700195096, value=0.85),
                    TimeSeriesDataPoint(timestamp=1700191496, value=1.25),
                    TimeSeriesDataPoint(timestamp=1700187896, value=1.15),
                    TimeSeriesDataPoint(timestamp=1700184296, value=1.2),
                    TimeSeriesDataPoint(timestamp=1700180696, value=1.33),
                    TimeSeriesDataPoint(timestamp=1700177096, value=1.35),
                    TimeSeriesDataPoint(timestamp=1700173496, value=1.65),
                    TimeSeriesDataPoint(timestamp=1700169896, value=1.08),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=100),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=101),
                    TimeSeriesDataPoint(timestamp=1700245496, value=95),
                    TimeSeriesDataPoint(timestamp=1700241896, value=98),
                    TimeSeriesDataPoint(timestamp=1700238296, value=123),
                    TimeSeriesDataPoint(timestamp=1700234696, value=112),
                    TimeSeriesDataPoint(timestamp=1700231096, value=109),
                    TimeSeriesDataPoint(timestamp=1700227496, value=107),
                    TimeSeriesDataPoint(timestamp=1700223896, value=105),
                    TimeSeriesDataPoint(timestamp=1700220296, value=163),
                    TimeSeriesDataPoint(timestamp=1700216696, value=155),
                    TimeSeriesDataPoint(timestamp=1700213096, value=145),
                    TimeSeriesDataPoint(timestamp=1700209496, value=125),
                    TimeSeriesDataPoint(timestamp=1700205896, value=130),
                    TimeSeriesDataPoint(timestamp=1700202296, value=132),
                    TimeSeriesDataPoint(timestamp=1700198696, value=131),
                    TimeSeriesDataPoint(timestamp=1700195096, value=126),
                    TimeSeriesDataPoint(timestamp=1700191496, value=179),
                    TimeSeriesDataPoint(timestamp=1700187896, value=187),
                    TimeSeriesDataPoint(timestamp=1700184296, value=132),
                    TimeSeriesDataPoint(timestamp=1700180696, value=133),
                    TimeSeriesDataPoint(timestamp=1700177096, value=134),
                    TimeSeriesDataPoint(timestamp=1700173496, value=125),
                    TimeSeriesDataPoint(timestamp=1700169896, value=110),
                ],
            )
        )
    ]


@router.get("/{stakeholder_address}/private-royalty-tokens")
def fetch_private_royalty_tokens(
    stakeholder_address: str,
) -> List[RoyaltyToken]:  # address
    return [
        RoyaltyToken(
            royalty_token_symbol="RT-00000002",
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=0.73),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=0.64),
                    TimeSeriesDataPoint(timestamp=1700245496, value=0.45),
                    TimeSeriesDataPoint(timestamp=1700241896, value=0.41),
                    TimeSeriesDataPoint(timestamp=1700238296, value=0.41),
                    TimeSeriesDataPoint(timestamp=1700234696, value=0.57),
                    TimeSeriesDataPoint(timestamp=1700231096, value=0.59),
                    TimeSeriesDataPoint(timestamp=1700227496, value=0.56),
                    TimeSeriesDataPoint(timestamp=1700223896, value=0.61),
                    TimeSeriesDataPoint(timestamp=1700220296, value=0.62),
                    TimeSeriesDataPoint(timestamp=1700216696, value=0.64),
                    TimeSeriesDataPoint(timestamp=1700213096, value=0.76),
                    TimeSeriesDataPoint(timestamp=1700209496, value=1),
                    TimeSeriesDataPoint(timestamp=1700205896, value=1.1),
                    TimeSeriesDataPoint(timestamp=1700202296, value=1.13),
                    TimeSeriesDataPoint(timestamp=1700198696, value=0.94),
                    TimeSeriesDataPoint(timestamp=1700195096, value=0.89),
                    TimeSeriesDataPoint(timestamp=1700191496, value=1.23),
                    TimeSeriesDataPoint(timestamp=1700187896, value=1.25),
                    TimeSeriesDataPoint(timestamp=1700184296, value=1.2),
                    TimeSeriesDataPoint(timestamp=1700180696, value=1.34),
                    TimeSeriesDataPoint(timestamp=1700177096, value=1.39),
                    TimeSeriesDataPoint(timestamp=1700173496, value=1.56),
                    TimeSeriesDataPoint(timestamp=1700169896, value=1.03),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=11),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=10),
                    TimeSeriesDataPoint(timestamp=1700245496, value=9),
                    TimeSeriesDataPoint(timestamp=1700241896, value=9),
                    TimeSeriesDataPoint(timestamp=1700238296, value=12),
                    TimeSeriesDataPoint(timestamp=1700234696, value=11),
                    TimeSeriesDataPoint(timestamp=1700231096, value=10),
                    TimeSeriesDataPoint(timestamp=1700227496, value=10),
                    TimeSeriesDataPoint(timestamp=1700223896, value=10),
                    TimeSeriesDataPoint(timestamp=1700220296, value=16),
                    TimeSeriesDataPoint(timestamp=1700216696, value=15),
                    TimeSeriesDataPoint(timestamp=1700213096, value=14),
                    TimeSeriesDataPoint(timestamp=1700209496, value=12),
                    TimeSeriesDataPoint(timestamp=1700205896, value=13),
                    TimeSeriesDataPoint(timestamp=1700202296, value=13),
                    TimeSeriesDataPoint(timestamp=1700198696, value=13),
                    TimeSeriesDataPoint(timestamp=1700195096, value=15),
                    TimeSeriesDataPoint(timestamp=1700191496, value=17),
                    TimeSeriesDataPoint(timestamp=1700187896, value=17),
                    TimeSeriesDataPoint(timestamp=1700184296, value=12),
                    TimeSeriesDataPoint(timestamp=1700180696, value=13),
                    TimeSeriesDataPoint(timestamp=1700177096, value=14),
                    TimeSeriesDataPoint(timestamp=1700173496, value=12),
                    TimeSeriesDataPoint(timestamp=1700169896, value=112),
                ],
            )
        )
    ]

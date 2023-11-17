from typing import List

from fastapi import APIRouter

from apiserver.routers.commune import ValueIndicator, RoyaltyToken, TimeSeriesDataPoint

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str:  # address
    return "0x7f702afFf34fF3976338C17fDE5D8D777cDB2185"


@router.get("/{royalty_token_symbol}/public")
def fetch_public(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=1.84),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=1.85),
                    TimeSeriesDataPoint(timestamp=1700245496, value=1.83),
                    TimeSeriesDataPoint(timestamp=1700241896, value=1.79),
                    TimeSeriesDataPoint(timestamp=1700238296, value=1.81),
                    TimeSeriesDataPoint(timestamp=1700234696, value=1.87),
                    TimeSeriesDataPoint(timestamp=1700231096, value=1.82),
                    TimeSeriesDataPoint(timestamp=1700227496, value=1.80),
                    TimeSeriesDataPoint(timestamp=1700223896, value=1.78),
                    TimeSeriesDataPoint(timestamp=1700220296, value=1.88),
                    TimeSeriesDataPoint(timestamp=1700216696, value=1.97),
                    TimeSeriesDataPoint(timestamp=1700213096, value=1.65),
                    TimeSeriesDataPoint(timestamp=1700209496, value=1.56),
                    TimeSeriesDataPoint(timestamp=1700205896, value=1.52),
                    TimeSeriesDataPoint(timestamp=1700202296, value=1.26),
                    TimeSeriesDataPoint(timestamp=1700198696, value=1.12),
                    TimeSeriesDataPoint(timestamp=1700195096, value=1.09),
                    TimeSeriesDataPoint(timestamp=1700191496, value=1.081),
                    TimeSeriesDataPoint(timestamp=1700187896, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700184296, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700180696, value=1.08),
                    TimeSeriesDataPoint(timestamp=1700177096, value=1.07),
                    TimeSeriesDataPoint(timestamp=1700173496, value=1.065),
                    TimeSeriesDataPoint(timestamp=1700169896, value=1.05),
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
            ),
        )
    ]


@router.get("/{royalty_token_symbol}/private")
def fetch_private(royalty_token_symbol: str) -> List[RoyaltyToken]:
    return [
        RoyaltyToken(
            royalty_token_symbol=royalty_token_symbol,
            price=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=1.87),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=1.58),
                    TimeSeriesDataPoint(timestamp=1700245496, value=1.57),
                    TimeSeriesDataPoint(timestamp=1700241896, value=1.55),
                    TimeSeriesDataPoint(timestamp=1700238296, value=1.45),
                    TimeSeriesDataPoint(timestamp=1700234696, value=1.41),
                    TimeSeriesDataPoint(timestamp=1700231096, value=1.38),
                    TimeSeriesDataPoint(timestamp=1700227496, value=1.42),
                    TimeSeriesDataPoint(timestamp=1700223896, value=1.57),
                    TimeSeriesDataPoint(timestamp=1700220296, value=1.87),
                    TimeSeriesDataPoint(timestamp=1700216696, value=1.91),
                    TimeSeriesDataPoint(timestamp=1700213096, value=1.56),
                    TimeSeriesDataPoint(timestamp=1700209496, value=1.32),
                    TimeSeriesDataPoint(timestamp=1700205896, value=1.35),
                    TimeSeriesDataPoint(timestamp=1700202296, value=1.38),
                    TimeSeriesDataPoint(timestamp=1700198696, value=1.41),
                    TimeSeriesDataPoint(timestamp=1700195096, value=1.44),
                    TimeSeriesDataPoint(timestamp=1700191496, value=1.43),
                    TimeSeriesDataPoint(timestamp=1700187896, value=1.41),
                    TimeSeriesDataPoint(timestamp=1700184296, value=1.37),
                    TimeSeriesDataPoint(timestamp=1700180696, value=1.34),
                    TimeSeriesDataPoint(timestamp=1700177096, value=1.31),
                    TimeSeriesDataPoint(timestamp=1700173496, value=1.26),
                    TimeSeriesDataPoint(timestamp=1700169896, value=1.24),
                ],
            ),
            deposited_royalty_income=ValueIndicator(
                current=TimeSeriesDataPoint(timestamp=1700252696, value=120),
                recent_values_dataset=[
                    TimeSeriesDataPoint(timestamp=1700249096, value=110),
                    TimeSeriesDataPoint(timestamp=1700245496, value=98),
                    TimeSeriesDataPoint(timestamp=1700241896, value=85),
                    TimeSeriesDataPoint(timestamp=1700238296, value=132),
                    TimeSeriesDataPoint(timestamp=1700234696, value=121),
                    TimeSeriesDataPoint(timestamp=1700231096, value=115),
                    TimeSeriesDataPoint(timestamp=1700227496, value=132),
                    TimeSeriesDataPoint(timestamp=1700223896, value=122),
                    TimeSeriesDataPoint(timestamp=1700220296, value=163),
                    TimeSeriesDataPoint(timestamp=1700216696, value=155),
                    TimeSeriesDataPoint(timestamp=1700213096, value=154),
                    TimeSeriesDataPoint(timestamp=1700209496, value=152),
                    TimeSeriesDataPoint(timestamp=1700205896, value=103),
                    TimeSeriesDataPoint(timestamp=1700202296, value=132),
                    TimeSeriesDataPoint(timestamp=1700198696, value=131),
                    TimeSeriesDataPoint(timestamp=1700195096, value=126),
                    TimeSeriesDataPoint(timestamp=1700191496, value=179),
                    TimeSeriesDataPoint(timestamp=1700187896, value=187),
                    TimeSeriesDataPoint(timestamp=1700184296, value=123),
                    TimeSeriesDataPoint(timestamp=1700180696, value=133),
                    TimeSeriesDataPoint(timestamp=1700177096, value=134),
                    TimeSeriesDataPoint(timestamp=1700173496, value=152),
                    TimeSeriesDataPoint(timestamp=1700169896, value=104),
                ],
            ),
        )
    ]

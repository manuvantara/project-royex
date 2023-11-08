from apiserver.common import GetEstimatedPortfolioValue, GetRoyaltyIncomeResponse
from fastapi import APIRouter

router = APIRouter()


@router.get("/{stakeholder_addr}/estimated-value")
def get_estimated_portfolio_value(
    stakeholder_addr: str,
) -> GetEstimatedPortfolioValue:  # address
    pass


@router.get("/{stakeholder_addr}/royalty-income")
def calculate_royalty_income_per_portfolio(
    stakeholder_addr: str,
) -> GetRoyaltyIncomeResponse:  # address
    pass

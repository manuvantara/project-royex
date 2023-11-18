from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from requests import Session

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    StakeholderCollectiveProposal,
    StakeholderCollective
)

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> Optional[str]:
    statement = select(StakeholderCollective).where(
        StakeholderCollective.royalty_token_symbol == royalty_token_symbol
    )
    results = session.exec(statement)

    try:
        stakeholder_collective = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Stakeholder Collective Not Found",
        )

    return stakeholder_collective.contract_address


@router.get("/{royalty_token_symbol}/proposals")
def fetch_proposals(
    *, royalty_token_symbol: str, session: Session = Depends(get_session)
) -> List[StakeholderCollectiveProposal]:
    statement = select(StakeholderCollective).where(
        StakeholderCollective.royalty_token_symbol == royalty_token_symbol
    )
    stakeholder_collective = session.exec(statement).one()

    statement = select(StakeholderCollectiveProposal).where(
        StakeholderCollectiveProposal.contract_address == stakeholder_collective.contract_address
    )
    proposals = session.exec(statement)

    return [
        StakeholderCollectiveProposal(
            contract_address=p.contract_address,
            proposal_id=p.proposal_id,
            proposer=p.proposer,
            title=p.title,
            description=p.description,
            votes_for=p.votes_for,
            votes_against=p.votes_against,
            votes_abstain=p.votes_abstain,
            is_executed=p.is_executed,
        )
        for p in proposals
    ]


@router.get("/{royalty_token_symbol}/proposals/{proposal_id}")
def get_proposal(
    *, royalty_token_symbol: str, proposal_id: str, session: Session = Depends(get_session)
) -> StakeholderCollectiveProposal:
    statement = select(StakeholderCollectiveProposal).where(
        StakeholderCollectiveProposal.proposal_id == proposal_id
    )
    proposal = session.exec(statement).one()

    return StakeholderCollectiveProposal(
        contract_address=proposal.contract_address,
        proposal_id=proposal.proposal_id,
        proposer=proposal.proposer,
        title=proposal.title,
        description=proposal.description,
        votes_for=proposal.votes_for,
        votes_against=proposal.votes_against,
        votes_abstain=proposal.votes_abstain,
        is_executed=proposal.is_executed,
    )
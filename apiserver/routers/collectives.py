from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import exc
from sqlmodel import Session, select

from apiserver.database import get_session

from apiserver.database.models import (
    RoyaltyToken,
    StakeholderCollectiveProposal,
    StakeholderCollective,
)
from apiserver.routers.commune import (
    Proposal,
    ProposalDescription,
    ProposalInfo,
    ProposalVotes,
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
) -> List[ProposalInfo]:
    statement = select(StakeholderCollectiveProposal).where(
        (StakeholderCollective.royalty_token_symbol == royalty_token_symbol)
        & (
            StakeholderCollectiveProposal.contract_address
            == StakeholderCollective.contract_address
        )
    )
    results = session.exec(statement)

    try:
        proposals = results.all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Proposals Not Found",
        )

    return [
        ProposalInfo(
            proposal_id=proposal.proposal_id,
            proposer=proposal.proposer,
            title=proposal.title,
            votes=ProposalVotes(
                pro=proposal.votes_for,
                contra=proposal.votes_against,
                abstain=proposal.votes_abstain,
            ),
            is_executed=proposal.is_executed,
        )
        for proposal in proposals
    ]


@router.get("/{royalty_token_symbol}/proposals/{proposal_id}")
def get_proposal(
    *,
    royalty_token_symbol: str,
    proposal_id: str,
    session: Session = Depends(get_session)
) -> Proposal:
    statement = select(StakeholderCollectiveProposal).where(
        (StakeholderCollective.royalty_token_symbol == royalty_token_symbol)
        & (StakeholderCollectiveProposal.proposal_id == proposal_id)
    )
    results = session.exec(statement)

    try:
        proposal = results.one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Proposal Not Found",
        )

    return Proposal(
        info=ProposalInfo(
            proposal_id=proposal.proposal_id,
            proposer=proposal.proposer,
            title=proposal.title,
            votes=ProposalVotes(
                pro=proposal.votes_for,
                contra=proposal.votes_against,
                abstain=proposal.votes_abstain,
            ),
            is_executed=proposal.is_executed,
        ),
        description=ProposalDescription(
            description=proposal.description,
            targets=[],
            values=[],
            signatures=[],
            calldatas=[],
        ),
    )
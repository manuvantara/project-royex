from common import ShortenProposal, Proposal
from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get('/collectives/{royalty_token_symbol}/contract-address')
def get_contract_address(royalty_id: int) -> str:
    return "0xB37713ed41AfE1A7ac1c3D009e6f0B3a57F8A3251"

@router.get('/collectives/{royalty_token_symbol}/proposals')
def fetch_proposals(royalty_id: int) -> List[ShortenProposal]:
    mock_proposals: List[ShortenProposal] = [
        ShortenProposal(
            proposal_id=1,
            proposer="0x0000000000000000000000000000000000000001",
            title="Proposal 1",
            voting_date=1,
            voting_deadline=2,
            votes={"for": 5, "against": 1, "abstain": 2},
            is_executed=True
        ),
        ShortenProposal(
            proposal_id=2,
            proposer="0x0000000000000000000000000000000000000002",
            title="Proposal 2",
            voting_date=2,
            voting_deadline=3,
            votes={"for": 3, "against": 15, "abstain": 5},
            is_executed=False
        ),
        ShortenProposal(
            proposal_id=3,
            proposer="0x0000000000000000000000000000000000000003",
            title="Proposal 3",
            voting_date=4,
            voting_deadline=5,
            votes={"for": 0, "against": 0, "abstain": 0},
            is_executed=False
        )
    ]

    return mock_proposals

@router.get('/collectives/{royalty_token_symbol}/proposals/{proposal_id}')
def get_proposal(royalty_id=int) -> List[Proposal]:
    mock_proposals=List[Proposal] = [
        Proposal(
            description="Proposal 1",
            targets=["0x0000000000000000000000000000000000000004"],
            values=[5],
            signatures=["0x0000000000000000000000000000000000000005"],
            calldatas=["0x0000000000000000000000000000000000000006"]
        ),
        Proposal(
            description="Proposal 2",
            targets=["0x0000000000000000000000000000000000000007"],
            values=[3],
            signatures=["0x0000000000000000000000000000000000000008"],
            calldatas=["0x0000000000000000000000000000000000000009"]
        ),
        Proposal(
            description="Proposal 3",
            targets=["0x000000000000000000000000000000000000000a"],
            values=[0],
            signatures=["0x000000000000000000000000000000000000000b"],
            calldatas=["0x000000000000000000000000000000000000000c"]
        )
    ]

    return mock_proposals
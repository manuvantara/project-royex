from apiserver.routers.common import ShortenProposal, Proposal, Votes
from fastapi import APIRouter
from typing import List

router = APIRouter()


@router.get("/{royalty_token_symbol}/contract-address")
def get_contract_address(royalty_token_symbol: str) -> str:
    return "0xB37713ed41AfE1A7ac1c3D009e6f0B3a57F8A3251"


@router.get("/{royalty_token_symbol}/proposals")
def fetch_proposals(royalty_token_symbol: str) -> List[ShortenProposal]:
    return [
        ShortenProposal(
            proposal_id="202cb962ac59075b964b07152d234b70",
            proposer="0x0000000000000000000000000000000000000001",
            title="Proposal 1",
            voting_date=1,
            voting_deadline=2,
            votes=Votes(for_=5, against=3, abstain=2),
            is_executed=True,
        ),
        ShortenProposal(
            proposal_id="81dc9bdb52d04dc20036dbd8313ed055",
            proposer="0x0000000000000000000000000000000000000002",
            title="Proposal 2",
            voting_date=2,
            voting_deadline=3,
            votes=Votes(for_=3, against=15, abstain=2),
            is_executed=False,
        ),
        ShortenProposal(
            proposal_id="900150983cd24fb0d6963f7d28e17f72",
            proposer="0x0000000000000000000000000000000000000003",
            title="Proposal 3",
            voting_date=4,
            voting_deadline=5,
            votes=Votes(for_=0, against=0, abstain=0),
            is_executed=False,
        ),
    ]


@router.get("/{royalty_token_symbol}/proposals/{proposal_id}")
def get_proposal(royalty_token_symbol: str, proposal_id: str) -> Proposal:
    return Proposal(
        proposal_id="202cb962ac59075b964b07152d234b70",
        title="Proposal 1",
        description="<p>Proposal description</p>",
        targets=["0x0000000000000000000000000000000000000004"],
        values=[0],
        signatures=["0x0000000000000000000000000000000000000005"],
        calldatas=["0x0000000000000000000000000000000000000006"],
        proposer="0x0000000000000000000000000000000000000003",
        title="Proposal 3",
        voting_date=4,
        voting_deadline=5,
        votes=Votes(for_=0, against=0, abstain=0),
        is_executed=False,
    )

from apiserver.routers.common import ShortenProposal, Proposal
from fastapi import APIRouter
from typing import List

router = APIRouter()

@router.get('/{royalty_token_symbol}/contract-address')
def get_contract_address(royalty_token_symbol: str) -> str:
    return "0xB37713ed41AfE1A7ac1c3D009e6f0B3a57F8A3251"

@router.get('/{royalty_token_symbol}/proposals')
def fetch_proposals(royalty_token_symbol: str) -> List[ShortenProposal]:
    return [
        ShortenProposal(
            proposalId="202cb962ac59075b964b07152d234b70",
            proposer="0x0000000000000000000000000000000000000001",
            title="Proposal 1",
            votingDate=1,
            votingDeadline=2,
            votes={"for": 5, "against": 1, "abstain": 2},
            isExecuted=True
        ),
        ShortenProposal(
            proposalId="81dc9bdb52d04dc20036dbd8313ed055",
            proposer="0x0000000000000000000000000000000000000002",
            title="Proposal 2",
            votingDate=2,
            votingDeadline=3,
            votes={"for": 3, "against": 15, "abstain": 5},
            isExecuted=False
        ),
        ShortenProposal(
            proposalId="900150983cd24fb0d6963f7d28e17f72",
            proposer="0x0000000000000000000000000000000000000003",
            title="Proposal 3",
            votingDate=4,
            votingDeadline=5,
            votes={"for": 0, "against": 0, "abstain": 0},
            isExecuted=False
        )
    ]

@router.get('/{royalty_token_symbol}/proposals/{proposal_id}')
def get_proposal(royalty_token_symbol: str) -> List[Proposal]:
    return [
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
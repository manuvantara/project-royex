import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s\n\n"
)

import time

from typing import List, Tuple, Type

from sqlmodel import Session, select

import web3

import apiserver.config as config
import apiserver.database as database
import apiserver.database.models as models
import apiserver.abis as abis

from apiserver.database.models import OtcMarketOffer, StakeholderCollectiveProposal


def fetch_symbols() -> List[str]:
    with Session(database.engine) as session:
        statement = select(models.RoyaltyToken.symbol)
        results = session.exec(statement)
        return results.all()


def fetch_contracts(*, model: models.ContractBase, symbol: str) -> Tuple[str, int]:
    with Session(database.engine) as session:
        statement = select(model.contract_address, model.latest_block_number).where(
            model.royalty_token_symbol == symbol
        )
        results = session.exec(statement)
        return results.all()


def update_latest_block(*, model: models.ContractBase, symbol: str, value: int):
    with Session(database.engine) as session:
        statement = select(model).where(model.royalty_token_symbol == symbol)
        results = session.exec(statement)
        result = results.one()
        result.latest_block_number = value
        session.add(result)
        session.commit()


def new_otc_market_offer(
    *,
    session: Session,
    contract_address: str,
    offer_id: str,
    seller: str,
    royalty_token_amount: int,
    stablecoin_amount: int,
):
    offer = models.OtcMarketOffer(
        contract_address=contract_address,
        offer_id=offer_id,
        seller=seller,
        royalty_token_amount=royalty_token_amount,
        stablecoin_amount=stablecoin_amount,
    )
    offer.offer_id = offer_id

    session.add(offer)


# [contract_address, block_timestamp, offer_id:]


def delete_otc_market_offer(*, session: Session, contract_address: str, offer_id: str):
    statement = select(OtcMarketOffer).where(
        (OtcMarketOffer.contract_address == contract_address)
        & (OtcMarketOffer.offer_id == offer_id)
    )

    results = session.exec(statement)
    offer = results.first()
    offer.offer_id = offer_id
    # logging.info(f"OtcMarketOffer={offer}")

    session.delete(offer)

    # statement = select(models.OtcMarketOffer).where(
    #     models.OtcMarketOffer.contract_address == contract_address
    #     and models.OtcMarketOffer.offer_id == offer_id
    # )

    # results = session.exec(statement)
    # offer = results.first()

    # if offer is None:
    #     logging.info(f"OtcMarketOffer={offer}")


def new_otc_market_offer_accepted_event(
    *,
    session: Session,
    contract_address: str,
    block_timestamp: int,
    offer_id: str,
    buyer: str,
):
    statement = select(OtcMarketOffer).where(
        (OtcMarketOffer.contract_address == contract_address)
        & (OtcMarketOffer.offer_id == offer_id)
    )

    results = session.exec(statement)
    offer = results.one()

    logging.info(f"offers={offer}")

    # logging.info(f"offers={offers}")
    # offer = offers[0]

    # logging.info(f"OtcMarketOffer={offer}")

    delete_otc_market_offer(
        session=session,
        contract_address=contract_address,
        offer_id=offer_id,
    )

    offer_accepted_event = models.OtcMarketOfferAcceptedEvent(
        contract_address=offer.contract_address,
        block_timestamp=block_timestamp,
        offer_id=offer.offer_id,
        seller=offer.seller,
        royalty_token_amount=offer.royalty_token_amount,
        stablecoin_amount=offer.royalty_token_amount,
        buyer=buyer,
    )
    offer_accepted_event.offer_id = offer_id

    session.add(offer_accepted_event)


logging.info("indexer: begin")

logging.info(f"AURORA_ENDPOINT={config.AURORA_ENDPOINT}")

w3 = web3.Web3(web3.Web3.HTTPProvider(config.AURORA_ENDPOINT))
logging.info("w3: created")

def new_stakeholder_proposal(
    *,
    session: Session,
    contract_address: str,
    proposal_id: str,
    proposer: str,
    title: str,
    description: str
):
    proposal = models.StakeholderCollectiveProposal(
        contract_address=contract_address,
        proposal_id=proposal_id,
        proposer=proposer,
        title=title,
        description=description,
        votes_for=0,
        votes_against=0,
        votes_abstain=0,
        is_executed=False,
    )

    proposal.proposal_id = proposal_id

    session.add(proposal)

def delete_stakeholder_proposal(*, session: Session, contract_address: str, proposal_id: str):
    statement = select(StakeholderCollectiveProposal).where(
        (StakeholderCollectiveProposal.contract_address == contract_address)
        & (StakeholderCollectiveProposal.proposal_id == proposal_id)
    )

    results = session.exec(statement)
    proposal = results.first()
    proposal.proposal_id = proposal_id

    if proposal is None:
        logging.info(f"Is None: StakeholderCollectiveProposal={proposal}")

    session.delete(proposal)

def execute_stakeholder_proposal(*, session: Session, contract_address: str, proposal_id: str):
    statement = select(StakeholderCollectiveProposal).where(
        (StakeholderCollectiveProposal.contract_address == contract_address)
        & (StakeholderCollectiveProposal.proposal_id == proposal_id)
    )

    results = session.exec(statement)
    proposal = results.first()
    proposal_id = proposal.proposal_id

    if proposal is None:
        logging.info(f"Is None: StakeholderCollectiveProposal={proposal}")

    proposal.is_executed = True

    session.add(proposal)

def cast_vote_to_stakeholder_proposal(*, session: Session, contract_address: str, proposal_id: str, support: int, weight: int):
    statement = select(StakeholderCollectiveProposal).where(
        (StakeholderCollectiveProposal.contract_address == contract_address)
        & (StakeholderCollectiveProposal.proposal_id == proposal_id)
    )

    results = session.exec(statement)
    proposal = results.first()
    proposal_id = proposal.proposal_id

    if proposal is None:
        logging.info(f"Is None: StakeholderCollectiveProposal={proposal}")

    if support == 1:
        proposal.votes_for += weight
    elif support == -1:
        proposal.votes_against += weight
    elif support == 0:
        proposal.votes_abstain += weight
    
    session.add(proposal)

def new_royalty_token_operation(
    *,
    session: Session,
    contract_address: str,
    trader: str,
    royalty_token_amount: int,
    stablecoin_amount: int,
    updated_royalty_token_reserve: int,
    updated_stablecoin_reserve: int,
    block_timestamp: int,
    model: Type[models.RoyaltyTokenEvent]
):
    royalty_token_bought_event = model(
        contract_address=contract_address,
        trader=trader,
        royalty_token_amount=royalty_token_amount // 10**18,
        stablecoin_amount=stablecoin_amount // 10**18,
        updated_royalty_token_reserve=updated_royalty_token_reserve // 10**18,
        updated_stablecoin_reserve=updated_stablecoin_reserve // 10**18,
        block_timestamp=block_timestamp,
    )

    session.add(royalty_token_bought_event)


def update():
    symbols = fetch_symbols()

    logging.info("symbols fetched")

    for symbol in symbols:
        otc_market_contracts = fetch_contracts(model=models.OtcMarket, symbol=symbol)
        stakeholder_collective_contracts = fetch_contracts(model=models.StakeholderCollective, symbol=symbol)
        royalty_exchange_contracts = fetch_contracts(model=models.RoyaltyExchange, symbol=symbol)

        logging.info("contracts fetched")

        for [contract_address, block_number] in otc_market_contracts:
            # get metadata
            latest_block = w3.eth.get_block("latest")

            logging.info(f"block_number={block_number}")
            logging.info(f"latest_block_number={latest_block.number}")

            entries = []

            OtcMarket = w3.eth.contract(address=contract_address, abi=abis.OtcMarket)

            entries += OtcMarket.events.OfferCreated.create_filter(
                fromBlock=block_number, toBlock=latest_block.number
            ).get_new_entries()

            entries += OtcMarket.events.OfferCancelled.create_filter(
                fromBlock=block_number, toBlock=latest_block.number
            ).get_new_entries()

            entries += OtcMarket.events.OfferAccepted.create_filter(
                fromBlock=block_number, toBlock=latest_block.number
            ).get_new_entries()

            logging.info(f"len(entries)={len(entries)}")

            sorted_entries = sorted(entries, key=lambda entry: entry.blockNumber)
            logging.info(f"sorted_entries={sorted_entries}")

            if len(entries) == 0:
                continue

            with Session(database.engine) as session:
                for entry in sorted_entries:
                    logging.info(f"entry={entry}")
                    block = w3.eth.get_block(entry["blockNumber"])

                    if entry["event"] == "OfferCreated":
                        offer_id = str(entry["args"]["offerId"])
                        seller = entry["args"]["seller"]
                        royalty_token_amount = entry["args"]["royaltyTokenAmount"]
                        stablecoin_amount = entry["args"]["stablecoinAmount"]

                        new_otc_market_offer(
                            session=session,
                            contract_address=contract_address,
                            offer_id=offer_id,
                            seller=seller,
                            royalty_token_amount=royalty_token_amount,
                            stablecoin_amount=stablecoin_amount,
                        )

                    elif entry["event"] == "OfferCancelled":
                        offer_id = str(entry["args"]["offerId"])

                        delete_otc_market_offer(
                            session=session,
                            contract_address=contract_address,
                            offer_id=offer_id,
                        )

                    elif entry["event"] == "OfferAccepted":
                        logging.info(f"!!!={entry}")

                        block_timestamp = w3.eth.get_block(
                            entry["blockNumber"]
                        ).timestamp

                        offer_id = str(entry["args"]["offerId"])
                        buyer = entry["args"]["buyer"]

                        new_otc_market_offer_accepted_event(
                            session=session,
                            contract_address=contract_address,
                            block_timestamp=block_timestamp,
                            offer_id=offer_id,
                            buyer=buyer,
                        )

                session.commit()

            update_latest_block(
                model=models.OtcMarket, symbol=symbol, value=latest_block.number
            )

        logging.info(f"symbol={symbol}")

    for [contract_address, block_number] in stakeholder_collective_contracts:
        # get metadata
        latest_block = w3.eth.get_block("latest")

        logging.info(f"block_number={block_number}")
        logging.info(f"latest_block_number={latest_block.number}")

        entries = []

        StakeholderCollective = w3.eth.contract(address=contract_address, abi=abis.StakeholderCollective)	

        entries += StakeholderCollective.events.ProposalCreated.create_filter(
            fromBlock=block_number, toBlock=latest_block.number
        ).get_new_entries()

        entries += StakeholderCollective.events.ProposalCanceled.create_filter(
            fromBlock=block_number, toBlock=latest_block.number
        ).get_new_entries()

        entries += StakeholderCollective.events.ProposalExecuted.create_filter(
            fromBlock=block_number, toBlock=latest_block.number
        ).get_new_entries()

        entries += StakeholderCollective.events.VoteCast.create_filter(
            fromBlock=block_number, toBlock=latest_block.number
        ).get_new_entries()

        entries += StakeholderCollective.events.VoteCastWithParams.create_filter(
            fromBlock=block_number, toBlock=latest_block.number
        ).get_new_entries()

        logging.info(f"len(entries)={len(entries)}")

        sorted_entries = sorted(entries, key=lambda entry: entry.blockNumber)
        logging.info(f"sorted_entries={sorted_entries}")

        if len(entries) == 0:
            continue

        with Session(database.engine) as session:
            for entry in sorted_entries:
                logging.info(f"entry={entry}")

                if entry["event"] == "ProposalCreated":
                    proposal_id = str(entry["args"]["proposalId"])
                    proposer = entry["args"]["proposer"]
                    description = entry["args"]["description"]

                    new_stakeholder_proposal(
                        session=session,
                        contract_address=contract_address,
                        proposal_id=proposal_id,
                        proposer=proposer,
                        title=f"Proposal {proposal_id}",
                        description=description
                    )

                elif entry["event"] == "ProposalCanceled":
                    proposal_id = str(entry["args"]["proposalId"])

                    delete_stakeholder_proposal(
                        session=session,
                        contract_address=contract_address,
                        proposal_id=proposal_id,
                    )

                elif entry["event"] == "ProposalExecuted":
                    proposal_id = str(entry["args"]["proposalId"])

                    execute_stakeholder_proposal(
                        session=session,
                        contract_address=contract_address,
                        proposal_id=proposal_id,
                    )

                elif entry["event"] in ("VoteCast", "VoteCastWithParams"):
                    proposal_id = str(entry["args"]["proposalId"])
                    support = entry["args"]["support"]
                    weight = entry["args"]["weight"]

                    cast_vote_to_stakeholder_proposal(
                        session=session,
                        contract_address=contract_address,
                        proposal_id=proposal_id,
                        support=support,
                        weight=weight
                    )

                session.commit()

            update_latest_block(
                model=models.StakeholderCollective, symbol=symbol, value=latest_block.number
            )

        for [contract_address, block_number] in royalty_exchange_contracts:
            # get metadata
            latest_block = w3.eth.get_block("latest")

            logging.info(f"block_number={block_number}")
            logging.info(f"latest_block_number={latest_block.number}")

            entries = []

            RoyaltyExchange = w3.eth.contract(address=contract_address, abi=abis.RoyaltyExchange)	

            entries += RoyaltyExchange.events.RoyaltyTokenBought.create_filter(
                fromBlock=block_number, toBlock=latest_block.number
            ).get_new_entries()

            entries += RoyaltyExchange.events.RoyaltyTokenSold.create_filter(
                fromBlock=block_number, toBlock=latest_block.number
            ).get_new_entries()

            logging.info(f"len(entries)={len(entries)}")

            sorted_entries = sorted(entries, key=lambda entry: entry.blockNumber)
            logging.info(f"sorted_entries={sorted_entries}")

            if len(entries) == 0:
                continue

            with Session(database.engine) as session:
                for entry in sorted_entries:
                    logging.info(f"entry={entry}")

                    trader = entry["args"]["trader"]
                    royalty_token_amount = entry["args"]["royaltyTokenAmount"]
                    stablecoin_amount = entry["args"]["stablecoinAmount"]
                    updated_royalty_token_reserve = entry["args"]["updatedRoyaltyTokenReserve"]
                    updated_stablecoin_reserve = entry["args"]["updatedStablecoinReserve"]

                    new_royalty_token_operation(
                        session=session,
                        contract_address=contract_address,
                        trader=trader,
                        royalty_token_amount=royalty_token_amount,
                        stablecoin_amount=stablecoin_amount,
                        updated_royalty_token_reserve=updated_royalty_token_reserve,
                        updated_stablecoin_reserve=updated_stablecoin_reserve,
                        block_timestamp=entry["blockNumber"],
                        model=models.RoyaltyTokenBoughtEvent if entry["event"] == "RoyaltyTokenBought" else models.RoyaltyTokenSoldEvent
                    )

                    session.commit()

            update_latest_block(
                model=models.RoyaltyExchange, symbol=symbol, value=latest_block.number
            )


    time.sleep(10)


if __name__ == "__main__":
    while True:
        update()

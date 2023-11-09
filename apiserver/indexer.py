import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s\n\n"
)

import time

from typing import List, Tuple

from sqlmodel import Session, select

import web3

import apiserver.config as config
import apiserver.database as database
import apiserver.database.models as models
import apiserver.abis as abis

from apiserver.database.models import OtcMarketOffer


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

    session.add(offer)


# [contract_address, block_timestamp, offer_id:]


def delete_otc_market_offer(*, session: Session, contract_address: str, offer_id: str):
    statement = select(OtcMarketOffer).where(
        (OtcMarketOffer.contract_address == contract_address)
        & (OtcMarketOffer.offer_id == offer_id)
    )

    results = session.exec(statement)
    offer = results.first()
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

    session.add(offer_accepted_event)


logging.info("indexer: begin")

logging.info(f"AURORA_ENDPOINT={config.AURORA_ENDPOINT}")

w3 = web3.Web3(web3.Web3.HTTPProvider(config.AURORA_ENDPOINT))
logging.info("w3: created")


def update():
    symbols = fetch_symbols()

    logging.info("symbols fetched")

    for symbol in symbols:
        contracts = fetch_contracts(model=models.OtcMarket, symbol=symbol)

        logging.info("contracts fetched")

        for [contract_address, block_number] in contracts:
            # get metadata
            latest_block = w3.eth.get_block("latest")

            logging.info(f"block_number={block_number}")
            logging.info(f"latest_block_number={latest_block.number}")

            entries = []

            # create OtcMarket Contract

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

            # event OfferCreated

            # filter = OtcMarket.events.OfferCreated.create_filter(
            #     fromBlock=block_number, toBlock=latest_block.number
            # )

            # entries = filter.get_new_entries()
            # logging.info(f"otc_market_offer_created_events={entries}")

            # for entry in entries:
            #     logging.debug(f"offer_created_event_entry={entry}")

            #     block = w3.eth.get_block(entry["blockNumber"])

            #     block_timestamp = block.timestamp
            #     offer_id = str(entry["args"]["offerId"])
            #     seller = entry["args"]["seller"]
            #     royalty_token_amount = entry["args"]["royaltyTokenAmount"]
            #     stablecoin_amount = entry["args"]["stablecoinAmount"]

            #     new_otc_market_offer(
            #         contract_address=contract_address,
            #         block_timestamp=block.timestamp,
            #         offer_id=offer_id,
            #         seller=seller,
            #         royalty_token_amount=royalty_token_amount,
            #         stablecoin_amount=stablecoin_amount,
            #     )

            # # event OfferCancelled

            # filter = OtcMarket.events.OfferCancelled.create_filter(
            #     fromBlock=block_number, toBlock=latest_block.number
            # )

            # entries = filter.get_new_entries()
            # logging.info(f"otc_market_offer_cancelled_events={entries}")

            # for entry in entries:
            #     logging.info(f"otc_market_offer_cancelled_event_entry={entries}")

            #     offer_id = str(entry["args"]["offerId"])

            #     delete_otc_market_offer(
            #         contract_address=contract_address, offer_id=offer_id
            #     )

            # # event OfferAccepted

            # filter = OtcMarket.events.OfferAccepted.create_filter(
            #     fromBlock=block_number, toBlock=latest_block.number
            # )

            # entries = filter.get_new_entries()
            # logging.info(f"otc_market_offer_accepted_events={entries}")

            # for entry in entries:
            #     logging.debug(f"offer_accepted_event_entry={entry}")

            #     block = w3.eth.get_block(entry["blockNumber"])

            #     block_timestamp = block.timestamp
            #     offer_id = str(entry["args"]["offerId"])
            #     seller = entry["args"]["seller"]
            #     royalty_token_amount = entry["args"]["royaltyTokenAmount"]
            #     stablecoin_amount = entry["args"]["stablecoinAmount"]
            #     buyer = entry["args"]["buyer"]

            #     new_otc_market_offer_accepted_event(
            #         contract_address=contract_address,
            #         block_timestamp=block_timestamp,
            #         offer_id=offer_id,
            #         seller=seller,
            #         royalty_token_amount=royalty_token_amount,
            #         stablecoin_amount=stablecoin_amount,
            #         buyer=buyer,
            #     )

            #     delete_otc_market_offer(
            #         contract_address=contract_address, offer_id=offer_id
            #     )

            # update metadata

            update_latest_block(
                model=models.OtcMarket, symbol=symbol, value=latest_block.number
            )

        logging.info(f"symbol={symbol}")

    time.sleep(10)


if __name__ == "__main__":
    while True:
        update()

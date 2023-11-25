import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s\n\n"
)

import time
import json

from typing import List, Tuple

from sqlmodel import Session, select

import web3

import apiserver.config as config
import apiserver.database as database
import apiserver.database.models as models
import apiserver.abis as abis

import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

w3 = web3.Web3(web3.Web3.HTTPProvider(config.AURORA_ENDPOINT))
logging.info("w3: created")

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

async def fetch_event():
    symbols = fetch_symbols()

    logging.info("symbols fetched")

    for symbol in symbols:
        otc_market_contracts = fetch_contracts(model=models.OtcMarket, symbol=symbol)

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

                    if entry["event"] == "OfferCreated":
                        offer_id = str(entry["args"]["offerId"])
                        seller = entry["args"]["seller"]
                        royalty_token_amount = entry["args"]["royaltyTokenAmount"]
                        stablecoin_amount = entry["args"]["stablecoinAmount"]

                        logging.info(f"Created offer_id={offer_id}")

                    elif entry["event"] == "OfferCancelled":
                        offer_id = str(entry["args"]["offerId"])

                        logging.info(f"Cancelled offer_id={offer_id}")

                    elif entry["event"] == "OfferAccepted":
                        logging.info(f"!!!={entry}")

                        block_timestamp = w3.eth.get_block(
                            entry["blockNumber"]
                        ).timestamp

                        offer_id = str(entry["args"]["offerId"])
                        buyer = entry["args"]["buyer"]

                        logging.info(f"Accepted offer_id={offer_id}")

                session.commit()

        logging.info(f"symbol={symbol}")

async def main():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(fetch_event, 'interval', seconds=10)

    scheduler.start()

    try:
        while True:
            await asyncio.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

if __name__ == '__main__':
    asyncio.run(main())
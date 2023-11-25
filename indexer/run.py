import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s\n\n"
)

from typing import List, Tuple

from sqlmodel import Session, select

import web3

import apiserver.config as config
import apiserver.database as database
import apiserver.database.models as models
import apiserver.abis as abis

import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler

w3 = web3.AsyncWeb3(web3.AsyncHTTPProvider(config.AURORA_ENDPOINT))
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

async def otc_offer_created(*, contract_address: str, from_block: int, to_block: int):
    OtcMarket = w3.eth.contract(address=contract_address, abi=abis.OtcMarket)

    filter = await OtcMarket.events.OfferCreated.create_filter(
        fromBlock=0, toBlock=to_block
    )
    entries = await filter.get_new_entries()

    logging.info(f"Entries: {entries}")

async def main():
    scheduler = AsyncIOScheduler()

    symbols = fetch_symbols()
    logging.info("Symbols fetched")


    for symbol in symbols:
        latest_block = await w3.eth.get_block("latest")
        otc_market_contracts = fetch_contracts(model=models.OtcMarket, symbol=symbol)

        for [contract_address, block_number] in otc_market_contracts:
            scheduler.add_job(otc_offer_created, 'interval', seconds=10, kwargs={
                'contract_address': contract_address,
                'from_block': block_number,
                'to_block': latest_block.number
            })

    scheduler.start()

    try:
        while True:
            await asyncio.sleep(1000)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()

if __name__ == '__main__':
    asyncio.run(main())
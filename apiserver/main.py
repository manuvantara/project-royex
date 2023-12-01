from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from sqlmodel import SQLModel

from apiserver.database import engine

from apiserver.routers import (
    collectives,
    initial_royalty_offerings,
    royalty_tokens,
    otc_markets,
    portfolios,
    protocol,
    royalty_exchanges,
    royalty_payment_pools,
)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    create_db_and_tables()
    yield
    # Clean up the ML models and release the resources
    # ml_models.clear()


app = FastAPI(generate_unique_id_function=custom_generate_unique_id, lifespan=lifespan)


origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://project-royex.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(collectives.router, prefix="/collectives", tags=["collectives"])

app.include_router(
    initial_royalty_offerings.router,
    prefix="/initial-royalty-offerings",
    tags=["initial-royalty-offerings"],
)

app.include_router(
    royalty_tokens.router, prefix="/royalty-tokens", tags=["royalty-tokens"]
)

app.include_router(otc_markets.router, prefix="/otc-markets", tags=["otc-markets"])

app.include_router(portfolios.router, prefix="/portfolios", tags=["portfolios"])

app.include_router(protocol.router, prefix="/protocol", tags=["protocol"])

app.include_router(
    royalty_exchanges.router, prefix="/royalty-exchanges", tags=["royalty-exchanges"]
)

app.include_router(
    royalty_payment_pools.router,
    prefix="/royalty-payment-pools",
    tags=["royalty-payment-pools"],
)

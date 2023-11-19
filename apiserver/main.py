from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.openapi.utils import get_openapi

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

app.include_router(collectives.router, prefix="/collectives", tags=["collectives"])

app.include_router(
    initial_royalty_offerings.router,
    prefix="/public-royalty-offerings",
    tags=["public-royalty-offerings"],
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


# def custom_openapi():
#     if app.openapi_schema:
#         return app.openapi_schema
#     openapi_schema = get_openapi(
#         title="Custom title",
#         version="2.5.0",
#         summary="This is a very custom OpenAPI schema",
#         description="Here's a longer description of the custom **OpenAPI** schema",
#         routes=app.routes,
#     )
#     openapi_schema["info"]["x-logo"] = {
#         "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
#     }

#     for path_data in openapi_schema["paths"].values():
#         for operation in path_data.values():
#             tag = operation["tags"][0]
#             operation_id = operation["operationId"]
#             to_remove = f"{tag}-"
#             new_operation_id = operation_id[len(to_remove) :]
#             operation["operationId"] = new_operation_id

#     app.openapi_schema = openapi_schema
#     return app.openapi_schema


# app.openapi = custom_openapi

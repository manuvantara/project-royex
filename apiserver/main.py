from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.openapi.utils import get_openapi

from apiserver.routers import (
    otc_markets,
    portfolios,
    protocol,
    royalty_exchanges,
    royalty_payment_pools,
)

def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

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

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Custom title",
        version="2.5.0",
        summary="This is a very custom OpenAPI schema",
        description="Here's a longer description of the custom **OpenAPI** schema",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }

    for path_data in openapi_schema["paths"].values():
        for operation in path_data.values():
            tag = operation["tags"][0]
            operation_id = operation["operationId"]
            to_remove = f"{tag}-"
            new_operation_id = operation_id[len(to_remove) :]
            operation["operationId"] = new_operation_id

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
from fastapi import FastAPI
from infrastructure.logging import get_logger
from interfaces.api.routes import routers

# Configurar logger
logger = get_logger("routers")


def add_routers(app: FastAPI) -> None:
    """Añadir routers a la aplicación FastAPI"""

    logger.info("Including API routers")

    for router in routers:
        app.include_router(router)
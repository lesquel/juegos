from fastapi import FastAPI
from infrastructure.logging import get_logger
from interfaces.api.routes import user_router, auth_router, category_router

# Configurar logger
logger = get_logger("routers")


def add_routers(app: FastAPI) -> None:
    """Añadir routers a la aplicación FastAPI"""

    logger.info("Including API routers")
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(category_router)

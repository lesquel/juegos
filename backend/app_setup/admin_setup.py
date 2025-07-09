from fastapi import FastAPI
from infrastructure.logging import get_logger
from .admin import initialize_admin

# Configurar logger
logger = get_logger("admin_setup")


def setup_admin(app: FastAPI) -> None:
    """Configurar el panel de administración"""
    logger.info("Setting up admin panel")
    initialize_admin(app)

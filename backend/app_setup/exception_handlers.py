from api.http.common.exception_handler import GlobalExceptionHandler
from fastapi import FastAPI
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("exception_handlers")


def setup_exception_handlers(app: FastAPI) -> None:
    """Configurar manejo global de excepciones estandarizado"""
    logger.info("Setting up standardized global exception handlers")
    GlobalExceptionHandler.setup_error_handlers(app)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from infrastructure.core.settings_config import AppSettings
from infrastructure.middleware import LoggingMiddleware
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("middlewares")


def add_middlewares(app: FastAPI, app_settings: AppSettings) -> None:
    """Añadir middlewares a la aplicación FastAPI"""
    
    # Configurar CORS
    logger.info("Configuring CORS middleware")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Middleware de logging de requests y tracking de errores
    logger.info("Adding request logging and error tracking middleware")
    app.add_middleware(LoggingMiddleware)

    # Middleware de seguridad (solo en producción)
    if app_settings.environment == "prod":
        logger.info("Adding TrustedHost middleware for production")
        app.add_middleware(
            TrustedHostMiddleware, 
            allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
        )

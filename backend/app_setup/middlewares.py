from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from infrastructure.core.settings_config import AppSettings
from infrastructure.middleware import LoggingMiddleware
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("middlewares")


def add_middlewares(app: FastAPI, app_settings: AppSettings) -> None:
    """
    Añadir middlewares a la aplicación FastAPI con configuración mejorada.

    Args:
        app: Aplicación FastAPI
        app_settings: Configuración de la aplicación
    """

    # Configurar CORS con seguridad mejorada
    cors_origins = app_settings.allowed_origins or ["*"]
    logger.info(
        f"Configuring CORS middleware for environment: {app_settings.environment}"
    )
    logger.info(f"Allowed origins: {cors_origins}")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=[
            "Accept",
            "Accept-Language",
            "Content-Language",
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "X-CSRF-Token",
        ],
        expose_headers=["X-Total-Count", "X-Page-Count"],
        max_age=86400,  # 24 horas
    )

    # Middleware de logging de requests y tracking de errores
    logger.info("Adding request logging and error tracking middleware")
    app.add_middleware(LoggingMiddleware)

    # Middleware de seguridad (solo en producción)
    if app_settings.is_production():
        logger.info("Adding production security middlewares")

        # TrustedHost middleware
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=cors_origins
        )


    elif app_settings.is_development():
        logger.info(
            "Development environment - skipping production security middlewares"
        )
        # En desarrollo, podrías agregar middlewares específicos de debugging
        logger.info("Development mode - enabling detailed request logging")

    logger.info("✅ All middlewares configured successfully")

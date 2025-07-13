"""Configurador de aplicación FastAPI."""

from fastapi import FastAPI
from application.mixins.logging_mixin import LoggingMixin
from infrastructure.core.settings_config import settings
from infrastructure.logging import get_logger

from .lifespan import lifespan
from .middlewares import add_middlewares
from .routers import add_routers
from .exception_handlers import setup_exception_handlers
from .admin_setup import setup_admin

# Configurar logger
logger = get_logger("app_configurator")


class AppConfigurator(LoggingMixin):
    """Configurador modular de aplicación FastAPI."""

    @staticmethod
    def create_app() -> FastAPI:
        """Crea y configura la aplicación FastAPI."""

        app_settings = settings.app_settings
        logger.info(f"Creating FastAPI application: {app_settings.app_name}")

        # Crear aplicación
        app = FastAPI(
            title=app_settings.app_name,
            description="Backend API para sistema de juegos con autenticación JWT",
            version="1.0.0",
            docs_url="/docs" if app_settings.debug else None,
            redoc_url="/redoc" if app_settings.debug else None,
            lifespan=lifespan,
        )

        # Configurar todos los componentes
        AppConfigurator._configure_app(app, app_settings)

        logger.info(f"✅ {app_settings.app_name} configured successfully!")
        logger.info(f"📊 Environment: {app_settings.environment}")
        logger.info(f"🔧 Debug mode: {app_settings.debug}")

        return app

    @staticmethod
    def _configure_app(app: FastAPI, app_settings) -> None:
        """Configura todos los componentes de la aplicación."""

        # Configurar middlewares
        add_middlewares(app, app_settings)

        # Configurar manejo de excepciones
        setup_exception_handlers(app)

        # Incluir routers
        add_routers(app)

        # Configurar admin
        setup_admin(app)

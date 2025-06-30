"""
Configuración y setup de la aplicación FastAPI
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware


from admin import initialize_admin


from contextlib import asynccontextmanager

from infrastructure.core.settings_config import settings
from infrastructure.db import create_tables, engine
from infrastructure.logging import get_logger
from infrastructure.middleware import LoggingMiddleware
from interfaces.api.routes import user_router, auth_router
from interfaces.api.common.exception_handler import GlobalExceptionHandler

# Configurar logger
logger = get_logger("app_factory")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events para FastAPI"""
    # Startup
    logger.info("🚀 Starting application...")

    # Crear tablas de base de datos
    try:
        create_tables()
        logger.info("✅ Database tables created/verified")
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {str(e)}")
        raise

    yield

    # Shutdown
    logger.info("👋 Shutting down application...")




def create_app() -> FastAPI:
    """Factory function para crear la aplicación FastAPI"""

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

    # Configurar CORS
    logger.info("Configuring CORS middleware")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["*"],
    )

    # Middleware de logging de requests
    logger.info("Adding HTTP request logging middleware")
    app.add_middleware(LoggingMiddleware)

    # Middleware de seguridad (solo en producción)
    if app_settings.environment == "prod":
        logger.info("Adding TrustedHost middleware for production")
        app.add_middleware(
            TrustedHostMiddleware, allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
        )

    # Configurar manejo global de excepciones
    logger.info("Setting up global exception handlers")
    GlobalExceptionHandler.setup_handlers(app)

    # Incluir routers
    logger.info("Including API routers")
    app.include_router(auth_router)
    app.include_router(user_router)

    logger.info(f"✅ {app_settings.app_name} configured successfully!")
    logger.info(f"📊 Environment: {app_settings.environment}")
    logger.info(f"🔧 Debug mode: {app_settings.debug}")

    initialize_admin(app)

    return app

"""
Configuración y setup de la aplicación FastAPI
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from infrastructure.core.settings_config import settings
from infrastructure.db.init_db import create_tables
from interfaces.api.routes import user_router, auth_router
from interfaces.api.common.exception_handler import GlobalExceptionHandler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events para FastAPI"""
    # Startup
    print("🚀 Starting application...")

    # Crear tablas de base de datos
    create_tables()
    print("✅ Database tables created/verified")

    yield

    # Shutdown
    print("👋 Shutting down application...")


def create_app() -> FastAPI:
    """Factory function para crear la aplicación FastAPI"""

    app_settings = settings.app_settings

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
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["*"],
    )

    # Middleware de seguridad (solo en producción)
    if app_settings.environment == "prod":
        app.add_middleware(
            TrustedHostMiddleware, allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
        )

    # Configurar manejo global de excepciones
    GlobalExceptionHandler.setup_handlers(app)

    # Incluir routers
    app.include_router(auth_router)
    app.include_router(user_router)

    print(f"✅ {app_settings.app_name} configured successfully!")
    print(f"📊 Environment: {app_settings.environment}")
    print(f"🔧 Debug mode: {app_settings.debug}")

    return app

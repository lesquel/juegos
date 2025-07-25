from contextlib import asynccontextmanager

from fastapi import FastAPI
from infrastructure.db import create_tables
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("lifespan")


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
        logger.warning("⚠️ Application will continue without database initialization")
        # Don't raise the exception to allow the app to start without database

    yield

    # Shutdown
    logger.info("👋 Shutting down application...")

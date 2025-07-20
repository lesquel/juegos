from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker

from .config import get_async_postgres_url, get_postgres_url

# Engine síncrono (para migraciones y admin)
engine = create_engine(get_postgres_url())
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Engine asíncrono (para la aplicación)
async_engine = create_async_engine(get_async_postgres_url(), echo=False)
AsyncSessionLocal = async_sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)


def get_db():
    """Obtiene sesión síncrona (para admin y migraciones)"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """Obtiene sesión asíncrona (para la aplicación)"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

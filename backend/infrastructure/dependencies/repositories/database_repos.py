"""
Proveedores de repositorios para acceso a datos.

Este módulo contiene las funciones que crean instancias de repositorios
configurados con las conexiones de base de datos apropiadas.
"""

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from domain.repositories import (
    IUserRepository,
    IGameRepository,
    ICategoryRepository,
    IGameReviewRepository,
    IMatchRepository,
    ITransferPaymentRepository,
)
from infrastructure.db.connection import get_async_db

from infrastructure.db.models import (
    UserModel,
    GameModel,
    CategoryModel,
    GameReviewModel,
    MatchModel,
    TransferPaymentModel,
)
from infrastructure.db.repositories import (
    PostgresUserRepository,
    PostgresGameRepository,
    PostgresCategoryRepository,
    PostgresGameReviewRepository,
    PostgresMatchRepository,
    PostgresTransferPaymentRepository,
)


def get_user_repository(db: AsyncSession = Depends(get_async_db)) -> IUserRepository:
    """
    Proveedor para el repositorio de usuarios.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        IUserRepository: Repositorio de usuarios configurado
    """
    return PostgresUserRepository(db, UserModel)


def get_game_repository(db: AsyncSession = Depends(get_async_db)) -> IGameRepository:
    """
    Proveedor para el repositorio de juegos.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        IGameRepository: Repositorio de juegos configurado
    """
    return PostgresGameRepository(db, GameModel)


def get_category_repository(
    db: AsyncSession = Depends(get_async_db),
) -> ICategoryRepository:
    """
    Proveedor para el repositorio de categorías.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        ICategoryRepository: Repositorio de categorías configurado
    """
    return PostgresCategoryRepository(db, CategoryModel)


def get_game_review_repository(
    db: AsyncSession = Depends(get_async_db),
) -> IGameReviewRepository:
    """
    Proveedor para el repositorio de reseñas de juegos.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        IGameReviewRepository: Repositorio de reseñas configurado
    """
    return PostgresGameReviewRepository(db, GameReviewModel)


def get_transfer_payment_repository(
    db: AsyncSession = Depends(get_async_db),
) -> ITransferPaymentRepository:
    """
    Proveedor para el repositorio de transferencias de pago.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        ITransferPaymentRepository: Repositorio de transferencias configurado
    """
    return PostgresTransferPaymentRepository(db, TransferPaymentModel)


def get_match_repository(db: AsyncSession = Depends(get_async_db)) -> IMatchRepository:
    """
    Proveedor para el repositorio de partidas.

    Args:
        db: Sesión de base de datos inyectada

    Returns:
        IMatchRepository: Repositorio de partidas configurado
    """
    return PostgresMatchRepository(db, MatchModel)


# Exportar todos los proveedores
__all__ = [
    "get_user_repository",
    "get_game_repository",
    "get_category_repository",
    "get_game_review_repository",
    "get_match_repository",
    "get_transfer_payment_repository",
]

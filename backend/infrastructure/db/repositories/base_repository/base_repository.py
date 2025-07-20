from abc import ABC
from typing import Type

from sqlalchemy.ext.asyncio import AsyncSession

from ..common import EntityType, FilterType, ModelType
from .base_read_repository import BaseReadOnlyPostgresRepository
from .base_write_repository import BaseWriteOnlyPostgresRepository


class BasePostgresRepository(
    BaseReadOnlyPostgresRepository[EntityType, ModelType, FilterType],
    BaseWriteOnlyPostgresRepository[EntityType, ModelType],
    ABC,
):
    """Repositorio base para PostgreSQL que implementa operaciones CRUD completas."""

    def __init__(self, db_session: AsyncSession, db_model: Type[ModelType]):
        # Configurar atributos comunes una sola vez
        self.db = db_session
        self.model = db_model

from abc import ABC
from typing import Type
from sqlalchemy.ext.asyncio import AsyncSession

from .base_read_repository import BaseReadOnlyPostgresRepository
from .base_write_repository import BaseWriteOnlyPostgresRepository
from ..common import EntityType, ModelType, FilterType


class BasePostgresRepository(
    BaseReadOnlyPostgresRepository[EntityType, ModelType, FilterType],
    BaseWriteOnlyPostgresRepository[EntityType, ModelType],
    ABC,
):
    """Repositorio base para PostgreSQL que implementa operaciones CRUD completas."""

    def __init__(self, db_session: AsyncSession, db_model: Type[ModelType]):
        super().__init__(db_session, db_model)

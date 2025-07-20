from abc import ABC
from typing import Type

from sqlalchemy.ext.asyncio import AsyncSession

from ..common import EntityType, FilterType, ModelType
from .base_read_repository import BaseReadOnlyPostgresRepository
from .base_write_repository import BaseWriteOnlyPostgresRepository


class BaseModelMixin:
    """Mixin para el atributo model común"""

    def __init__(
        self, db_session: AsyncSession, db_model: Type[ModelType], *args, **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.db = db_session
        self.model = db_model


class BasePostgresRepository(
    BaseModelMixin,
    BaseReadOnlyPostgresRepository[EntityType, ModelType, FilterType],
    BaseWriteOnlyPostgresRepository[EntityType, ModelType],
    ABC,
):
    """Repositorio base para PostgreSQL que implementa operaciones CRUD completas."""

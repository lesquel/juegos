from abc import ABC, abstractmethod
from typing import Generic, Type, Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from domain.repositories.base_repository import (
    IReadOnlyRepository,
)
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from application.mixins import LoggingMixin

from ..common import EntityType, ModelType, FilterType


class BaseReadOnlyPostgresRepository(
    Generic[EntityType, ModelType, FilterType],
    IReadOnlyRepository[EntityType, FilterType],
    LoggingMixin,
    ABC,
):
    """Repositorio base de solo lectura para PostgreSQL."""

    def __init__(
        self, db_session: AsyncSession, db_model: Type[ModelType], *args, **kwargs
    ):
        self.db = db_session
        self.model = db_model

    async def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[FilterType] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[EntityType], int]:
        """Obtiene entidades paginadas con filtros y ordenamiento."""
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
        )

    async def get_by_id(self, entity_id: str) -> Optional[EntityType]:
        """Obtiene una entidad por ID."""
        self.logger.debug(f"Getting entity by ID: {entity_id}")
        stmt = select(self.model).where(self._get_id_field() == entity_id)
        result = await self.db.execute(stmt)
        model_instance = result.scalar_one_or_none()

        if model_instance:
            self.logger.debug(f"Entity found with ID: {entity_id}")
            return self._model_to_entity(model_instance)
        else:
            self.logger.debug(f"No entity found with ID: {entity_id}")
            return None

    @abstractmethod
    def _model_to_entity(self, model: ModelType) -> EntityType:
        """Convierte un modelo a entidad."""
        pass

    @abstractmethod
    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        pass

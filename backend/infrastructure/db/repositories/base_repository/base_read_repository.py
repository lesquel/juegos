from abc import ABC, abstractmethod
from typing import Generic, List, Optional, Tuple, Type

from application.mixins import LoggingMixin
from domain.repositories.base_repository import IReadOnlyRepository
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from interfaces.api.mixins import QueryMixin
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..common import EntityType, FilterType, ModelType


class BaseReadOnlyPostgresRepository(
    Generic[EntityType, ModelType, FilterType],
    IReadOnlyRepository[EntityType, FilterType, ModelType],
    QueryMixin,
    LoggingMixin,
    ABC,
):
    """Repositorio base de solo lectura para PostgreSQL."""

    def __init__(
        self, db_session: AsyncSession, db_model: Type[ModelType], *args, **kwargs
    ):
        # Configurar atributos necesarios
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

    @abstractmethod
    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""

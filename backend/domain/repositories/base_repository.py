from abc import ABC, abstractmethod
from typing import List, Generic, Optional, Tuple

from interfaces.api.common.sort import SortParams
from interfaces.api.mixins import QueryMixin
from .common import EntityType, FilterType, ModelType


class IReadOnlyRepository(ABC, Generic[EntityType, FilterType], QueryMixin):
    """Repositorio de solo lectura para operaciones de consulta."""

    @abstractmethod
    async def get_paginated(
        self,
        pagination: FilterType,
        filters: Optional[FilterType] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[EntityType], int]:
        """Obtiene entidades paginadas con filtros y ordenamiento."""
        pass

    @abstractmethod
    async def get_by_id(self, entity_id: str) -> Optional[EntityType]:
        """Obtiene una entidad por ID."""
        pass

    @abstractmethod
    def _model_to_entity(self, model: EntityType) -> EntityType:
        """Convierte un modelo a su entidad correspondiente."""
        pass


class IWriteOnlyRepository(ABC, Generic[EntityType]):
    """Repositorio de escritura para operaciones de modificación."""

    @abstractmethod
    async def save(self, entity: EntityType) -> EntityType:
        """Guarda una entidad."""
        pass

    @abstractmethod
    async def delete(self, entity_id: str) -> None:
        """Elimina una entidad por ID."""
        pass

    @abstractmethod
    async def update(self, entity_id: str, entity: EntityType) -> None:
        """Actualiza una entidad."""
        pass

    @abstractmethod
    def _entity_to_model(self, entity: EntityType) -> ModelType:
        """Convierte una entidad a su modelo correspondiente."""
        pass


class IBaseRepository(
    IReadOnlyRepository[EntityType, FilterType],
    IWriteOnlyRepository[EntityType],
    Generic[EntityType, FilterType],
):
    """Repositorio completo que combina operaciones de lectura y escritura."""

    pass

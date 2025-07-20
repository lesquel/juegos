from abc import ABC, abstractmethod
from typing import Generic, List, Optional, Tuple

from domain.common import SortParams

from .common import EntityType, FilterType, ModelType


class IReadOnlyRepository(ABC, Generic[EntityType, FilterType, ModelType]):
    """Repositorio de solo lectura para operaciones de consulta."""

    @abstractmethod
    async def get_paginated(
        self,
        pagination: FilterType,
        filters: Optional[FilterType] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[EntityType], int]:
        """Obtiene entidades paginadas con filtros y ordenamiento."""

    @abstractmethod
    async def get_by_id(self, entity_id: str) -> Optional[EntityType]:
        """Obtiene una entidad por ID."""

    @abstractmethod
    def _model_to_entity(self, model: ModelType) -> EntityType:
        """Convierte un modelo a su entidad correspondiente."""


class IWriteOnlyRepository(ABC, Generic[EntityType, ModelType]):
    """Repositorio de escritura para operaciones de modificación."""

    @abstractmethod
    async def save(self, entity: EntityType) -> EntityType:
        """Guarda una entidad."""

    @abstractmethod
    async def delete(self, entity_id: str) -> None:
        """Elimina una entidad por ID."""

    @abstractmethod
    async def update(self, entity_id: str, entity: EntityType) -> None:
        """Actualiza una entidad."""

    @abstractmethod
    def _entity_to_model(self, entity: EntityType) -> ModelType:
        """Convierte una entidad a su modelo correspondiente."""


class IBaseRepository(
    IReadOnlyRepository[EntityType, FilterType, ModelType],
    IWriteOnlyRepository[EntityType, ModelType],
    Generic[EntityType, FilterType, ModelType],
):
    """Repositorio completo que combina operaciones de lectura y escritura."""

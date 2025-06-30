from abc import ABC, abstractmethod
from typing import List, Tuple, TypeVar, Generic, Optional

from interfaces.api.common import PaginationParams, BaseFilterParams
from interfaces.api.common.sort import SortParams

T = TypeVar("T")  # Tipo de entidad
F = TypeVar("F", bound=BaseFilterParams)  # Tipo de filtros


class IBaseRepository(ABC, Generic[T, F]):
    """
    Repositorio base genérico que define operaciones comunes
    para cualquier entidad con paginación y filtros.
    """

    @abstractmethod
    def get_all(self) -> List[T]:
        """Obtiene todas las entidades"""
        pass

    @abstractmethod
    def get_by_id(self, entity_id: str) -> Optional[T]:
        """Obtiene una entidad por ID"""
        pass

    @abstractmethod
    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[F] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[T], int]:
        """
        Obtiene entidades paginadas con filtros opcionales.

        Returns:
            Tuple[List[T], int]: (entities, total_count)
        """
        pass

    @abstractmethod
    def save(self, entity: T) -> T:
        """Guarda una entidad"""
        pass

    @abstractmethod
    def delete(self, entity_id: str) -> None:
        """Elimina una entidad por ID"""
        pass

    @abstractmethod
    def update(self, entity_id: str, entity: T) -> None:
        """Actualiza una entidad"""
        pass

    @abstractmethod
    def _entity_to_model(self, entity: T) -> T:
        """Convierte una entidad a su modelo correspondiente"""
        pass

    @abstractmethod
    def _model_to_entity(self, model: T) -> T:
        """Convierte un modelo a su entidad correspondiente"""
        pass

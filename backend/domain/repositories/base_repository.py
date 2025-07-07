from abc import ABC, abstractmethod
from typing import List, Type, TypeVar, Generic, Optional

from interfaces.api.common import BaseFilterParams
from interfaces.api.mixins import QueryMixin

T = TypeVar("T")
F = TypeVar("F", bound=BaseFilterParams)




class IReadOnlyRepository(ABC, Generic[T, F], QueryMixin):
    """
    Repositorio de solo lectura para operaciones de consulta.
    """
    @abstractmethod
    def get_paginated(
        self,
        pagination: F,
        filters: Optional[F] = None,
        sort_params: Optional[F] = None,
    ) -> List[T]:
        """Obtiene entidades paginadas con filtros y ordenamiento"""
        pass
        

    @abstractmethod
    def get_by_id(self, entity_id: str) -> Optional[T]:
        """Obtiene una entidad por ID"""
        pass

    @abstractmethod
    def _model_to_entity(self, model: T) -> T:
        """Convierte un modelo a su entidad correspondiente"""
        pass


class IWriteOnlyRepository(ABC, Generic[T]):
    """
    Repositorio de escritura para operaciones de modificación.
    """

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


class IBaseRepository(IReadOnlyRepository[T, F], IWriteOnlyRepository[T], Generic[T, F]):
    """
    Repositorio completo que combina operaciones de lectura y escritura.
    """

    pass

class IConstructorRepository:
    def __init__(self, db_session, db_model: Type[T]):
        self.db = db_session
        self.model = db_model
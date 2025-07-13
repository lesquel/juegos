"""Mixins genéricos para conversiones de DTOs."""

from typing import TypeVar, Generic, List
from abc import ABC, abstractmethod

EntityType = TypeVar("EntityType")  # Entity type
DTOType = TypeVar("DTOType")  # DTO type


class EntityToDTOConverter(ABC, Generic[EntityType, DTOType]):
    """Convertidor genérico de entidades a DTOs."""

    @abstractmethod
    def to_dto(self, entity: EntityType) -> DTOType:
        """Convierte una entidad a DTO."""
        pass

    def to_dto_list(self, entities: List[EntityType]) -> List[DTOType]:
        """Convierte una lista de entidades a DTOs."""
        return [self.to_dto(entity) for entity in entities]


class DTOToEntityConverter(ABC, Generic[DTOType, EntityType]):
    """Convertidor genérico de DTOs a entidades."""

    @abstractmethod
    def to_entity(self, dto: DTOType) -> EntityType:
        """Convierte un DTO a entidad."""
        pass

    def to_entity_list(self, dtos: List[DTOType]) -> List[EntityType]:
        """Convierte una lista de DTOs a entidades."""
        return [self.to_entity(dto) for dto in dtos]


class BidirectionalConverter(
    EntityToDTOConverter[EntityType, DTOType],
    DTOToEntityConverter[DTOType, EntityType],
    Generic[EntityType, DTOType],
):
    """Convertidor bidireccional entre entidades y DTOs."""

    pass

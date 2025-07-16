"""Conversor DTO para entidad Game."""

from domain.entities.game.game import GameEntity
from dtos.response.game.game_response import GameResponseDTO
from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    BidirectionalConverter,
)
from application.mixins import LoggingMixin


class GameEntityToDTOConverter(
    EntityToDTOConverter[GameEntity, GameResponseDTO], LoggingMixin
):
    """Convierte GameEntity a GameResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: GameEntity) -> GameResponseDTO:
        """Convierte GameEntity a GameResponseDTO."""
        self.logger.debug(
            f"Converting GameEntity to GameResponseDTO for game: {entity.game_id}"
        )

        try:
            # Convertir categories a IDs si son objetos, mantener si ya son strings
            if entity.categories:
                category_ids = []
                for category in entity.categories:
                    category_ids.append(str(category))

            dto = GameResponseDTO(
                game_id=str(entity.game_id),
                game_name=entity.game_name,
                game_description=entity.game_description,
                game_img=entity.game_img,
                game_url=entity.game_url,
                game_capacity=entity.game_capacity,
                category_ids=category_ids,  # Siempre IDs de string
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )

            self.logger.debug("Successfully converted GameEntity to GameResponseDTO")
            return dto

        except Exception as e:
            self.logger.error(
                f"Error converting GameEntity to GameResponseDTO: {str(e)}"
            )
            raise


class GameDTOToEntityConverter(
    EntityToDTOConverter[GameResponseDTO, GameEntity], LoggingMixin
):
    """Convierte GameResponseDTO a GameEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: GameResponseDTO) -> GameEntity:
        """Convierte GameResponseDTO a GameEntity."""
        self.logger.debug(
            f"Converting GameResponseDTO to GameEntity for game: {dto.game_id}"
        )

        try:
            entity = GameEntity(
                game_id=dto.game_id,
                game_name=dto.game_name,
                game_description=dto.game_description,
                game_url=dto.game_url,
                game_img=dto.game_img,
                game_capacity=dto.game_capacity,
                categories=dto.categories if dto.categories else [],  # Ya son IDs
                created_at=dto.created_at,
                updated_at=dto.updated_at,
            )

            self.logger.debug("Successfully converted GameResponseDTO to GameEntity")
            return entity

        except Exception as e:
            self.logger.error(
                f"Error converting GameResponseDTO to GameEntity: {str(e)}"
            )
            raise


class GameBidirectionalConverter(
    BidirectionalConverter[GameEntity, GameResponseDTO], LoggingMixin
):
    """Convertidor bidireccional para Game."""

    def __init__(self):
        super().__init__()
        self.to_entity_to_dto_converter = GameEntityToDTOConverter()
        self.to_dto_to_entity_converter = GameDTOToEntityConverter()

    def to_dto(self, entity: GameEntity) -> GameResponseDTO:
        """Convierte GameEntity a GameResponseDTO."""
        self.logger.debug(
            f"Converting GameEntity to GameResponseDTO (bidirectional) for game: {entity.game_id}"
        )

        return self.to_entity_to_dto_converter.to_dto(entity)

    def to_entity(self, dto: GameResponseDTO) -> GameEntity:
        """Convierte GameResponseDTO a GameEntity."""
        self.logger.debug(
            f"Converting GameResponseDTO to GameEntity (bidirectional) for game: {dto.game_id}"
        )

        return self.to_dto_to_entity_converter.to_entity(dto)

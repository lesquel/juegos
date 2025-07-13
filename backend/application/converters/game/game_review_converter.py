"""Conversor DTO para entidad GameReview."""

from typing import Union
from domain.entities.game.game_review import GameReviewEntity
from dtos.response.game.game_review_response_dto import (
    GameReviewResponseDTO,
    GameReviewSummaryResponseDTO,
)
from dtos.request.game.game_review_request_dto import (
    CreateGameReviewRequestDTO,
    UpdateGameReviewRequestDTO,
)
from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    DTOToEntityConverter,
    BidirectionalConverter,
)
from application.mixins.logging_mixin import LoggingMixin


class GameReviewEntityToDTOConverter(
    EntityToDTOConverter[GameReviewEntity, GameReviewResponseDTO], LoggingMixin
):
    """Convierte GameReviewEntity a GameReviewResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: GameReviewEntity) -> GameReviewResponseDTO:
        """Convierte GameReviewEntity a GameReviewResponseDTO."""
        self.logger.debug(
            f"Converting GameReviewEntity to GameReviewResponseDTO for review: {entity.review_id}"
        )

        try:
            dto = GameReviewResponseDTO(
                review_id=str(entity.review_id),
                game_id=str(entity.game_id),
                user_id=str(entity.user_id),
                rating=entity.rating,
                comment=entity.comment,
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )

            self.logger.debug(
                "Successfully converted GameReviewEntity to GameReviewResponseDTO"
            )
            return dto

        except Exception as e:
            self.logger.error(f"Error converting GameReviewEntity to DTO: {str(e)}")
            raise


class GameReviewDTOToEntityConverter(
    DTOToEntityConverter[CreateGameReviewRequestDTO, GameReviewEntity], LoggingMixin
):
    """Convierte CreateGameReviewRequestDTO a GameReviewEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: CreateGameReviewRequestDTO) -> GameReviewEntity:
        """Convierte CreateGameReviewRequestDTO a GameReviewEntity."""
        self.logger.debug(f"Converting CreateGameReviewRequestDTO to GameReviewEntity")

        try:
            entity = GameReviewEntity(
                review_id=None,  # Se asigna en el repositorio
                game_id=None,  # Se asigna externamente
                user_id=None,  # Se asigna externamente
                rating=dto.rating,
                comment=dto.comment,
            )

            self.logger.debug(
                "Successfully converted CreateGameReviewRequestDTO to GameReviewEntity"
            )
            return entity

        except Exception as e:
            self.logger.error(f"Error converting DTO to GameReviewEntity: {str(e)}")
            raise


class GameReviewBidirectionalConverter(
    BidirectionalConverter[GameReviewEntity, GameReviewResponseDTO], LoggingMixin
):
    """Conversor bidireccional para GameReview."""

    def __init__(self):
        super().__init__()
        self.entity_to_dto = GameReviewEntityToDTOConverter()
        self.dto_to_entity = GameReviewDTOToEntityConverter()

    def to_dto(self, entity: GameReviewEntity) -> GameReviewResponseDTO:
        """Convierte entidad a DTO de respuesta."""
        self.logger.debug(
            f"Converting GameReviewEntity to GameReviewResponseDTO (bidirectional) for review: {entity.review_id if entity.review_id else 'N/A'}"
        )
        return self.entity_to_dto.to_dto(entity)

    def to_entity(
        self, dto: Union[CreateGameReviewRequestDTO, GameReviewResponseDTO]
    ) -> GameReviewEntity:
        """Convierte DTO a entidad (maneja tanto request como response DTOs)."""
        # Si es un CreateGameReviewRequestDTO, usar el converter apropiado
        if hasattr(dto, "rating") and not hasattr(dto, "review_id"):
            self.logger.debug(
                f"Converting CreateGameReviewRequestDTO to GameReviewEntity"
            )
            return self.dto_to_entity.to_entity(dto)

        # Si es un GameReviewResponseDTO, convertir directamente
        self.logger.debug(
            f"Converting GameReviewResponseDTO to GameReviewEntity for review: {dto.review_id}"
        )
        return GameReviewEntity(
            review_id=dto.review_id,
            game_id=dto.game_id,
            user_id=dto.user_id,
            rating=dto.rating,
            comment=dto.comment,
            created_at=dto.created_at,
            updated_at=dto.updated_at,
        )


class GameReviewUpdateDTOToEntityConverter(
    DTOToEntityConverter[UpdateGameReviewRequestDTO, GameReviewEntity], LoggingMixin
):
    """Convierte UpdateGameReviewRequestDTO a GameReviewEntity para actualización."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: UpdateGameReviewRequestDTO) -> GameReviewEntity:
        """Convierte UpdateGameReviewRequestDTO a GameReviewEntity."""
        self.logger.debug("Converting UpdateGameReviewRequestDTO to GameReviewEntity")
        
        try:
            entity = GameReviewEntity(
                review_id=None,  # Se asigna externamente
                game_id=None,  # Se mantiene el existente
                user_id=None,  # Se mantiene el existente
                rating=dto.rating,  # Puede ser None si no se actualiza
                comment=dto.comment,  # Puede ser None si no se actualiza
            )
            
            self.logger.debug("Successfully converted UpdateGameReviewRequestDTO to GameReviewEntity")
            return entity
            
        except Exception as e:
            self.logger.error(f"Error converting UpdateGameReviewRequestDTO to GameReviewEntity: {str(e)}")
            raise

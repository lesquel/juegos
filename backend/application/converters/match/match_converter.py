"""Conversor DTO para entidad Match."""

from decimal import Decimal
from domain.entities.match.match import MatchEntity
from dtos.response.match.match_response_dto import (
    MatchResponseDTO,
    MatchParticipationResponseDTO,
)
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    DTOToEntityConverter,
    BidirectionalConverter,
)
from application.mixins.logging_mixin import LoggingMixin


class MatchEntityToDTOConverter(
    EntityToDTOConverter[MatchEntity, MatchResponseDTO], LoggingMixin
):
    """Convierte MatchEntity a MatchResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: MatchEntity) -> MatchResponseDTO:
        """Convierte MatchEntity a MatchResponseDTO."""
        self.logger.debug(
            f"Converting MatchEntity to MatchResponseDTO for match: {entity.match_id}"
        )

        dto = MatchResponseDTO(
            match_id=str(entity.match_id),
            game_id=str(entity.game_id),
            winner_id=str(entity.winner_id) if entity.winner_id else None,
            created_by_id=str(entity.created_by_id),
            base_bet_amount=(
                float(entity.base_bet_amount) if entity.base_bet_amount else None
            ),
            participant_ids=entity.participant_ids,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

        self.logger.debug("Successfully converted MatchEntity to MatchResponseDTO")
        return dto


class CreateMatchDTOToEntityConverter(
    DTOToEntityConverter[CreateMatchRequestDTO, MatchEntity], LoggingMixin
):
    """Convierte CreateMatchRequestDTO a MatchEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: CreateMatchRequestDTO) -> MatchEntity:
        """Convierte CreateMatchRequestDTO a MatchEntity."""
        self.logger.debug(f"Converting CreateMatchRequestDTO to MatchEntity for game")

        entity = MatchEntity(
            match_id=None,  # Se asigna en el repositorio
            game_id=None,
            base_bet_amount=(
                Decimal(str(dto.base_bet_amount)) if dto.base_bet_amount else None
            ),
            winner_id=None,  # Se asigna cuando el match termina
            created_by_id=None,  # Se asigna al crear la partida
            participant_ids=[],
        )

        self.logger.debug("Successfully converted CreateMatchRequestDTO to MatchEntity")
        return entity


class MatchBidirectionalConverter(
    BidirectionalConverter[MatchEntity, MatchResponseDTO], LoggingMixin
):
    """Conversor bidireccional para Match."""

    def __init__(self):
        super().__init__()
        self.entity_to_dto = MatchEntityToDTOConverter()
        self.dto_to_entity = CreateMatchDTOToEntityConverter()

    def to_dto(self, entity: MatchEntity) -> MatchResponseDTO:
        """Convierte entidad a DTO de respuesta."""
        self.logger.debug(
            f"Converting MatchEntity to MatchResponseDTO (bidirectional) for match: {entity.match_id}"
        )
        return self.entity_to_dto.to_dto(entity)

    def to_entity(self, dto: MatchResponseDTO) -> MatchEntity:
        """Convierte DTO de respuesta a entidad."""
        self.logger.debug(f"Converting MatchResponseDTO to MatchEntity for match")
        return self.dto_to_entity.to_entity(dto)

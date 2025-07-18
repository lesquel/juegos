"""Conversor DTO para entidad MatchParticipation."""

from domain.entities.match.match_participation import MatchParticipation
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from dtos.response.match.match_response import MatchParticipationResponseDTO
from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    DTOToEntityConverter,
    BidirectionalConverter,
)
from application.mixins.logging_mixin import LoggingMixin


class MatchParticipationEntityToDTOConverter(
    EntityToDTOConverter[MatchParticipation, MatchParticipationResponseDTO],
    LoggingMixin,
):
    """Convierte MatchParticipation a MatchParticipationResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: MatchParticipation) -> MatchParticipationResponseDTO:
        """Convierte MatchParticipation a MatchParticipationResponseDTO."""
        self.logger.debug(
            f"Converting MatchParticipation to MatchParticipationResponseDTO for user: {entity.user_id}"
        )

        dto = MatchParticipationResponseDTO(
            user_id=str(entity.user_id),
            score=entity.score,
            bet_amount=entity.bet_amount,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

        self.logger.debug(
            "Successfully converted MatchParticipation to MatchParticipationResponseDTO"
        )
        return dto


class MatchParticipationDTOToEntityConverter(
    DTOToEntityConverter[CreateMatchRequestDTO, MatchParticipation],
    LoggingMixin,
):
    """Convierte JoinMatchRequestDTO a MatchParticipation."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: CreateMatchRequestDTO) -> MatchParticipation:
        """Convierte UpdateMatchRequestDTO a MatchParticipation."""
        self.logger.debug("Converting UpdateMatchRequestDTO to MatchParticipation")

        try:
            entity = MatchParticipation(
                match=None,  # Se asigna externamente
                user=None,  # Se asigna externamente
                score=0,  # Comienza en 0
                bet_amount=dto.base_bet_amount,
                created_at=None,
                updated_at=None,
            )

            self.logger.debug(
                "Successfully converted JoinMatchRequestDTO to MatchParticipation"
            )
            return entity

        except Exception as e:
            self.logger.error(f"Error converting DTO to MatchParticipation: {str(e)}")
            raise


class MatchParticipationBidirectionalConverter(
    BidirectionalConverter[MatchParticipation, MatchParticipationResponseDTO],
    LoggingMixin,
):
    """Conversor bidireccional para MatchParticipation."""

    def __init__(self):
        super().__init__()
        self.entity_to_dto = MatchParticipationEntityToDTOConverter()
        self.dto_to_entity = MatchParticipationDTOToEntityConverter()

    def to_dto(self, entity: MatchParticipation) -> MatchParticipationResponseDTO:
        """Convierte entidad a DTO de respuesta."""
        self.logger.debug(
            f"Converting MatchParticipation to MatchParticipationResponseDTO (bidirectional) for user: {entity.user_id}"
        )
        return self.entity_to_dto.to_dto(entity)

    def to_entity(self, dto: MatchParticipationResponseDTO) -> MatchParticipation:
        """Convierte DTO de respuesta a entidad."""
        self.logger.debug(
            f"Converting MatchParticipationResponseDTO to MatchParticipation for user: {dto.user_id}"
        )
        # Nota: Esta conversión es limitada ya que convierte desde un DTO de respuesta
        return self.dto_to_entity.to_entity(dto)

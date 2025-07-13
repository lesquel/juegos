"""Conversor DTO para entidad Match."""

from domain.entities.match.match import MatchEntity
from dtos.response.match.match_response_dto import (
    MatchResponseDTO,
    MatchSummaryResponseDTO,
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

        try:
            # Convertir participantes
            participants_dto = []
            for participant in entity.participants:
                participants_dto.append(
                    MatchParticipationResponseDTO(
                        user_id=(
                            str(participant.user.user_id)
                            if hasattr(participant.user, "user_id")
                            else str(participant.user)
                        ),
                        user_email=(
                            participant.user.email
                            if hasattr(participant.user, "email")
                            else "Unknown"
                        ),
                        score=participant.score,
                        bet_amount=participant.bet_amount,
                        created_at=participant.created_at,
                        updated_at=participant.updated_at,
                    )
                )

            dto = MatchResponseDTO(
                match_id=str(entity.match_id),
                game_id=str(entity.game_id),
                game_name="Unknown",  # Se debe cargar por separado
                start_time=entity.start_time,
                end_time=entity.end_time,
                winner_id=str(entity.winner_id) if entity.winner_id else None,
                winner_email=None,  # Se debe cargar por separado
                participants=participants_dto,
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )

            self.logger.debug("Successfully converted MatchEntity to MatchResponseDTO")
            return dto

        except Exception as e:
            self.logger.error(f"Error converting MatchEntity to DTO: {str(e)}")
            raise

    def to_dto(self, entity: MatchEntity) -> MatchResponseDTO:
        """
        Convierte MatchEntity a MatchResponseDTO (método abstracto requerido).

        Args:
            entity: La entidad a convertir

        Returns:
            MatchResponseDTO: El DTO convertido
        """
        return self.to_dto(entity)


class MatchSummaryConverter(
    EntityToDTOConverter[MatchEntity, MatchSummaryResponseDTO], LoggingMixin
):
    """Convierte MatchEntity a MatchSummaryResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: MatchEntity) -> MatchSummaryResponseDTO:
        """Convierte MatchEntity a MatchSummaryResponseDTO."""
        self.logger.debug(
            f"Converting MatchEntity to MatchSummaryResponseDTO for match: {entity.match_id}"
        )

        try:
            dto = MatchSummaryResponseDTO(
                match_id=str(entity.match_id),
                game_name="Unknown",  # Se debe cargar por separado
                start_time=entity.start_time,
                end_time=entity.end_time,
                participants_count=len(entity.participants),
                winner_email=None,  # Se debe cargar por separado
            )

            self.logger.debug(
                "Successfully converted MatchEntity to MatchSummaryResponseDTO"
            )
            return dto

        except Exception as e:
            self.logger.error(f"Error converting MatchEntity to summary DTO: {str(e)}")
            raise

    def to_dto(self, entity: MatchEntity) -> MatchSummaryResponseDTO:
        """
        Convierte MatchEntity a MatchSummaryResponseDTO (método abstracto requerido).

        Args:
            entity: La entidad a convertir

        Returns:
            MatchSummaryResponseDTO: El DTO convertido
        """
        return self.to_dto(entity)


class CreateMatchDTOToEntityConverter(
    DTOToEntityConverter[CreateMatchRequestDTO, MatchEntity], LoggingMixin
):
    """Convierte CreateMatchRequestDTO a MatchEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: CreateMatchRequestDTO) -> MatchEntity:
        """Convierte CreateMatchRequestDTO a MatchEntity."""
        self.logger.debug(
            f"Converting CreateMatchRequestDTO to MatchEntity for game: {dto.game_id}"
        )

        try:
            entity = MatchEntity(
                match_id=None,  # Se asigna en el repositorio
                game_id=dto.game_id,
                start_time=dto.start_time,
                end_time=None,  # Se asigna cuando el match termina
                winner_id=None,  # Se asigna cuando el match termina
                participants=[],  # Se añaden por separado
            )

            self.logger.debug(
                "Successfully converted CreateMatchRequestDTO to MatchEntity"
            )
            return entity

        except Exception as e:
            self.logger.error(f"Error converting DTO to MatchEntity: {str(e)}")
            raise

    def to_entity(self, dto: CreateMatchRequestDTO) -> MatchEntity:
        """
        Convierte CreateMatchRequestDTO a MatchEntity (método abstracto requerido).

        Args:
            dto: El DTO a convertir

        Returns:
            MatchEntity: La entidad convertida
        """
        return self.to_entity(dto)


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
        self.logger.debug(
            f"Converting MatchResponseDTO to MatchEntity for match: {dto.match_id}"
        )
        # Nota: Esta conversión es limitada ya que convierte desde un DTO de respuesta
        return MatchEntity(
            match_id=dto.match_id,
            game_id=dto.game_id,
            start_time=dto.start_time,
            end_time=dto.end_time,
            winner_id=dto.winner_id,
            participants=[],  # Los participantes se cargan por separado
            created_at=dto.created_at,
            updated_at=dto.updated_at,
        )

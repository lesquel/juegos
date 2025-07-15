from datetime import datetime
from typing import Optional
from domain.entities.match import MatchEntity
from dtos.response.match import MatchResponseDTO
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution


class MatchToResponseConverter(EntityToDTOConverter[MatchEntity, MatchResponseDTO]):
    """Converter para transformar entidades Match a DTOs de respuesta."""

    @log_execution(include_args=False, include_result=False, log_level="DEBUG")
    def to_dto(self, domain_entity: MatchEntity) -> MatchResponseDTO:
        """
        Convierte una entidad Match a MatchResponse DTO.

        Args:
            domain_entity: Entidad Match del dominio

        Returns:
            MatchResponse: DTO para respuesta de API
        """
        return MatchResponseDTO(
            id=domain_entity.id,
            game_id=domain_entity.game_id,
            host_user_id=domain_entity.host_user_id,
            start_time=domain_entity.start_time,
            end_time=domain_entity.end_time,
            status=domain_entity.status,
            max_participants=domain_entity.max_participants,
            bet_amount=float(domain_entity.bet_amount) if domain_entity.bet_amount else None,
            winner_user_id=domain_entity.winner_user_id,
            is_active=domain_entity.is_active,
            created_at=domain_entity.created_at,
            updated_at=domain_entity.updated_at
        )

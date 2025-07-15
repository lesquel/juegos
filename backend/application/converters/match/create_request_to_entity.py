from datetime import datetime
from decimal import Decimal
from typing import Optional
from domain.entities.match import MatchEntity
from dtos.request.match import CreateMatchRequestDTO
from application.mixins.dto_converter_mixin import DTOToEntityConverter
from infrastructure.logging import log_execution


class CreateMatchRequestToEntityConverter(DTOToEntityConverter[CreateMatchRequestDTO, MatchEntity]):
    """Converter para transformar DTOs de creación de partida a entidades Match."""

    @log_execution(include_args=False, include_result=False, log_level="DEBUG")
    def to_entity(self, dto: CreateMatchRequestDTO) -> MatchEntity:
        """
        Convierte un CreateMatchRequest DTO a entidad Match.

        Args:
            dto: DTO de request para crear partida

        Returns:
            Match: Entidad del dominio
        """
        now = datetime.utcnow()
        
        return MatchEntity(
            id=None,  # Se asignará en la base de datos
            game_id=dto.game_id,
            host_user_id=dto.host_user_id,
            start_time=dto.start_time,
            end_time=dto.end_time,
            status="waiting",  # Estado inicial por defecto
            max_participants=dto.max_participants,
            bet_amount=Decimal(str(dto.bet_amount)) if dto.bet_amount else None,
            winner_user_id=None,  # Se asignará cuando termine la partida
            is_active=True,
            created_at=now,
            updated_at=now
        )

from decimal import Decimal
from domain.entities.match import MatchEntity
from domain.entities.user.user import UserEntity
from dtos.request.match import CreateMatchRequestDTO
from application.mixins.dto_converter_mixin import DTOToEntityConverter
from infrastructure.logging import log_execution


class CreateMatchRequestToEntityConverter(
    DTOToEntityConverter[CreateMatchRequestDTO, MatchEntity]
):
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

        return MatchEntity(
            match_id=None,  # Se asignará en la base de datos
            game_id=dto.game_id,
            start_time=dto.start_time,
            end_time=None,
            created_by_id=None,
            base_bet_amount=(
                Decimal(str(dto.base_bet_amount)) if dto.base_bet_amount else None
            ),
            winner_id=None,  # Se asignará cuando termine la partida
            is_active=True,
        )

from datetime import datetime
from typing import Optional
from application.enums.match_state import MatchStateEnum
from domain.entities.match import MatchEntity
from dtos.request.match import UpdateMatchRequestDTO
from application.interfaces.base_assembler import BaseAssembler
from infrastructure.logging import log_execution


class UpdateMatchScoreRequestToEntityConverter(
    BaseAssembler[UpdateMatchRequestDTO, dict]
):
    """Converter para transformar DTOs de actualización de score a diccionario de campos."""

    @log_execution(include_args=False, include_result=False, log_level="DEBUG")
    def convert(self, dto: UpdateMatchRequestDTO) -> dict:
        """
        Convierte un UpdateMatchScoreRequest DTO a diccionario de campos para actualizar.

        Args:
            dto: DTO de request para actualizar score

        Returns:
            dict: Diccionario con campos a actualizar
        """
        update_fields = {"updated_at": datetime.now(datetime.timezone.utc)}

        # Agregar winner_user_id si se proporciona
        if dto.winner_user_id is not None:
            update_fields["winner_user_id"] = dto.winner_user_id

        # Cambiar status a "finished" si se declara un ganador
        if dto.winner_user_id:
            update_fields["end_time"] = datetime.now()

        return update_fields

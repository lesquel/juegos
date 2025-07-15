from domain.repositories.match_repository import IMatchRepository
from domain.exceptions.match import MatchNotFoundError, MatchScoreError
from dtos.request.match.match_request_dto import UpdateMatchScoreRequestDTO
from dtos.response.match.match_response_dto import MatchResponseDTO
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class UpdateMatchScoreUseCase(BaseUseCase[UpdateMatchScoreRequestDTO, MatchResponseDTO]):
    """Caso de uso para actualizar la puntuación en una partida."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.match_repo = match_repo
        self.match_converter = match_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self,
        match_id: str,
        score_data: UpdateMatchScoreRequestDTO,
        current_user: UserBaseResponseDTO,
    ) -> MatchResponseDTO:
        """
        Actualiza la puntuación de un usuario en una partida.

        Args:
            match_id: ID de la partida
            score_data: Nueva puntuación
            current_user: Usuario autenticado

        Returns:
            MatchResponseDTO: Datos actualizados de la partida

        Raises:
            MatchNotFoundError: Si la partida no existe
            MatchScoreError: Si no se puede actualizar la puntuación
        """
        self.logger.info(
            f"Updating score for user {current_user.user_id} in match {match_id} to {score_data.score}"
        )

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)
        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        # Verificar que el usuario es participante
        is_participant = await self.match_repo.is_user_participant(match_id, current_user.user_id)
        if not is_participant:
            self.logger.warning(f"User {current_user.user_id} is not a participant in match {match_id}")
            raise MatchScoreError("User is not a participant in this match")

        # Validar puntuación
        if score_data.score < 0:
            self.logger.error(f"Invalid score: {score_data.score}")
            raise MatchScoreError("Score cannot be negative")

        # Actualizar puntuación
        updated_match = await self.match_repo.update_user_score(
            match_id, current_user.user_id, score_data.score
        )

        self.logger.info(
            f"Score updated successfully for user {current_user.user_id} in match {match_id}"
        )

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(updated_match)

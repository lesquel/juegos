from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from domain.exceptions.match import MatchNotFoundError, MatchScoreError
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from dtos.request.match.match_request_dto import MatchParticipationResultsDTO
from dtos.response.match.match_response import MatchResponseDTO
from infrastructure.logging import log_execution, log_performance


class FinishMatchUseCase(BaseUseCase[MatchParticipationResultsDTO, MatchResponseDTO]):
    """Caso de uso para actualizar la puntuación en una partida."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        user_repo: IUserRepository,
        game_repo: IGameRepository,
        match_converter: BidirectionalConverter,
    ):
        super().__init__()
        self.match_repo = match_repo
        self.user_repo = user_repo
        self.game_repo = game_repo
        self.match_converter = match_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self,
        match_id: str,
        participation_data: MatchParticipationResultsDTO,
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
        self.logger.info(f"Updating score for participation in match {match_id}")

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)

        if match.winner_id:
            self.logger.error(f"Match {match_id} has already been finished")
            raise MatchScoreError("Match has already been finished")

        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        participations = [(p.user_id, p.score) for p in participation_data.participants]

        # Actualizar puntuación
        updated_match = await self.match_repo.finish_match(match_id, participations)

        winner = await self.user_repo.get_by_id(updated_match.winner_id)

        game = await self.game_repo.get_by_id(updated_match.game_id)
        if not game:
            self.logger.error(f"Game not found for match {match_id}")
            raise MatchNotFoundError(f"Game for match {match_id} not found")

        odds = updated_match.calculate_odds_for_match(game.house_odds)
        base_bet = updated_match.base_bet_amount or 0.0
        reward = UserBalanceService.calculate_reward(odds, base_bet)

        UserBalanceService.add_balance(winner, reward)

        self.logger.info(f"Match {match_id} finished successfully with updated scores")

        await self.user_repo.update(winner.user_id, winner)

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(updated_match, game)

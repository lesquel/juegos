from application.mixins.dto_converter_mixin import BidirectionalConverter
from domain.exceptions.match import MatchNotFoundError, MatchScoreError
from domain.interfaces.base_use_case import BaseUseCase
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.match_service import MatchService
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
        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        if match.winner_id:
            self.logger.error(f"Match {match_id} has already been finished")
            raise MatchScoreError("Match has already been finished")

        participations = [(p.user_id, p.score) for p in participation_data.participants]

        for user_id, _ in participations:
            if not match.is_participant(user_id):
                self.logger.warning(
                    f"User {user_id} is not a participant in match {match_id}"
                )
                raise MatchScoreError("User is not a participant in this match")

        match.winner_id = MatchService.get_winner(participations)

        self.logger.info(
            f"Determined winner {match.winner_id} for match {match_id} based on scores"
        )

        try:
            # Actualizar puntuación
            updated_match = await self.match_repo.update(match_id, match)

            # Obtener el ganador
            winner = await self.user_repo.get_by_id(updated_match.winner_id)
            if not winner:
                self.logger.error(f"Winner with ID {updated_match.winner_id} not found")
                raise MatchScoreError(
                    f"Winner with ID {updated_match.winner_id} not found"
                )

            # Obtener el juego
            game = await self.game_repo.get_by_id(updated_match.game_id)
            if not game:
                self.logger.error(f"Game with ID {updated_match.game_id} not found")
                raise MatchScoreError(f"Game with ID {updated_match.game_id} not found")

            # Calcular recompensa
            try:
                odds = updated_match.calculate_odds_for_match(game.house_odds)
                base_bet = updated_match.base_bet_amount or 0.0
                reward = UserBalanceService.calculate_reward(odds, base_bet)

                self.logger.info(
                    f"Calculated reward for winner {winner.user_id}: {reward} (odds: {odds}, base_bet: {base_bet})"
                )

                # Agregar balance al ganador
                UserBalanceService.add_balance(winner, reward)

                # Actualizar el usuario en la base de datos
                await self.user_repo.update(winner.user_id, winner)

                self.logger.info(
                    f"Updated balance for winner {winner.user_id}. New balance: {winner.virtual_currency}"
                )

            except Exception as balance_error:
                self.logger.error(
                    f"Error calculating or updating balance: {str(balance_error)}"
                )
                # No lanzar error aquí para no interrumpir la finalización del match
                # Solo registrar el error

            self.logger.info(
                f"Match {match_id} finished successfully with updated scores"
            )

            # Convertir a DTO de respuesta
            return self.match_converter.to_dto(updated_match, game)

        except Exception as update_error:
            self.logger.error(f"Error updating match or user data: {str(update_error)}")
            raise MatchScoreError(f"Failed to update match data: {str(update_error)}")

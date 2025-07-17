from domain.exceptions.game import GameNotFoundError
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from domain.exceptions.match import MatchNotFoundError, MatchJoinError
from domain.exceptions.user import UserNotFoundError, InsufficientBalanceError
from dtos.response.match.match_response import MatchResponseDTO
from dtos.response.user.user_response import UserBaseResponseDTO, UserResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class JoinMatchUseCase(BaseUseCase[str, MatchResponseDTO]):
    """Caso de uso para unirse a una partida."""

    def __init__(
        self,
        user: UserResponseDTO,
        match_repo: IMatchRepository,
        game_repo: IGameRepository,
        user_repo: IUserRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.user = user
        self.match_repo = match_repo
        self.game_repo = game_repo
        self.user_repo = user_repo
        self.match_converter = match_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self,
        match_id: str,
    ) -> MatchResponseDTO:
        """
        Permite a un usuario unirse a una partida.

        Args:
            match_id: ID de la partida

        Returns:
            MatchResponseDTO: Datos actualizados de la partida

        Raises:
            MatchNotFoundError: Si la partida no existe
            UserNotFoundError: Si el usuario no existe
            InsufficientBalanceError: Si el usuario no tiene saldo suficiente
            MatchJoinError: Si no se puede unir a la partida
        """
        self.logger.info(f"User {self.user.user_id} joining match {match_id}")

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)
        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        game = await self.game_repo.get_by_id(match.game_id)

        if len(match.participant_ids) >= game.game_capacity:
            self.logger.error(f"Match {match_id} is full")
            raise MatchJoinError("Match is already full")

        print(game)
        if not game:
            self.logger.error(f"Game not found for match: {match_id}")
            raise GameNotFoundError(f"Game for match with ID {match_id} not found")

        # Verificar que el usuario existe
        if not self.user:
            self.logger.error(f"User not found: {self.user.user_id}")
            raise UserNotFoundError(f"User with ID {self.user.email} not found")

        # Verificar que el usuario no esté ya participando
        is_participant = await self.match_repo.is_user_participant(
            match_id, self.user.user_id
        )
        print(is_participant)

        if is_participant:
            self.logger.warning(
                f"User {self.user.user_id} already participating in match {match_id}"
            )
            raise MatchJoinError("User is already participating in this match")

        # Validar saldo para la apuesta

        if not UserBalanceService.has_sufficient_balance(
            self.user, match.base_bet_amount
        ):
            self.logger.warning(
                f"User {self.user.user_id} has insufficient balance. "
                f"Required: {match.base_bet_amount}, Available: {self.user.virtual_currency}"
            )
            raise InsufficientBalanceError(
                self.user.virtual_currency,
                match.base_bet_amount,
                f"Insufficient balance to join match. Required: {match.base_bet_amount}, Available: {self.user.virtual_currency}",
            )

        # Deducir el monto de la apuesta del balance del usuario
        UserBalanceService.deduct_balance(self.user, match.base_bet_amount)

        # Obtener la entidad completa del usuario para actualizar
        user_entity = await self.user_repo.get_by_id(self.user.user_id)
        if user_entity:
            user_entity.virtual_currency = self.user.virtual_currency
            await self.user_repo.update(self.user.user_id, user_entity)

        self.logger.info(
            f"Deducted {match.base_bet_amount} from self.user {self.user.user_id} balance"
        )

        # Unirse a la partida
        updated_match = await self.match_repo.join_match(match_id, self.user.user_id)

        self.logger.info(
            f"User {self.user.user_id} successfully joined match {match_id}"
        )

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(updated_match, game)

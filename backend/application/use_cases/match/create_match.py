from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from domain.entities.match.match import MatchEntity
from domain.exceptions.game import GameNotFoundError
from domain.exceptions.user import InsufficientBalanceError, UserNotFoundError
from domain.repositories.game_repository import IGameRepository
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from dtos.response.match.match_response import MatchResponseDTO
from dtos.response.user.user_response import UserResponseDTO
from infrastructure.logging import log_execution, log_performance


class CreateMatchUseCase(BaseUseCase[CreateMatchRequestDTO, MatchResponseDTO]):
    """Caso de uso para crear una nueva partida."""

    def __init__(
        self,
        user: UserResponseDTO,
        match_repo: IMatchRepository,
        game_repo: IGameRepository,
        user_repo: IUserRepository,
        match_converter: BidirectionalConverter[MatchEntity, MatchResponseDTO],
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
        self, game_id: str, match_data: CreateMatchRequestDTO
    ) -> MatchResponseDTO:
        """
        Crea una nueva partida.

        Args:
            match_data: Datos para crear la partida

        Returns:
            MatchResponseDTO: Datos de la partida creada

        Raises:
            GameNotFoundError: Si el juego no existe
            UserNotFoundError: Si el usuario no existe
            InsufficientBalanceError: Si el usuario no tiene saldo suficiente
            MatchValidationError: Si los datos son inválidos
        """
        self.logger.info(
            f"Creating match for game {match_data} by user {self.user.user_id}"
        )

        # Validar que el usuario existe
        if not self.user:
            self.logger.error(f"User not found: {self.user.user_id}")
            raise UserNotFoundError(f"User with ID {self.user.user_id} not found")

        # Validar que el usuario tiene saldo suficiente para crear la partida
        if not UserBalanceService.has_sufficient_balance(
            self.user, match_data.base_bet_amount
        ):
            self.logger.warning(
                f"User {self.user.user_id} has insufficient balance. "
                f"Required: {match_data.base_bet_amount}, Available: {self.user.virtual_currency}"
            )
            raise InsufficientBalanceError(
                self.user.virtual_currency,
                match_data.base_bet_amount,
                f"Insufficient balance to create match. Required: {match_data.base_bet_amount}, "
                f"Available: {self.user.virtual_currency}",
            )

        # Validar que el juego existe
        game = await self.game_repo.get_by_id(game_id)
        if not game:
            self.logger.error(f"Game not found: {game_id}")
            raise GameNotFoundError(f"Game with ID {game_id} not found")

        # Crear entidad de partida usando el converter
        match_entity = self.match_converter.to_entity(match_data)

        # Deducir el monto de la apuesta del balance del usuario
        UserBalanceService.deduct_balance(self.user, match_data.base_bet_amount)

        # Obtener la entidad completa del usuario para actualizar
        user_entity = await self.user_repo.get_by_id(self.user.user_id)
        if user_entity:
            user_entity.virtual_currency = self.user.virtual_currency
            await self.user_repo.update(self.user.user_id, user_entity)

        self.logger.info(
            f"Deducted {match_data.base_bet_amount} from user {self.user.user_id} balance"
        )

        match_entity.created_by_id = self.user.user_id
        match_entity.game_id = game_id

        match_entity.add_participant(self.user.user_id)

        created_match = await self.match_repo.save(match_entity)

        self.logger.info(
            f"Match created successfully with ID: {created_match.match_id}"
        )

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(created_match, game)

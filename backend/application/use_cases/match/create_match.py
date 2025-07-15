from domain.entities.match.match import MatchEntity
from domain.entities.user.user import UserEntity
from domain.repositories.match_repository import IMatchRepository
from domain.repositories.game_repository import IGameRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from domain.exceptions.game import GameNotFoundError
from domain.exceptions.match import MatchValidationError
from domain.exceptions.user import UserNotFoundError, InsufficientBalanceError
from dtos.request.match.match_request_dto import CreateMatchRequestDTO
from dtos.response.match.match_response_dto import MatchResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import BidirectionalConverter
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from infrastructure.logging import log_execution, log_performance
from datetime import datetime


class CreateMatchUseCase(BaseUseCase[CreateMatchRequestDTO, MatchResponseDTO]):
    """Caso de uso para crear una nueva partida."""

    def __init__(
        self,
        user: UserBaseResponseDTO,
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
        user = await self.user_repo.get_by_id(self.user.user_id)
        if not user:
            self.logger.error(f"User not found: {self.user.user_id}")
            raise UserNotFoundError(f"User with ID {self.user.user_id} not found")

        # Validar que el usuario tiene saldo suficiente para crear la partida
        if not UserBalanceService.has_sufficient_balance(
            user, match_data.base_bet_amount
        ):
            self.logger.warning(
                f"User {self.user.user_id} has insufficient balance. "
                f"Required: {match_data.base_bet_amount}, Available: {user.virtual_currency}"
            )
            raise InsufficientBalanceError(
                user.virtual_currency,
                match_data.base_bet_amount,
                f"Insufficient balance to create match. Required: {match_data.base_bet_amount}, Available: {user.virtual_currency}",
            )

        # Validar que el juego existe
        game = await self.game_repo.get_by_id(game_id)
        if not game:
            self.logger.error(f"Game not found: {game_id}")
            raise GameNotFoundError(f"Game with ID {game_id} not found")

        # Crear entidad de partida usando el converter
        match_entity = self.match_converter.to_entity(match_data)

        # Deducir el monto de la apuesta del balance del usuario
        UserBalanceService.deduct_balance(user, match_data.base_bet_amount)
        await self.user_repo.update(self.user.user_id, user)

        self.logger.info(
            f"Deducted {match_data.base_bet_amount} from user {self.user.user_id} balance"
        )

        match_entity.created_by_id = self.user.user_id
        match_entity.game_id = game_id
        # Crear la partida en el repositorio
        
        match_entity.participant_ids = [self.user.user_id]

        created_match = await self.match_repo.save(match_entity)
        print(f"Match created with ID: {created_match.match_id}")

        self.logger.info(
            f"Match created successfully with ID: {created_match.match_id}"
        )

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(created_match)

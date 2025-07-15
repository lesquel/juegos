from domain.repositories.match_repository import IMatchRepository
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from domain.exceptions.match import MatchNotFoundError, MatchJoinError
from domain.exceptions.user import UserNotFoundError, InsufficientBalanceError
from dtos.request.match.match_request_dto import JoinMatchRequestDTO
from dtos.response.match.match_response_dto import MatchResponseDTO
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class JoinMatchUseCase(BaseUseCase[JoinMatchRequestDTO, MatchResponseDTO]):
    """Caso de uso para unirse a una partida."""

    def __init__(
        self,
        match_repo: IMatchRepository,
        user_repo: IUserRepository,
        match_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.match_repo = match_repo
        self.user_repo = user_repo
        self.match_converter = match_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self,
        match_id: str,
        join_data: JoinMatchRequestDTO,
        current_user: UserBaseResponseDTO,
    ) -> MatchResponseDTO:
        """
        Permite a un usuario unirse a una partida.

        Args:
            match_id: ID de la partida
            join_data: Datos para unirse (bet_amount)
            current_user: Usuario autenticado

        Returns:
            MatchResponseDTO: Datos actualizados de la partida

        Raises:
            MatchNotFoundError: Si la partida no existe
            UserNotFoundError: Si el usuario no existe
            InsufficientBalanceError: Si el usuario no tiene saldo suficiente
            MatchJoinError: Si no se puede unir a la partida
        """
        self.logger.info(f"User {current_user.user_id} joining match {match_id}")

        # Verificar que la partida existe
        match = await self.match_repo.get_by_id(match_id)
        if not match:
            self.logger.error(f"Match not found: {match_id}")
            raise MatchNotFoundError(f"Match with ID {match_id} not found")

        # Verificar que el usuario existe
        user = await self.user_repo.get_by_id(current_user.user_id)
        if not user:
            self.logger.error(f"User not found: {current_user.user_id}")
            raise UserNotFoundError(f"User with ID {current_user.user_id} not found")

        # Verificar que el usuario no esté ya participando
        is_participant = await self.match_repo.is_user_participant(match_id, current_user.user_id)
        if is_participant:
            self.logger.warning(f"User {current_user.user_id} already participating in match {match_id}")
            raise MatchJoinError("User is already participating in this match")

        # Validar saldo para la apuesta
        bet_amount = join_data.bet_amount if join_data.bet_amount is not None else 0.0
        
        if bet_amount > 0:
            if not UserBalanceService.has_sufficient_balance(user, bet_amount):
                self.logger.warning(
                    f"User {current_user.user_id} has insufficient balance. "
                    f"Required: {bet_amount}, Available: {user.virtual_currency}"
                )
                raise InsufficientBalanceError(
                    user.virtual_currency,
                    bet_amount,
                    f"Insufficient balance to join match. Required: {bet_amount}, Available: {user.virtual_currency}"
                )
            
            # Deducir el monto de la apuesta del balance del usuario
            UserBalanceService.deduct_balance(user, bet_amount)
            await self.user_repo.update(user)
            
            self.logger.info(f"Deducted {bet_amount} from user {current_user.user_id} balance")

        # Unirse a la partida
        updated_match = await self.match_repo.join_match(
            match_id, current_user.user_id, bet_amount
        )

        self.logger.info(f"User {current_user.user_id} successfully joined match {match_id}")

        # Convertir a DTO de respuesta
        return self.match_converter.to_dto(updated_match)

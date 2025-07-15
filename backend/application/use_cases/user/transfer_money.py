"""Transfer Money Use Case for handling financial transactions."        # Validar que el usuario tiene saldo suficiente
        if not UserBalanceService.has_sufficient_balance(from_user, transfer_data.amount):
            self.logger.warning(
                f"User {transfer_data.from_user_id} has insufficient balance. "
                f"Required: {transfer_data.amount}, Available: {from_user.virtual_currency}"
            )
            raise InsufficientBalanceError(
                from_user.virtual_currency,
                transfer_data.amount,
                f"Insufficient balance for transfer. Required: {transfer_data.amount}, "
                f"Available: {from_user.virtual_currency}"
            )

        # Realizar la transferencia usando el servicio de dominio
        UserBalanceService.transfer_balance(from_user, to_user, transfer_data.amount)al import Decimal
from domain.entities.user.user import UserEntity
from domain.repositories.user_repository import IUserRepository
from domain.services.user_balance_service import UserBalanceService
from domain.exceptions.user import UserNotFoundError, InsufficientBalanceError
from dtos.request.user.user_request_dto import TransferMoneyRequestDTO
from dtos.response.user.user_response_dto import UserBaseResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class TransferMoneyUseCase(BaseUseCase[TransferMoneyRequestDTO, UserBaseResponseDTO]):
    """Caso de uso para transferir dinero entre usuarios."""

    def __init__(
        self,
        user_repo: IUserRepository,
        user_converter: EntityToDTOConverter[UserEntity, UserBaseResponseDTO],
    ):
        super().__init__()
        self.user_repo = user_repo
        self.user_converter = user_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, transfer_data: TransferMoneyRequestDTO
    ) -> UserBaseResponseDTO:
        """
        Transfiere dinero de un usuario a otro.

        Args:
            transfer_data: Datos de la transferencia

        Returns:
            UserBaseResponseDTO: Datos actualizados del usuario que envía

        Raises:
            UserNotFoundError: Si alguno de los usuarios no existe
            InsufficientBalanceError: Si el usuario no tiene saldo suficiente
        """
        self.logger.info(
            f"Transferring {transfer_data.amount} from user {transfer_data.from_user_id} "
            f"to user {transfer_data.to_user_id}"
        )

        # Verificar que ambos usuarios existen
        from_user = await self.user_repo.get_by_id(transfer_data.from_user_id)
        if not from_user:
            self.logger.error(f"Source user not found: {transfer_data.from_user_id}")
            raise UserNotFoundError(
                f"User with ID {transfer_data.from_user_id} not found"
            )

        to_user = await self.user_repo.get_by_id(transfer_data.to_user_id)
        if not to_user:
            self.logger.error(f"Destination user not found: {transfer_data.to_user_id}")
            raise UserNotFoundError(
                f"User with ID {transfer_data.to_user_id} not found"
            )

        # Validar que el usuario tiene saldo suficiente
        if not from_user.has_sufficient_balance(transfer_data.amount):
            self.logger.warning(
                f"User {transfer_data.from_user_id} has insufficient balance. "
                f"Required: {transfer_data.amount}, Available: {from_user.balance}"
            )
            raise InsufficientBalanceError(
                from_user.balance,
                transfer_data.amount,
                f"Insufficient balance for transfer. Required: {transfer_data.amount}, "
                f"Available: {from_user.balance}",
            )

        # Realizar la transferencia
        from_user.deduct_balance(transfer_data.amount)
        to_user.add_balance(transfer_data.amount)

        # Guardar cambios
        await self.user_repo.update(from_user)
        await self.user_repo.update(to_user)

        self.logger.info(
            f"Transfer completed successfully. {transfer_data.amount} transferred "
            f"from user {transfer_data.from_user_id} to user {transfer_data.to_user_id}"
        )

        # Retornar datos actualizados del usuario que envía
        return self.user_converter.to_dto(from_user)

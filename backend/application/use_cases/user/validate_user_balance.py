"""Use case para validar saldo de usuario antes de apostar."""

from application.use_cases.base_use_case import BaseUseCase
from domain.repositories.user_repository import IUserRepository
from domain.exceptions.user import UserNotFoundError, InsufficientBalanceError
from application.mixins.logging_mixin import LoggingMixin


class ValidateUserBalanceUseCase(BaseUseCase, LoggingMixin):
    """Use case para validar que el usuario tenga suficiente saldo para apostar."""

    def __init__(self, user_repository: IUserRepository) -> None:
        """Initialize the use case."""
        self._user_repository = user_repository

    async def execute(self, user_id: str, required_amount: float) -> bool:
        """
        Valida que el usuario tenga suficiente saldo.

        Args:
            user_id: ID del usuario
            required_amount: Cantidad requerida para apostar

        Returns:
            bool: True si tiene suficiente saldo

        Raises:
            UserNotFoundError: Si el usuario no existe
            InsufficientBalanceError: Si no tiene suficiente saldo
        """
        try:
            self.log_info(
                f"Validating balance for user {user_id}, required amount: {required_amount}"
            )

            # Obtener usuario
            user = await self._user_repository.get_by_id(user_id)
            if not user:
                raise UserNotFoundError(f"Usuario con ID {user_id} no encontrado")

            # Validar saldo
            if not user.has_sufficient_balance(required_amount):
                raise InsufficientBalanceError(
                    current_balance=user.virtual_currency,
                    required_amount=required_amount,
                )

            self.log_info(f"Balance validation successful for user {user_id}")
            return True

        except Exception as e:
            self.log_error(f"Error validating balance for user {user_id}: {str(e)}")
            raise e

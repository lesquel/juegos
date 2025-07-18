from domain.entities.user.user import UserEntity
from domain.exceptions.user import InsufficientBalanceError
from domain.interfaces.balance_validator import IBalanceValidator


class UserBalanceService(IBalanceValidator):
    """Servicio de dominio para operaciones de saldo de usuario."""

    @staticmethod
    def has_sufficient_balance(user: UserEntity, amount: float) -> bool:
        """
        Verifica si el usuario tiene suficiente saldo para una operación.

        Args:
            user: Entidad del usuario
            amount: Cantidad requerida

        Returns:
            bool: True si tiene suficiente saldo, False en caso contrario
        """
        if amount < 0:
            raise ValueError("Amount must be positive")

        return user.virtual_currency >= amount

    @staticmethod
    def deduct_balance(user: UserEntity, amount: float) -> None:
        """
        Deduce una cantidad del saldo del usuario.

        Args:
            user: Entidad del usuario
            amount: Cantidad a deducir

        Raises:
            InsufficientBalanceError: Si no tiene suficiente saldo
            ValueError: Si la cantidad es negativa
        """
        if amount < 0:
            raise ValueError("Amount to deduct must be positive")

        if not UserBalanceService.has_sufficient_balance(user, amount):
            raise InsufficientBalanceError(
                current_balance=user.virtual_currency,
                required_amount=amount,
                message=f"Insufficient balance. Required: {amount}, Available: {user.virtual_currency}",
            )

        user.virtual_currency -= amount

    @staticmethod
    def add_balance(user: UserEntity, amount: float) -> None:
        """
        Agrega una cantidad al saldo del usuario.

        Args:
            user: Entidad del usuario
            amount: Cantidad a agregar

        Raises:
            ValueError: Si la cantidad es negativa
        """
        if amount < 0:
            raise ValueError("Amount to add must be positive")

        user.virtual_currency += amount
        
    
    @staticmethod
    def calculate_reward(odds: float, base_bet: float) -> float:
        """
        Calcula la recompensa basada en las probabilidades y la apuesta base.

        Args:
            odds: Probabilidades de la partida
            base_bet: Monto de la apuesta base

        Returns:
            float: Recompensa calculada
        """
        return round(odds * base_bet, 2)


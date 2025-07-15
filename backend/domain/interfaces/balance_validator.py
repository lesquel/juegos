from abc import abstractmethod
from typing import Protocol
from domain.entities.user.user import UserEntity




class IBalanceValidator(Protocol):
    """Interfaz para validadores de saldo."""

    @abstractmethod
    def has_sufficient_balance(self, user: UserEntity, amount: float) -> bool:
        """Verifica si el usuario tiene suficiente saldo."""

    @abstractmethod
    def deduct_balance(self, user: UserEntity, amount: float) -> None:
        """Deduce una cantidad del saldo del usuario."""

    @abstractmethod
    def add_balance(self, user: UserEntity, amount: float) -> None:
        """Agrega una cantidad al saldo del usuario."""

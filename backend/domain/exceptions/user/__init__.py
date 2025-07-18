"""
Excepciones relacionadas con usuarios
"""

from ..base import DomainException, ValidationError


class UserAlreadyExistsError(DomainException):
    """Usuario ya existe"""

    def __init__(
        self,
        message: str = "User already exists",
        identifier: str = "user_already_exists",
    ):
        super().__init__(message, 409, identifier)


class UserNotFoundError(DomainException):
    """Usuario no encontrado"""

    def __init__(
        self, message: str = "User not found", identifier: str = "user_not_found"
    ):
        super().__init__(message, 404, identifier)


class FailedToRetrieveUserError(DomainException):
    """Error al recuperar usuario"""

    def __init__(
        self,
        message: str = "Failed to retrieve user",
        identifier: str = "failed_to_retrieve_user",
    ):
        super().__init__(message, 500, identifier)


class InsufficientFundsError(DomainException):
    """Fondos insuficientes"""

    def __init__(
        self,
        message: str = "Insufficient funds",
        identifier: str = "insufficient_funds",
    ):
        super().__init__(message, 400, identifier)


class InvalidEmailFormatError(ValidationError):
    """Formato de email inválido"""

    def __init__(self, email: str = ""):
        message = f"Invalid email format: {email}" if email else "Invalid email format"
        super().__init__(message, "invalid_email_format")


class WeakPasswordError(ValidationError):
    """Contraseña débil"""

    def __init__(self, message: str = "Password does not meet security requirements"):
        super().__init__(message, "weak_password")


class InsufficientBalanceError(DomainException):
    """Error cuando el usuario no tiene suficiente saldo"""

    def __init__(self, current_balance: float, required_amount: float, message: str = None):
        self.current_balance = current_balance
        self.required_amount = required_amount

        if message is None:
            message = f"Saldo insuficiente. Saldo actual: {current_balance}, cantidad requerida: {required_amount}"

        super().__init__(message)


__all__ = [
    "UserAlreadyExistsError",
    "UserNotFoundError",
    "FailedToRetrieveUserError",
    "InsufficientFundsError",
    "InvalidEmailFormatError",
    "WeakPasswordError",
    "InsufficientBalanceError",
]

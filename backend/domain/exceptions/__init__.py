"""
Excepciones del dominio - NO dependen de frameworks externos
Similar al sistema de Django pero adaptado para FastAPI
"""

from typing import Optional, Dict, Any


class DomainException(Exception):
    """Excepción base del dominio - equivalente a BaseError de Django"""

    def __init__(
        self,
        message: str,
        code: int = 500,
        identifier: str = "domain_error",
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.code = code  # HTTP status code
        self.identifier = identifier  # Para identificar el tipo de error
        self.details = details or {}
        super().__init__(message)


# ========== Excepciones de Autenticación ==========
class AuthenticationError(DomainException):
    """Error de autenticación"""

    def __init__(
        self,
        message: str = "Invalid credentials",
        identifier: str = "authentication_error",
    ):
        super().__init__(message, 401, identifier)


class InvalidTokenError(DomainException):
    """Token inválido"""

    def __init__(
        self, message: str = "Invalid token", identifier: str = "invalid_token"
    ):
        super().__init__(message, 401, identifier)


class ExpiredTokenError(DomainException):
    """Token expirado"""

    def __init__(
        self, message: str = "Token has expired", identifier: str = "expired_token"
    ):
        super().__init__(message, 401, identifier)


class InsufficientPermissionsError(DomainException):
    """Permisos insuficientes"""

    def __init__(
        self,
        message: str = "Insufficient permissions",
        identifier: str = "insufficient_permissions",
    ):
        super().__init__(message, 403, identifier)


# ========== Excepciones de Usuario ==========
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


# ========== Excepciones de Juegos ==========
class GameNotFoundError(DomainException):
    """Juego no encontrado"""

    def __init__(
        self, message: str = "Game not found", identifier: str = "game_not_found"
    ):
        super().__init__(message, 404, identifier)


class GameAlreadyExistsError(DomainException):
    """Juego ya existe"""

    def __init__(
        self,
        message: str = "Game already exists",
        identifier: str = "game_already_exists",
    ):
        super().__init__(message, 409, identifier)


# ========== Excepciones de Categorías ==========
class CategoryNotFoundError(DomainException):
    """Categoría no encontrada"""

    def __init__(
        self,
        message: str = "Category not found",
        identifier: str = "category_not_found",
    ):
        super().__init__(message, 404, identifier)


class CategoryAlreadyExistsError(DomainException):
    """Categoría ya existe"""

    def __init__(
        self,
        message: str = "Category already exists",
        identifier: str = "category_already_exists",
    ):
        super().__init__(message, 409, identifier)


# ========== Excepciones de Partidas ==========
class MatchNotFoundError(DomainException):
    """Partida no encontrada"""

    def __init__(
        self, message: str = "Match not found", identifier: str = "match_not_found"
    ):
        super().__init__(message, 404, identifier)


class MatchAlreadyFinishedError(DomainException):
    """Partida ya terminada"""

    def __init__(
        self,
        message: str = "Match has already finished",
        identifier: str = "match_already_finished",
    ):
        super().__init__(message, 400, identifier)


class MatchNotStartedError(DomainException):
    """Partida no iniciada"""

    def __init__(
        self,
        message: str = "Match has not started yet",
        identifier: str = "match_not_started",
    ):
        super().__init__(message, 400, identifier)


class AlreadyParticipatingError(DomainException):
    """Ya está participando en la partida"""

    def __init__(
        self,
        message: str = "User is already participating in this match",
        identifier: str = "already_participating",
    ):
        super().__init__(message, 409, identifier)


# ========== Excepciones de Transferencias ==========
class TransferNotFoundError(DomainException):
    """Transferencia no encontrada"""

    def __init__(
        self,
        message: str = "Transfer not found",
        identifier: str = "transfer_not_found",
    ):
        super().__init__(message, 404, identifier)


class InvalidTransferStateError(DomainException):
    """Estado de transferencia inválido"""

    def __init__(
        self,
        message: str = "Invalid transfer state",
        identifier: str = "invalid_transfer_state",
    ):
        super().__init__(message, 400, identifier)


# ========== Excepciones de Validación ==========
class ValidationError(DomainException):
    """Error de validación"""

    def __init__(self, message: str, identifier: str = "validation_error"):
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


# ========== Excepciones de Negocio ==========
class BusinessRuleViolationError(DomainException):
    """Violación de regla de negocio"""

    def __init__(self, message: str, identifier: str = "business_rule_violation"):
        super().__init__(message, 422, identifier)


class ConcurrencyError(DomainException):
    """Error de concurrencia"""

    def __init__(
        self,
        message: str = "Resource was modified by another process",
        identifier: str = "concurrency_error",
    ):
        super().__init__(message, 409, identifier)


# ========== Excepciones específicas del dominio de juegos ==========
class ServiceIdRequiredError(ValidationError):
    """Service ID es requerido"""

    def __init__(self, message: str = "service_id is required"):
        super().__init__(message, "service_id_required")


class CannotDeletePendingEventRentalError(BusinessRuleViolationError):
    """No se puede eliminar un evento pendiente"""

    def __init__(self, message: str = "Cannot delete pending event rental"):
        super().__init__(message, "cannot_delete_pending_event")

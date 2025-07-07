"""
Excepciones de autenticación y autorización
"""

from .base import DomainException


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

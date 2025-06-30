"""
Excepciones del dominio - NO dependen de frameworks externos
"""


class DomainException(Exception):
    """Excepción base del dominio"""

    def __init__(self, message: str, code: str = None):
        self.message = message
        self.code = code
        super().__init__(message)


class AuthenticationError(DomainException):
    """Error de autenticación"""

    def __init__(self, message: str = "Invalid credentials"):
        super().__init__(message, "AUTHENTICATION_ERROR")


class UserAlreadyExistsError(DomainException):
    """Usuario ya existe"""

    def __init__(self, message: str = "User already exists"):
        super().__init__(message, "USER_ALREADY_EXISTS")


class UserNotFoundError(DomainException):
    """Usuario no encontrado"""

    def __init__(self, message: str = "User not found"):
        super().__init__(message, "USER_NOT_FOUND")


class InvalidTokenError(DomainException):
    """Token inválido"""

    def __init__(self, message: str = "Invalid token"):
        super().__init__(message, "INVALID_TOKEN")


class ValidationError(DomainException):
    """Error de validación"""

    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR")

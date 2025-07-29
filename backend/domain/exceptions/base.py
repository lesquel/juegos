from typing import Any, Dict, Optional


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


# ========== Excepciones de Validación ==========
class ValidationError(DomainException):
    """Error de validación"""

    def __init__(self, message: str, identifier: str = "validation_error"):
        super().__init__(message, 400, identifier)


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

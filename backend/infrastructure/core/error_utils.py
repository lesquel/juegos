"""
Utilidades para manejo simplificado de errores - Estilo Django
"""
from typing import Any, NoReturn
from domain.exceptions import *


class ErrorRaiser:
    """Clase utilitaria para lanzar errores de manera simple y directa"""

    @staticmethod
    def not_found(resource: str, identifier: str = None) -> NoReturn:
        """Lanza error de recurso no encontrado"""
        message = f"{resource} not found"
        if identifier:
            message += f" with identifier: {identifier}"
        
        # Mapeo directo como en Django
        resource_lower = resource.lower()
        if "user" in resource_lower:
            raise UserNotFoundError(message)
        elif "game" in resource_lower:
            raise GameNotFoundError(message)
        elif "category" in resource_lower:
            raise CategoryNotFoundError(message)
        elif "match" in resource_lower:
            raise MatchNotFoundError(message)
        elif "transfer" in resource_lower:
            raise TransferNotFoundError(message)
        else:
            raise DomainException(message, 404, "resource_not_found")

    @staticmethod
    def already_exists(resource: str, identifier: str = None) -> NoReturn:
        """Lanza error de recurso ya existente"""
        message = f"{resource} already exists"
        if identifier:
            message += f" with identifier: {identifier}"
        
        resource_lower = resource.lower()
        if "user" in resource_lower:
            raise UserAlreadyExistsError(message)
        elif "game" in resource_lower:
            raise GameAlreadyExistsError(message)
        elif "category" in resource_lower:
            raise CategoryAlreadyExistsError(message)
        else:
            raise DomainException(message, 409, "resource_already_exists")

    @staticmethod
    def validation_failed(message: str, identifier: str = "validation_error") -> NoReturn:
        """Lanza error de validación simple"""
        raise ValidationError(message, identifier)

    @staticmethod
    def business_rule_violation(message: str, identifier: str = "business_rule_violation") -> NoReturn:
        """Lanza error de regla de negocio"""
        raise BusinessRuleViolationError(message, identifier)

    @staticmethod
    def insufficient_permissions(message: str = "Insufficient permissions") -> NoReturn:
        """Lanza error de permisos"""
        raise InsufficientPermissionsError(message)

    @staticmethod
    def authentication_failed(message: str = "Authentication failed") -> NoReturn:
        """Lanza error de autenticación"""
        raise AuthenticationError(message)

    @staticmethod
    def invalid_token(message: str = "Invalid token") -> NoReturn:
        """Lanza error de token inválido"""
        raise InvalidTokenError(message)

    @staticmethod
    def insufficient_funds(message: str = "Insufficient funds") -> NoReturn:
        """Lanza error de fondos insuficientes"""
        raise InsufficientFundsError(message)


class ErrorChecker:
    """Verificaciones simples que lanzan errores automáticamente"""

    @staticmethod
    def ensure_exists(obj: Any, resource_name: str, identifier: str = None):
        """Verifica que un objeto exista, si no lanza error"""
        if obj is None:
            ErrorRaiser.not_found(resource_name, identifier)
        return obj

    @staticmethod
    def ensure_not_exists(obj: Any, resource_name: str, identifier: str = None):
        """Verifica que un objeto NO exista, si existe lanza error"""
        if obj is not None:
            ErrorRaiser.already_exists(resource_name, identifier)

    @staticmethod
    def ensure_authorized(condition: bool, message: str = "Insufficient permissions"):
        """Verifica autorización"""
        if not condition:
            ErrorRaiser.insufficient_permissions(message)

    @staticmethod
    def ensure_valid(condition: bool, message: str, identifier: str = "validation_error"):
        """Verifica validez"""
        if not condition:
            ErrorRaiser.validation_failed(message, identifier)

    @staticmethod
    def ensure_business_rule(condition: bool, message: str, identifier: str = "business_rule_violation"):
        """Verifica regla de negocio"""
        if not condition:
            ErrorRaiser.business_rule_violation(message, identifier)

    @staticmethod
    def ensure_sufficient_funds(available: float, required: float):
        """Verifica fondos suficientes"""
        if available < required:
            ErrorRaiser.insufficient_funds(f"Required {required}, available {available}")


# Funciones de conveniencia específicas del dominio (como en tu Django)
def require_service_id(service_id):
    """Requiere que service_id esté presente"""
    if not service_id:
        raise ServiceIdRequiredError()


def cannot_delete_pending_event():
    """No se puede eliminar evento pendiente"""
    raise CannotDeletePendingEventRentalError()

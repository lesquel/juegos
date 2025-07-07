"""
Excepciones relacionadas con juegos
"""

from ..base import DomainException, ValidationError, BusinessRuleViolationError


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


class ServiceIdRequiredError(ValidationError):
    """Service ID es requerido"""

    def __init__(self, message: str = "service_id is required"):
        super().__init__(message, "service_id_required")


class CannotDeletePendingEventRentalError(BusinessRuleViolationError):
    """No se puede eliminar un evento pendiente"""

    def __init__(self, message: str = "Cannot delete pending event rental"):
        super().__init__(message, "cannot_delete_pending_event")


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

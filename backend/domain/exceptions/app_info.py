from .base import DomainException


class AppInfoNotFound(DomainException):
    """Error de información de la aplicación no encontrada"""

    def __init__(
        self,
        message: str = "App information not found",
        identifier: str = "app_info_not_found",
    ):
        super().__init__(message, 404, identifier)

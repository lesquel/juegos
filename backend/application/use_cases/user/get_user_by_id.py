"""Caso de uso para obtener usuario por ID."""

from domain.exceptions import UserNotFoundError
from domain.repositories import IUserRepository
from dtos.response.user.user_response import UserResponseDTO
from application.interfaces.base_use_case import BaseGetByIdUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class GetUserByIdUseCase(BaseGetByIdUseCase[UserResponseDTO]):
    """Caso de uso para obtener un usuario por ID."""

    def __init__(self, user_repo: IUserRepository, user_converter: EntityToDTOConverter):
        super().__init__(user_repo, user_converter)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para usuario no encontrado."""
        return UserNotFoundError(f"User with ID {entity_id} not found")



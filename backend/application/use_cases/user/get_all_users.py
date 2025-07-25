from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.interfaces.base_use_case import BasePaginatedUseCase
from domain.repositories import IUserRepository
from dtos.response.user.user_response import UserResponseDTO


class GetAllUsersUseCase(BasePaginatedUseCase[UserResponseDTO]):
    """Caso de uso para obtener todos los usuarios."""

    def __init__(
        self, user_repo: IUserRepository, user_converter: EntityToDTOConverter
    ):
        super().__init__(user_repo, user_converter)

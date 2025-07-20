from application.interfaces.base_use_case import BasePaginatedUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO


class GetAllCategoriesUseCase(BasePaginatedUseCase[CategoryResponseDTO]):
    """Caso de uso para obtener todas las categorías con paginación."""

    def __init__(
        self,
        category_repo: ICategoryRepository,
        category_converter: EntityToDTOConverter,
    ):
        super().__init__(category_repo, category_converter)

from application.interfaces.base_use_case import BaseGetByIdUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions.game import CategoryNotFoundError
from domain.repositories import ICategoryRepository
from dtos.response.game import CategoryResponseDTO


class GetCategoryByIdUseCase(BaseGetByIdUseCase[CategoryResponseDTO]):
    """Caso de uso para obtener una categoría por ID."""

    def __init__(
        self,
        category_repo: ICategoryRepository,
        category_converter: EntityToDTOConverter,
    ):
        super().__init__(category_repo, category_converter)

    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""
        return CategoryNotFoundError(f"Category with ID {entity_id} not found")

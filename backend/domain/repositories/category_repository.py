from abc import abstractmethod
from typing import Optional

from domain.entities.game import CategoryEntity
from interfaces.api.common.filters.specific_filters import CategoryFilterParams
from .base_repository import IBaseRepository


class ICategoryRepository(IBaseRepository[CategoryEntity, CategoryFilterParams]):
    """Repositorio específico para categorías"""

    @abstractmethod
    def get_by_name(self, name: str) -> Optional[CategoryEntity]:
        """
        Retrieves a category by its name.

        :param name: The name of the category to retrieve.
        :return: The Category object corresponding to the given name.
        """
        pass

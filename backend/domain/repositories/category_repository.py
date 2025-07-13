from abc import abstractmethod
from typing import Optional

from domain.entities.game import CategoryEntity
from interfaces.api.common.filters.specific_filters import CategoryFilterParams
from interfaces.api.common import PaginationParams, SortParams
from .base_repository import IReadOnlyRepository


class ICategoryRepository(IReadOnlyRepository[CategoryEntity, CategoryFilterParams]):
    """Repositorio específico para categorías"""
    @abstractmethod
    async def get_by_game_id(self, game_id: str, pagination: PaginationParams, filters: CategoryFilterParams, sort_params: SortParams) -> Optional[list[CategoryEntity]]:
        """
        Retrieves a list of categories associated with a specific game.

        :param game_id: The ID of the game to retrieve categories for.
        :return: A list of Category objects corresponding to the given game.
        """
        pass
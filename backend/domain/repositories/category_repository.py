from abc import abstractmethod
from typing import Optional

from application.common import BaseFilterParams, PaginationParams, SortParams
from domain.entities.game import CategoryEntity

from .base_repository import IReadOnlyRepository
from .common import ModelType


class ICategoryRepository(
    IReadOnlyRepository[CategoryEntity, BaseFilterParams, ModelType]
):
    """Repositorio específico para categorías"""

    @abstractmethod
    async def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: BaseFilterParams,
        sort_params: SortParams,
    ) -> Optional[list[CategoryEntity]]:
        """
        Retrieves a list of categories associated with a specific game.

        :param game_id: The ID of the game to retrieve categories for.
        :return: A list of Category objects corresponding to the given game.
        """

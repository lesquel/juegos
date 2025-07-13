from abc import abstractmethod
from typing import Optional

from domain.entities.game import GameEntity
from interfaces.api.common.filters.specific_filters import GameFilterParams
from interfaces.api.common import PaginationParams, SortParams
from .base_repository import IReadOnlyRepository


class IGameRepository(IReadOnlyRepository[GameEntity, GameFilterParams]):
    """Repositorio específico para juegos"""

    @abstractmethod
    async def get_by_category_id(
        self, category_id: str, pagination: PaginationParams, sort_params: SortParams
    ) -> Optional[list[GameEntity]]:
        """
        Retrieves a list of games associated with a specific category.

        :param category_id: The ID of the category to retrieve games for.
        :return: A list of Game objects corresponding to the given category.
        """
        pass

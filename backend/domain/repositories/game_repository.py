from abc import abstractmethod
from typing import Optional

from domain.common import BaseFilterParams, PaginationParams, SortParams
from domain.entities.game import GameEntity

from .base_repository import IReadOnlyRepository
from .common import ModelType


class IGameRepository(IReadOnlyRepository[GameEntity, BaseFilterParams, ModelType]):
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

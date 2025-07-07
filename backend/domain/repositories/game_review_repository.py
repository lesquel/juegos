from abc import abstractmethod
from typing import Optional

from domain.entities.game import GameReviewEntity
from interfaces.api.common.filters.specific_filters import GameReviewFilterParams
from .base_repository import IBaseRepository


class IGameReviewRepository(IBaseRepository[GameReviewEntity, GameReviewFilterParams]):
    """Repositorio específico para Game Reviews"""

    @abstractmethod 
    def get_by_name(self, name: str) -> Optional[GameReviewEntity]:
        """
        Retrieves a game by its name.

        :param name: The name of the game to retrieve.
        :return: The Game object corresponding to the given name.
        """
        pass

from abc import abstractmethod
from typing import Optional

from domain.entities.game import GameEntity
from interfaces.api.common.filters.specific_filters import GameFilterParams
from .base_repository import IBaseRepository


class IGameRepository(IBaseRepository[GameEntity, GameFilterParams]):
    """Repositorio específico para Gameías"""

    @abstractmethod
    def get_by_name(self, name: str) -> Optional[GameEntity]:
        """
        Retrieves a game by its name.

        :param name: The name of the game to retrieve.
        :return: The Game object corresponding to the given name.
        """
        pass

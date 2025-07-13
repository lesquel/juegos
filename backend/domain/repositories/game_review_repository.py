from abc import abstractmethod
from typing import Optional

from domain.entities.game import GameReviewEntity
from interfaces.api.common.filters.specific_filters import GameReviewFilterParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from .base_repository import IBaseRepository


class IGameReviewRepository(IBaseRepository[GameReviewEntity, GameReviewFilterParams]):
    """Repositorio específico para Game Reviews"""

    @abstractmethod
    async def get_by_game_id(
        self,
        game_id: str,
        pagination: Optional[PaginationParams] = None,
        filters: Optional[GameReviewFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> tuple[list[GameReviewEntity], int]:
        """Obtiene reseñas de un juego específico por su ID."""
        pass

    @abstractmethod
    async def get_by_user_and_game_id(
        self, user_id: str, game_id: str
    ) -> Optional[GameReviewEntity]:
        """Obtiene una reseña de un juego específico por el ID del usuario y del juego."""
        pass

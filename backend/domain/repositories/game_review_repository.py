from abc import abstractmethod
from typing import Optional

from domain.common import BaseFilterParams, PaginationParams, SortParams
from domain.entities.game import GameReviewEntity

from .base_repository import IBaseRepository
from .common import ModelType


class IGameReviewRepository(
    IBaseRepository[GameReviewEntity, BaseFilterParams, ModelType]
):
    """Repositorio específico para Game Reviews"""

    @abstractmethod
    async def get_by_game_id(
        self,
        game_id: str,
        pagination: Optional[PaginationParams] = None,
        filters: Optional[BaseFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> tuple[list[GameReviewEntity], int]:
        """Obtiene reseñas de un juego específico por su ID."""

    @abstractmethod
    async def get_by_user_and_game_id(
        self, user_id: str, game_id: str
    ) -> Optional[GameReviewEntity]:
        """Obtiene una reseña de un juego específico por el ID del usuario y del juego."""

from abc import abstractmethod
from typing import List

from application.common import BaseFilterParams
from domain.entities import MatchEntity

from .base_repository import IBaseRepository
from .common import ModelType


class IMatchRepository(IBaseRepository[MatchEntity, BaseFilterParams, ModelType]):
    """Repositorio específico para partidas"""

    @abstractmethod
    async def get_by_game_id(
        self, game_id: str, pagination, filters, sort_params
    ) -> tuple[List[MatchEntity], int]:
        """
        Obtiene partidas por ID de juego con paginación.

        Args:
            game_id: ID del juego
            pagination: Parámetros de paginación
            filters: Filtros específicos
            sort_params: Parámetros de ordenamiento

        Returns:
            Tupla con lista de partidas y total de registros
        """

    @abstractmethod
    async def get_match_participant_ids(self, match_id: str) -> List[str]:
        """
        Obtiene la lista de IDs de participantes de una partida.

        Args:
            match_id: ID de la partida

        Returns:
            Lista de IDs de usuarios participantes
        """

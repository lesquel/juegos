from abc import abstractmethod
from typing import List

from domain.common import BaseFilterParams
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

    @abstractmethod
    async def join_match(self, match_id: str, user_id: str) -> MatchEntity:
        """
        Permite a un usuario unirse a una partida.

        Args:
            match_id: ID de la partida
            user_id: ID del usuario
            bet_amount: Monto apostado (opcional)

        Returns:
            Entidad de partida actualizada
        """

    @abstractmethod
    async def finish_match(
        self, match_id: str, participations: list[tuple[str, int]]
    ) -> MatchEntity:
        """
        Actualiza la puntuación de un usuario en una partida.

        Args:
            match_id: ID de la partida
            participations: Lista de tuplas con ID de usuario y puntuación

        Returns:
            Entidad de partida actualizada
        """

    @abstractmethod
    async def is_user_participant(self, match_id: str, user_id: str) -> bool:
        """
        Verifica si un usuario es participante de una partida.

        Args:
            match_id: ID de la partida
            user_id: ID del usuario

        Returns:
            True si el usuario participa, False en caso contrario
        """

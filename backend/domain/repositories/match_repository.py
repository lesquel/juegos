from abc import abstractmethod
from typing import Optional, List

from domain.entities import MatchEntity
from interfaces.api.common.filters.specific_filters import MatchFilterParams
from .base_repository import IBaseRepository


class IMatchRepository(IBaseRepository[MatchEntity, MatchFilterParams]):
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
        pass

    @abstractmethod
    async def get_match_participant_ids(self, match_id: str) -> List[str]:
        """
        Obtiene la lista de IDs de participantes de una partida.
        
        Args:
            match_id: ID de la partida
            
        Returns:
            Lista de IDs de usuarios participantes
        """
        pass

    @abstractmethod
    async def join_match(self, match_id: str, user_id: str, bet_amount: Optional[float] = None) -> MatchEntity:
        """
        Permite a un usuario unirse a una partida.
        
        Args:
            match_id: ID de la partida
            user_id: ID del usuario
            bet_amount: Monto apostado (opcional)
            
        Returns:
            Entidad de partida actualizada
        """
        pass

    @abstractmethod
    async def update_user_score(self, match_id: str, user_id: str, score: int) -> MatchEntity:
        """
        Actualiza la puntuación de un usuario en una partida.
        
        Args:
            match_id: ID de la partida
            user_id: ID del usuario
            score: Nueva puntuación
            
        Returns:
            Entidad de partida actualizada
        """
        pass

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
        pass

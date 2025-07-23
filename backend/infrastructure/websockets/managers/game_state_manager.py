from typing import Any, Dict, Optional

from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.game_state_manager")


class GameStateManager:
    """Maneja el estado de los juegos activos"""

    def __init__(self):
        self.active_games: Dict[str, Any] = {}  # match_id -> game_engine

    def create_game(self, match_id: str, game_engine: Any) -> Any:
        """Crea una nueva instancia de juego"""
        self.active_games[match_id] = game_engine
        logger.info(f"Created game for match {match_id}")
        return game_engine

    def get_game(self, match_id: str) -> Optional[Any]:
        """Obtiene la instancia de juego para un match"""
        return self.active_games.get(match_id)

    def remove_game(self, match_id: str) -> bool:
        """Elimina un juego y retorna True si existía"""
        game = self.active_games.pop(match_id, None)
        if game:
            logger.info(f"Removed game for match {match_id}")
            return True
        return False

    def has_game(self, match_id: str) -> bool:
        """Verifica si existe un juego para el match"""
        return match_id in self.active_games

    def get_all_active_matches(self) -> list[str]:
        """Obtiene todos los match_ids activos"""
        return list(self.active_games.keys())

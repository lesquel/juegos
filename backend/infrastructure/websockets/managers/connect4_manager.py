from typing import Any

from infrastructure.dependencies.factories import get_game_engine

from ..game_names import CONNECT4_NAME
from .base_game_manager import BaseGameWebSocketManager


class Connect4WebSocketManager(BaseGameWebSocketManager):
    """Manager específico para juegos de Connect4 (Conecta 4)"""

    @property
    def game_type(self) -> str:
        return CONNECT4_NAME

    def create_game_engine(self, match_id: str) -> Any:
        """Crea una instancia del motor de Connect4"""
        return get_game_engine(self.game_type)

    def get_max_players(self) -> int:
        """Connect4 permite 2 jugadores activos"""
        return 2

    def assign_player_symbol(self, current_players: int) -> str:
        """Asigna símbolos para Connect4: R (rojo) y Y (amarillo)"""
        if current_players == 0:
            return "R"  # Primer jugador es rojo
        elif current_players == 1:
            return "Y"  # Segundo jugador es amarillo
        else:
            return "S"  # Espectador

    def get_player_color_from_symbol(self, symbol: str) -> str:
        """Convierte el símbolo del jugador a color para Connect4"""
        color_map = {"R": "red", "Y": "yellow", "S": "spectator"}
        return color_map.get(symbol, "spectator")

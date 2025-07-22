from typing import Any

from domain.enums.online_game_type import GameType
from infrastructure.dependencies.factories import get_game_engine

from .base_game_manager import BaseGameWebSocketManager


class TictactoeWebSocketManager(BaseGameWebSocketManager):
    """Manager específico para juegos de TicTacToe (Tres en Raya)"""

    @property
    def game_type(self) -> str:
        return "tictactoe"

    def create_game_engine(self, match_id: str) -> Any:
        """Crea una instancia del motor de TicTacToe"""
        return get_game_engine(GameType.tictactoe)

    def get_max_players(self) -> int:
        """TicTacToe permite 2 jugadores activos"""
        return 2

    def assign_player_symbol(self, current_players: int) -> str:
        """Asigna símbolos para TicTacToe: X y O"""
        if current_players == 0:
            return "X"  # Primer jugador es X
        elif current_players == 1:
            return "O"  # Segundo jugador es O
        else:
            return "S"  # Espectador

    def get_player_color_from_symbol(self, symbol: str) -> str:
        """Convierte el símbolo del jugador a color para TicTacToe"""
        color_map = {"X": "blue", "O": "red", "S": "spectator"}
        return color_map.get(symbol, "spectator")

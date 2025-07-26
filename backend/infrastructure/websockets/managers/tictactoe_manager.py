from typing import Any

from infrastructure.dependencies.factories import get_game_engine

from ..game_names import TICTACTOE_NAME
from .base_game_manager import BaseGameWebSocketManager


class TictactoeWebSocketManager(BaseGameWebSocketManager):
    """Manager específico para juegos de TicTacToe (Tres en Raya)"""

    @property
    def game_type(self) -> str:
        return TICTACTOE_NAME

    def create_game_engine(self, match_id: str) -> Any:
        """Crea una instancia del motor de TicTacToe"""
        from domain.game_engines.tictactoe import TictactoeGame
        # Crear instancia fresca del motor para evitar problemas de cache
        engine = TictactoeGame()
        print(f"🎮 TicTacToe engine created - Board dimensions: {len(engine.board)}x{len(engine.board[0]) if engine.board else 0}")
        return engine

    def get_max_players(self) -> int:
        """TicTacToe permite 2 jugadores activos"""
        return 2

    def assign_player_symbol(self, current_players: int) -> str:
        """Asigna símbolos para TicTacToe: R y Y (compatible con Connect4)"""
        if current_players == 0:
            return "R"  # Primer jugador es R
        elif current_players == 1:
            return "Y"  # Segundo jugador es Y
        else:
            return "S"  # Espectador

    def get_player_color_from_symbol(self, symbol: str) -> str:
        """Convierte el símbolo del jugador a color para TicTacToe"""
        color_map = {"R": "red", "Y": "yellow", "S": "spectator"}
        return color_map.get(symbol, "spectator")

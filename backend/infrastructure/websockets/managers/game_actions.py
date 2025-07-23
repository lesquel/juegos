from typing import Any, Protocol

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.game_actions")

# Constantes para mensajes
GAME_NOT_FOUND_ERROR = "Juego no encontrado"


class GameManagerProtocol(Protocol):
    """Protocolo que define la interfaz necesaria para GameActions"""

    def get_game(self, match_id: str) -> Any:
        ...

    def get_player_symbol(self, match_id: str, player_id: str) -> str:
        ...

    async def broadcast(self, match_id: str, message: dict):
        ...


class GameActions:
    """Maneja las acciones específicas del juego"""

    def __init__(self, manager: GameManagerProtocol):
        self.manager = manager

    async def handle_make_move(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja un movimiento del juego"""
        game = self.manager.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        player_id = message.get("player_id")
        player_symbol = self.manager.get_player_symbol(match_id, player_id)

        if player_symbol != game.current_player:
            await websocket.send_json({"type": "error", "message": "No es tu turno"})
            return

        try:
            move_data = message.get("move", {})
            result = game.apply_move(move_data)

            response = {
                "type": "move_made",
                "player_id": player_id,
                "player_symbol": player_symbol,
                "move": move_data,
                "result": result,
                "game_state": game.get_game_state(),
            }

            print(response)

            await self.manager.broadcast(match_id, response)

        except ValueError as e:
            await websocket.send_json({"type": "error", "message": str(e)})

    async def handle_restart_game(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja el reinicio del juego"""
        game = self.manager.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        game.reset_game()
        response = {"type": "game_restarted", "game_state": game.get_game_state()}
        await self.manager.broadcast(match_id, response)

    async def handle_get_game_state(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Envía el estado actual del juego al jugador que lo solicita"""
        game = self.manager.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        # Obtener jugadores desde el manager
        players = {}
        if hasattr(self.manager, "player_manager"):
            players = self.manager.player_manager.get_match_players(match_id)

        response = {
            "type": "game_state",
            "game_state": game.get_game_state(),
            "players": players,
        }

        await websocket.send_json(response)

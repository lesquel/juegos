from typing import Any, Protocol

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.player_actions")


class PlayerActionManagerProtocol(Protocol):
    """Protocolo que define la interfaz necesaria para PlayerActions"""

    def create_game_engine(self, match_id: str) -> Any:
        ...

    def get_max_players(self) -> int:
        ...

    def assign_player_symbol(self, current_players: int) -> str:
        ...

    def get_player_color_from_symbol(self, symbol: str) -> str:
        ...

    def get_game(self, match_id: str) -> Any:
        ...

    async def broadcast(self, match_id: str, message: dict):
        ...


class PlayerActions:
    """Maneja las acciones relacionadas con los jugadores"""

    def __init__(self, manager: PlayerActionManagerProtocol):
        self.manager = manager

    async def handle_join_game(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja cuando un jugador se une al juego"""
        player_id = user_id if user_id else message.get("player_id")

        if user_id:
            logger.info(
                f"Using authenticated user_id {user_id} as player_id for match {match_id}"
            )

        if not player_id:
            logger.error(f"No player_id or user_id provided for match {match_id}")
            await websocket.send_json(
                {"type": "error", "message": "Player ID required"}
            )
            return

        # Verificar si el jugador ya está en el match
        if hasattr(
            self.manager, "player_manager"
        ) and self.manager.player_manager.is_player_in_match(match_id, player_id):
            logger.info(
                f"Player {player_id} already exists in match {match_id}, sending current game state"
            )
            await self._send_existing_player_state(match_id, websocket, player_id)
            return

        # Crear juego si no existe
        if hasattr(
            self.manager, "game_state_manager"
        ) and not self.manager.game_state_manager.has_game(match_id):
            game_engine = self.manager.create_game_engine(match_id)
            self.manager.game_state_manager.create_game(match_id, game_engine)
            if hasattr(self.manager, "player_manager"):
                # No necesitamos inicializar players aquí, se hace en add_player_to_match
                pass

        # Verificar límite de jugadores
        current_players = 0
        if hasattr(self.manager, "player_manager"):
            current_players = self.manager.player_manager.get_players_count(match_id)

        max_players = self.manager.get_max_players()

        if current_players >= max_players:
            # Asignar como espectador
            player_symbol = "S"
            player_color = "spectator"
        else:
            # Asignar símbolo de jugador activo
            player_symbol = self.manager.assign_player_symbol(current_players)
            player_color = self.manager.get_player_color_from_symbol(player_symbol)

        # Agregar jugador al match
        if hasattr(self.manager, "player_manager"):
            self.manager.player_manager.add_player_to_match(
                match_id, player_id, player_symbol
            )

        # Enviar estado del juego al jugador que se unió
        await self._send_game_state_to_player(
            match_id, websocket, player_id, player_color, current_players
        )

        # Notificar a otros jugadores
        await self._broadcast_player_joined(match_id, player_id, player_symbol)

    async def _send_existing_player_state(
        self, match_id: str, websocket: WebSocket, player_id: str
    ):
        """Envía el estado actual del juego a un jugador que ya existe"""
        game = self.manager.get_game(match_id)
        existing_player_symbol = None

        if hasattr(self.manager, "player_manager"):
            existing_player_symbol = self.manager.player_manager.get_player_symbol(
                match_id, player_id
            )

        player_color = (
            self.manager.get_player_color_from_symbol(existing_player_symbol)
            if existing_player_symbol
            else "unknown"
        )

        players_count = 0
        if hasattr(self.manager, "player_manager"):
            players_count = self.manager.player_manager.get_players_count(match_id)

        response = {
            "type": "game_state",
            "game_id": match_id,
            "player_id": player_id,
            "player_color": player_color,
            "state": (
                "playing"
                if players_count >= self.manager.get_max_players()
                else "waiting_for_players"
            ),
            "current_player": game.current_player if game else 1,
            "board": game.get_board() if game else None,
            "winner": None,
            "message": "Player already in game",
        }

        await websocket.send_json(response)

    async def _send_game_state_to_player(
        self,
        match_id: str,
        websocket: WebSocket,
        player_id: str,
        player_color: str,
        current_players: int,
    ):
        """Envía el estado del juego al jugador que se acaba de unir"""
        game = self.manager.get_game(match_id)

        response = {
            "type": "game_state",
            "game_id": match_id,
            "player_id": player_id,
            "player_color": player_color,
            "state": (
                "waiting_for_players"
                if current_players < self.manager.get_max_players()
                else "playing"
            ),
            "current_player": game.current_player if game else 1,
            "board": game.get_board() if game else None,
            "winner": None,
        }

        await websocket.send_json(response)

    async def _broadcast_player_joined(
        self, match_id: str, player_id: str, player_symbol: str
    ):
        """Notifica a otros jugadores que un nuevo jugador se unió"""
        players_count = 0
        if hasattr(self.manager, "player_manager"):
            players_count = self.manager.player_manager.get_players_count(match_id)

        broadcast_response = {
            "type": "player_joined",
            "player_id": player_id,
            "player_symbol": player_symbol,
            "players_count": players_count,
        }

        await self.manager.broadcast(match_id, broadcast_response)

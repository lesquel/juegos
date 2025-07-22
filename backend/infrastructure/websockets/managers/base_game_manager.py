from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.websocket_manager import WebSocketManager

logger = get_logger("websockets.base_game_manager")

# Constantes para mensajes
GAME_NOT_FOUND_ERROR = "Juego no encontrado"


class BaseGameWebSocketManager(WebSocketManager, ABC):
    """Clase base para managers de WebSocket específicos de juegos"""

    def __init__(self):
        super().__init__()
        self.active_games: Dict[str, Any] = {}  # match_id -> game_engine
        self.match_players: Dict[str, Dict[str, str]] = {}
        self.match_users: Dict[
            str, Dict[str, WebSocket]
        ] = {}  # match_id -> {user_id -> websocket}

    @property
    @abstractmethod
    def game_type(self) -> str:
        """Tipo de juego que maneja este manager"""

    @abstractmethod
    def create_game_engine(self, match_id: str) -> Any:
        """Crea una instancia específica del motor de juego"""

    @abstractmethod
    def get_max_players(self) -> int:
        """Número máximo de jugadores para este tipo de juego"""

    @abstractmethod
    def assign_player_symbol(self, current_players: int) -> str:
        """Asigna un símbolo al jugador basado en el número de jugadores actuales"""

    @abstractmethod
    def get_player_color_from_symbol(self, symbol: str) -> str:
        """Convierte el símbolo del jugador a color"""

    def create_game(self, match_id: str) -> Any:
        """Crea una nueva instancia de juego"""
        game = self.create_game_engine(match_id)
        self.active_games[match_id] = game
        self.match_players[match_id] = {}
        logger.info(f"Created {self.game_type} game for match {match_id}")
        return game

    def get_game(self, match_id: str) -> Optional[Any]:
        """Obtiene la instancia de juego para un match"""
        return self.active_games.get(match_id)

    def add_player_to_match(self, match_id: str, player_id: str, player_symbol: str):
        """Agrega un jugador a un match"""
        if match_id not in self.match_players:
            self.match_players[match_id] = {}
        self.match_players[match_id][player_id] = player_symbol
        logger.info(
            f"Added player {player_id} with symbol {player_symbol} to match {match_id}"
        )

    def get_player_symbol(self, match_id: str, player_id: str) -> Optional[str]:
        """Obtiene el símbolo del jugador en un match"""
        return self.match_players.get(match_id, {}).get(player_id)

    def remove_game(self, match_id: str):
        """Elimina un juego y limpia recursos"""
        self.active_games.pop(match_id, None)
        self.match_players.pop(match_id, None)
        self.match_users.pop(match_id, None)
        logger.info(f"Removed game for match {match_id}")

    def connect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Conecta un websocket a un match, verificando si el usuario ya está conectado"""
        if (
            user_id
            and match_id in self.match_users
            and user_id in self.match_users[match_id]
        ):
            logger.info(
                f"User {user_id} already connected to match {match_id}, rejecting duplicate connection"
            )
            return False

        super().connect(match_id, websocket)

        if user_id:
            if match_id not in self.match_users:
                self.match_users[match_id] = {}
            self.match_users[match_id][user_id] = websocket
            logger.info(f"User {user_id} connected to match {match_id}")

        return True

    def disconnect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Sobrescribe disconnect para limpiar recursos del juego y usuarios"""
        super().disconnect(match_id, websocket)

        if user_id and match_id in self.match_users:
            self.match_users[match_id].pop(user_id, None)
            if not self.match_users[match_id]:
                del self.match_users[match_id]

        if (
            match_id not in self.active_connections
            or not self.active_connections[match_id]
        ):
            self.remove_game(match_id)

    async def handle_game_message(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja mensajes específicos del juego"""
        return await self._get_game_action_factory(
            match_id, websocket, message, user_id
        )

    async def _get_game_action_factory(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Factory method para manejar diferentes tipos de mensajes"""
        message_type = message.get("type") or message.get("action")

        if message_type == "join_game":
            await self._handle_join_game(match_id, websocket, message, user_id)
        elif message_type == "create_game":
            await self._handle_create_game(match_id, websocket, message, user_id)
        elif message_type == "make_move":
            await self._handle_make_move(match_id, websocket, message)
        elif message_type == "restart_game":
            await self._handle_restart_game(match_id, websocket, message)
        elif message_type == "get_game_state":
            await self._handle_get_game_state(match_id, websocket, message)
        else:
            await self.broadcast(match_id, message)

    async def _handle_join_game(
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
        if match_id in self.match_players and player_id in self.match_players[match_id]:
            logger.info(
                f"Player {player_id} already exists in match {match_id}, sending current game state"
            )
            await self._send_existing_player_state(match_id, websocket, player_id)
            return

        # Crear juego si no existe
        if match_id not in self.active_games:
            self.create_game(match_id)

        # Verificar límite de jugadores
        current_players = len(self.match_players.get(match_id, {}))
        max_players = self.get_max_players()

        if current_players >= max_players:
            # Asignar como espectador
            player_symbol = "S"
            player_color = "spectator"
        else:
            # Asignar símbolo de jugador activo
            player_symbol = self.assign_player_symbol(current_players)
            player_color = self.get_player_color_from_symbol(player_symbol)

        self.add_player_to_match(match_id, player_id, player_symbol)

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
        game = self.get_game(match_id)
        existing_player_symbol = self.get_player_symbol(match_id, player_id)
        player_color = self.get_player_color_from_symbol(existing_player_symbol)

        response = {
            "type": "game_state",
            "game_id": match_id,
            "player_id": player_id,
            "player_color": player_color,
            "state": "playing"
            if len(self.match_players[match_id]) >= self.get_max_players()
            else "waiting_for_players",
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
        game = self.get_game(match_id)

        response = {
            "type": "game_state",
            "game_id": match_id,
            "player_id": player_id,
            "player_color": player_color,
            "state": "waiting_for_players"
            if current_players < self.get_max_players()
            else "playing",
            "current_player": game.current_player if game else 1,
            "board": game.get_board() if game else None,
            "winner": None,
        }

        await websocket.send_json(response)

    async def _broadcast_player_joined(
        self, match_id: str, player_id: str, player_symbol: str
    ):
        """Notifica a otros jugadores que un nuevo jugador se unió"""
        broadcast_response = {
            "type": "player_joined",
            "player_id": player_id,
            "player_symbol": player_symbol,
            "players_count": len(self.match_players[match_id]),
        }

        await self.broadcast(match_id, broadcast_response)

    async def _handle_create_game(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja la creación de un nuevo juego - delegado a implementaciones específicas"""
        # Por defecto, redirigir a join_game
        await self._handle_join_game(match_id, websocket, message, user_id)

    async def _handle_make_move(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja un movimiento del juego"""
        game = self.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        player_id = message.get("player_id")
        player_symbol = self.get_player_symbol(match_id, player_id)

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

            await self.broadcast(match_id, response)

        except ValueError as e:
            await websocket.send_json({"type": "error", "message": str(e)})

    async def _handle_restart_game(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja el reinicio del juego"""
        game = self.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        game.reset_game()
        response = {"type": "game_restarted", "game_state": game.get_game_state()}
        await self.broadcast(match_id, response)

    async def _handle_get_game_state(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Envía el estado actual del juego al jugador que lo solicita"""
        game = self.get_game(match_id)
        if not game:
            await websocket.send_json(
                {"type": "error", "message": GAME_NOT_FOUND_ERROR}
            )
            return

        response = {
            "type": "game_state",
            "game_state": game.get_game_state(),
            "players": self.match_players.get(match_id, {}),
        }

        await websocket.send_json(response)

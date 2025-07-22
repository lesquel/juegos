from typing import Any, Dict, Optional

from fastapi import WebSocket
from infrastructure.dependencies.factories import get_game_engine
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.websocket_manager import WebSocketManager

# Constantes para mensajes
GAME_NOT_FOUND_ERROR = "Juego no encontrado"

logger = get_logger("websockets.game_manager")


class GameWebSocketManager(WebSocketManager):
    def __init__(self):
        super().__init__()
        self.active_games: Dict[str, Any] = {}  # match_id -> game_engine
        self.match_players: Dict[str, Dict[str, str]] = {}
        self.match_users: Dict[
            str, Dict[str, WebSocket]
        ] = {}  # match_id -> {user_id -> websocket}

    def create_game(self, match_id: str, game_type: str) -> Any:
        """Crea una nueva instancia de juego"""
        game = get_game_engine(game_type)

        self.active_games[match_id] = game
        self.match_players[match_id] = {}
        return game

    def get_game(self, match_id: str) -> Optional[Any]:
        """Obtiene la instancia de juego para un match"""
        return self.active_games.get(match_id)

    def add_player_to_match(self, match_id: str, player_id: str, player_symbol: str):
        """Agrega un jugador a un match"""
        if match_id not in self.match_players:
            self.match_players[match_id] = {}
        self.match_players[match_id][player_id] = player_symbol

    def get_player_symbol(self, match_id: str, player_id: str) -> Optional[str]:
        """Obtiene el símbolo del jugador en un match"""
        return self.match_players.get(match_id, {}).get(player_id)

    def remove_game(self, match_id: str):
        """Elimina un juego y limpia recursos"""
        self.active_games.pop(match_id, None)
        self.match_players.pop(match_id, None)
        self.match_users.pop(match_id, None)

    async def handle_game_message(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja mensajes específicos del juego"""
        return await self._get_game_action_factory(
            match_id, websocket, message, user_id
        )

    async def _handle_join_game(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja cuando un jugador se une al juego"""
        # Usar el user_id autenticado como player_id si está disponible
        # Si no, usar el player_id del mensaje como fallback
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
            # El jugador ya está en el match, enviar el estado actual sin agregarlo nuevamente
            logger.info(
                f"Player {player_id} already exists in match {match_id}, sending current game state"
            )
            game = self.get_game(match_id)
            existing_player_symbol = self.get_player_symbol(match_id, player_id)

            if existing_player_symbol == "R":
                player_color = "red"
            elif existing_player_symbol == "Y":
                player_color = "yellow"
            else:
                player_color = "spectator"

            response = {
                "type": "game_state",
                "game_id": match_id,
                "player_id": player_id,
                "player_color": player_color,
                "state": (
                    "playing"
                    if len(self.match_players[match_id]) >= 2
                    else "waiting_for_players"
                ),
                "current_player": game.current_player if game else 1,
                "board": game.get_board() if game else None,
                "winner": None,
                "message": "Player already in game",
            }

            await websocket.send_json(response)
            return

        game_type = message.get("game_type")

        # Convertir game_type al formato esperado
        if game_type == "connect4":
            game_type = "conecta4"

        # Crear juego si no existe
        if match_id not in self.active_games:
            self.create_game(match_id, game_type)

        # Asignar símbolo al jugador
        current_players = len(self.match_players.get(match_id, {}))
        if current_players == 0:
            player_symbol = "R"  # Primer jugador es rojo
        elif current_players == 1:
            player_symbol = "Y"  # Segundo jugador es amarillo
        else:
            # Jugador espectador
            player_symbol = "S"

        self.add_player_to_match(match_id, player_id, player_symbol)

        # Enviar estado del juego al jugador que se unió
        game = self.get_game(match_id)

        if player_symbol == "R":
            player_color = "red"
        elif player_symbol == "Y":
            player_color = "yellow"
        else:
            player_color = "spectator"

        response = {
            "type": "game_state",
            "game_id": match_id,
            "player_id": player_id,
            "player_color": player_color,
            "state": "waiting_for_players" if current_players < 2 else "playing",
            "current_player": game.current_player if game else 1,
            "board": game.get_board() if game else None,
            "winner": None,
        }

        await websocket.send_json(response)

        # También notificar a otros jugadores
        broadcast_response = {
            "type": "player_joined",
            "player_id": player_id,
            "player_symbol": player_symbol,
            "players_count": len(self.match_players[match_id]),
        }

        await self.broadcast(match_id, broadcast_response)

    async def _handle_create_game(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja la creación de un nuevo juego"""
        game_type = message.get("game_type", "connect4")

        # Convertir game_type al formato esperado
        if game_type == "connect4":
            game_type = "conecta4"

        # Crear el juego
        try:
            game = self.create_game(match_id, game_type)

            # Generar un player_id único si no se proporciona
            import random
            import string

            player_id = (
                message.get("player_id")
                or f"player_{''.join(random.choices(string.ascii_lowercase + string.digits, k=9))}"
            )

            # Asignar al jugador como primer jugador
            self.add_player_to_match(match_id, player_id, "R")  # Primer jugador es rojo

            # Enviar estado del juego
            response = {
                "type": "game_state",
                "game_id": match_id,
                "player_id": player_id,
                "player_color": "red",
                "state": "waiting_for_players",
                "current_player": 1,
                "board": game.get_board(),
                "winner": None,
            }

            await websocket.send_json(response)

        except Exception as e:
            await websocket.send_json(
                {"type": "error", "message": f"Error creando juego: {str(e)}"}
            )

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

        # Verificar si es el turno del jugador
        if player_symbol != game.current_player:
            await websocket.send_json({"type": "error", "message": "No es tu turno"})
            return

        try:
            # Aplicar movimiento
            move_data = message.get("move", {})
            result = game.apply_move(move_data)

            # Enviar resultado a todos los jugadores
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
            # Enviar error solo al jugador que hizo el movimiento inválido
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

        # Reiniciar el juego
        game.reset_game()

        # Notificar a todos los jugadores
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

    def connect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Conecta un websocket a un match, verificando si el usuario ya está conectado"""
        if (
            user_id
            and match_id in self.match_users
            and user_id in self.match_users[match_id]
        ):
            # El usuario ya está conectado, no hacer nada
            logger.info(
                f"User {user_id} already connected to match {match_id}, rejecting duplicate connection"
            )
            return False

        # Llamar al método padre para manejar la conexión del websocket
        super().connect(match_id, websocket)

        # Registrar el usuario si se proporciona user_id
        if user_id:
            if match_id not in self.match_users:
                self.match_users[match_id] = {}
            self.match_users[match_id][user_id] = websocket
            logger.info(f"User {user_id} connected to match {match_id}")

        return True

    def disconnect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Sobrescribe disconnect para limpiar recursos del juego y usuarios"""
        super().disconnect(match_id, websocket)

        # Remover el usuario del mapeo si se proporciona user_id
        if user_id and match_id in self.match_users:
            self.match_users[match_id].pop(user_id, None)
            if not self.match_users[match_id]:
                del self.match_users[match_id]

        # Si no quedan conexiones, limpiar el juego
        if (
            match_id not in self.active_connections
            or not self.active_connections[match_id]
        ):
            self.remove_game(match_id)

    async def _get_game_action_factory(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        message_type = message.get("type") or message.get("action")

        if message_type == "join_game":
            await self._handle_join_game(match_id, websocket, message, user_id)
        elif message_type == "create_game":
            await self._handle_create_game(match_id, websocket, message)
        elif message_type == "make_move":
            await self._handle_make_move(match_id, websocket, message)
        elif message_type == "restart_game":
            await self._handle_restart_game(match_id, websocket, message)
        elif message_type == "get_game_state":
            await self._handle_get_game_state(match_id, websocket, message)
        else:
            # Para otros tipos de mensajes, usar el comportamiento base
            await self.broadcast(match_id, message)

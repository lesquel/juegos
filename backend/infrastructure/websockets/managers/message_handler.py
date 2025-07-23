from typing import Protocol

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.message_handler")

# Constants for message types
JOIN_GAME = "join_game"
CREATE_GAME = "create_game"
MAKE_MOVE = "make_move"
RESTART_GAME = "restart_game"
GET_GAME_STATE = "get_game_state"


class MessageHandlerProtocol(Protocol):
    """Protocolo que define la interfaz necesaria para MessageHandler"""

    async def broadcast(self, match_id: str, message: dict):
        ...


class MessageHandler:
    """Maneja el enrutamiento de mensajes WebSocket"""

    def __init__(self, manager: MessageHandlerProtocol):
        self.manager = manager
        self.player_actions = None
        self.game_actions = None

    def set_action_handlers(self, player_actions, game_actions):
        """Configura los manejadores de acciones"""
        self.player_actions = player_actions
        self.game_actions = game_actions

    async def handle_message(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Factory method para manejar diferentes tipos de mensajes"""
        message_type = message.get("type") or message.get("action")

        if message_type in (JOIN_GAME, CREATE_GAME):
            # Ambos tipos redirigen a join_game
            if self.player_actions:
                await self.player_actions.handle_join_game(
                    match_id, websocket, message, user_id
                )
        elif message_type == MAKE_MOVE:
            if self.game_actions:
                await self.game_actions.handle_make_move(match_id, websocket, message)
        elif message_type == RESTART_GAME:
            if self.game_actions:
                await self.game_actions.handle_restart_game(
                    match_id, websocket, message
                )
        elif message_type == GET_GAME_STATE:
            if self.game_actions:
                await self.game_actions.handle_get_game_state(
                    match_id, websocket, message
                )
        else:
            # Mensaje no reconocido, hacer broadcast
            await self.manager.broadcast(match_id, message)

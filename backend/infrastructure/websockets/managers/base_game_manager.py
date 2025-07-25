from abc import ABC, abstractmethod
from typing import Any, Optional

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.websocket_manager import WebSocketManager

from .game_actions import GameActions
from .game_state_manager import GameStateManager
from .message_handler import MessageHandler
from .player_actions import PlayerActions
from .player_manager import PlayerManager

logger = get_logger("websockets.base_game_manager")


class BaseGameWebSocketManager(WebSocketManager, ABC):
    """Clase base para managers de WebSocket específicos de juegos"""

    def __init__(self, game_finish_service=None):
        super().__init__()
        # Inicializar los módulos de gestión
        self.game_state_manager = GameStateManager()
        self.player_manager = PlayerManager()
        self.message_handler = MessageHandler(self)

        # Configurar los manejadores de acciones
        self.player_actions = PlayerActions(self)
        self.game_actions = GameActions(self, game_finish_service)
        self.message_handler.set_action_handlers(self.player_actions, self.game_actions)

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
        return self.game_state_manager.create_game(match_id, game)

    def get_game(self, match_id: str) -> Optional[Any]:
        """Obtiene la instancia de juego para un match"""
        return self.game_state_manager.get_game(match_id)

    def get_player_symbol(self, match_id: str, player_id: str) -> Optional[str]:
        """Obtiene el símbolo del jugador en un match"""
        return self.player_manager.get_player_symbol(match_id, player_id)

    def remove_game(self, match_id: str):
        """Elimina un juego y limpia recursos"""
        self.game_state_manager.remove_game(match_id)
        self.player_manager.remove_match_data(match_id)
        logger.info(f"Removed game for match {match_id}")

    def connect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Conecta un websocket a un match, verificando si el usuario ya está conectado"""
        if user_id:
            if not self.player_manager.add_user_connection(
                match_id, user_id, websocket
            ):
                logger.warning(f"User {user_id} already connected to match {match_id}")
                return False
            # Solo llamar a super().connect() si la conexión del usuario fue exitosa
            super().connect(match_id, websocket)
            logger.info(f"User {user_id} connected to match {match_id}")
        else:
            # Si no hay user_id, conectar directamente
            super().connect(match_id, websocket)
            logger.info(f"Anonymous connection added to match {match_id}")

        connections_count = len(self.active_connections.get(match_id, []))
        logger.info(f"Total connections for match {match_id}: {connections_count}")

        return True

    def disconnect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Sobrescribe disconnect para limpiar recursos del juego y usuarios"""
        super().disconnect(match_id, websocket)

        if user_id:
            self.player_manager.remove_user_connection(match_id, user_id)

        if (
            match_id not in self.active_connections
            or not self.active_connections[match_id]
        ):
            self.remove_game(match_id)

    async def handle_game_message(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja mensajes específicos del juego usando el message handler"""
        return await self.message_handler.handle_message(
            match_id, websocket, message, user_id
        )

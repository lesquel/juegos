from typing import Any, Dict, Optional

from fastapi import WebSocket
from infrastructure.dependencies.factories.game_manager_factory import (
    get_game_websocket_manager as get_specific_manager,
)
from infrastructure.logging.logging_config import get_logger

from .game_names import CONNECT4_NAME

logger = get_logger("websockets.unified_game_manager")


class UnifiedGameWebSocketManager:
    """
    Manager unificado que delega a managers específicos según el tipo de juego.
    Mantiene la compatibilidad con el código existente mientras usa el nuevo sistema modular.
    """

    def __init__(self, game_finish_service=None):
        self._game_managers: Dict[str, Any] = {}  # cache de managers por tipo
        self._match_game_types: Dict[str, str] = {}  # mapeo match_id -> game_type
        self._game_finish_service = game_finish_service

    def _get_game_type_from_message(self, message: dict) -> str:
        """Extrae el tipo de juego del mensaje"""
        game_type = message.get("game_type", None)
        return game_type

    def _get_manager_for_match(self, match_id: str, game_type: str = None) -> Any:
        """Obtiene el manager específico para un match"""
        # Si ya sabemos el tipo de juego para este match, usarlo
        if match_id in self._match_game_types:
            game_type = self._match_game_types[match_id]
        elif game_type:
            # Guardar el tipo de juego para este match
            self._match_game_types[match_id] = game_type
        else:
            # Por defecto usar connect4
            game_type = CONNECT4_NAME
            self._match_game_types[match_id] = game_type

        # Usar cache de managers por tipo
        if game_type not in self._game_managers:
            self._game_managers[game_type] = get_specific_manager(
                game_type, self._game_finish_service
            )

        return self._game_managers[game_type]

    def connect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Conecta un websocket usando el manager apropiado"""
        # Para connect, usar el manager por defecto ya que aún no sabemos el tipo de juego
        manager = self._get_manager_for_match(match_id)
        result = manager.connect(match_id, websocket, user_id)

        if result:
            logger.info(
                f"Successfully connected user {user_id} to match {match_id}. "
                f"Active connections for this match: {len(manager.active_connections.get(match_id, []))}"
            )
        else:
            logger.warning(
                f"Failed to connect user {user_id} to match {match_id} (already connected)"
            )

        return result

    def disconnect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Desconecta un websocket usando el manager apropiado"""
        if match_id in self._match_game_types:
            manager = self._get_manager_for_match(match_id)
            result = manager.disconnect(match_id, websocket, user_id)

            # Log del estado después de la desconexión
            connections_count = len(manager.active_connections.get(match_id, []))
            logger.info(
                f"Disconnected user {user_id} from match {match_id}. "
                f"Remaining connections: {connections_count}"
            )

            # Si ya no hay conexiones activas, limpiar el mapeo de tipo de juego
            if (
                not hasattr(manager, "active_connections")
                or match_id not in manager.active_connections
                or not manager.active_connections[match_id]
            ):
                self._match_game_types.pop(match_id, None)
                logger.info(f"Removed game type mapping for match {match_id}")

            return result
        else:
            # Si no conocemos el tipo, intentar con connect4 por defecto
            logger.warning(f"No game type found for match {match_id}, using default")
            manager = self._get_manager_for_match(match_id, CONNECT4_NAME)
            return manager.disconnect(match_id, websocket, user_id)

    async def handle_game_message(
        self, match_id: str, websocket: WebSocket, message: dict, user_id: str = None
    ):
        """Maneja mensajes usando el manager específico según el tipo de juego"""
        # Extraer el tipo de juego del mensaje
        game_type = self._get_game_type_from_message(message)

        # Obtener el manager apropiado
        manager = self._get_manager_for_match(match_id, game_type)

        # Delegar al manager específico
        return await manager.handle_game_message(match_id, websocket, message, user_id)

    async def broadcast(self, match_id: str, message: dict, sender: WebSocket = None):
        """Broadcast usando el manager apropiado"""
        if match_id in self._match_game_types:
            manager = self._get_manager_for_match(match_id)
            return await manager.broadcast(match_id, message, sender)
        else:
            # Si no conocemos el tipo, intentar con connect4 por defecto
            manager = self._get_manager_for_match(match_id, CONNECT4_NAME)
            return await manager.broadcast(match_id, message, sender)

    @property
    def active_connections(self) -> Dict[str, list]:
        """
        Retorna todas las conexiones activas de todos los managers.
        Para compatibilidad con el código existente.
        """
        all_connections = {}
        for game_type, manager in self._game_managers.items():
            if hasattr(manager, "active_connections"):
                for match_id, connections in manager.active_connections.items():
                    if match_id not in all_connections:
                        all_connections[match_id] = []
                    # Agregar información del tipo de juego para debugging
                    all_connections[match_id].extend(connections)

        # Log para debugging
        for match_id, connections in all_connections.items():
            logger.debug(f"Match {match_id}: {len(connections)} active connections")

        return all_connections

    def get_match_game_type(self, match_id: str) -> Optional[str]:
        """Obtiene el tipo de juego para un match específico"""
        return self._match_game_types.get(match_id)

    def get_game_manager_for_match(self, match_id: str) -> Optional[Any]:
        """Obtiene el manager específico para un match"""
        if match_id in self._match_game_types:
            return self._get_manager_for_match(match_id)
        return None

    def get_debug_info(self, match_id: str = None) -> Dict:
        """Obtiene información detallada para debugging"""
        debug_info = {
            "match_game_types": dict(self._match_game_types),
            "cached_managers": list(self._game_managers.keys()),
            "connections_by_manager": {},
        }

        for game_type, manager in self._game_managers.items():
            if hasattr(manager, "active_connections"):
                debug_info["connections_by_manager"][game_type] = {
                    match_id: len(connections)
                    for match_id, connections in manager.active_connections.items()
                }

        if match_id:
            specific_manager = self.get_game_manager_for_match(match_id)
            if specific_manager:
                debug_info["specific_match"] = {
                    "match_id": match_id,
                    "game_type": self.get_match_game_type(match_id),
                    "connections_count": len(
                        specific_manager.active_connections.get(match_id, [])
                    ),
                    "has_player_manager": hasattr(specific_manager, "player_manager"),
                }
                if hasattr(specific_manager, "player_manager"):
                    debug_info["specific_match"]["users_connected"] = len(
                        specific_manager.player_manager.match_users.get(match_id, {})
                    )

        return debug_info

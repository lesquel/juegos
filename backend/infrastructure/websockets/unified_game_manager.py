from typing import Any, Dict, Optional

from fastapi import WebSocket
from infrastructure.dependencies.factories.game_manager_factory import (
    get_game_websocket_manager as get_specific_manager,
)
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.unified_game_manager")


class UnifiedGameWebSocketManager:
    """
    Manager unificado que delega a managers específicos según el tipo de juego.
    Mantiene la compatibilidad con el código existente mientras usa el nuevo sistema modular.
    """

    def __init__(self):
        self._game_managers: Dict[str, Any] = {}  # cache de managers por tipo
        self._match_game_types: Dict[str, str] = {}  # mapeo match_id -> game_type

    def _get_game_type_from_message(self, message: dict) -> str:
        """Extrae el tipo de juego del mensaje"""
        game_type = message.get("game_type", "connect4")
        # Normalizar tipos de juego
        if game_type == "connect4":
            return "conecta4"
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
            game_type = "conecta4"
            self._match_game_types[match_id] = game_type

        # Usar cache de managers por tipo
        if game_type not in self._game_managers:
            self._game_managers[game_type] = get_specific_manager(game_type)

        return self._game_managers[game_type]

    def connect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Conecta un websocket usando el manager apropiado"""
        # Para connect, usar el manager por defecto ya que aún no sabemos el tipo de juego
        manager = self._get_manager_for_match(match_id)
        return manager.connect(match_id, websocket, user_id)

    def disconnect(self, match_id: str, websocket: WebSocket, user_id: str = None):
        """Desconecta un websocket usando el manager apropiado"""
        if match_id in self._match_game_types:
            manager = self._get_manager_for_match(match_id)
            result = manager.disconnect(match_id, websocket, user_id)

            # Si ya no hay conexiones activas, limpiar el mapeo de tipo de juego
            if (
                not hasattr(manager, "active_connections")
                or match_id not in manager.active_connections
                or not manager.active_connections[match_id]
            ):
                self._match_game_types.pop(match_id, None)

            return result
        else:
            # Si no conocemos el tipo, intentar con connect4 por defecto
            manager = self._get_manager_for_match(match_id, "conecta4")
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
            manager = self._get_manager_for_match(match_id, "conecta4")
            return await manager.broadcast(match_id, message, sender)

    @property
    def active_connections(self) -> Dict[str, list]:
        """
        Retorna todas las conexiones activas de todos los managers.
        Para compatibilidad con el código existente.
        """
        all_connections = {}
        for manager in self._game_managers.values():
            if hasattr(manager, "active_connections"):
                all_connections.update(manager.active_connections)
        return all_connections

    def get_match_game_type(self, match_id: str) -> Optional[str]:
        """Obtiene el tipo de juego para un match específico"""
        return self._match_game_types.get(match_id)

    def get_game_manager_for_match(self, match_id: str) -> Optional[Any]:
        """Obtiene el manager específico para un match"""
        if match_id in self._match_game_types:
            return self._get_manager_for_match(match_id)
        return None

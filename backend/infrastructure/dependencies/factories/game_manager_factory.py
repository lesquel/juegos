from typing import Dict, Type

from application.services.game_finish_service import GameFinishService

from ...websockets.game_names import CONNECT4_NAME, TICTACTOE_NAME
from ...websockets.managers.base_game_manager import BaseGameWebSocketManager
from ...websockets.managers.connect4_manager import Connect4WebSocketManager
from ...websockets.managers.tictactoe_manager import TictactoeWebSocketManager


class GameManagerRegistry:
    """Registry para almacenar y recuperar managers de juego"""

    def __init__(self):
        self._managers: Dict[str, Type[BaseGameWebSocketManager]] = {}
        self._instances: Dict[str, BaseGameWebSocketManager] = {}
        self._register_default_managers()

    def _register_default_managers(self):
        """Registra los managers por defecto"""
        self.register(CONNECT4_NAME, Connect4WebSocketManager)
        self.register(TICTACTOE_NAME, TictactoeWebSocketManager)

    def register(self, game_type: str, manager_class: Type[BaseGameWebSocketManager]):
        """Registra un manager para un tipo de juego"""
        self._managers[game_type.lower()] = manager_class

    def get_manager(
        self, game_type: str, game_finish_service=None
    ) -> BaseGameWebSocketManager:
        """Obtiene una instancia singleton del manager para el tipo de juego"""
        game_type = game_type.lower()

        # Crear una clave única que incluya el servicio si está presente
        instance_key = f"{game_type}_{id(game_finish_service) if game_finish_service else 'no_service'}"

        if instance_key not in self._instances:
            if game_type not in self._managers:
                raise ValueError(f"Game manager for '{game_type}' not found")

            manager_class = self._managers[game_type]
            self._instances[instance_key] = manager_class(
                game_finish_service=game_finish_service
            )

        return self._instances[instance_key]

    def get_available_game_types(self) -> list[str]:
        """Retorna la lista de tipos de juego disponibles"""
        return list(self._managers.keys())


# Instancia global del registry
_game_manager_registry = GameManagerRegistry()


def get_game_websocket_manager(
    game_type: str = CONNECT4_NAME,
    game_finish_service: GameFinishService = None,
) -> BaseGameWebSocketManager:
    """
    Factory function para obtener el manager apropiado según el tipo de juego

    Args:
        game_type: Tipo de juego ("connect4", "tictactoe", etc.)
        game_finish_service: Servicio para manejar la finalización de juegos

    Returns:
        Instancia del manager WebSocket específico para el tipo de juego

    Raises:
        ValueError: Si el tipo de juego no está soportado
    """
    return _game_manager_registry.get_manager(game_type, game_finish_service)


def register_game_manager(
    game_type: str, manager_class: Type[BaseGameWebSocketManager]
):
    """
    Registra un nuevo manager de juego

    Args:
        game_type: Tipo de juego a registrar
        manager_class: Clase del manager que hereda de BaseGameWebSocketManager
    """
    _game_manager_registry.register(game_type, manager_class)


def get_available_game_types() -> list[str]:
    """Retorna la lista de tipos de juego disponibles"""
    return _game_manager_registry.get_available_game_types()

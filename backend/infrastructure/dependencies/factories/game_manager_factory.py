from typing import Dict, Type

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
        self.register("connect4", Connect4WebSocketManager)
        self.register("conecta4", Connect4WebSocketManager)  # Alias
        self.register("tictactoe", TictactoeWebSocketManager)

    def register(self, game_type: str, manager_class: Type[BaseGameWebSocketManager]):
        """Registra un manager para un tipo de juego"""
        self._managers[game_type.lower()] = manager_class

    def get_manager(self, game_type: str) -> BaseGameWebSocketManager:
        """Obtiene una instancia singleton del manager para el tipo de juego"""
        game_type = game_type.lower()

        if game_type not in self._instances:
            if game_type not in self._managers:
                raise ValueError(f"Game manager for '{game_type}' not found")

            manager_class = self._managers[game_type]
            self._instances[game_type] = manager_class()

        return self._instances[game_type]

    def get_available_game_types(self) -> list[str]:
        """Retorna la lista de tipos de juego disponibles"""
        return list(self._managers.keys())


# Instancia global del registry
_game_manager_registry = GameManagerRegistry()


def get_game_websocket_manager(game_type: str = "connect4") -> BaseGameWebSocketManager:
    """
    Factory function para obtener el manager apropiado según el tipo de juego

    Args:
        game_type: Tipo de juego ("connect4", "tictactoe", etc.)

    Returns:
        Instancia del manager WebSocket específico para el tipo de juego

    Raises:
        ValueError: Si el tipo de juego no está soportado
    """
    return _game_manager_registry.get_manager(game_type)


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

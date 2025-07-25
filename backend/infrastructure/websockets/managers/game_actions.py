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

    def __init__(self, manager: GameManagerProtocol, game_finish_service=None):
        self.manager = manager
        self.game_finish_service = game_finish_service

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

            # 🔥 NUEVA FUNCIONALIDAD: Detectar automáticamente si el juego ha terminado
            if self.game_finish_service and result.get("game_over"):
                await self._handle_automatic_game_finish(match_id, result)

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

    async def handle_game_finished(
        self, match_id: str, websocket: WebSocket, message: dict
    ):
        """Maneja el final manual del juego (ej: rendición)"""
        if not self.game_finish_service:
            await websocket.send_json(
                {"type": "error", "message": "Game finish service not available"}
            )
            return

        try:
            # Extraer datos de participantes del mensaje
            participants_data = message.get("participants", [])

            if not participants_data:
                await websocket.send_json(
                    {"type": "error", "message": "No participants data provided"}
                )
                return

            # Llamar al servicio para finalizar el juego
            result = await self.game_finish_service.handle_game_finished(
                match_id=match_id,
                participants_data=participants_data,
                websocket_manager=self.manager,
            )

            logger.info(f"Game {match_id} finished manually with result: {result}")

        except Exception as e:
            logger.error(
                f"Error finishing game manually for match {match_id}: {str(e)}"
            )
            await websocket.send_json(
                {"type": "error", "message": f"Failed to finish game: {str(e)}"}
            )

    async def _handle_automatic_game_finish(self, match_id: str, game_result: dict):
        """Maneja la finalización automática del juego cuando se detecta un ganador"""
        if not self.game_finish_service:
            logger.warning(f"Game finish service not available for match {match_id}")
            return

        try:
            # Extraer información del ganador y participantes del resultado del juego
            winner = game_result.get("winner")

            # Obtener jugadores del manager
            players = {}
            if hasattr(self.manager, "player_manager"):
                players = self.manager.player_manager.get_match_players(match_id)

            # Construir datos de participantes con puntuaciones
            participants_data = []
            for player_id, player_symbol in players.items():
                # Determinar puntuación basada en si ganó o no
                if winner and player_symbol == winner:
                    score = 100  # Ganador obtiene 100 puntos
                else:
                    score = 0  # Perdedor obtiene 0 puntos

                participants_data.append({"user_id": player_id, "score": score})

            if participants_data:
                # Llamar al servicio para finalizar el juego automáticamente
                await self.game_finish_service.handle_game_finished(
                    match_id=match_id,
                    participants_data=participants_data,
                    websocket_manager=self.manager,
                )

                logger.info(f"Game {match_id} finished automatically. Winner: {winner}")
            else:
                logger.warning(
                    f"No participants found for automatic finish of match {match_id}"
                )

        except Exception as e:
            logger.error(
                f"Error in automatic game finish for match {match_id}: {str(e)}"
            )
            # No lanzamos la excepción para no interrumpir el flujo del juego

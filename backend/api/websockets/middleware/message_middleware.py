from typing import Any, Dict, Optional

from fastapi import WebSocket

from ..validators.message_validators import GameMessageValidator
from .websocket_middleware import WebSocketMiddleware


class WebSocketMessageMiddleware(WebSocketMiddleware):
    """Middleware for handling WebSocket message processing with validation"""

    async def process_connection(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """No connection processing needed in message middleware"""
        return None

    async def process_message(
        self, websocket: WebSocket, match_id: str, message: dict, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """Process and validate incoming messages"""
        game_handler = kwargs.get("game_handler")
        user = kwargs.get("user")
        error_handler = kwargs.get("error_handler")

        if not game_handler or not user:
            self.logger.error("Missing required handlers or user in message middleware")
            return None

        # Validate message
        (
            is_valid,
            error_message,
            validated_data,
        ) = GameMessageValidator.validate_game_message(message)
        if not is_valid:
            self.logger.warning(f"Message validation failed: {error_message}")
            try:
                await websocket.send_json(
                    {"type": "error", "message": f"Invalid message: {error_message}"}
                )
            except Exception:
                pass  # WebSocket might be closed
            return None

        # Validate move data if it's a move message
        if validated_data.get("type") == "make_move" and validated_data.get("move"):
            game_type = validated_data.get(
                "game_type", "connect4"
            )  # Default to connect4
            move_valid, move_error = GameMessageValidator.validate_move_data(
                validated_data["move"], game_type
            )
            if not move_valid:
                self.logger.warning(f"Move validation failed: {move_error}")
                try:
                    await websocket.send_json(
                        {"type": "error", "message": f"Invalid move: {move_error}"}
                    )
                except Exception:
                    pass
                return None

        try:
            # Use validated data instead of original message
            await game_handler.handle_game_message(
                match_id, websocket, validated_data, user
            )
        except Exception as e:
            if error_handler:

                def disconnect_callback():
                    game_handler.disconnect_user_from_game(match_id, websocket, user)

                await error_handler.handle_message_error(
                    websocket, match_id, e, disconnect_callback
                )
            raise

        return None

    async def process_disconnect(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> None:
        """No disconnect processing needed in message middleware"""

import json
from typing import Optional

from fastapi import WebSocket, WebSocketDisconnect
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.error_handler")


class WebSocketErrorHandler:
    """Handles WebSocket error scenarios and cleanup"""

    def __init__(self):
        self.logger = logger

    async def handle_message_error(
        self,
        websocket: WebSocket,
        match_id: str,
        error: Exception,
        disconnect_callback=None,
    ) -> None:
        """Handle errors during message processing"""
        self.logger.error(f"Error handling message: {error}")

        # Send error message to client before closing
        error_message = f"Message processing error: {str(error)}"
        await self._send_error_message_to_client(
            websocket, error_message, "MESSAGE_ERROR"
        )

        try:
            await websocket.close(code=1011)  # Internal error
        except Exception as close_error:
            self.logger.error(
                f"Error closing websocket after message error: {close_error}"
            )

        if disconnect_callback:
            disconnect_callback()

    def handle_disconnect_error(
        self,
        websocket_disconnect: WebSocketDisconnect,
        match_id: str,
        user_id: Optional[str] = None,
        disconnect_callback=None,
    ) -> None:
        """Handle WebSocket disconnect scenarios"""
        self.logger.error(
            f"WebSocket disconnected for match_id: {match_id}, "
            f"user: {user_id}, error: {str(websocket_disconnect)}"
        )

        if disconnect_callback:
            try:
                disconnect_callback()
            except Exception as disconnect_error:
                self.logger.error(
                    f"Error during disconnect cleanup for match_id: {match_id}, "
                    f"error: {str(disconnect_error)}"
                )

    async def handle_unexpected_error(
        self,
        error: Exception,
        match_id: str,
        user_id: Optional[str] = None,
        disconnect_callback=None,
        websocket: Optional[WebSocket] = None,
    ) -> None:
        """Handle unexpected errors in WebSocket handler"""
        self.logger.error(
            f"Unexpected error in websocket handler for match_id: {match_id}, "
            f"error: {str(error)}"
        )

        # Send error message to client if websocket is available
        if websocket:
            error_message = "An unexpected error occurred. Connection will be closed."
            await self._send_error_message_to_client(
                websocket, error_message, "UNEXPECTED_ERROR"
            )

            try:
                await websocket.close(code=1011)  # Internal error
            except Exception as close_error:
                self.logger.error(
                    f"Error closing websocket after unexpected error: {close_error}"
                )

        if disconnect_callback:
            try:
                disconnect_callback()
            except Exception as disconnect_error:
                self.logger.error(
                    f"Error during disconnect cleanup for match_id: {match_id}, "
                    f"error: {str(disconnect_error)}"
                )

    async def handle_authentication_failure(
        self, websocket: WebSocket, match_id: str, reason: str = "Authentication failed"
    ) -> None:
        """Handle authentication failure scenarios"""
        self.logger.error(f"{reason} for match_id: {match_id}")

        # Send error message to client before closing
        await self._send_error_message_to_client(websocket, reason, "AUTH_FAILED")

        try:
            await websocket.close(code=1008)  # Policy violation
        except Exception as e:
            self.logger.error(f"Error closing websocket after auth failure: {e}")

    async def handle_validation_failure(
        self, websocket: WebSocket, match_id: str, reason: str = "Validation failed"
    ) -> None:
        """Handle validation failure scenarios"""
        self.logger.warning(f"{reason} for match_id: {match_id}")

        # Send error message to client before closing
        await self._send_error_message_to_client(websocket, reason, "VALIDATION_FAILED")

        try:
            await websocket.close(code=1008, reason=reason)
        except Exception as e:
            self.logger.error(f"Error closing websocket after validation failure: {e}")

    async def handle_connection_validation_failure(
        self, websocket: WebSocket, match_id: str, error_message: str
    ) -> None:
        """Handle connection validation failure scenarios with detailed error message"""
        self.logger.warning(
            f"Connection validation failed for match_id: {match_id}, error: {error_message}"
        )

        # Send detailed error message to client before closing
        await self._send_error_message_to_client(
            websocket, error_message, "CONNECTION_VALIDATION_FAILED"
        )

        try:
            await websocket.close(code=1008, reason="Invalid connection parameters")
        except Exception as e:
            self.logger.error(
                f"Error closing websocket after connection validation failure: {e}"
            )

    async def handle_duplicate_connection(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> None:
        """Handle duplicate connection scenarios"""
        self.logger.info(
            f"User {user_id} is already connected to match_id: {match_id}, "
            "closing duplicate connection"
        )

        # Send informative message to client before closing
        message = f"User {user_id} is already connected to this match. Only one connection per user is allowed."
        await self._send_error_message_to_client(
            websocket, message, "DUPLICATE_CONNECTION"
        )

        try:
            await websocket.close(code=1000, reason="User already connected")
        except Exception as e:
            self.logger.error(f"Error closing duplicate connection: {e}")

    async def handle_rate_limit_exceeded(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> None:
        """Handle rate limit exceeded scenarios"""
        self.logger.warning(
            f"Rate limit exceeded for user {user_id} in match_id: {match_id}"
        )

        message = "Rate limit exceeded. Please slow down your requests."
        await self._send_error_message_to_client(
            websocket, message, "RATE_LIMIT_EXCEEDED"
        )

        try:
            await websocket.close(code=1008, reason="Rate limit exceeded")
        except Exception as e:
            self.logger.error(f"Error closing websocket after rate limit: {e}")

    async def handle_invalid_game_state(
        self, websocket: WebSocket, match_id: str, reason: str
    ) -> None:
        """Handle invalid game state scenarios"""
        self.logger.warning(
            f"Invalid game state for match_id: {match_id}, reason: {reason}"
        )

        message = f"Invalid game state: {reason}"
        await self._send_error_message_to_client(
            websocket, message, "INVALID_GAME_STATE"
        )

        try:
            await websocket.close(code=1002, reason="Invalid game state")
        except Exception as e:
            self.logger.error(f"Error closing websocket after invalid game state: {e}")

    async def _send_error_message_to_client(
        self, websocket: WebSocket, error_message: str, error_code: Optional[str] = None
    ) -> None:
        """Send error message to client before closing connection"""
        try:
            error_response = {
                "type": "error",
                "message": error_message,
                "error_code": error_code,
                "timestamp": __import__("datetime").datetime.utcnow().isoformat(),
                "action": "connection_closing",
            }
            await websocket.send_text(json.dumps(error_response))

            # Give client a moment to process the message
            await __import__("asyncio").sleep(0.1)

        except Exception as e:
            self.logger.error(f"Failed to send error message to client: {e}")
            # Don't raise the exception to avoid masking the original error

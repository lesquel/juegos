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

    def handle_unexpected_error(
        self,
        error: Exception,
        match_id: str,
        user_id: Optional[str] = None,
        disconnect_callback=None,
    ) -> None:
        """Handle unexpected errors in WebSocket handler"""
        self.logger.error(
            f"Unexpected error in websocket handler for match_id: {match_id}, "
            f"error: {str(error)}"
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
        try:
            await websocket.close(code=1008)  # Policy violation
        except Exception as e:
            self.logger.error(f"Error closing websocket after auth failure: {e}")

    async def handle_validation_failure(
        self, websocket: WebSocket, match_id: str, reason: str = "Validation failed"
    ) -> None:
        """Handle validation failure scenarios"""
        self.logger.warning(f"{reason} for match_id: {match_id}")
        try:
            await websocket.close()
        except Exception as e:
            self.logger.error(f"Error closing websocket after validation failure: {e}")

    async def handle_duplicate_connection(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> None:
        """Handle duplicate connection scenarios"""
        self.logger.info(
            f"User {user_id} is already connected to match_id: {match_id}, "
            "closing duplicate connection"
        )
        try:
            await websocket.close(code=1000, reason="User already connected")
        except Exception as e:
            self.logger.error(f"Error closing duplicate connection: {e}")

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

        try:
            # Send error message to client before closing
            error_message = f"Message processing error: {str(error)}"
            await self._send_error_message_to_client(
                websocket, error_message, "MESSAGE_ERROR"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1011)  # Internal error
        except Exception as close_error:
            self.logger.error(f"Error during websocket error handling: {close_error}")

        if disconnect_callback:
            try:
                disconnect_callback()
            except Exception as callback_error:
                self.logger.error(f"Error in disconnect callback: {callback_error}")

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
            try:
                error_message = (
                    "An unexpected error occurred. Connection will be closed."
                )
                await self._send_error_message_to_client(
                    websocket, error_message, "UNEXPECTED_ERROR"
                )

                # Wait a moment for the client to receive the message
                await __import__("asyncio").sleep(0.2)

                # Then close the connection
                await websocket.close(code=1011)  # Internal error
            except Exception as close_error:
                self.logger.error(
                    f"Error during unexpected error handling: {close_error}"
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
            # Send error message to client before closing
            await self._send_error_message_to_client(websocket, reason, "AUTH_FAILED")

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1008)  # Policy violation
        except Exception as e:
            self.logger.error(f"Error during authentication failure handling: {e}")

    async def handle_validation_failure(
        self, websocket: WebSocket, match_id: str, reason: str = "Validation failed"
    ) -> None:
        """Handle validation failure scenarios"""
        self.logger.warning(f"{reason} for match_id: {match_id}")

        try:
            # Send error message to client before closing
            await self._send_error_message_to_client(
                websocket, reason, "VALIDATION_FAILED"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1008, reason=reason)
        except Exception as e:
            self.logger.error(f"Error during validation failure handling: {e}")

    async def handle_connection_validation_failure(
        self, websocket: WebSocket, match_id: str, error_message: str
    ) -> None:
        """Handle connection validation failure scenarios with detailed error message"""
        self.logger.warning(
            f"Connection validation failed for match_id: {match_id}, error: {error_message}"
        )

        try:
            # Send detailed error message to client before closing
            await self._send_error_message_to_client(
                websocket, error_message, "CONNECTION_VALIDATION_FAILED"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1008, reason="Invalid connection parameters")
        except Exception as e:
            self.logger.error(
                f"Error during connection validation failure handling: {e}"
            )

    async def handle_duplicate_connection(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> None:
        """Handle duplicate connection scenarios"""
        self.logger.info(
            f"User {user_id} is already connected to match_id: {match_id}, "
            "closing duplicate connection"
        )

        try:
            # Send informative message to client before closing
            message = f"User {user_id} is already connected to this match. Only one connection per user is allowed."
            await self._send_error_message_to_client(
                websocket, message, "DUPLICATE_CONNECTION"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1000, reason="User already connected")
        except Exception as e:
            self.logger.error(f"Error during duplicate connection handling: {e}")

    async def handle_rate_limit_exceeded(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> None:
        """Handle rate limit exceeded scenarios"""
        self.logger.warning(
            f"Rate limit exceeded for user {user_id} in match_id: {match_id}"
        )

        try:
            message = "Rate limit exceeded. Please slow down your requests."
            await self._send_error_message_to_client(
                websocket, message, "RATE_LIMIT_EXCEEDED"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1008, reason="Rate limit exceeded")
        except Exception as e:
            self.logger.error(f"Error during rate limit handling: {e}")

    async def handle_invalid_game_state(
        self, websocket: WebSocket, match_id: str, reason: str
    ) -> None:
        """Handle invalid game state scenarios"""
        self.logger.warning(
            f"Invalid game state for match_id: {match_id}, reason: {reason}"
        )

        try:
            message = f"Invalid game state: {reason}"
            await self._send_error_message_to_client(
                websocket, message, "INVALID_GAME_STATE"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1002, reason="Invalid game state")
        except Exception as e:
            self.logger.error(f"Error during invalid game state handling: {e}")

    async def handle_match_not_found(
        self, websocket: WebSocket, match_id: str, reason: str
    ) -> None:
        """Handle match not found scenarios"""
        self.logger.warning(
            f"Match not found for match_id: {match_id}, reason: {reason}"
        )

        try:
            await self._send_error_message_to_client(
                websocket, reason, "MATCH_NOT_FOUND"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1000, reason="Match not found")
        except Exception as e:
            self.logger.error(f"Error during match not found handling: {e}")

    async def handle_match_already_finished(
        self, websocket: WebSocket, match_id: str, reason: str
    ) -> None:
        """Handle match already finished scenarios"""
        self.logger.warning(
            f"Match already finished for match_id: {match_id}, reason: {reason}"
        )

        try:
            await self._send_error_message_to_client(
                websocket, reason, "MATCH_ALREADY_FINISHED"
            )

            # Wait a moment for the client to receive the message
            await __import__("asyncio").sleep(0.2)

            # Then close the connection
            await websocket.close(code=1000, reason="Match already finished")
        except Exception as e:
            self.logger.error(f"Error during match already finished handling: {e}")

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

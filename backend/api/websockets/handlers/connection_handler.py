from typing import Optional

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.connection_handler")


class WebSocketConnectionHandler:
    """Handles WebSocket connection lifecycle operations"""

    def __init__(self):
        self.logger = logger

    async def accept_connection(self, websocket: WebSocket, match_id: str) -> bool:
        """Accept WebSocket connection with proper error handling"""
        try:
            await websocket.accept()
            self.logger.info(
                f"WebSocket connection established for match_id: {match_id}"
            )

            # Record metrics
            from ..utils.message_logger import message_logger

            # Note: We don't have user_id at this point, so we'll update metrics later
            message_logger.log_connection_established(match_id, "pending_auth")

            return True
        except Exception as e:
            self.logger.error(
                f"Failed to accept WebSocket connection for match_id: {match_id}, error: {str(e)}"
            )
            return False

    async def close_connection(
        self,
        websocket: WebSocket,
        match_id: str,
        code: int = 1000,
        reason: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> None:
        """Close WebSocket connection with proper error handling"""
        try:
            await websocket.close(code=code, reason=reason)
            self.logger.info(
                f"WebSocket connection closed for match_id: {match_id}, code: {code}, reason: {reason}"
            )

            # Record metrics
            from ..utils.connection_monitor import connection_monitor
            from ..utils.message_logger import message_logger
            from ..utils.websocket_metrics import websocket_metrics

            if user_id:
                websocket_metrics.connection_closed(match_id, user_id)
                message_logger.log_connection_closed(match_id, user_id, code, reason)
                connection_monitor.unregister_connection(match_id, user_id)

        except Exception as e:
            self.logger.error(
                f"Error closing WebSocket connection for match_id: {match_id}, error: {str(e)}"
            )

    async def send_connection_confirmation(
        self, websocket: WebSocket, match_id: str, user_id: str
    ) -> bool:
        """Send connection confirmation message"""
        try:
            # Check if websocket is in the right state
            if websocket.client_state.name != "CONNECTED":
                self.logger.error(
                    f"WebSocket state is {websocket.client_state.name}, cannot send confirmation"
                )
                return False

            message = {
                "type": "connection_established",
                "match_id": match_id,
                "user_id": user_id,
                "message": "WebSocket connection established successfully",
            }

            await websocket.send_json(message)
            self.logger.info(
                f"Connection confirmation sent for match_id: {match_id}, user: {user_id}"
            )

            # Record metrics
            from ..utils.connection_monitor import connection_monitor
            from ..utils.message_logger import message_logger
            from ..utils.websocket_metrics import websocket_metrics

            websocket_metrics.connection_established(match_id, user_id)
            websocket_metrics.message_sent(match_id, user_id)
            message_logger.log_message_sent(match_id, user_id, message)
            connection_monitor.register_connection(match_id, user_id, websocket)

            return True
        except Exception as e:
            self.logger.error(
                f"Failed to send connection confirmation for match_id: {match_id}, error: {str(e)}",
                exc_info=True,
            )
            return False

    async def handle_connection_timeout(
        self, websocket: WebSocket, match_id: str, timeout_reason: str
    ) -> None:
        """Handle connection timeout scenarios"""
        self.logger.error(f"{timeout_reason} for match_id: {match_id}")
        await self.close_connection(websocket, match_id, code=1008)

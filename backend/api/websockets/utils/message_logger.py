"""WebSocket message logging utilities."""

from typing import Any, Dict

from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.message_logger")


class MessageLogger:
    """Centralized WebSocket message logging"""

    def __init__(self):
        self.logger = logger

    def log_message_sent(
        self, match_id: str, user_id: str, message: Dict[str, Any]
    ) -> None:
        """Log a message sent to client"""
        self.logger.info(
            f"Message sent - Match: {match_id}, User: {user_id}, Type: {message.get('type', 'unknown')}"
        )

    def log_message_received(
        self, match_id: str, user_id: str, message: Dict[str, Any]
    ) -> None:
        """Log a message received from client"""
        self.logger.info(
            f"Message received - Match: {match_id}, User: {user_id}, Type: {message.get('type', 'unknown')}"
        )

    def log_connection_established(self, match_id: str, user_id: str) -> None:
        """Log connection establishment"""
        self.logger.info(f"Connection established - Match: {match_id}, User: {user_id}")

    def log_connection_closed(
        self, match_id: str, user_id: str, code: int, reason: str
    ) -> None:
        """Log connection closure"""
        self.logger.info(
            f"Connection closed - Match: {match_id}, User: {user_id}, Code: {code}, Reason: {reason}"
        )

    def log_error(
        self, match_id: str, user_id: str, error: str, context: str = ""
    ) -> None:
        """Log an error"""
        self.logger.error(
            f"Error - Match: {match_id}, User: {user_id}, Error: {error}"
            + (f", Context: {context}" if context else "")
        )


# Global message logger instance
message_logger = MessageLogger()

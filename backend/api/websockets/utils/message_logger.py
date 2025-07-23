import time
from typing import Any, Dict, Optional

from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.message_logger")


class MessageLogger:
    """Logs WebSocket messages for debugging and monitoring"""

    def __init__(self, enable_logging: bool = True, log_content: bool = False):
        self.enable_logging = enable_logging
        self.log_content = log_content
        self.logger = logger

    def log_connection_established(self, match_id: str, user_id: str) -> None:
        """Log when a connection is established"""
        if not self.enable_logging:
            return

        self.logger.info(
            f"Connection established - Match: {match_id}, User: {user_id}",
            extra={
                "event_type": "connection_established",
                "match_id": match_id,
                "user_id": user_id,
                "timestamp": time.time(),
            },
        )

    def log_connection_closed(
        self,
        match_id: str,
        user_id: str,
        code: Optional[int] = None,
        reason: Optional[str] = None,
    ) -> None:
        """Log when a connection is closed"""
        if not self.enable_logging:
            return

        self.logger.info(
            f"Connection closed - Match: {match_id}, User: {user_id}, "
            f"Code: {code}, Reason: {reason}",
            extra={
                "event_type": "connection_closed",
                "match_id": match_id,
                "user_id": user_id,
                "close_code": code,
                "close_reason": reason,
                "timestamp": time.time(),
            },
        )

    def log_message_received(
        self, match_id: str, user_id: str, message: Dict[str, Any]
    ) -> None:
        """Log when a message is received"""
        if not self.enable_logging:
            return

        message_type = message.get("type", "unknown")
        log_data = {
            "event_type": "message_received",
            "match_id": match_id,
            "user_id": user_id,
            "message_type": message_type,
            "timestamp": time.time(),
        }

        if self.log_content:
            log_data["message_content"] = self._sanitize_message(message)

        self.logger.info(
            f"Message received - Match: {match_id}, User: {user_id}, Type: {message_type}",
            extra=log_data,
        )

    def log_message_sent(
        self, match_id: str, user_id: str, message: Dict[str, Any]
    ) -> None:
        """Log when a message is sent"""
        if not self.enable_logging:
            return

        message_type = message.get("type", "unknown")
        log_data = {
            "event_type": "message_sent",
            "match_id": match_id,
            "user_id": user_id,
            "message_type": message_type,
            "timestamp": time.time(),
        }

        if self.log_content:
            log_data["message_content"] = self._sanitize_message(message)

        self.logger.info(
            f"Message sent - Match: {match_id}, User: {user_id}, Type: {message_type}",
            extra=log_data,
        )

    def log_error(
        self,
        match_id: str,
        user_id: str,
        error: Exception,
        context: Optional[str] = None,
    ) -> None:
        """Log an error"""
        if not self.enable_logging:
            return

        self.logger.error(
            f"Error - Match: {match_id}, User: {user_id}, "
            f"Error: {str(error)}, Context: {context}",
            extra={
                "event_type": "error",
                "match_id": match_id,
                "user_id": user_id,
                "error_type": type(error).__name__,
                "error_message": str(error),
                "context": context,
                "timestamp": time.time(),
            },
        )

    def log_validation_error(
        self,
        match_id: str,
        user_id: str,
        error_message: str,
        message: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log a validation error"""
        if not self.enable_logging:
            return

        log_data = {
            "event_type": "validation_error",
            "match_id": match_id,
            "user_id": user_id,
            "error_message": error_message,
            "timestamp": time.time(),
        }

        if self.log_content and message:
            log_data["invalid_message"] = self._sanitize_message(message)

        self.logger.warning(
            f"Validation error - Match: {match_id}, User: {user_id}, Error: {error_message}",
            extra=log_data,
        )

    def log_authentication_event(
        self, match_id: str, event: str, details: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log authentication events"""
        if not self.enable_logging:
            return

        log_data = {
            "event_type": "authentication",
            "match_id": match_id,
            "auth_event": event,
            "timestamp": time.time(),
        }

        if details:
            log_data.update(details)

        self.logger.info(
            f"Authentication event - Match: {match_id}, Event: {event}", extra=log_data
        )

    def _sanitize_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize message content for logging (remove sensitive data)"""
        sanitized = {}
        sensitive_fields = ["password", "token", "secret", "key", "auth"]

        for key, value in message.items():
            if any(
                sensitive_word in key.lower() for sensitive_word in sensitive_fields
            ):
                sanitized[key] = "[REDACTED]"
            elif isinstance(value, dict):
                sanitized[key] = self._sanitize_message(value)
            elif isinstance(value, str) and len(value) > 1000:
                sanitized[key] = value[:1000] + "... [TRUNCATED]"
            else:
                sanitized[key] = value

        return sanitized

    def set_logging_enabled(self, enabled: bool) -> None:
        """Enable or disable message logging"""
        self.enable_logging = enabled

    def set_content_logging(self, enabled: bool) -> None:
        """Enable or disable content logging"""
        self.log_content = enabled


# Global message logger instance
message_logger = MessageLogger()

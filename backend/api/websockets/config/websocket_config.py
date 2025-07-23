from dataclasses import dataclass
from typing import Dict


@dataclass
class WebSocketConfig:
    """Configuration class for WebSocket settings"""

    # Connection settings
    authentication_timeout: float = 10.0
    connection_timeout: float = 30.0
    heartbeat_interval: float = 30.0

    # Error codes
    ERROR_CODES: Dict[str, int] = None

    # Connection limits
    max_connections_per_match: int = 100
    max_connections_per_user: int = 5

    # Message settings
    max_message_size: int = 10240  # 10KB
    message_rate_limit: int = 10  # messages per second

    # Logging settings
    enable_debug_logging: bool = False
    log_message_content: bool = False

    def __post_init__(self):
        if self.ERROR_CODES is None:
            self.ERROR_CODES = {
                "NORMAL_CLOSURE": 1000,
                "GOING_AWAY": 1001,
                "PROTOCOL_ERROR": 1002,
                "UNSUPPORTED_DATA": 1003,
                "NO_STATUS_RECEIVED": 1005,
                "ABNORMAL_CLOSURE": 1006,
                "INVALID_FRAME_PAYLOAD_DATA": 1007,
                "POLICY_VIOLATION": 1008,
                "MESSAGE_TOO_BIG": 1009,
                "MANDATORY_EXTENSION": 1010,
                "INTERNAL_ERROR": 1011,
                "SERVICE_RESTART": 1012,
                "TRY_AGAIN_LATER": 1013,
                "BAD_GATEWAY": 1014,
                "TLS_HANDSHAKE": 1015,
            }

    @classmethod
    def development(cls) -> "WebSocketConfig":
        """Create development configuration"""
        return cls(
            authentication_timeout=5.0,
            enable_debug_logging=True,
            log_message_content=True,
        )

    @classmethod
    def production(cls) -> "WebSocketConfig":
        """Create production configuration"""
        return cls(
            authentication_timeout=10.0,
            enable_debug_logging=False,
            log_message_content=False,
            max_connections_per_match=1000,
        )

    @classmethod
    def testing(cls) -> "WebSocketConfig":
        """Create testing configuration"""
        return cls(
            authentication_timeout=1.0,
            connection_timeout=5.0,
            heartbeat_interval=5.0,
            enable_debug_logging=True,
            log_message_content=True,
        )

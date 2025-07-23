"""Connection monitoring and health check utilities."""

import asyncio
import time
from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional, Set

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.connection_monitor")


@dataclass
class ConnectionInfo:
    """Information about an active connection"""

    websocket: WebSocket
    match_id: str
    user_id: str
    connected_at: float
    last_ping: Optional[float] = None
    is_healthy: bool = True


class ConnectionMonitor:
    """Monitors WebSocket connections for health and lifecycle"""

    def __init__(self, ping_interval: float = 30.0, ping_timeout: float = 10.0):
        self.logger = logger
        self.ping_interval = ping_interval
        self.ping_timeout = ping_timeout

        # Active connections registry
        self._connections: Dict[str, ConnectionInfo] = {}
        self._match_connections: Dict[str, Set[str]] = {}

        # Health check task
        self._health_check_task: Optional[asyncio.Task] = None
        self._running = False

        # Event callbacks
        self._on_connection_lost: Optional[Callable[[str, str], None]] = None

    def start_monitoring(self) -> None:
        """Start the connection monitoring service"""
        if not self._running:
            self._running = True
            self._health_check_task = asyncio.create_task(self._health_check_loop())
            self.logger.info("Connection monitoring started")

    def stop_monitoring(self) -> None:
        """Stop the connection monitoring service"""
        self._running = False
        if self._health_check_task:
            self._health_check_task.cancel()
            self.logger.info("Connection monitoring stopped")

    def register_connection(
        self, match_id: str, user_id: str, websocket: WebSocket
    ) -> None:
        """Register a new connection for monitoring"""
        key = f"{match_id}:{user_id}"

        connection_info = ConnectionInfo(
            websocket=websocket,
            match_id=match_id,
            user_id=user_id,
            connected_at=time.time(),
        )

        self._connections[key] = connection_info

        # Track by match
        if match_id not in self._match_connections:
            self._match_connections[match_id] = set()
        self._match_connections[match_id].add(key)

        self.logger.info(f"Connection registered for monitoring: {key}")

    def unregister_connection(self, match_id: str, user_id: str) -> None:
        """Unregister a connection from monitoring"""
        key = f"{match_id}:{user_id}"

        if key in self._connections:
            self._connections.pop(key)

            # Remove from match tracking
            if match_id in self._match_connections:
                self._match_connections[match_id].discard(key)
                if not self._match_connections[match_id]:
                    self._match_connections.pop(match_id)

            self.logger.info(f"Connection unregistered from monitoring: {key}")

    def get_connection_info(
        self, match_id: str, user_id: str
    ) -> Optional[ConnectionInfo]:
        """Get connection info for specific connection"""
        key = f"{match_id}:{user_id}"
        return self._connections.get(key)

    def get_match_connections(self, match_id: str) -> List[ConnectionInfo]:
        """Get all connections for a specific match"""
        if match_id not in self._match_connections:
            return []

        return [
            self._connections[key]
            for key in self._match_connections[match_id]
            if key in self._connections
        ]

    def get_connection_count(self) -> int:
        """Get total number of monitored connections"""
        return len(self._connections)

    def get_match_count(self) -> int:
        """Get number of matches with active connections"""
        return len(self._match_connections)

    def set_connection_lost_callback(
        self, callback: Callable[[str, str], None]
    ) -> None:
        """Set callback for when a connection is lost"""
        self._on_connection_lost = callback

    async def ping_connection(self, connection_info: ConnectionInfo) -> bool:
        """Ping a specific connection to check health"""
        try:
            # Send ping
            await connection_info.websocket.send_json(
                {"type": "ping", "timestamp": time.time()}
            )

            connection_info.last_ping = time.time()
            connection_info.is_healthy = True
            return True

        except Exception as e:
            self.logger.warning(
                f"Ping failed for {connection_info.match_id}:{connection_info.user_id}: {e}"
            )
            connection_info.is_healthy = False
            return False

    async def _health_check_loop(self) -> None:
        """Main health check loop"""
        while self._running:
            try:
                await self._perform_health_checks()
                await asyncio.sleep(self.ping_interval)
            except asyncio.CancelledError:
                # Re-raise cancellation to properly handle task cancellation
                raise
            except Exception as e:
                self.logger.error(f"Health check loop error: {e}")
                await asyncio.sleep(5)  # Brief pause before retrying

    async def _perform_health_checks(self) -> None:
        """Perform health checks on all connections"""
        if not self._connections:
            return

        now = time.time()
        unhealthy_connections = []

        for key, connection_info in self._connections.items():
            # Check if connection needs a ping
            if (
                connection_info.last_ping is None
                or now - connection_info.last_ping > self.ping_interval
            ):
                success = await self.ping_connection(connection_info)

                if not success:
                    unhealthy_connections.append(
                        (connection_info.match_id, connection_info.user_id)
                    )

        # Handle unhealthy connections
        for match_id, user_id in unhealthy_connections:
            self.logger.warning(f"Unhealthy connection detected: {match_id}:{user_id}")

            # Remove from monitoring
            self.unregister_connection(match_id, user_id)

            # Notify callback
            if self._on_connection_lost:
                try:
                    self._on_connection_lost(match_id, user_id)
                except Exception as e:
                    self.logger.error(f"Connection lost callback error: {e}")

    def get_health_report(self) -> Dict[str, Any]:
        """Get comprehensive health report"""
        now = time.time()

        healthy_count = sum(1 for conn in self._connections.values() if conn.is_healthy)
        unhealthy_count = len(self._connections) - healthy_count

        return {
            "total_connections": len(self._connections),
            "healthy_connections": healthy_count,
            "unhealthy_connections": unhealthy_count,
            "total_matches": len(self._match_connections),
            "monitoring_running": self._running,
            "ping_interval": self.ping_interval,
            "ping_timeout": self.ping_timeout,
            "uptime": now - self._start_time if hasattr(self, "_start_time") else 0,
        }


# Global connection monitor instance
connection_monitor = ConnectionMonitor()

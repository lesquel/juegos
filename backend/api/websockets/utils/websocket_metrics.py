"""WebSocket metrics and monitoring utilities."""

import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.metrics")


@dataclass
class ConnectionMetric:
    """Metrics for a single connection"""

    match_id: str
    user_id: str
    connected_at: float
    messages_sent: int = 0
    messages_received: int = 0
    last_activity: float = field(default_factory=time.time)


class WebSocketMetrics:
    """Centralized WebSocket metrics collection"""

    def __init__(self):
        self.logger = logger
        self._connections: Dict[str, ConnectionMetric] = {}
        self._connection_history: List[ConnectionMetric] = []
        self._start_time = time.time()

    def connection_established(self, match_id: str, user_id: str) -> None:
        """Record a new connection"""
        key = f"{match_id}:{user_id}"
        metric = ConnectionMetric(
            match_id=match_id, user_id=user_id, connected_at=time.time()
        )
        self._connections[key] = metric
        self.logger.info(f"Connection metric recorded for {match_id}:{user_id}")

    def connection_closed(self, match_id: str, user_id: str) -> None:
        """Record connection closure"""
        key = f"{match_id}:{user_id}"
        if key in self._connections:
            metric = self._connections.pop(key)
            self._connection_history.append(metric)
            duration = time.time() - metric.connected_at
            self.logger.info(
                f"Connection closed for {match_id}:{user_id}, "
                f"duration: {duration:.2f}s, "
                f"messages sent: {metric.messages_sent}, "
                f"messages received: {metric.messages_received}"
            )

    def message_sent(self, match_id: str, user_id: str) -> None:
        """Record a message sent"""
        key = f"{match_id}:{user_id}"
        if key in self._connections:
            self._connections[key].messages_sent += 1
            self._connections[key].last_activity = time.time()

    def message_received(self, match_id: str, user_id: str) -> None:
        """Record a message received"""
        key = f"{match_id}:{user_id}"
        if key in self._connections:
            self._connections[key].messages_received += 1
            self._connections[key].last_activity = time.time()

    def get_active_connections(self) -> int:
        """Get count of active connections"""
        return len(self._connections)

    def get_connection_metrics(
        self, match_id: str, user_id: str
    ) -> Optional[ConnectionMetric]:
        """Get metrics for specific connection"""
        key = f"{match_id}:{user_id}"
        return self._connections.get(key)

    def get_match_metrics(self, match_id: str) -> List[ConnectionMetric]:
        """Get all metrics for a specific match"""
        return [
            metric
            for metric in self._connections.values()
            if metric.match_id == match_id
        ]

    def get_system_metrics(self) -> Dict:
        """Get overall system metrics"""
        now = time.time()
        uptime = now - self._start_time

        return {
            "uptime_seconds": uptime,
            "active_connections": len(self._connections),
            "total_historical_connections": len(self._connection_history),
            "total_connections": len(self._connections) + len(self._connection_history),
            "average_connection_duration": self._calculate_avg_duration(),
            "total_messages_sent": sum(
                m.messages_sent for m in self._connections.values()
            ),
            "total_messages_received": sum(
                m.messages_received for m in self._connections.values()
            ),
        }

    def _calculate_avg_duration(self) -> float:
        """Calculate average connection duration from history"""
        if not self._connection_history:
            return 0.0

        durations = [
            time.time() - metric.connected_at for metric in self._connection_history
        ]
        return sum(durations) / len(durations)


# Global metrics instance
websocket_metrics = WebSocketMetrics()

from typing import Dict, List

from fastapi import WebSocket
from starlette.websockets import WebSocketState


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    def connect(self, match_id: str, websocket: WebSocket):
        if match_id not in self.active_connections:
            self.active_connections[match_id] = []
        self.active_connections[match_id].append(websocket)

    def disconnect(self, match_id: str, websocket: WebSocket):
        if match_id in self.active_connections:
            if websocket in self.active_connections[match_id]:
                self.active_connections[match_id].remove(websocket)
            if not self.active_connections[match_id]:
                del self.active_connections[match_id]

    async def broadcast(self, match_id: str, message: dict, sender: WebSocket = None):
        connections = self.active_connections.get(match_id, [])
        to_remove = []
        for connection in connections:
            # Skip sending to the sender if provided
            if sender is not None and connection == sender:
                continue
            try:
                if connection.application_state == WebSocketState.CONNECTED:
                    await connection.send_json(message)
                else:
                    to_remove.append(connection)
            except Exception:
                to_remove.append(connection)

        for conn in to_remove:
            self.disconnect(match_id, conn)

    async def handle_message(self, match_id: str, websocket: WebSocket, message: dict):
        await self.broadcast(match_id, message, sender=websocket)

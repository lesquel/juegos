from abc import ABC, abstractmethod

from .websocket_connection import WebSocketConnection


class IWebSocketManager(ABC):
    @abstractmethod
    async def connect(self, websocket: WebSocketConnection):
        pass

    @abstractmethod
    def disconnect(self, websocket: WebSocketConnection):
        pass

    @abstractmethod
    async def broadcast(self, message: str):
        pass

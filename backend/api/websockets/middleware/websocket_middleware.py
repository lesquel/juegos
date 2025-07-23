from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.middleware")


class WebSocketMiddleware(ABC):
    """Base class for WebSocket middleware"""

    def __init__(self):
        self.logger = logger

    @abstractmethod
    async def process_connection(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """Process WebSocket connection"""

    @abstractmethod
    async def process_message(
        self, websocket: WebSocket, match_id: str, message: dict, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """Process WebSocket message"""

    @abstractmethod
    async def process_disconnect(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> None:
        """Process WebSocket disconnect"""


class WebSocketMiddlewareChain:
    """Chain of responsibility for WebSocket middleware"""

    def __init__(self):
        self.middlewares: list[WebSocketMiddleware] = []
        self.logger = logger

    def add_middleware(self, middleware: WebSocketMiddleware) -> None:
        """Add middleware to the chain"""
        self.middlewares.append(middleware)

    async def process_connection(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> Dict[str, Any]:
        """Process connection through middleware chain"""
        context = {}

        for middleware in self.middlewares:
            try:
                result = await middleware.process_connection(
                    websocket, match_id, **kwargs, **context
                )
                if result:
                    context.update(result)
            except Exception as e:
                self.logger.error(
                    f"Error in middleware {middleware.__class__.__name__}: {e}"
                )
                raise

        return context

    async def process_message(
        self, websocket: WebSocket, match_id: str, message: dict, **kwargs
    ) -> Dict[str, Any]:
        """Process message through middleware chain"""
        context = {}

        for middleware in self.middlewares:
            try:
                result = await middleware.process_message(
                    websocket, match_id, message, **kwargs, **context
                )
                if result:
                    context.update(result)
            except Exception as e:
                self.logger.error(
                    f"Error in middleware {middleware.__class__.__name__}: {e}"
                )
                raise

        return context

    async def process_disconnect(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> None:
        """Process disconnect through middleware chain"""
        for middleware in reversed(self.middlewares):  # Reverse order for cleanup
            try:
                await middleware.process_disconnect(websocket, match_id, **kwargs)
            except Exception as e:
                self.logger.error(
                    f"Error in middleware cleanup {middleware.__class__.__name__}: {e}"
                )
                # Continue with other middleware cleanup

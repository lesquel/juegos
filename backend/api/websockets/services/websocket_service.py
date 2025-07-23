from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.repositories.match_repository import IMatchRepository
from fastapi import WebSocket, WebSocketDisconnect
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.unified_game_manager import UnifiedGameWebSocketManager

from ..handlers.error_handler import WebSocketErrorHandler
from ..middleware.connection_middleware import WebSocketConnectionMiddleware
from ..middleware.message_middleware import WebSocketMessageMiddleware
from ..middleware.websocket_middleware import WebSocketMiddlewareChain

logger = get_logger("websockets.service")


class WebSocketService:
    """
    Service class that orchestrates WebSocket connection handling using middleware pattern.
    Provides a clean interface for the route handler while maintaining modularity.
    """

    def __init__(
        self,
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ):
        self.user_use_case = user_use_case
        self.match_repository = match_repository
        self.unified_game_manager = unified_game_manager
        self.error_handler = WebSocketErrorHandler()
        self.logger = logger

        # Setup middleware chain
        self._setup_middleware()

    def _setup_middleware(self) -> None:
        """Setup the middleware chain"""
        self.middleware_chain = WebSocketMiddlewareChain()

        # Add connection middleware
        connection_middleware = WebSocketConnectionMiddleware(
            self.user_use_case, self.match_repository, self.unified_game_manager
        )
        self.middleware_chain.add_middleware(connection_middleware)

        # Add message middleware
        message_middleware = WebSocketMessageMiddleware()
        self.middleware_chain.add_middleware(message_middleware)

    async def handle_websocket_connection(
        self, websocket: WebSocket, match_id: str
    ) -> None:
        """
        Main entry point for handling WebSocket connections.
        Uses middleware chain for modular processing.
        """
        context = {}

        try:
            # Process connection through middleware chain
            context = await self.middleware_chain.process_connection(
                websocket, match_id
            )

            # Extract handlers from context
            user = context.get("user")
            game_handler = context.get("game_handler")
            error_handler = context.get("error_handler", self.error_handler)

            if user or game_handler or error_handler:
                self.logger.info(
                    f"WebSocket connection established for match_id: {match_id}"
                )
                self.logger.info(f"User: {user.user_id if user else 'N/A'}")

            # Message handling loop
            await self._handle_message_loop(websocket, match_id, context)

        except WebSocketDisconnect as e:
            # Handle disconnect
            self._handle_disconnect(e, match_id, context)
        except Exception as e:
            # Handle unexpected errors
            self._handle_unexpected_error(e, match_id, context)
        finally:
            # Cleanup through middleware chain
            await self.middleware_chain.process_disconnect(
                websocket, match_id, **context
            )

    async def _handle_message_loop(
        self, websocket: WebSocket, match_id: str, context: dict
    ) -> None:
        """Handle the main message processing loop"""
        while True:
            try:
                # Receive message
                data = await websocket.receive_json()

                # Process message through middleware chain
                await self.middleware_chain.process_message(
                    websocket, match_id, data, **context
                )

            except Exception:
                # Let the error bubble up to be handled by outer try-catch
                raise

    def _handle_disconnect(
        self, websocket_disconnect: WebSocketDisconnect, match_id: str, context: dict
    ) -> None:
        """Handle WebSocket disconnect"""
        user = context.get("user")
        error_handler = context.get("error_handler", self.error_handler)
        game_handler = context.get("game_handler")

        def disconnect_callback():
            if game_handler and user:
                game_handler.disconnect_user_from_game(match_id, None, user)

        error_handler.handle_disconnect_error(
            websocket_disconnect,
            match_id,
            str(user.user_id) if user else None,
            disconnect_callback,
        )

    def _handle_unexpected_error(
        self, error: Exception, match_id: str, context: dict
    ) -> None:
        """Handle unexpected errors"""
        user = context.get("user")
        error_handler = context.get("error_handler", self.error_handler)
        game_handler = context.get("game_handler")

        def disconnect_callback():
            if game_handler and user:
                game_handler.disconnect_user_from_game(match_id, None, user)

        error_handler.handle_unexpected_error(
            error, match_id, str(user.user_id) if user else None, disconnect_callback
        )

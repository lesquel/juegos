from typing import Any, Dict, Optional

from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.exceptions.auth import AuthenticationError
from domain.exceptions.match import AlreadyParticipatingError, MatchJoinError
from domain.repositories.match_repository import IMatchRepository
from fastapi import WebSocket
from infrastructure.websockets.unified_game_manager import UnifiedGameWebSocketManager

from ..handlers.authentication_handler import WebSocketAuthenticationHandler
from ..handlers.connection_handler import WebSocketConnectionHandler
from ..handlers.error_handler import WebSocketErrorHandler
from ..handlers.game_handler import WebSocketGameHandler
from .websocket_middleware import WebSocketMiddleware


class WebSocketConnectionMiddleware(WebSocketMiddleware):
    """Middleware for handling WebSocket connection validation and setup"""

    def __init__(
        self,
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ):
        super().__init__()
        self.user_use_case = user_use_case
        self.match_repository = match_repository
        self.unified_game_manager = unified_game_manager

    async def process_connection(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """Process connection validation and authentication"""

        # Initialize handlers
        connection_handler = WebSocketConnectionHandler()
        auth_handler = WebSocketAuthenticationHandler(self.user_use_case)
        game_handler = WebSocketGameHandler(
            self.match_repository, self.unified_game_manager
        )
        error_handler = WebSocketErrorHandler()

        # Initialize variables to avoid unbound issues
        user = None
        match = None

        # Connection is already accepted in routes.py, so we skip that step here

        try:
            # Authenticate user FIRST - don't send error response here
            user = await auth_handler.validate_authentication(websocket, match_id)
            if not user:
                # Just raise the exception, let the caller handle the response
                raise AuthenticationError("Authentication failed")

            # Validate game setup SECOND - don't send error response here
            match = await game_handler.validate_game_setup(match_id, user)
            if not match:
                # Just raise the exception, let the caller handle the response
                raise MatchJoinError("Match validation failed")

            # Connect to game THIRD - don't send error response here
            if not game_handler.connect_user_to_game(match_id, websocket, user):
                # Just raise the exception, let the caller handle the response
                raise AlreadyParticipatingError("Duplicate connection")

            return {
                "user": user,
                "match": match,
                "connection_handler": connection_handler,
                "auth_handler": auth_handler,
                "game_handler": game_handler,
                "error_handler": error_handler,
            }

        except (AuthenticationError, MatchJoinError, AlreadyParticipatingError) as e:
            # Handle ALL errors in one place - send response OR close connection, not both
            if isinstance(e, AuthenticationError):
                await error_handler.handle_authentication_failure(websocket, match_id)
            elif isinstance(e, MatchJoinError):
                await error_handler.handle_validation_failure(
                    websocket, match_id, "Match validation failed"
                )
            elif isinstance(e, AlreadyParticipatingError):
                # Get user_id safely
                user_id = str(user.user_id) if user else "unknown"
                await error_handler.handle_duplicate_connection(
                    websocket, match_id, user_id
                )
            # Don't re-raise the exception since we already handled the response
            return None

    async def process_message(
        self, websocket: WebSocket, match_id: str, message: dict, **kwargs
    ) -> Optional[Dict[str, Any]]:
        """No message processing needed in connection middleware"""
        return None

    async def process_disconnect(
        self, websocket: WebSocket, match_id: str, **kwargs
    ) -> None:
        """Handle connection cleanup"""
        game_handler = kwargs.get("game_handler")
        user = kwargs.get("user")

        if game_handler and user:
            game_handler.disconnect_user_from_game(match_id, websocket, user)

from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.repositories.match_repository import IMatchRepository
from fastapi import APIRouter, WebSocket
from fastapi.params import Depends
from infrastructure.dependencies.repositories.database_repos import get_match_repository
from infrastructure.dependencies.sockets.providers import get_game_websocket_manager
from infrastructure.dependencies.use_cases import get_current_user_use_case
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.unified_game_manager import UnifiedGameWebSocketManager

from .factories.websocket_factory import WebSocketServiceFactory
from .handlers.error_handler import WebSocketErrorHandler
from .validators.connection_validators import ConnectionValidator

websocket_router = APIRouter()
logger = get_logger("websockets.routes")


@websocket_router.websocket("/ws/games/{match_id}")
async def game_socket(
    websocket: WebSocket,
    match_id: str,
    user_use_case: GetCurrentUserUseCase = Depends(get_current_user_use_case),
    match_repository: IMatchRepository = Depends(get_match_repository),
    unified_game_manager: UnifiedGameWebSocketManager = Depends(
        get_game_websocket_manager
    ),
):
    """
    Enhanced WebSocket endpoint for game connections.

    This endpoint uses a modular architecture with:
    - Connection validation
    - Middleware chain for request processing
    - Service layer for business logic
    - Error handlers for graceful error management

    Args:
        websocket: FastAPI WebSocket connection
        match_id: UUID of the game match
        user_use_case: Authentication use case
        match_repository: Repository for match data
        unified_game_manager: Game manager for WebSocket operations
    """

    # Accept the WebSocket connection first
    try:
        await websocket.accept()
        logger.info(f"WebSocket connection accepted for match_id: {match_id}")
    except Exception as e:
        logger.error(
            f"Failed to accept WebSocket connection for match_id: {match_id}, error: {str(e)}"
        )
        return

    # Validate connection parameters
    token = websocket.query_params.get("token", "")
    is_valid, error_message = ConnectionValidator.validate_connection_params(
        match_id, token
    )

    if not is_valid:
        # Use error handler to send detailed error message before closing
        error_handler = WebSocketErrorHandler()
        await error_handler.handle_connection_validation_failure(
            websocket, match_id, error_message
        )
        return

    # Create WebSocket service using factory (defaults to development config)
    websocket_service = WebSocketServiceFactory.create_development_service(
        user_use_case=user_use_case,
        match_repository=match_repository,
        unified_game_manager=unified_game_manager,
    )

    # Handle the WebSocket connection through the service
    await websocket_service.handle_websocket_connection(websocket, match_id)

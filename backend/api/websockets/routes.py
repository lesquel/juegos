from api.websockets.utils.conecction_utils import check_connection_validity
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
    logger.info(f"Incoming WebSocket connection for match_id: {match_id}")

    if not await check_connection_validity(websocket, match_id, match_repository):
        return

    websocket_service = WebSocketServiceFactory.create_development_service(
        user_use_case=user_use_case,
        match_repository=match_repository,
        unified_game_manager=unified_game_manager,
    )

    await websocket_service.handle_websocket_connection(websocket, match_id)

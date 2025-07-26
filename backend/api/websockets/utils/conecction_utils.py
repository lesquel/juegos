from api.websockets.handlers.error_handler import WebSocketErrorHandler
from api.websockets.validators.connection_validators import ConnectionValidator
from domain.entities.match.match import MatchEntity
from domain.repositories.match_repository import IMatchRepository
from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.utils.connection_utils")


async def try_accept_connection(websocket: WebSocket, match_id: str) -> bool:
    try:
        await websocket.accept()
        logger.info(f"WebSocket connection accepted for match_id: {match_id}")
        return True
    except Exception as e:
        logger.error(f"Failed to accept WebSocket for {match_id}: {e}")
        return False


async def validate_token(websocket: WebSocket, match_id: str) -> bool:
    token = websocket.query_params.get("token", "")
    is_valid, error_message = ConnectionValidator.validate_connection_params(
        match_id, token
    )

    if not is_valid:
        await WebSocketErrorHandler().handle_connection_validation_failure(
            websocket, match_id, error_message
        )
        return False
    return True


async def fetch_match_or_fail(
    websocket: WebSocket, match_id: str, match_repository: IMatchRepository
):
    match = await match_repository.get_by_id(match_id)
    if not match:
        await WebSocketErrorHandler().handle_match_not_found(
            websocket, match_id, f"Match with ID {match_id} does not exist."
        )
    return match


async def check_match_finished(
    websocket: WebSocket, match: MatchEntity, match_id: str
) -> bool:
    if match.is_finished_match():
        await WebSocketErrorHandler().handle_match_already_finished(
            websocket, match_id, f"Match with ID {match_id} is already finished."
        )
        return True
    return False


async def check_connection_validity(
    websocket: WebSocket, match_id: str, match_repository: IMatchRepository
) -> bool:
    if not await try_accept_connection(websocket, match_id):
        return False

    if not await validate_token(websocket, match_id):
        return False

    match = await fetch_match_or_fail(websocket, match_id, match_repository)
    if not match:
        return False

    if await check_match_finished(websocket, match, match_id):
        return False

    return True

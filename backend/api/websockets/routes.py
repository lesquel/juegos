import asyncio

from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.repositories.match_repository import IMatchRepository
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.params import Depends
from infrastructure.dependencies.repositories.database_repos import get_match_repository
from infrastructure.dependencies.sockets import get_game_websocket_manager
from infrastructure.dependencies.use_cases import get_current_user_use_case
from infrastructure.logging.logging_config import get_logger

websocket_router = APIRouter()
game_manager = get_game_websocket_manager()

logger = get_logger("websockets.routes")


@websocket_router.websocket("/ws/games/{match_id}")
async def game_socket(
    websocket: WebSocket,
    match_id: str,
    user_use_case: GetCurrentUserUseCase = Depends(get_current_user_use_case),
    match_repository: IMatchRepository = Depends(get_match_repository),
):
    # Accept the WebSocket connection first
    await websocket.accept()

    logger.info(f"WebSocket connection established for match_id: {match_id}")

    token = websocket.query_params.get("token")

    logger.info(
        f"WebSocket connection request for match_id: {match_id} with token: {token}"
    )
    if not token:
        logger.warning(f"No token provided for match_id: {match_id}")
        await websocket.close(code=1008)
        return

    logger.info(f"Starting user authentication for match_id: {match_id}")
    try:
        # Add timeout for authentication to prevent WebSocket hanging

        user = await asyncio.wait_for(user_use_case.execute(token), timeout=10.0)
        logger.info(
            f"User authenticated successfully for match_id: {match_id}, user: {user.user_id}"
        )
    except asyncio.TimeoutError:
        logger.error(f"Authentication timeout for match_id: {match_id}")
        await websocket.close(code=1008)
        return
    except Exception as e:
        logger.error(f"Authentication failed for match_id: {match_id}, error: {str(e)}")
        await websocket.close(code=1008)
        return

    logger.info(f"Retrieving match data for match_id: {match_id}")
    match = await match_repository.get_by_id(match_id)
    if not match:
        logger.warning(f"Match not found for match_id: {match_id}")
        await websocket.close()
        return

    if not match.is_participant(user.user_id):
        logger.warning(
            f"User {user.user_id} is not a participant in match_id: {match_id}"
        )
        await websocket.close()
        return

    logger.info(
        f"Adding websocket to game manager for match_id: {match_id}, user: {user.user_id}"
    )

    # Verificar si el usuario ya está conectado
    connection_successful = game_manager.connect(match_id, websocket, str(user.user_id))

    if not connection_successful:
        logger.info(
            f"User {user.user_id} is already connected to match_id: {match_id}, closing duplicate connection"
        )
        await websocket.close(code=1000, reason="User already connected")
        return

    # Send connection confirmation message
    try:
        await websocket.send_json(
            {
                "type": "connection_established",
                "match_id": match_id,
                "user_id": str(user.user_id),
                "message": "WebSocket connection established successfully",
            }
        )
        logger.info(
            f"Connection confirmation sent for match_id: {match_id}, user: {user.user_id}"
        )
    except Exception as e:
        logger.error(
            f"Failed to send connection confirmation for match_id: {match_id}, error: {str(e)}"
        )

    try:
        while True:
            try:
                data = await websocket.receive_json()
                logger.info(f"Received message: {data}")
                logger.info(f"Active connections: {game_manager.active_connections}")
                await game_manager.handle_game_message(
                    match_id, websocket, data, str(user.user_id)
                )
            except Exception as e:
                logger.error(f"Error handling message: {e}")
                await websocket.close(code=1011)  # Error interno
                break
    except WebSocketDisconnect as e:
        logger.error(
            f"WebSocket disconnected for match_id: {match_id}, user: {user.user_id}, error: {str(e)}"
        )
        try:
            game_manager.disconnect(match_id, websocket, str(user.user_id))
        except Exception as disconnect_error:
            logger.error(
                f"Error during disconnect for match_id: {match_id}, error: {str(disconnect_error)}"
            )
    except Exception as e:
        logger.error(
            f"Unexpected error in websocket handler for match_id: {match_id}, error: {str(e)}"
        )
        try:
            game_manager.disconnect(match_id, websocket, str(user.user_id))
        except Exception as disconnect_error:
            logger.error(
                f"Error during disconnect for match_id: {match_id}, error: {str(disconnect_error)}"
            )

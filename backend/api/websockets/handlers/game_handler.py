from typing import Optional

from domain.entities.match.match import MatchEntity
from domain.entities.user.user import UserEntity
from domain.repositories.match_repository import IMatchRepository
from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger
from infrastructure.websockets.unified_game_manager import UnifiedGameWebSocketManager

logger = get_logger("websockets.game_handler")


class WebSocketGameHandler:
    """Handles WebSocket game-specific operations"""

    def __init__(
        self,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ):
        self.match_repository = match_repository
        self.unified_game_manager = unified_game_manager
        self.logger = logger

    async def validate_match(self, match_id: str) -> Optional[MatchEntity]:
        """Validate that match exists"""
        self.logger.info(f"Retrieving match data for match_id: {match_id}")

        match = await self.match_repository.get_by_id(match_id)
        if not match:
            self.logger.warning(f"Match not found for match_id: {match_id}")
            return None

        return match

    def validate_user_participation(
        self, match: MatchEntity, user: UserEntity, match_id: str
    ) -> bool:
        """Validate that user is a participant in the match"""
        if not match.is_participant(user.user_id):
            self.logger.warning(
                f"User {user.user_id} is not a participant in match_id: {match_id}"
            )
            return False

        return True

    def connect_user_to_game(
        self, match_id: str, websocket: WebSocket, user: UserEntity
    ) -> bool:
        """Connect user to game manager"""
        self.logger.info(
            f"Adding websocket to game manager for match_id: {match_id}, user: {user.user_id}"
        )

        connection_successful = self.unified_game_manager.connect(
            match_id, websocket, str(user.user_id)
        )

        if not connection_successful:
            self.logger.info(
                f"User {user.user_id} is already connected to match_id: {match_id}"
            )
            return False

        return True

    async def handle_game_message(
        self, match_id: str, websocket: WebSocket, data: dict, user: UserEntity
    ) -> None:
        """Handle incoming game message"""
        try:
            self.logger.info(f"Received message: {data}")
            self.logger.info(
                f"Active connections: {self.unified_game_manager.active_connections}"
            )

            # Record metrics
            from ..utils.connection_monitor import connection_monitor
            from ..utils.message_logger import message_logger
            from ..utils.websocket_metrics import websocket_metrics

            websocket_metrics.message_received(match_id, str(user.user_id))
            message_logger.log_message_received(match_id, str(user.user_id), data)
            connection_monitor.update_activity(match_id, str(user.user_id))

            await self.unified_game_manager.handle_game_message(
                match_id, websocket, data, str(user.user_id)
            )
        except Exception as e:
            # Record error metrics
            from ..utils.message_logger import message_logger
            from ..utils.websocket_metrics import websocket_metrics

            websocket_metrics.error_occurred(match_id, str(user.user_id))
            message_logger.log_error(
                match_id, str(user.user_id), e, "game_message_handling"
            )

            self.logger.error(f"Error handling message: {e}")
            raise

    def disconnect_user_from_game(
        self, match_id: str, websocket: WebSocket, user: UserEntity
    ) -> None:
        """Safely disconnect user from game"""
        try:
            self.unified_game_manager.disconnect(match_id, websocket, str(user.user_id))
        except Exception as disconnect_error:
            self.logger.error(
                f"Error during disconnect for match_id: {match_id}, error: {str(disconnect_error)}"
            )

    async def validate_game_setup(
        self, match_id: str, user: UserEntity
    ) -> Optional[MatchEntity]:
        """Complete game validation flow"""
        # Validate match exists
        match = await self.validate_match(match_id)
        if not match:
            return None

        # Validate user participation
        if not self.validate_user_participation(match, user, match_id):
            return None

        return match

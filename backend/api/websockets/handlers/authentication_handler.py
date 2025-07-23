import asyncio
from typing import Optional

from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.entities.user.user import UserEntity
from fastapi import WebSocket
from infrastructure.logging.logging_config import get_logger

logger = get_logger("websockets.authentication_handler")


class WebSocketAuthenticationHandler:
    """Handles WebSocket authentication operations"""

    def __init__(self, user_use_case: GetCurrentUserUseCase):
        self.user_use_case = user_use_case
        self.logger = logger

    def extract_token(self, websocket: WebSocket, match_id: str) -> Optional[str]:
        """Extract authentication token from WebSocket query parameters"""
        token = websocket.query_params.get("token")

        if not token:
            self.logger.warning(f"No token provided for match_id: {match_id}")
            return None

        self.logger.info(f"Token extracted for match_id: {match_id}")
        return token

    async def authenticate_user(
        self, token: str, match_id: str
    ) -> Optional[UserEntity]:
        TIMEOUT = 10.0

        """Authenticate user with timeout"""
        self.logger.info(f"Starting user authentication for match_id: {match_id}")

        try:
            async with asyncio.timeout(TIMEOUT):
                user = await self.user_use_case.execute(token)
                self.logger.info(
                    f"User authenticated successfully for match_id: {match_id}, user: {user.user_id}"
                )
                return user
        except asyncio.TimeoutError:
            self.logger.error(f"Authentication timeout for match_id: {match_id}")
            return None
        except Exception as e:
            self.logger.error(
                f"Authentication failed for match_id: {match_id}, error: {str(e)}"
            )
            return None

    async def validate_authentication(
        self, websocket: WebSocket, match_id: str
    ) -> Optional[UserEntity]:
        """Complete authentication flow"""
        # Extract token
        token = self.extract_token(websocket, match_id)
        if not token:
            return None

        # Authenticate user
        user = await self.authenticate_user(token, match_id)
        if not user:
            return None

        return user

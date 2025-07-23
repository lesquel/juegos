from typing import Optional

from application.use_cases.auth.get_current_user import GetCurrentUserUseCase
from domain.repositories.match_repository import IMatchRepository
from infrastructure.websockets.unified_game_manager import UnifiedGameWebSocketManager

from ..config.websocket_config import WebSocketConfig
from ..services.websocket_service import WebSocketService


class WebSocketServiceFactory:
    """Factory for creating WebSocket services with different configurations"""

    @staticmethod
    def create_websocket_service(
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
        config: Optional[WebSocketConfig] = None,
    ) -> WebSocketService:
        """
        Create a WebSocket service with the specified configuration

        Args:
            user_use_case: Authentication use case
            match_repository: Repository for match data
            unified_game_manager: Game manager for WebSocket operations
            config: WebSocket configuration (defaults to development config)

        Returns:
            Configured WebSocket service
        """
        if config is None:
            config = WebSocketConfig.development()

        service = WebSocketService(
            user_use_case=user_use_case,
            match_repository=match_repository,
            unified_game_manager=unified_game_manager,
        )

        # Apply configuration to service
        service.config = config

        return service

    @staticmethod
    def create_development_service(
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ) -> WebSocketService:
        """Create a WebSocket service with development configuration"""
        return WebSocketServiceFactory.create_websocket_service(
            user_use_case,
            match_repository,
            unified_game_manager,
            WebSocketConfig.development(),
        )

    @staticmethod
    def create_production_service(
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ) -> WebSocketService:
        """Create a WebSocket service with production configuration"""
        return WebSocketServiceFactory.create_websocket_service(
            user_use_case,
            match_repository,
            unified_game_manager,
            WebSocketConfig.production(),
        )

    @staticmethod
    def create_testing_service(
        user_use_case: GetCurrentUserUseCase,
        match_repository: IMatchRepository,
        unified_game_manager: UnifiedGameWebSocketManager,
    ) -> WebSocketService:
        """Create a WebSocket service with testing configuration"""
        return WebSocketServiceFactory.create_websocket_service(
            user_use_case,
            match_repository,
            unified_game_manager,
            WebSocketConfig.testing(),
        )

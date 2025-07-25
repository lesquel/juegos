from application.services.game_finish_service import GameFinishService
from application.use_cases.match.finish_match import FinishMatchUseCase
from fastapi import Depends

from ...websockets.unified_game_manager import UnifiedGameWebSocketManager
from ..use_cases.match_participations_use_cases import get_finish_match_use_case


def get_game_finish_service(
    finish_match_use_case: FinishMatchUseCase = Depends(get_finish_match_use_case),
) -> GameFinishService:
    """Returns an instance of GameFinishService with all dependencies."""
    return GameFinishService(finish_match_use_case=finish_match_use_case)


def get_game_websocket_manager(
    game_finish_service: GameFinishService = Depends(get_game_finish_service),
) -> UnifiedGameWebSocketManager:
    """Returns an instance of UnifiedGameWebSocketManager with GameFinishService."""
    return UnifiedGameWebSocketManager(game_finish_service=game_finish_service)

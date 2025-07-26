from application.services.game_finish_service import GameFinishService
from application.use_cases.match.finish_match import FinishMatchUseCase
from fastapi import Depends
from infrastructure.dependencies.use_cases.match_participations_use_cases import (
    get_finish_match_use_case,
)


def get_game_finish_service(
    finish_match_use_case: FinishMatchUseCase = Depends(get_finish_match_use_case),
) -> GameFinishService:
    """
    Factory function to create GameFinishService with all required dependencies.

    Returns:
        GameFinishService: Configured service instance
    """
    return GameFinishService(finish_match_use_case=finish_match_use_case)

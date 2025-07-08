from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_games_use_case")


class GetAllGamesUseCase:
    def __init__(self, game_repo: IGameRepository):
        self.game_repo = game_repo

    def execute(
        self, pagination, filters, sort_params
    ) -> tuple[list[GameResponseDTO], int]:
        games, count = self.game_repo.get_paginated(pagination, filters, sort_params)
        if not games:
            logger.warning("No games found with the given filters and pagination")
            return [], 0
        games = [
            GameResponseDTO(
                game_id=str(game.game_id),
                game_name=game.game_name,
                game_description=game.game_description,
                game_img=game.game_img,
                game_url=game.game_url,
                categories=(
                    [str(category.category_id) for category in game.categories]
                    if game.categories
                    else None
                ),
                created_at=game.created_at,
                updated_at=game.updated_at,
            )
            for game in games
        ]
        return games, count

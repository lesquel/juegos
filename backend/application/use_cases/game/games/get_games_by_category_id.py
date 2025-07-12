from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_games_by_category_id_use_case")


class GetGamesByCategoryIdUseCase:
    def __init__(self, game_repo: IGameRepository):
        self.game_repo = game_repo

    def execute(
        self, game_id, pagination, filters, sort_params
    ) -> tuple[list[GameResponseDTO], int]:
        games, count = self.game_repo.get_by_category_id(
            game_id, pagination, filters, sort_params
        )
        if not games:
            logger.warning(
                "No games found with the given category, filters and pagination"
            )
            return [], 0
        games = [
            GameResponseDTO(
                game_id=game.game_id,
                game_name=game.game_name,
                game_description=game.game_description,
                game_img=game.game_img,
                game_url=game.game_url,
                categories=[str(category.category_id) for category in game.categories]
            )
            for game in games
        ]

        return games, count

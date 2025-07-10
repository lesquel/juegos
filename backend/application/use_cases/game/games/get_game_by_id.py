from domain.repositories import IGameRepository
from dtos.response.game import GameResponseDTO
from domain.exceptions import GameNotFoundError


from infrastructure.logging import get_logger

logger = get_logger("get_game_by_id_use_case")


class GetGameByIdUseCase:
    def __init__(self, game_repo: IGameRepository):
        self.game_repo = game_repo

    def execute(self, game_id: str) -> GameResponseDTO | None:
        game = self.game_repo.get_by_id(game_id)
        if not game:
            logger.warning(f"Game not found: {game_id}")
            raise GameNotFoundError(f"Game with ID {game_id} not found")
        return GameResponseDTO(
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

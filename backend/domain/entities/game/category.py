from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .game import GameEntity

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class CategoryEntity(TimeStampEntityMixin):
    def __init__(
        self,
        category_id: Optional[str],
        category_name: str,
        category_img: Optional[str],
        category_description: Optional[str],
        games: Optional[list["GameEntity"]],
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.category_id = category_id
        self.category_name = category_name
        self.category_img = category_img
        self.category_description = category_description
        self.games = games if games is not None else []

    def add_game(self, game: "GameEntity"):
        if game not in self.games:
            self.games.append(game)

    def __repr__(self):
        return f"CategoryEntity(category_id={self.category_id}, category_name='{self.category_name}', category_img='{self.category_img}', category_description='{self.category_description}')"

from typing import Optional

from .category import CategoryEntity

from .time_stamp_entity_mixin import TimeStampEntityMixin


class GameEntity(TimeStampEntityMixin):
    def __init__(
        self,
        game_id: Optional[str],
        game_name: str,
        game_description: str,
        game_url: str,
        game_img: str,
        categories: Optional[list[CategoryEntity]],
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.game_id = game_id
        self.game_name = game_name
        self.game_description = game_description
        self.game_url = game_url
        self.game_img = game_img
        self.categories = categories if categories is not None else []

    def add_category(self, category: CategoryEntity):
        if category not in self.categories:
            self.categories.append(category)

    def __repr__(self):
        return f"GameEntity(game_id={self.game_id}, game_name='{self.game_name}', game_description='{self.game_description}', game_url='{self.game_url}')"

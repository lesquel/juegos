from typing import Optional

from ..time_stamp_entity_mixin import TimeStampEntityMixin


class CategoryEntity(TimeStampEntityMixin):
    def __init__(
        self,
        category_id: Optional[str],
        category_name: str,
        category_img: Optional[str],
        category_description: Optional[str],
        games: Optional[list[str]],  # Solo IDs de juegos para eficiencia
        created_at: Optional[str],
        updated_at: Optional[str],
    ):
        super().__init__(created_at, updated_at)

        self.category_id = category_id
        self.category_name = category_name
        self.category_img = category_img
        self.category_description = category_description
        self.games = games if games is not None else []  # Lista de IDs de juegos

    def add_game_id(self, game_id: str):
        """Añade el ID de un juego a la categoría."""
        if game_id not in self.games:
            self.games.append(game_id)

    def remove_game_id(self, game_id: str):
        """Remueve el ID de un juego de la categoría."""
        if game_id in self.games:
            self.games.remove(game_id)

    def has_game(self, game_id: str) -> bool:
        """Verifica si la categoría contiene un juego específico."""
        return game_id in self.games

    def __repr__(self):
        return (
            f"CategoryEntity(category_id={self.category_id}, "
            f"category_name='{self.category_name}', games_count={len(self.games)})"
        )

from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
import uuid

from domain.repositories import IGameRepository, IConstructorRepository
from domain.entities.game import GameEntity
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import GameFilterParams
from infrastructure.logging import get_logger

from ..models.game_model import GameModel

# Configurar logger
logger = get_logger("game_repository")


class PostgresGameRepository(IGameRepository, IConstructorRepository):
    """
    A repository for managing user data in a PostgreSQL database.
    """

    def __init__(self, db_session: Session):
        super().__init__(db_session, GameModel)

    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[GameFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[GameEntity], int]:
        """Get paginated games with optional filtering and sorting."""
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
        )

    def get_by_id(self, game_id: str) -> Optional[GameEntity]:
        """Retrieves a game by its ID."""
        logger.debug(f"Getting game by ID: {game_id}")
        game_model = (
            self.db.query(self.model).filter(self.model.game_id == game_id).first()
        )

        if game_model:
            logger.debug(f"Game found with ID: {game_id}")
            return self._model_to_entity(game_model)
        else:
            logger.debug(f"No game found with ID: {game_id}")
            return None

    def get_by_category_id(self, category_id: str) -> Optional[GameEntity]:
        """Retrieves a game by its category ID."""
        logger.debug(f"Getting game by category ID: {category_id}")

        game_models = self.db.query(self.model).filter(
            self.model.categories.any(id=category_id)
        )

        if game_models:
            logger.debug(f"Game found with category ID: {category_id}")
            return [self._model_to_entity(model) for model in game_models]
        else:
            logger.debug(f"No game found with category ID: {category_id}")
            return None

    def _model_to_entity(self, model: GameModel) -> GameEntity:
        """Converts a GameModel to a Game entity."""
        return GameEntity(
            game_id=str(model.game_id),
            game_name=model.game_name,
            game_description=model.game_description,
            game_img=model.game_img,
            game_url=model.game_url,
            categories=model.categories,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

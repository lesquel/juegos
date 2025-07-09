from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
import uuid

from domain.repositories import ICategoryRepository, IConstructorRepository
from domain.entities import CategoryEntity
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import CategoryFilterParams
from infrastructure.logging import get_logger

from ..models import CategoryModel

# Configurar logger
logger = get_logger("category_repository")


class PostgresCategoryRepository(ICategoryRepository, IConstructorRepository):
    """
    A repository for managing user data in a PostgreSQL database.
    """

    def __init__(self, db_session: Session):
        super().__init__(db_session, CategoryModel)

    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[CategoryFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[CategoryEntity], int]:
        """Get paginated categories with optional filtering and sorting."""
        logger.debug("Getting all categories from database")
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
        )

    def get_by_id(self, category_id: str) -> Optional[CategoryEntity]:
        """Retrieves a category by its ID."""
        logger.debug(f"Getting category by ID: {category_id}")
        category_model = (
            self.db.query(self.model)
            .filter(self.model.category_id == category_id)
            .first()
        )

        if category_model:
            logger.debug(f"Category found with ID: {category_id}")
            return self._model_to_entity(category_model)
        else:
            logger.debug(f"No category found with ID: {category_id}")
            return None

    def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: Optional[CategoryFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[CategoryEntity], int]:
        """Retrieves a category by its game ID."""
        logger.debug(f"Getting category by game ID: {game_id}")
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda q: q.filter(self.model.games.any(game_id=game_id)),
        )

    def _model_to_entity(self, model: CategoryModel) -> CategoryEntity:
        """Converts a CategoryModel to a User entity."""
        return CategoryEntity(
            category_id=str(model.category_id),
            category_name=model.category_name,
            category_img=model.category_img,
            category_description=model.category_description,
            games=model.games,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

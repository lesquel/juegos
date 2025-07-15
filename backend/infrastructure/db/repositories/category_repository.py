from typing import List, Optional, Tuple
import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from domain.repositories import ICategoryRepository
from domain.entities import CategoryEntity
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import CategoryFilterParams
from .base_repository import BaseReadOnlyPostgresRepository
from ..models import CategoryModel


class PostgresCategoryRepository(
    BaseReadOnlyPostgresRepository[CategoryEntity, CategoryModel, CategoryFilterParams],
    ICategoryRepository,
):
    """Repositorio de categorías para PostgreSQL."""

    async def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[CategoryFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[CategoryEntity], int]:
        """Obtiene categorías paginadas con eager loading."""
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.options(selectinload(self.model.games)),
        )

    async def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: Optional[CategoryFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[CategoryEntity], int]:
        """Obtiene categorías por ID de juego con eager loading."""
        self.logger.debug(f"Getting categories by game ID: {game_id}")
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.options(
                selectinload(self.model.games)
            ).where(self.model.games.any(game_id=game_id)),
        )

    async def get_by_id(self, entity_id: str) -> Optional[CategoryEntity]:
        """Obtiene una categoría por ID con eager loading."""
        self.logger.debug(f"Getting category by ID: {entity_id}")
        stmt = (
            select(self.model)
            .options(selectinload(self.model.games))
            .where(self.model.category_id == entity_id)
        )
        result = await self.db.execute(stmt)
        model_instance = result.scalar_one_or_none()

        if model_instance:
            self.logger.debug(f"Category found with ID: {entity_id}")
            return self._model_to_entity(model_instance)
        else:
            self.logger.debug(f"No category found with ID: {entity_id}")
            return None

    def _model_to_entity(self, model: CategoryModel) -> CategoryEntity:
        """Convierte CategoryModel a CategoryEntity."""
        # Extraer los IDs de los juegos para evitar lazy loading
        game_ids = [str(game.game_id) for game in model.games] if model.games else []

        return CategoryEntity(
            category_id=str(model.category_id),
            category_name=model.category_name,
            category_img=model.category_img,
            category_description=model.category_description,
            games=game_ids,  # Usando IDs en lugar del objeto completo
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.category_id

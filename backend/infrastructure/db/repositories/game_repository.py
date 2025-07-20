from typing import List, Optional, Tuple

from domain.entities.game import GameEntity
from domain.repositories import IGameRepository
from interfaces.api.common.filters.specific_filters import GameFilterParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models import GameModel
from .base_repository import BaseReadOnlyPostgresRepository


class PostgresGameRepository(
    BaseReadOnlyPostgresRepository[GameEntity, GameModel, GameFilterParams],
    IGameRepository,
):
    """Repositorio de juegos para PostgreSQL."""

    async def get_by_category_id(
        self,
        category_id: str,
        pagination: PaginationParams,
        filters: GameFilterParams,
        sort_params: SortParams,
    ) -> Tuple[List[GameEntity], int]:
        """Obtiene juegos por ID de categoría con eager loading."""
        self.logger.debug(f"Getting games by category ID: {category_id}")

        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.options(
                selectinload(self.model.categories),
                selectinload(self.model.reviews),
                selectinload(self.model.matches),
            ).where(self.model.categories.any(category_id=category_id)),
        )

    async def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[GameFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[GameEntity], int]:
        """Obtiene juegos paginados con eager loading."""
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.options(
                selectinload(self.model.categories),
                selectinload(self.model.reviews),
                selectinload(self.model.matches),
            ),
        )

    async def get_by_id(self, entity_id: str) -> Optional[GameEntity]:
        """Obtiene un juego por ID con eager loading."""
        self.logger.debug(f"Getting game by ID: {entity_id}")
        stmt = (
            select(self.model)
            .options(
                selectinload(self.model.categories),
                selectinload(self.model.reviews),
                selectinload(self.model.matches),
            )
            .where(self.model.game_id == entity_id)
        )
        result = await self.db.execute(stmt)
        model_instance = result.scalar_one_or_none()

        if model_instance:
            self.logger.debug(f"Game found with ID: {entity_id}")
            return self._model_to_entity(model_instance)
        else:
            self.logger.debug(f"No game found with ID: {entity_id}")
            return None

    def _model_to_entity(self, model: GameModel) -> GameEntity:
        """Convierte GameModel a GameEntity."""
        # Extraer solo los IDs de las categorías en lugar de los objetos completos
        category_ids = (
            [str(category.category_id) for category in model.categories]
            if model.categories
            else []
        )

        return GameEntity(
            game_id=str(model.game_id),
            game_name=model.game_name,
            game_description=model.game_description,
            game_img=model.game_img,
            game_url=model.game_url,
            game_capacity=model.game_capacity,
            house_odds=model.house_odds,
            categories=category_ids,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.game_id

    def _get_entity_id(self, entity: GameEntity) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        return entity.game_id

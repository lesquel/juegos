from typing import List, Optional, Tuple
from sqlalchemy import select

from domain.repositories import IGameReviewRepository
from domain.entities.game import GameReviewEntity
from domain.exceptions.game import GameReviewAlreadyExistsError, GameReviewNotFoundError
from infrastructure.db.models import GameReviewModel
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import GameReviewFilterParams
from .base_repository import BasePostgresRepository


class PostgresGameReviewRepository(
    BasePostgresRepository[GameReviewEntity, GameReviewModel, GameReviewFilterParams],
    IGameReviewRepository,
):
    """Repositorio de reseñas de juegos para PostgreSQL."""

    async def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: Optional[GameReviewFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[GameReviewEntity], int]:
        """Obtiene reviews del juego con paginación y ordenamiento."""
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.where(self.model.game_id == game_id),
        )

    async def get_by_user_and_game_id(
        self, user_id: str, game_id: str
    ) -> GameReviewModel:
        """Obtiene una reseña de un juego específico por el ID del usuario y del juego."""
        self.logger.debug(
            f"Getting review by user ID: {user_id} and game ID: {game_id}"
        )
        stmt = select(self.model).where(
            self.model.user_id == user_id, self.model.game_id == game_id
        )
        result = await self.db.execute(stmt)
        game_review_model = result.scalar_one_or_none()

        if game_review_model:
            self.logger.debug(
                f"Game review found for user ID: {user_id} and game ID: {game_id}"
            )
            return game_review_model
        else:
            self.logger.debug(
                f"No game review found for user ID: {user_id} and game ID: {game_id}"
            )
            return None

    async def save(self, entity: GameReviewEntity) -> GameReviewEntity:
        """Creates a new GameReview. Throws exception if review already exists for user+game."""
        try:
            # Verificar si ya existe una reseña del usuario para el juego
            existing_review = await self.get_by_user_and_game_id(
                user_id=entity.user_id, game_id=entity.game_id
            )

            if existing_review:
                self.logger.error(
                    f"Review already exists for user_id={entity.user_id}, game_id={entity.game_id}"
                )
                raise GameReviewAlreadyExistsError(
                    f"User {entity.user_id} already has a review for game {entity.game_id}"
                )

            self.logger.debug(f"Creating new game review: {entity}")
            new_model = self._entity_to_model(entity)
            self.db.add(new_model)
            await self.db.commit()
            await self.db.refresh(new_model)
            return self._model_to_entity(new_model)

        except Exception as e:
            self.logger.error(f"Error creating game review: {e}")
            await self.db.rollback()
            raise

    async def update(self, entity: GameReviewEntity) -> GameReviewEntity:
        """Actualiza una reseña de juego existente."""
        try:
            if not entity.review_id:
                raise ValueError("Entity must have a review_id for updates")

            stmt = select(self.model).where(self.model.review_id == entity.review_id)
            result = await self.db.execute(stmt)
            game_review_model = result.scalar_one_or_none()

            if not game_review_model:
                self.logger.error(f"Game review with ID {entity.review_id} not found")
                raise GameReviewNotFoundError(
                    f"Game review with ID {entity.review_id} not found"
                )

            # Actualizar solo los campos que no son None
            if entity.rating is not None:
                game_review_model.rating = entity.rating
            if entity.comment is not None:
                game_review_model.comment = entity.comment

            await self.db.commit()
            await self.db.refresh(game_review_model)

            self.logger.info(f"Successfully updated game review: {entity.review_id}")
            return self._model_to_entity(game_review_model)

        except Exception as e:
            self.logger.error(f"Error updating game review: {e}")
            await self.db.rollback()
            raise

    def _model_to_entity(self, model: GameReviewModel) -> GameReviewEntity:
        """Convierte GameReviewModel a GameReviewEntity."""
        return GameReviewEntity(
            review_id=str(model.review_id),
            game_id=str(model.game_id),
            user_id=str(model.user_id),
            rating=model.rating,
            comment=model.comment,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _entity_to_model(self, entity: GameReviewEntity) -> GameReviewModel:
        """Convierte GameReviewEntity a GameReviewModel."""
        return GameReviewModel(
            review_id=entity.review_id,
            game_id=entity.game_id,
            user_id=entity.user_id,
            rating=entity.rating,
            comment=entity.comment,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.review_id

    def _get_entity_id(self, entity: GameReviewEntity) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        return entity.review_id

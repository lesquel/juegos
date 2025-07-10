from sqlalchemy.orm import Session
from typing import List, Optional, Tuple

from domain.repositories import IGameReviewRepository, IConstructorRepository
from domain.entities.game import GameReviewEntity
from infrastructure.db.models import GameReviewModel
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import GameReviewFilterParams
from infrastructure.logging import get_logger


# Configurar logger
logger = get_logger("game_repository")


class PostgresGameReviewRepository(IGameReviewRepository, IConstructorRepository):
    """
    A repository for managing user data in a PostgreSQL database.
    """

    def __init__(self, db_session: Session):
        super().__init__(db_session, GameReviewModel)

    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[GameReviewFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[GameReviewEntity], int]:
        """Get paginated games with optional filtering and sorting."""
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
        )

    def get_by_id(self, game_review_id: str) -> Optional[GameReviewEntity]:
        """Retrieves a game by its ID."""
        logger.debug(f"Getting game by ID: {game_review_id}")
        game_review_model = (
            self.db.query(self.model)
            .filter(self.model.game_review_id == game_review_id)
            .first()
        )

        if game_review_model:
            logger.debug(f"Game review found with ID: {game_review_id}")
            return self._model_to_entity(game_review_model)
        else:
            logger.debug(f"No game review found with ID: {game_review_id}")
            return None

    def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: Optional[GameReviewFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[GameReviewEntity], int]:
        """Obtiene reviews del juego con paginación y ordenamiento."""
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda q: q.filter(self.model.game_id == game_id),
        )

    def _get_by_user_and_game_id(self, user_id: str, game_id: str) -> GameReviewEntity:
        """Obtiene una reseña de un juego específico por el ID del usuario y del juego."""
        logger.debug(f"Getting review by user ID: {user_id} and game ID: {game_id}")
        game_review_model = (
            self.db.query(self.model)
            .filter(self.model.user_id == user_id, self.model.game_id == game_id)
            .first()
        )
        if game_review_model:
            logger.debug(
                f"Game review found for user ID: {user_id} and game ID: {game_id}"
            )
            return game_review_model
        else:
            logger.debug(
                f"No game review found for user ID: {user_id} and game ID: {game_id}"
            )
            return None

    def save(self, entity: GameReviewEntity) -> GameReviewEntity:
        """Creates or updates a GameReview: If one exists for the user+game, update it."""
        try:
            # Buscar si ya existe una reseña del usuario para el juego
            existing_review = self._get_by_user_and_game_id(
                user_id=entity.user_id, game_id=entity.game_id
            )

            if existing_review:
                logger.debug(
                    f"Review already exists for user_id={entity.user_id}, game_id={entity.game_id}. Updating..."
                )
                # Actualizar campos
                if entity.rating is not None:
                    existing_review.rating = entity.rating
                if entity.comment is not None:
                    existing_review.comment = entity.comment

                self.db.commit()
                self.db.refresh(existing_review)
                return self._model_to_entity(existing_review)

            logger.debug(f"Saving new game review: {entity}")
            new_model = self._entity_to_model(entity)
            self.db.add(new_model)
            self.db.commit()
            self.db.refresh(new_model)
            return self._model_to_entity(new_model)

        except Exception as e:
            logger.error(f"Error saving game review: {e}")
            self.db.rollback()
            raise

    def delete(self, game_review_id: str) -> None:
        """Deletes a game review by its ID."""
        logger.debug(f"Deleting game review with ID: {game_review_id}")
        game_review_model = (
            self.db.query(self.model)
            .filter(self.model.review_id == game_review_id)
            .first()
        )

        if game_review_model:
            self.db.delete(game_review_model)
            self.db.commit()
            logger.debug(f"Game review deleted with ID: {game_review_id}")
        else:
            logger.warning(f"No game review found to delete with ID: {game_review_id}")

    def update(self, game_review_id: str, entity: GameReviewEntity) -> GameReviewEntity:
        """Updates a game review by its ID."""
        logger.debug(f"Updating game review with ID: {game_review_id}")
        game_review_model = (
            self.db.query(self.model)
            .filter(self.model.review_id == game_review_id)
            .first()
        )
        if not game_review_model:
            logger.warning(f"No game review found to update with ID: {game_review_id}")
            return None
        # Update fields
        if entity.rating is not None:
            game_review_model.rating = entity.rating
        if entity.comment is not None:
            game_review_model.comment = entity.comment
        self.db.commit()
        self.db.refresh(game_review_model)
        logger.debug(f"Game review updated with ID: {game_review_id}")
        return self._model_to_entity(game_review_model)

    def _model_to_entity(self, model: GameReviewModel) -> GameReviewEntity:
        """Converts a GameReviewModel to a GameReview entity."""
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
        """Converts a GameReview entity to a GameReviewModel."""
        return GameReviewModel(
            review_id=entity.review_id,
            game_id=entity.game_id,
            user_id=entity.user_id,
            rating=entity.rating,
            comment=entity.comment,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

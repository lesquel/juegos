from typing import List, Optional, Tuple

from api.http.common.filters.specific_filters.match_filters import MatchFilterParams
from api.http.common.pagination import PaginationParams
from api.http.common.sort import SortParams
from domain.entities.match.match import MatchEntity
from domain.exceptions.match import MatchNotFoundError
from domain.repositories.match_repository import IMatchRepository
from infrastructure.db.models.match.match_model import MatchModel
from infrastructure.db.models.match.match_participation_model import (
    MatchParticipationModel,
)
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from .base_repository import BasePostgresRepository


class PostgresMatchRepository(
    BasePostgresRepository[MatchEntity, MatchModel, MatchFilterParams],
    IMatchRepository,
):
    """Repositorio de partidas para PostgreSQL."""

    async def get_by_game_id(
        self,
        game_id: str,
        pagination: PaginationParams,
        filters: Optional[MatchFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[MatchEntity], int]:
        """Obtiene partidas por ID de juego con paginación y ordenamiento."""
        return await self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
            custom_filter_fn=lambda stmt: stmt.where(self.model.game_id == game_id),
            load_options=self.get_load_options(),
        )

    async def get_match_participant_ids(self, match_id: str) -> List[str]:
        """Obtiene la lista de IDs de participantes de una partida."""
        try:
            stmt = select(MatchParticipationModel.user_id).where(
                MatchParticipationModel.match_id == match_id
            )
            result = await self.db.execute(stmt)
            participant_ids = result.scalars().all()
            return [str(user_id) for user_id in participant_ids]
        except Exception as e:
            self.logger.error(f"Error getting match participants: {e}")
            raise

    async def update(self, entity_id: str, entity: MatchEntity) -> MatchEntity:
        """Actualiza una partida existente."""
        try:
            if not entity_id:
                raise ValueError("Entity ID is required for updates")

            stmt = select(self.model).where(self.model.match_id == entity_id)
            result = await self.db.execute(stmt)
            match_model = result.unique().scalar_one_or_none()

            if not match_model:
                self.logger.error(f"Match with ID {entity.match_id} not found")
                raise MatchNotFoundError(f"Match with ID {entity.match_id} not found")

            match_model.winner_id = entity.winner_id

            existing_participants = {
                str(p.user_id): p for p in match_model.participants
            }
            new_participants = []
            for user_id in entity.participant_ids:
                user_id_str = str(user_id)
                if user_id_str in existing_participants:
                    new_participants.append(existing_participants[user_id_str])
                else:
                    new_participants.append(
                        MatchParticipationModel(
                            match_id=entity.match_id, user_id=user_id, score=0
                        )
                    )
            match_model.participants = new_participants

            await self.db.commit()
            await self.db.refresh(match_model)

            self.logger.info(f"Successfully updated match: {entity.match_id}")
            return self._model_to_entity(match_model)

        except Exception as e:
            self.logger.error(f"Error updating match: {e}")
            await self.db.rollback()
            raise

    async def get_by_id(self, entity_id: str) -> Optional[MatchEntity]:
        """Obtiene una partida por ID con sus participaciones."""
        try:
            stmt = (
                select(self.model)
                .options(selectinload(self.model.participants))
                .where(self.model.match_id == entity_id)
            )

            result = await self.db.execute(stmt)
            match_model = result.scalar_one_or_none()

            if not match_model:
                return None

            return self._model_to_entity(match_model)

        except Exception as e:
            self.logger.error(f"Error getting match by ID: {e}")
            raise

    def _model_to_entity(self, model: MatchModel) -> MatchEntity:
        """Convierte MatchModel a MatchEntity."""

        participant_ids = (
            [str(p.user_id) for p in model.participants] if model.participants else []
        )

        return MatchEntity(
            match_id=str(model.match_id) if model.match_id else None,
            game_id=str(model.game_id),
            base_bet_amount=model.base_bet_amount,
            created_by_id=str(model.created_by_id),
            winner_id=str(model.winner_id) if model.winner_id else None,
            participant_ids=participant_ids,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _entity_to_model(self, entity: MatchEntity) -> MatchModel:
        """Convierte MatchEntity a MatchModel."""
        participants = (
            [
                MatchParticipationModel(
                    match_id=entity.match_id,
                    user_id=user_id,
                    score=0,  # Inicializar con score 0 para nuevos participantes
                )
                for user_id in entity.participant_ids
            ]
            if entity.participant_ids
            else []
        )

        return MatchModel(
            match_id=entity.match_id,
            game_id=entity.game_id,
            base_bet_amount=entity.base_bet_amount,
            created_by_id=entity.created_by_id,
            winner_id=entity.winner_id,
            participants=participants,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.match_id

    def _get_entity_id(self, entity: MatchEntity | MatchModel) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        return entity.match_id

    def get_load_options(self):
        return [selectinload(self.model.participants)]

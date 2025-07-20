from typing import List, Optional, Tuple

from domain.entities.match.match import MatchEntity
from domain.exceptions.match import MatchNotFoundError, MatchScoreError
from domain.repositories.match_repository import IMatchRepository
from infrastructure.db.models.match.match_model import MatchModel
from infrastructure.db.models.match.match_participation_model import (
    MatchParticipationModel,
)
from interfaces.api.common.filters.specific_filters.match_filters import (
    MatchFilterParams,
)
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.sort import SortParams
from sqlalchemy import and_, select
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

    async def join_match(self, match_id: str, user_id: str) -> MatchEntity:
        """Permite a un usuario unirse a una partida."""
        try:
            # Verificar que la partida existe
            match = await self.get_by_id(match_id)

            if not match:
                raise MatchNotFoundError(f"Match with ID {match_id} not found")

            print("Participant IDs before joining:")
            print(match.participant_ids)

            # Crear nueva participación
            participation = MatchParticipationModel(
                match_id=match_id,
                user_id=user_id,
                score=0,  # Inicializar con score 0
            )

            self.db.add(participation)
            await self.db.commit()

            # Retornar la partida actualizada
            updated_match = await self.get_by_id(match_id)
            if updated_match is not None:
                updated_match.participant_ids.append(user_id)
                return updated_match
            else:
                raise ValueError(f"Match with ID {match_id} not found after update")

        except Exception as e:
            self.logger.error(f"Error joining match: {e}")
            await self.db.rollback()
            raise

    async def update(self, entity_id: str, entity: MatchEntity) -> None:
        """Actualiza una partida existente."""
        try:
            if not entity_id:
                raise ValueError("Entity ID is required for updates")

            stmt = select(self.model).where(self.model.match_id == entity_id)
            result = await self.db.execute(stmt)
            match_model = result.scalar_one_or_none()

            if not match_model:
                self.logger.error(f"Match with ID {entity.match_id} not found")
                raise MatchNotFoundError(f"Match with ID {entity.match_id} not found")

            if entity.updated_at is not None:
                match_model.updated_at = entity.updated_at

            await self.db.commit()
            await self.db.refresh(match_model)

            self.logger.info(f"Successfully updated match: {entity.match_id}")
            return self._model_to_entity(match_model)

        except Exception as e:
            self.logger.error(f"Error updating match: {e}")
            await self.db.rollback()
            raise

    async def finish_match(
        self, match_id: str, participations: List[tuple[str, int]]
    ) -> MatchEntity:
        """
        Finaliza una partida actualizando los puntajes y asignando al ganador.

        Args:
            match_id: ID de la partida.
            participations: Lista de tuplas (user_id, score).

        Returns:
            MatchEntity actualizado con los puntajes y ganador.

        Raises:
            MatchNotFoundError: Si la partida o alguna participación no se encuentra.
        """
        try:
            print("PARTICIPATIONS:")
            print(participations)
            for user_id, score in participations:
                if not await self.is_user_participant(match_id, user_id):
                    self.logger.warning(
                        f"User {user_id} is not a participant in match {match_id}"
                    )
                    raise MatchScoreError("User is not a participant in this match")

            # Determinar ganador
            winner_id = max(participations, key=lambda x: x[1])[0]

            # Actualizar la entidad de la partida con el ganador y estado
            match_stmt = select(MatchModel).where(MatchModel.match_id == match_id)
            match_result = await self.db.execute(match_stmt)
            match = match_result.scalar_one_or_none()

            if not match:
                raise MatchNotFoundError(f"Match with ID {match_id} not found")

            match.winner_id = winner_id

            await self.db.commit()

            return await self.get_by_id(match_id)

        except Exception as e:
            self.logger.error(f"Unexpected error finishing match: {e}")
            await self.db.rollback()
            raise

    async def is_user_participant(self, match_id: str, user_id: str) -> bool:
        """Verifica si un usuario es participante de una partida."""
        try:
            stmt = select(MatchParticipationModel).where(
                and_(
                    MatchParticipationModel.match_id == match_id,
                    MatchParticipationModel.user_id == user_id,
                )
            )
            result = await self.db.execute(stmt)
            participation = result.scalar_one_or_none()
            return participation is not None

        except Exception as e:
            self.logger.error(f"Error checking user participation: {e}")
            return False

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

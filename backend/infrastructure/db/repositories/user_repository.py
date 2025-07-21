"""Repositorio de usuarios para PostgreSQL."""

import uuid
from typing import Optional

from api.http.common.filters.specific_filters import UserFilterParams
from domain.entities import UserEntity
from domain.exceptions import UserNotFoundError
from domain.repositories import IUserRepository
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import UserModel
from .base_repository import BasePostgresRepository


class PostgresUserRepository(
    BasePostgresRepository[UserEntity, UserModel, UserFilterParams], IUserRepository
):
    """Repositorio de usuarios para PostgreSQL."""

    def __init__(self, db_session: AsyncSession, db_model: type[UserModel]):
        super().__init__(db_session, db_model)

    async def get_by_email(self, email: str) -> Optional[UserEntity]:
        """Obtiene un usuario por email."""
        self.logger.debug(f"Getting user by email: {email}")
        stmt = select(self.model).where(self.model.email == email)
        result = await self.db.execute(stmt)
        user_model = result.scalar_one_or_none()

        if user_model:
            self.logger.debug(f"User found with email: {email}")
            return self._model_to_entity(user_model)
        else:
            self.logger.debug(f"No user found with email: {email}")
            return None

    async def update(self, user_id: str, user: UserEntity) -> None:
        """Actualiza un usuario."""
        stmt = select(self.model).where(self.model.user_id == user_id)
        result = await self.db.execute(stmt)
        user_model = result.scalar_one_or_none()

        if user_model:
            user_model.email = user.email
            user_model.hashed_password = user.hashed_password
            user_model.virtual_currency = user.virtual_currency
            user_model.role = user.role
            await self.db.commit()
            self.logger.info(f"Successfully updated user: {user_id}")
        else:
            raise UserNotFoundError(f"User with ID {user_id} not found")

    def _model_to_entity(self, model: UserModel) -> UserEntity:
        """Convierte UserModel a UserEntity."""
        return UserEntity(
            user_id=str(model.user_id),
            email=model.email,
            hashed_password=model.hashed_password,
            virtual_currency=model.virtual_currency,
            role=model.role,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _entity_to_model(self, entity: UserEntity) -> UserModel:
        """Convierte UserEntity a UserModel."""
        return UserModel(
            user_id=uuid.UUID(entity.user_id) if entity.user_id else None,
            email=entity.email,
            hashed_password=entity.hashed_password,
            virtual_currency=entity.virtual_currency,
            role=entity.role,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        return self.model.user_id

    def _get_entity_id(self, entity: UserEntity) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        return entity.user_id

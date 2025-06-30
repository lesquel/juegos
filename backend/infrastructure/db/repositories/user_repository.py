from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
import uuid

from domain.repositories import IUserRepository
from domain.entities import UserEntity
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import UserFilterParams


from ..models.user_model import UserModel


class PostgresUserRepository(IUserRepository):
    """
    A repository for managing user data in a PostgreSQL database.
    """

    def __init__(self, db_session: Session):
        self.db = db_session

    def get_all(self) -> List[UserEntity]:
        """Retrieves all users from the repository."""
        user_models = self.db.query(UserModel).all()
        return [self._model_to_entity(model) for model in user_models]

    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[UserFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[UserEntity], int]:
        """
        Retrieves users with pagination and optional filters.

        Returns:
            Tuple[List[UserEntity], int]: (users, total_count)
        """
        query = self.db.query(UserModel)

        # Aplicar filtros si existen
        if filters:
            query = self._apply_filters(query, filters)

        if sort_params:
            query = self._apply_sorting(query, sort_params)

        # Contar total de elementos (antes de aplicar paginación)
        total_count = query.count()

        # Aplicar paginación
        users = query.offset(pagination.offset).limit(pagination.limit).all()

        return [self._model_to_entity(model) for model in users], total_count

    def _apply_filters(self, query, filters: UserFilterParams):
        """Aplica filtros a la consulta SQL"""
        if filters.username:
            query = query.filter(UserModel.username.ilike(f"%{filters.username}%"))

        if filters.email:
            query = query.filter(UserModel.email.ilike(f"%{filters.email}%"))

        if filters.min_currency is not None:
            query = query.filter(UserModel.virtual_currency >= filters.min_currency)

        if filters.max_currency is not None:
            query = query.filter(UserModel.virtual_currency <= filters.max_currency)

        return query

    def _apply_sorting(self, query, sort_params: SortParams):
        """Applies sorting to the query based on sort parameters."""
        if sort_params.sort_by:
            if sort_params.sort_order == "desc":
                query = query.order_by(getattr(UserModel, sort_params.sort_by).desc())
            else:
                query = query.order_by(getattr(UserModel, sort_params.sort_by).asc())
        return query

    def get_by_id(self, user_id: str) -> Optional[UserEntity]:
        """Retrieves a user by their ID."""
        user_model = (
            self.db.query(UserModel).filter(UserModel.user_id == user_id).first()
        )

        return self._model_to_entity(user_model) if user_model else None

    def get_by_email(self, email: str) -> Optional[UserEntity]:
        """Retrieves a user by their email address."""
        user_model = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._model_to_entity(user_model) if user_model else None

    def save(self, user: UserEntity) -> UserEntity:
        """Saves a user to the repository."""
        if user.user_id is None:
            # Create new user
            user_model = UserModel(
                username=user.username,
                email=user.email,
                hashed_password=user.hashed_password,
            )
            self.db.add(user_model)
        else:
            # Update existing user
            user_model = (
                self.db.query(UserModel)
                .filter(UserModel.user_id == user.user_id)
                .first()
            )
            if user_model:
                user_model.username = user.username
                user_model.email = user.email
                user_model.hashed_password = user.hashed_password

        self.db.commit()
        self.db.refresh(user_model)
        return self._model_to_entity(user_model)

    def update(self, user_id: str, user: UserEntity) -> None:
        """Updates a user in the repository."""
        user_model = (
            self.db.query(UserModel).filter(UserModel.user_id == user_id).first()
        )
        if user_model:
            user_model.username = user.username
            user_model.email = user.email
            user_model.hashed_password = user.hashed_password
            self.db.commit()

    def delete(self, user_id: str) -> None:
        """Deletes a user from the repository by their ID."""
        user_model = (
            self.db.query(UserModel).filter(UserModel.user_id == user_id).first()
        )
        if user_model:
            self.db.delete(user_model)
            self.db.commit()

    def _model_to_entity(self, model: UserModel) -> UserEntity:
        """Converts a UserModel to a User entity."""
        return UserEntity(
            user_id=str(model.user_id),
            username=model.username,
            email=model.email,
            hashed_password=model.hashed_password,
            virtual_currency=model.virtual_currency,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _entity_to_model(self, entity: UserEntity) -> UserModel:
        """Converts a User entity to a UserModel."""
        return UserModel(
            user_id=uuid.UUID(entity.user_id) if entity.user_id else None,
            username=entity.username,
            email=entity.email,
            hashed_password=entity.hashed_password,
            virtual_currency=entity.virtual_currency,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

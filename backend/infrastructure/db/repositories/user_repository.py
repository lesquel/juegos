from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
import uuid

from domain.repositories import IUserRepository, IConstructorRepository
from domain.entities import UserEntity
from interfaces.api.common.sort import SortParams
from interfaces.api.common.pagination import PaginationParams
from interfaces.api.common.filters.specific_filters import UserFilterParams
from infrastructure.logging import get_logger

from ..models.user_model import UserModel

# Configurar logger
logger = get_logger("user_repository")


class PostgresUserRepository(IUserRepository, IConstructorRepository):
    """
    A repository for managing user data in a PostgreSQL database.
    """

    def __init__(self, db_session: Session):
        super().__init__(db_session, UserModel)

    def get_paginated(
        self,
        pagination: PaginationParams,
        filters: Optional[UserFilterParams] = None,
        sort_params: Optional[SortParams] = None,
    ) -> Tuple[List[UserEntity], int]:
        """Get paginated users with optional filtering and sorting."""
        logger.debug("Getting all users from database")
        return self.get_paginated_mixin(
            model=self.model,
            db_session=self.db,
            pagination=pagination,
            filters=filters,
            sort_params=sort_params,
            to_entity=self._model_to_entity,
        )

    def get_by_id(self, user_id: str) -> Optional[UserEntity]:
        """Retrieves a user by their ID."""
        logger.debug(f"Getting user by ID: {user_id}")
        user_model = (
            self.db.query(self.model).filter(self.model.user_id == user_id).first()
        )

        if user_model:
            logger.debug(f"User found with ID: {user_id}")
            return self._model_to_entity(user_model)
        else:
            logger.debug(f"No user found with ID: {user_id}")
            return None

    def get_by_email(self, email: str) -> Optional[UserEntity]:
        """Retrieves a user by their email address."""
        logger.debug(f"Getting user by email: {email}")
        user_model = self.db.query(self.model).filter(self.model.email == email).first()

        if user_model:
            logger.debug(f"User found with email: {email}")
            return self._model_to_entity(user_model)
        else:
            logger.debug(f"No user found with email: {email}")
            return None

    def save(self, user: UserEntity) -> UserEntity:
        try:
            if user.user_id is None:
                # Create new user
                user_model = self._entity_to_model(user)
                self.db.add(user_model)
                self.db.commit()
                self.db.refresh(user_model)
                logger.info(f"Successfully created user: {user.email}")
                return self._model_to_entity(user_model)
            else:
                self.update(user.user_id, user)
                user_model = (
                    self.db.query(self.model)
                    .filter(self.model.user_id == user.user_id)
                    .first()
                )
                if user_model:
                    return self._model_to_entity(user_model)
                else:
                    raise Exception("User not found after update")
        except Exception as e:
            logger.error(f"Error saving user {user.email}: {str(e)}")
            self.db.rollback()
            raise

    def update(self, user_id: str, user: UserEntity) -> None:
        user_model = (
            self.db.query(self.model).filter(self.model.user_id == user_id).first()
        )
        if user_model:
            user_model.email = user.email
            user_model.hashed_password = user.hashed_password
            self.db.commit()
        else:
            raise Exception(f"User with ID {user_id} not found")

    def delete(self, user_id: str) -> None:
        """Deletes a user from the repository by their ID."""
        user_model = (
            self.db.query(self.model).filter(self.model.user_id == user_id).first()
        )
        if user_model:
            self.db.delete(user_model)
            self.db.commit()

    def _model_to_entity(self, model: UserModel) -> UserEntity:
        """Converts a UserModel to a User entity."""
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
        """Converts a User entity to a UserModel."""
        return self.model(
            user_id=uuid.UUID(entity.user_id) if entity.user_id else None,
            email=entity.email,
            hashed_password=entity.hashed_password,
            virtual_currency=entity.virtual_currency,
            role=entity.role,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

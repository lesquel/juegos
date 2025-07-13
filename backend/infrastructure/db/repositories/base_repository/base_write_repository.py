from abc import ABC, abstractmethod
from typing import Generic, Type, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from domain.repositories.base_repository import (
    IWriteOnlyRepository,
)
from application.mixins import LoggingMixin
from ..common import EntityType, ModelType


class BaseWriteOnlyPostgresRepository(
    Generic[EntityType, ModelType],
    IWriteOnlyRepository[EntityType],
    LoggingMixin,
    ABC,
):
    """Repositorio base de solo escritura para PostgreSQL."""

    def __init__(
        self, db_session: AsyncSession, db_model: Type[ModelType], *args, **kwargs
    ):
        self.db = db_session
        self.model = db_model

    async def save(self, entity: EntityType) -> EntityType:
        """Guarda una entidad."""
        try:
            entity_id = self._get_entity_id(entity)
            if entity_id is None:
                # Create new entity
                model_instance = self._entity_to_model(entity)
                self.db.add(model_instance)
                await self.db.commit()
                await self.db.refresh(model_instance)
                self.logger.info(f"Successfully created entity: {entity_id}")
                return self._model_to_entity(model_instance)
            else:
                # Update existing entity
                await self.update(entity_id, entity)
                stmt = select(self.model).where(self._get_id_field() == entity_id)
                result = await self.db.execute(stmt)
                updated_model = result.scalar_one_or_none()
                if updated_model:
                    return self._model_to_entity(updated_model)
                else:
                    raise Exception("Entity not found after update")
        except Exception as e:
            self.logger.error(f"Error saving entity: {str(e)}")
            await self.db.rollback()
            raise

    async def delete(self, entity_id: str) -> None:
        """Elimina una entidad por ID."""
        stmt = select(self.model).where(self._get_id_field() == entity_id)
        result = await self.db.execute(stmt)
        model_instance = result.scalar_one_or_none()

        if model_instance:
            await self.db.delete(model_instance)
            await self.db.commit()
            self.logger.info(f"Successfully deleted entity with ID: {entity_id}")
        else:
            self.logger.warning(f"Entity not found for deletion: {entity_id}")

    @abstractmethod
    async def update(self, entity_id: str, entity: EntityType) -> None:
        """Actualiza una entidad."""
        pass

    @abstractmethod
    def _model_to_entity(self, model: ModelType) -> EntityType:
        """Convierte un modelo a entidad."""
        pass

    @abstractmethod
    def _entity_to_model(self, entity: EntityType) -> ModelType:
        """Convierte una entidad a modelo."""
        pass

    @abstractmethod
    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""
        pass

    @abstractmethod
    def _get_entity_id(self, entity: EntityType) -> Optional[str]:
        """Obtiene el ID de una entidad."""
        pass

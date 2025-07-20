from abc import ABC, abstractmethod
from typing import Any, Generic, Optional, Type

from application.mixins import LoggingMixin
from domain.repositories.base_repository import IWriteOnlyRepository
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..common import EntityType, ModelType


class BaseWriteOnlyPostgresRepository(
    Generic[EntityType, ModelType],
    IWriteOnlyRepository[EntityType, ModelType],
    LoggingMixin,
    ABC,
):
    """Repositorio base de solo escritura para PostgreSQL."""

    def __init__(
        self, db_session: AsyncSession, db_model: Type[ModelType], *args, **kwargs
    ):
        # Solo configurar si no están ya configurados (para evitar conflictos con herencia múltiple)
        if not hasattr(self, "db"):
            self.db = db_session
        if not hasattr(self, "model"):
            self.model = db_model

    async def save(self, entity: EntityType) -> EntityType:
        """
        Guarda una entidad (crear si no existe, actualizar si existe).
        Implementa el patrón save-or-update.
        """
        try:
            entity_id = self._get_entity_id(entity)

            if entity_id is None:
                # Crear nueva entidad
                return await self._create_entity(entity)
            else:
                # Actualizar entidad existente
                return await self._update_entity(entity_id, entity)

        except Exception as e:
            self.logger.error(f"Error saving entity: {str(e)}")
            await self.db.rollback()
            raise

    async def _create_entity(self, entity: EntityType) -> EntityType:
        """Crea una nueva entidad."""
        model_instance = self._entity_to_model(entity)
        self.db.add(model_instance)
        await self.db.commit()
        await self.db.refresh(model_instance)

        # Obtener el ID del modelo directamente usando el campo ID
        entity_id = getattr(model_instance, self._get_id_field().key)

        # Recargar con opciones si es necesario
        model_instance = await self._reload_with_options(entity_id)
        self.logger.info(f"Successfully created entity: {entity_id}")
        return self._model_to_entity(model_instance)

    async def _update_entity(self, entity_id: str, entity: EntityType) -> EntityType:
        """Actualiza una entidad existente."""
        stmt = select(self.model).where(self._get_id_field() == entity_id)
        result = await self.db.execute(stmt)
        model_instance = result.scalar_one_or_none()

        if not model_instance:
            raise ValueError(f"Entity with ID {entity_id} not found for update")

        # Actualizar campos del modelo con los datos de la entidad
        updated_model = self._entity_to_model(entity)
        for field, value in updated_model.__dict__.items():
            if not field.startswith("_") and hasattr(model_instance, field):
                setattr(model_instance, field, value)

        await self.db.commit()
        await self.db.refresh(model_instance)

        self.logger.info(f"Successfully updated entity: {entity_id}")
        return self._model_to_entity(model_instance)

    async def delete(self, entity_id: str) -> None:
        """
        Elimina una entidad por ID.
        Mejorado con mejor manejo de errores.
        """
        try:
            stmt = select(self.model).where(self._get_id_field() == entity_id)
            result = await self.db.execute(stmt)
            model_instance = result.scalar_one_or_none()

            if model_instance:
                await self.db.delete(model_instance)
                await self.db.commit()
                self.logger.info(f"Successfully deleted entity with ID: {entity_id}")
            else:
                self.logger.warning(f"Entity not found for deletion: {entity_id}")

        except Exception as e:
            self.logger.error(f"Error deleting entity with ID {entity_id}: {str(e)}")
            await self.db.rollback()
            raise

    @abstractmethod
    async def update(self, entity_id: str, entity: EntityType) -> None:
        """Actualiza una entidad."""

    @abstractmethod
    def _model_to_entity(self, model: ModelType) -> EntityType:
        """Convierte un modelo a entidad."""

    @abstractmethod
    def _entity_to_model(self, entity: EntityType) -> ModelType:
        """Convierte una entidad a modelo."""

    @abstractmethod
    def _get_id_field(self):
        """Obtiene el campo ID del modelo."""

    @abstractmethod
    def _get_entity_id(self, entity: EntityType) -> Optional[str]:
        """Obtiene el ID de una entidad."""

    def get_load_options(self) -> list:
        """Devuelve las opciones de carga para la entidad."""
        return []

    async def _reload_with_options(self, entity_id: Any) -> Any:
        """Recarga una entidad con relaciones si aplica."""
        stmt = select(self.model).where(self._get_id_field() == entity_id)
        for option in self.get_load_options():
            stmt = stmt.options(option)

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

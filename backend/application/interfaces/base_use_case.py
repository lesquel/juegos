"""Clase base para casos de uso comunes."""

from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

from application.mixins import LoggingMixin
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging.decorators import log_execution, log_performance

InputType = TypeVar("InputType")  # Input type
ReturnType = TypeVar("ReturnType")  # Return type


class BaseUseCase(ABC, Generic[InputType, ReturnType], LoggingMixin):
    """Clase base para casos de uso."""

    def __init__(self):
        super().__init__()

    @abstractmethod
    async def execute(self, *args, **kwargs) -> ReturnType:
        """Ejecuta el caso de uso."""


class BaseGetByIdUseCase(BaseUseCase[str, ReturnType], Generic[ReturnType]):
    """Clase base para casos de uso de obtener por ID."""

    def __init__(self, repository: Any, converter: EntityToDTOConverter):
        super().__init__()
        self.repository = repository
        self.converter = converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, entity_id: str) -> ReturnType:
        """Obtiene una entidad por ID."""
        self.logger.debug(f"Getting entity with ID: {entity_id}")
        entity = await self.repository.get_by_id(entity_id)

        if not entity:
            self.logger.warning(f"Entity not found with ID: {entity_id}")
            raise self._get_not_found_exception(entity_id)

        self.logger.info(f"Successfully retrieved entity: {entity_id}")
        return self.converter.to_dto(entity)

    @abstractmethod
    def _get_not_found_exception(self, entity_id: str) -> Exception:
        """Obtiene la excepción para entidad no encontrada."""


class BasePaginatedUseCase(BaseUseCase, Generic[ReturnType]):
    """Clase base para casos de uso paginados."""

    def __init__(self, repository: Any, converter: EntityToDTOConverter):
        super().__init__()
        self.repository = repository
        self.converter = converter

    @log_execution(include_args=True, include_result=False, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(
        self, pagination, filters, sort_params
    ) -> tuple[list[ReturnType], int]:
        """Ejecuta el caso de uso paginado."""
        entities, count = await self.repository.get_paginated(
            pagination, filters, sort_params
        )

        if not entities:
            self.logger.warning(
                "No entities found with the given filters and pagination"
            )
            return [], 0

        return self.converter.to_dto_list(entities), count

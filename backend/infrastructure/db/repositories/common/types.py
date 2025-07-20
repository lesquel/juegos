from typing import TypeVar

from interfaces.api.common.filters.base_filter import BaseFilterParams

# Entity type - Representa el tipo de entidad del dominio
EntityType = TypeVar("EntityType")

# Model type - Representa el tipo de modelo de la base de datos (SQLAlchemy)
ModelType = TypeVar("ModelType")

# Filter type - Representa el tipo de filtros para consultas
FilterType = TypeVar("FilterType", bound=BaseFilterParams)

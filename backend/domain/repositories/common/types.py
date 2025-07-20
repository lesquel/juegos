from typing import TypeVar

from domain.common import BaseFilterParams

# Entity type - Representa el tipo de entidad del dominio
EntityType = TypeVar("EntityType")

# Filter type - Representa el tipo de filtros para consultas
FilterType = TypeVar("FilterType", bound=BaseFilterParams)

# Model type - Representa el tipo de modelo de la base de datos
ModelType = TypeVar("ModelType")

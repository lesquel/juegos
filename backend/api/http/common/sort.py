from typing import Optional

from application.common.sort import SortParams
from fastapi.params import Query


def get_sort_params(
    sort_by: Optional[str] = Query(None, description="Campo por el cual ordenar"),
    sort_order: Optional[str] = Query(
        "asc", description="Orden de clasificación (asc o desc)"
    ),
) -> SortParams:
    """Dependency para parámetros de ordenamiento base"""
    return SortParams(sort_by=sort_by, sort_order=sort_order)

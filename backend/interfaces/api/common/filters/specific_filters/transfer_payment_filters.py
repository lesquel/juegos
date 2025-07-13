from typing import Optional
from fastapi import Query
from pydantic import Field

from ..base_filter import BaseFilterParams
from application.enums import TransferStateEnum


class TransferPaymentFilterParams(BaseFilterParams):
    """Filtros específicos para Transfer Payments - hereda filtros base + específicos"""

    user_id: Optional[str] = Field(
        None, description="Filtrar por ID de usuario"
    )
    transfer_state: Optional[TransferStateEnum] = Field(
        None, description="Filtrar por estado de transferencia"
    )
    min_amount: Optional[float] = Field(
        None, ge=0, description="Monto mínimo de transferencia"
    )
    max_amount: Optional[float] = Field(
        None, ge=0, description="Monto máximo de transferencia"
    )


# Dependencies específicos para cada modelo
def get_transfer_payment_filter_params(
    # Filtros base
    search: Optional[str] = Query(None, description="Búsqueda general"),
    created_after: Optional[str] = Query(None, description="Creado después de"),
    created_before: Optional[str] = Query(None, description="Creado antes de"),
    # Filtros específicos de transferencia
    user_id: Optional[str] = Query(None, description="Filtrar por ID de usuario"),
    transfer_state: Optional[TransferStateEnum] = Query(
        None, description="Filtrar por estado de transferencia"
    ),
    min_amount: Optional[float] = Query(
        None, ge=0, description="Monto mínimo de transferencia"
    ),
    max_amount: Optional[float] = Query(
        None, ge=0, description="Monto máximo de transferencia"
    ),
) -> TransferPaymentFilterParams:
    """Dependency para obtener filtros de Transfer Payments"""
    return TransferPaymentFilterParams(
        search=search,
        created_after=created_after,
        created_before=created_before,
        user_id=user_id,
        transfer_state=transfer_state,
        min_amount=min_amount,
        max_amount=max_amount,
    )

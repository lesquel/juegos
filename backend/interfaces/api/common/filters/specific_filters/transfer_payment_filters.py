from typing import Optional
from pydantic import Field

from ..base_filter import BaseFilterParams
from application.enums import TransferStateEnum
from ..filter_dependency_factory import build_filter_dependency


class TransferPaymentFilterParams(BaseFilterParams):
    """Filtros específicos para Transfer Payments - hereda filtros base + específicos"""

    transfer_state: Optional[TransferStateEnum] = Field(
        None, description="Filtrar por estado de transferencia"
    )
    min_amount: Optional[float] = Field(
        None, ge=0, description="Monto mínimo de transferencia"
    )
    max_amount: Optional[float] = Field(
        None, ge=0, description="Monto máximo de transferencia"
    )


get_transfer_payment_filter_params = build_filter_dependency(
    TransferPaymentFilterParams,
)

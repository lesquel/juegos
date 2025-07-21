from typing import Optional

from domain.enums import TransferStateEnum
from pydantic import Field

from ..base_filter import BaseFilterParams
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

    def filter_transfer_state(self, query, model, value):
        return self.any_filter(query, model.transfer_state, "transfer_state", value)

    def filter_min_amount(self, query, model, value):
        return self.gte_filter(query, model.transfer_amount, value)

    def filter_max_amount(self, query, model, value):
        return self.lte_filter(query, model.transfer_amount, value)


get_transfer_payment_filter_params = build_filter_dependency(
    TransferPaymentFilterParams,
)

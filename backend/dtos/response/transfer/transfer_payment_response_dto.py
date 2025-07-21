from typing import Optional

from domain.enums import TransferStateEnum
from dtos.common.constants import (
    EXAMPLE_CREATED_AT,
    EXAMPLE_TRANSFER_AMOUNT,
    EXAMPLE_TRANSFER_DESCRIPTION,
    EXAMPLE_TRANSFER_ID,
    EXAMPLE_TRANSFER_IMG,
    EXAMPLE_TRANSFER_STATE,
    EXAMPLE_UPDATED_AT,
    EXAMPLE_USER_ID,
)
from pydantic import Field

from ..time_stamp_base import TimeStampBase


class TransferPaymentResponseDTO(TimeStampBase):
    """DTO para respuesta de transferencia de pago"""

    transfer_id: str = Field(..., description="ID único de la transferencia")
    user_id: str = Field(..., description="ID del usuario que realizó la transferencia")
    transfer_img: str = Field(
        ..., description="URL de la imagen del comprobante de transferencia"
    )
    transfer_amount: float = Field(..., description="Monto de la transferencia")
    transfer_state: TransferStateEnum = Field(
        ..., description="Estado de la transferencia"
    )
    transfer_description: Optional[str] = Field(
        None, description="Descripción opcional de la transferencia"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "transfer_id": EXAMPLE_TRANSFER_ID,
                "user_id": EXAMPLE_USER_ID,
                "transfer_img": EXAMPLE_TRANSFER_IMG,
                "transfer_amount": EXAMPLE_TRANSFER_AMOUNT,
                "transfer_state": EXAMPLE_TRANSFER_STATE,
                "transfer_description": EXAMPLE_TRANSFER_DESCRIPTION,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }

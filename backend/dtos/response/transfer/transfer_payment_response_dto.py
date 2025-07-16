from typing import Optional
from pydantic import Field
from application.enums import TransferStateEnum
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

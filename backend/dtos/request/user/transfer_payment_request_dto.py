

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class TransferPaymentRequestDTO(BaseModel):
    """DTO para solicitud de transferencia de pago"""

    transfer_img: str = Field(..., description="URL de la imagen del comprobante de transferencia")
    transfer_amount: float = Field(..., gt=0, description="Monto de la transferencia (debe ser mayor a 0)")
    transfer_description: Optional[str] = Field(None, max_length=500, description="Descripción opcional de la transferencia")

    @field_validator('transfer_amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('El monto debe ser mayor a 0')
        return round(v, 2)  # Redondear a 2 decimales

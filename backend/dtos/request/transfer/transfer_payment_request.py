from typing import Optional

from dtos.common.constants import (
    EXAMPLE_TRANSFER_AMOUNT,
    EXAMPLE_TRANSFER_DESCRIPTION,
    EXAMPLE_TRANSFER_IMG,
)
from fastapi import File, Form, UploadFile
from pydantic import BaseModel, Field, field_validator

ERROR_MESSAGE_VALUE_MUST_BE_GREATER_THAN_ZERO = "El valor debe ser mayor a 0"


class CreateTransferPaymentRequestDTO(BaseModel):
    """DTO para solicitud de transferencia de pago"""

    transfer_amount: float = Field(
        ..., gt=0, description="Monto de la transferencia (debe ser mayor a 0)"
    )
    transfer_description: Optional[str] = Field(
        None, max_length=500, description="Descripción opcional de la transferencia"
    )

    @field_validator("transfer_amount")
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError(ERROR_MESSAGE_VALUE_MUST_BE_GREATER_THAN_ZERO)
        return round(v, 2)

    class Config:
        json_schema_extra = {
            "example": {
                "transfer_amount": EXAMPLE_TRANSFER_AMOUNT,
                "transfer_description": EXAMPLE_TRANSFER_DESCRIPTION,
            }
        }


class CreateTransferPaymentFormDTO:
    """DTO para manejar formulario con archivo de imagen"""

    def __init__(
        self,
        transfer_img: UploadFile = File(
            ..., description="Imagen del comprobante de transferencia"
        ),
        transfer_amount: float = Form(
            ..., gt=0, description="Monto de la transferencia"
        ),
        transfer_description: Optional[str] = Form(
            None, max_length=500, description="Descripción opcional"
        ),
    ):
        self.transfer_img = transfer_img
        self.transfer_amount = transfer_amount
        self.transfer_description = transfer_description

        # Validar el archivo de imagen
        self._validate_image_file()

        # Validar el monto
        if self.transfer_amount <= 0:
            raise ValueError(ERROR_MESSAGE_VALUE_MUST_BE_GREATER_THAN_ZERO)
        self.transfer_amount = round(self.transfer_amount, 2)

    def _validate_image_file(self):
        """Valida que el archivo sea una imagen válida"""
        if not self.transfer_img.content_type:
            raise ValueError("Tipo de contenido no especificado")

        allowed_types = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ]

        if self.transfer_img.content_type not in allowed_types:
            raise ValueError(
                f"Tipo de archivo no permitido. Tipos permitidos: {', '.join(allowed_types)}"
            )

        # Validar tamaño del archivo (máximo 5MB)
        if hasattr(self.transfer_img, "size") and self.transfer_img.size:
            max_size = 5 * 1024 * 1024  # 5MB
            if self.transfer_img.size > max_size:
                raise ValueError("El archivo es demasiado grande. Tamaño máximo: 5MB")


# DTO para conversión interna (cuando ya tenemos la URL del archivo)
class CreateTransferPaymentInternalDTO(BaseModel):
    """DTO interno para transferencia con URL de imagen ya procesada"""

    transfer_img: str = Field(
        ..., description="URL de la imagen del comprobante de transferencia"
    )
    transfer_amount: float = Field(
        ..., gt=0, description=ERROR_MESSAGE_VALUE_MUST_BE_GREATER_THAN_ZERO
    )
    transfer_description: Optional[str] = Field(
        None, max_length=500, description="Descripción opcional de la transferencia"
    )

    @field_validator("transfer_amount")
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError(ERROR_MESSAGE_VALUE_MUST_BE_GREATER_THAN_ZERO)
        return round(v, 2)

    class Config:
        json_schema_extra = {
            "example": {
                "transfer_img": EXAMPLE_TRANSFER_IMG,
                "transfer_amount": EXAMPLE_TRANSFER_AMOUNT,
                "transfer_description": EXAMPLE_TRANSFER_DESCRIPTION,
            }
        }

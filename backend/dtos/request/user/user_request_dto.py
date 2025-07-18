from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field, EmailStr, field_validator
from dtos.common.constants import (
    EXAMPLE_EMAIL,
    EXAMPLE_PSW,
    EXAMPLE_CONFIRM_PSW,
    EXAMPLE_NEW_EMAIL,
    EXAMPLE_CURRENT_PSW,
    EXAMPLE_NEW_PSW,
    EXAMPLE_FROM_USER_ID,
    EXAMPLE_TO_USER_ID,
    EXAMPLE_TRANSFER_MONEY_AMOUNT,
    EXAMPLE_TRANSFER_MONEY_DESCRIPTION,
)


class UserRegistrationRequestDTO(BaseModel):
    """DTO para registro de usuario"""

    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=8, description="Contraseña del usuario (mínimo 8 caracteres)")
    confirm_password: str = Field(..., description="Confirmación de la contraseña")

    @field_validator('confirm_password', mode='before')
    def password_match(cls, value: str, values: dict) -> str:
        """Valida que la contraseña y la confirmación coincidan"""
        if 'password' in values and value != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return value

    class Config:
        json_schema_extra = {
            "example": {
                "email": EXAMPLE_EMAIL,
                "password": EXAMPLE_PSW,
                "confirm_password": EXAMPLE_CONFIRM_PSW,
            }
        }


class UserUpdateProfileRequestDTO(BaseModel):
    """DTO para actualización de perfil de usuario"""

    email: Optional[EmailStr] = Field(None, description="Nuevo email del usuario")

    class Config:
        json_schema_extra = {
            "example": {
                "email": EXAMPLE_NEW_EMAIL,
            }
        }


class UserChangePasswordRequestDTO(BaseModel):
    """DTO para cambio de contraseña"""

    current_password: str = Field(..., description="Contraseña actual")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña (mínimo 8 caracteres)")
    confirm_new_password: str = Field(..., description="Confirmación de la nueva contraseña")

    @field_validator('confirm_new_password', mode='before')
    def new_password_match(cls, value: str, values: dict) -> str:
        if 'new_password' in values and value != values['new_password']:
            raise ValueError('Las contraseñas no coinciden')
        return value

    class Config:
        json_schema_extra = {
            "example": {
                "current_password": EXAMPLE_CURRENT_PSW,
                "new_password": EXAMPLE_NEW_PSW,
                "confirm_new_password": EXAMPLE_NEW_PSW,
            }
        }


class TransferMoneyRequestDTO(BaseModel):
    """DTO para transferir dinero entre usuarios"""

    from_user_id: str = Field(..., description="ID del usuario que envía el dinero")
    to_user_id: str = Field(..., description="ID del usuario que recibe el dinero")
    amount: Decimal = Field(..., gt=0, description="Cantidad a transferir (debe ser mayor a 0)")
    description: Optional[str] = Field(None, max_length=255, description="Descripción opcional de la transferencia")

    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        """Valida que la cantidad tenga máximo 2 decimales"""
        if v.as_tuple().exponent < -2:
            raise ValueError('Amount cannot have more than 2 decimal places')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "from_user_id": EXAMPLE_FROM_USER_ID,
                "to_user_id": EXAMPLE_TO_USER_ID,
                "amount": EXAMPLE_TRANSFER_MONEY_AMOUNT,
                "description": EXAMPLE_TRANSFER_MONEY_DESCRIPTION,
            }
        }
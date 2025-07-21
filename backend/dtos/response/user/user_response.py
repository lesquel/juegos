from domain.enums import UserRole
from dtos.common.constants import (
    EXAMPLE_CREATED_AT,
    EXAMPLE_EMAIL,
    EXAMPLE_UPDATED_AT,
    EXAMPLE_USER_ID,
    EXAMPLE_USER_ROLE,
    EXAMPLE_VIRTUAL_CURRENCY,
)
from pydantic import Field

from ..time_stamp_base import TimeStampBase


class UserBaseResponseDTO(TimeStampBase):
    """DTO base para respuesta de usuario (información básica)"""

    user_id: str = Field(..., description="ID único del usuario")
    email: str = Field(..., description="Email del usuario")
    role: UserRole = Field(..., description="Rol del usuario")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": EXAMPLE_USER_ID,
                "email": EXAMPLE_EMAIL,
                "role": EXAMPLE_USER_ROLE,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }


class UserResponseDTO(UserBaseResponseDTO):
    """DTO completo para respuesta de usuario"""

    virtual_currency: float = Field(None, description="Moneda virtual del usuario")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": EXAMPLE_USER_ID,
                "email": EXAMPLE_EMAIL,
                "role": EXAMPLE_USER_ROLE,
                "virtual_currency": EXAMPLE_VIRTUAL_CURRENCY,
                "created_at": EXAMPLE_CREATED_AT,
                "updated_at": EXAMPLE_UPDATED_AT,
            }
        }

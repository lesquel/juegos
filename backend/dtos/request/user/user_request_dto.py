from typing import Optional

from dtos.common.constants import (
    EXAMPLE_CONFIRM_PSW,
    EXAMPLE_EMAIL,
    EXAMPLE_NEW_EMAIL,
    EXAMPLE_PSW,
)
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegistrationRequestDTO(BaseModel):
    """DTO para registro de usuario"""

    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(
        ..., min_length=8, description="Contraseña del usuario (mínimo 8 caracteres)"
    )
    confirm_password: str = Field(..., description="Confirmación de la contraseña")

    @field_validator("confirm_password", mode="before")
    def password_match(cls, value: str, values: dict) -> str:
        """Valida que la contraseña y la confirmación coincidan"""
        if "password" in values and value != values["password"]:
            raise ValueError("Las contraseñas no coinciden")
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

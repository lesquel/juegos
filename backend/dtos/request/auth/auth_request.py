from dtos.common.constants import EXAMPLE_EMAIL, EXAMPLE_PSW
from pydantic import BaseModel, EmailStr, Field, field_validator

from .validators import password_validator


class UserCreateRequestDTO(BaseModel):
    """DTO para crear un nuevo usuario"""

    email: EmailStr
    password: str

    @field_validator("password", mode="before")
    @classmethod
    def validate_password(cls, value: str) -> str:
        """Valida el formato de la contraseña"""
        return password_validator(value)

    class Config:
        json_schema_extra = {
            "example": {"email": EXAMPLE_EMAIL, "password": EXAMPLE_PSW}
        }


class LoginRequestDTO(BaseModel):
    """DTO para request de login de usuario"""

    email: EmailStr = Field(..., description="Email del usuario", example=EXAMPLE_EMAIL)
    password: str = Field(
        ...,
        min_length=6,
        description="Contraseña del usuario",
        example=EXAMPLE_PSW,
    )

    class Config:
        json_schema_extra = {
            "example": {"email": EXAMPLE_EMAIL, "password": EXAMPLE_PSW}
        }

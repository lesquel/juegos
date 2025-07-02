from pydantic import BaseModel, EmailStr, Field, field_validator

from .validators import password_validator


class UserCreateRequestDTO(BaseModel):
    """DTO para crear un nuevo usuario"""

    email: EmailStr
    password: str

    _validate_password = field_validator("password")(password_validator)

    class Config:
        schema_extra = {
            "example": {"email": "usuario@ejemplo.com", "password": "micontraseña123"}
        }



class LoginRequestDTO(BaseModel):
    """DTO para request de login de usuario"""

    email: EmailStr = Field(
        ..., description="Email del usuario", example="usuario@ejemplo.com"
    )
    password: str = Field(
        ...,
        min_length=6,
        description="Contraseña del usuario",
        example="micontraseña123",
    )

    class Config:
        schema_extra = {
            "example": {"email": "usuario@ejemplo.com", "password": "micontraseña123"}
        }

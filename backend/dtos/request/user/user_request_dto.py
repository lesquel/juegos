from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator
from application.enums import UserRole


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

class UserUpdateProfileRequestDTO(BaseModel):
    """DTO para actualización de perfil de usuario"""

    email: Optional[EmailStr] = Field(None, description="Nuevo email del usuario")


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
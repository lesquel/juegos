from typing import Optional
from pydantic import BaseModel, Field, EmailStr, validator
from application.enums import UserRole


class UserRegistrationRequestDTO(BaseModel):
    """DTO para registro de usuario"""

    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=8, description="Contraseña del usuario (mínimo 8 caracteres)")
    confirm_password: str = Field(..., description="Confirmación de la contraseña")

    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Las contraseñas no coinciden')
        return v


class UserUpdateProfileRequestDTO(BaseModel):
    """DTO para actualización de perfil de usuario"""

    email: Optional[EmailStr] = Field(None, description="Nuevo email del usuario")


class UserChangePasswordRequestDTO(BaseModel):
    """DTO para cambio de contraseña"""

    current_password: str = Field(..., description="Contraseña actual")
    new_password: str = Field(..., min_length=8, description="Nueva contraseña (mínimo 8 caracteres)")
    confirm_new_password: str = Field(..., description="Confirmación de la nueva contraseña")

    @validator('confirm_new_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Las contraseñas no coinciden')
        return v

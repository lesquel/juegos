"""
DTOs para responses relacionados con usuarios
"""

from typing import Optional
from pydantic import BaseModel, Field
import datetime

from application.enums import UserRole


class UserBaseResponseDTO(BaseModel):
    """DTO base para respuesta de usuario (información básica)"""

    user_id: str = Field(..., description="ID único del usuario")
    email: str = Field(..., description="Email del usuario")
    role: UserRole = Field(..., description="Rol del usuario")


class UserResponseDTO(UserBaseResponseDTO):
    """DTO completo para respuesta de usuario"""

    virtual_currency: float = Field(None, description="Moneda virtual del usuario")
    created_at: Optional[datetime.datetime] = Field(None, description="Fecha de creación")
    updated_at: Optional[datetime.datetime] = Field(None, description="Fecha de última actualización")

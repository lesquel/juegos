from pydantic import Field


from application.enums import UserRole
from ..time_stamp_base import TimeStampBase


class UserBaseResponseDTO(TimeStampBase):
    """DTO base para respuesta de usuario (información básica)"""

    user_id: str = Field(..., description="ID único del usuario")
    email: str = Field(..., description="Email del usuario")
    role: UserRole = Field(..., description="Rol del usuario")


class UserResponseDTO(UserBaseResponseDTO):
    """DTO completo para respuesta de usuario"""

    virtual_currency: float = Field(None, description="Moneda virtual del usuario")

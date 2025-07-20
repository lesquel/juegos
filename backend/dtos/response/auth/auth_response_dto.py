from dtos.common.constants import (
    EXAMPLE_CREATED_AT,
    EXAMPLE_EMAIL,
    EXAMPLE_TOKEN,
    EXAMPLE_UPDATED_AT,
    EXAMPLE_USER_ID,
    EXAMPLE_USER_ROLE,
    EXAMPLE_VIRTUAL_CURRENCY,
)
from pydantic import BaseModel, Field

from ..user.user_response import UserResponseDTO


class TokenResponseDTO(BaseModel):
    """DTO para respuesta de token de autenticación"""

    access_token: str = Field(
        ...,
        description="Token de acceso JWT",
        example=EXAMPLE_TOKEN,
    )
    token_type: str = Field(
        default="bearer", description="Tipo de token", example="bearer"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": EXAMPLE_TOKEN,
                "token_type": "bearer",
            }
        }


class LoginResponseDTO(BaseModel):
    """DTO para respuesta completa de login"""

    token: TokenResponseDTO = Field(..., description="Información del token")
    user: UserResponseDTO = Field(..., description="Información del usuario")

    class Config:
        json_schema_extra = {
            "example": {
                "token": {
                    "access_token": EXAMPLE_TOKEN,
                    "token_type": "bearer",
                },
                "user": {
                    "user_id": EXAMPLE_USER_ID,
                    "email": EXAMPLE_EMAIL,
                    "virtual_currency": EXAMPLE_VIRTUAL_CURRENCY,
                    "role": EXAMPLE_USER_ROLE,
                    "created_at": EXAMPLE_CREATED_AT,
                    "updated_at": EXAMPLE_UPDATED_AT,
                },
            }
        }

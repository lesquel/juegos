from pydantic import BaseModel, Field

from domain.entities.token_data import TokenData


from .user_response_dto import UserResponseDTO


class TokenResponseDTO(BaseModel):
    """DTO para respuesta de token de autenticación"""

    access_token: str = Field(
        ...,
        description="Token de acceso JWT",
        example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    )
    token_type: str = Field(
        default="bearer", description="Tipo de token", example="bearer"
    )


    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
            }
        }


class LoginResponseDTO(BaseModel):
    """DTO para respuesta completa de login"""

    token: TokenResponseDTO = Field(..., description="Información del token")
    user: UserResponseDTO = Field(..., description="Información del usuario")

    class Config:
        schema_extra = {
            "example": {
                "token": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                },
                "user": {
                    "user_id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "usuario@ejemplo.com",
                    "virtual_currency": 100.0,
                    "role": "USER",
                    "created_at": "2025-01-01T00:00:00",
                    "updated_at": "2025-01-01T00:00:00",
                },
            }
        }

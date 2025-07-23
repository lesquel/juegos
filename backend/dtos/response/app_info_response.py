from typing import List, Optional

from pydantic import Field

from .time_stamp_base import TimeStampBase


class AccountResponseDTO(TimeStampBase):
    """DTO para respuesta de información de la cuenta"""

    account_id: str = Field(..., description="ID de la cuenta")
    account_owner_name: str = Field(
        ..., description="Nombre del propietario de la cuenta"
    )
    account_number: str = Field(..., description="Número de la cuenta")
    account_type: str = Field(..., description="Tipo de cuenta")
    account_description: Optional[str] = Field(
        None, description="Descripción de la cuenta"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "account_id": "12345",
                "account_owner_name": "John Doe",
                "account_number": "987654321",
                "account_description": "Cuenta principal del usuario",
            }
        }


class AppInfoResponseDTO(TimeStampBase):
    """DTO para respuesta de información de la aplicación"""

    site_name: str = Field(..., description="Nombre del sitio")
    site_icon: str = Field(..., description="Icono del sitio")
    site_logo: str = Field(..., description="Logo del sitio")
    accounts: List[AccountResponseDTO] = Field(
        ..., description="Lista de cuentas asociadas al sitio"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "site_name": "My App",
                "site_icon": "https://example.com/icon.png",
                "site_logo": "https://example.com/logo.png",
                "accounts": [
                    {
                        "account_id": "12345",
                        "account_owner_name": "John Doe",
                        "account_number": "987654321",
                        "account_description": "Cuenta principal del usuario",
                    }
                ],
            }
        }

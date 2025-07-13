"""
Proveedores de servicios de autenticación y seguridad.

Este módulo contiene las funciones que crean instancias de servicios
relacionados con autenticación, hashing de contraseñas y tokens.
"""

from domain.interfaces.token_provider import ITokenProvider
from application.interfaces.password_hasher import IPasswordHasher
from application.services import PasswordHasher
from infrastructure.auth.jwt_service import JWTService
from infrastructure.auth.security import CustomHTTPBearer


def get_password_hasher() -> IPasswordHasher:
    """
    Proveedor para el servicio de hash de contraseñas.

    Returns:
        IPasswordHasher: Servicio de hash de contraseñas
    """
    return PasswordHasher()


def get_token_provider() -> ITokenProvider:
    """
    Proveedor para el servicio de tokens JWT.

    Returns:
        ITokenProvider: Proveedor de tokens configurado
    """
    return JWTService()


def get_security_scheme() -> CustomHTTPBearer:
    """
    Proveedor para el esquema de seguridad HTTP Bearer.

    Returns:
        CustomHTTPBearer: Esquema de seguridad configurado
    """
    return CustomHTTPBearer()


# Exportar todos los proveedores
__all__ = [
    "get_password_hasher",
    "get_token_provider",
    "get_security_scheme",
]

from application.services import PasswordHasher
from domain.interfaces import IPasswordHasher, ITokenProvider
from infrastructure.auth.jwt_service import JWTService
from infrastructure.auth.security import CustomHTTPBearer
from passlib.context import CryptContext


def get_password_hasher() -> IPasswordHasher:
    """
    Proveedor para el servicio de hash de contraseñas.

    Returns:
        IPasswordHasher: Servicio de hash de contraseñas
    """
    hasher = CryptContext(schemes=["bcrypt"], deprecated="auto")

    return PasswordHasher(hasher)


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

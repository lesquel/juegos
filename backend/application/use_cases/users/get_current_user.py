"""
Caso de uso: Obtener usuario actual
Responsabilidad única: Obtener usuario basado en token
"""

from dataclasses import dataclass

from domain.entities import UserEntity
from domain.exceptions import InvalidTokenError, UserNotFoundError
from domain.interfaces import ITokenProvider
from domain.repositories import IUserRepository

from infrastructure.auth import get_token_provider


@dataclass
class GetCurrentUserRequest:
    """Request para el caso de uso de obtener usuario actual"""

    token: str


@dataclass
class GetCurrentUserResponse:
    """Response para el caso de uso de obtener usuario actual"""

    user: UserEntity


class GetCurrentUserUseCase:
    """Caso de uso para obtener usuario actual"""

    def __init__(
        self,
        user_repo: IUserRepository,
        token_provider: ITokenProvider = get_token_provider(),
    ):
        self.user_repo = user_repo
        self.token_provider = token_provider

    def execute(self, request: GetCurrentUserRequest) -> GetCurrentUserResponse:
        """Ejecuta el caso de uso de obtener usuario actual"""
        # Validar token usando función utilitaria directamente
        try:
            token_data = self.token_provider.decode_token(request.token)
        except Exception:
            raise InvalidTokenError("Invalid or expired token")

        # Obtener email del token
        email = token_data.get("sub")
        if not email:
            raise InvalidTokenError("Invalid token format")

        # Buscar usuario
        user = self.user_repo.get_by_email(email)
        if not user:
            raise UserNotFoundError("User not found")

        return GetCurrentUserResponse(user=user)

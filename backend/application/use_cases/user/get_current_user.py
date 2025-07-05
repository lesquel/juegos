"""
Caso de uso: Obtener usuario actual
Responsabilidad única: Obtener usuario basado en token
"""

from fastapi.security import HTTPAuthorizationCredentials

from domain.exceptions import InvalidTokenError, AuthenticationError, UserNotFoundError
from domain.interfaces import ITokenProvider
from domain.repositories import IUserRepository
from dtos.response.user.user_response_dto import UserResponseDTO
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("auth_service")


class GetCurrentUserUseCase:
    """Caso de uso para obtener usuario actual - Reemplaza AuthenticationMiddleware"""

    def __init__(
        self,
        user_repo: IUserRepository,
        token_provider: ITokenProvider,
    ):
        self.user_repo = user_repo
        self.token_provider = token_provider

    def execute(self, token: HTTPAuthorizationCredentials) -> UserResponseDTO:
        """
        Extrae y valida el usuario actual desde el token JWT
        Reemplaza AuthenticationMiddleware.get_current_user_from_token

        Args:
            token: Token JWT desde el header Authorization

        Returns:
            UserEntity: Usuario autenticado

        Raises:
            InvalidTokenError: Si el token es inválido
            UserNotFoundError: Si el usuario no existe
        """
        logger.debug("Authenticating user from token")

        # Decodificar token
        logger.debug("Decoding JWT token")
        payload = self.token_provider.decode_token(token.credentials)
        logger.debug("Token decoded successfully")

        user_id = payload.sub
        if user_id is None:
            logger.warning("Token validation failed - missing user_id in payload")
            raise InvalidTokenError("Missing user_id in token payload")

        logger.debug(f"Token validation successful for user_id: {user_id}")

        # Buscar usuario
        user = self.user_repo.get_by_id(user_id)

        if user is None:
            logger.warning(
                f"Authentication failed - user not found for user_id: {user_id}"
            )
            raise UserNotFoundError(f"User with ID {user_id} not found")

        logger.info(f"User authenticated successfully: {user_id}")
        return UserResponseDTO(
            user_id=str(user.user_id),
            email=user.email,
            role=user.role,
            virtual_currency=user.virtual_currency,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ) 
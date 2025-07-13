from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.exceptions import InvalidTokenError, UserNotFoundError
from domain.interfaces import ITokenProvider
from domain.repositories import IUserRepository
from dtos.response.user import UserResponseDTO
from application.interfaces.base_use_case import BaseUseCase
from infrastructure.logging import log_execution, log_performance


class GetCurrentUserUseCase(BaseUseCase[str, UserResponseDTO]):
    """Caso de uso para obtener usuario actual - Reemplaza AuthenticationMiddleware"""

    def __init__(
        self,
        user_repo: IUserRepository,
        token_provider: ITokenProvider,
        user_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.user_repo = user_repo
        self.token_provider = token_provider
        self.converter = user_converter

    @log_execution(include_args=False, include_result=False, log_level="DEBUG")
    @log_performance(threshold_seconds=1.0)
    async def execute(self, token: str) -> UserResponseDTO:
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
        self.logger.debug("Authenticating user from token")

        # Decodificar token
        self.logger.debug("Decoding JWT token")
        payload = self.token_provider.decode_token(token)
        self.logger.debug("Token decoded successfully")

        user_id = payload.sub
        if user_id is None:
            self.logger.warning("Token validation failed - missing user_id in payload")
            raise InvalidTokenError("Missing user_id in token payload")

        self.logger.debug(f"Token validation successful for user_id: {user_id}")

        # Buscar usuario
        user = await self.user_repo.get_by_id(user_id)

        if user is None:
            self.logger.warning(
                f"Authentication failed - user not found for user_id: {user_id}"
            )
            raise UserNotFoundError(f"User with ID {user_id} not found")

        self.logger.info(f"User authenticated successfully: {user_id}")
        return self.converter.to_dto(user)

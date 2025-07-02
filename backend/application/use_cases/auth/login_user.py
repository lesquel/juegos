from domain.entities.token_data import TokenData
from domain.exceptions import AuthenticationError
from application.interfaces.password_hasher import IPasswordHasher
from domain.interfaces.token_provider import ITokenProvider
from domain.repositories.user_repository import IUserRepository
from infrastructure.logging import get_logger
from dtos.response.auth_response_dto import (
    LoginResponseDTO,
    TokenResponseDTO,
)
from dtos.response.user_response_dto import UserResponseDTO
from dtos.request.auth_request_dto import LoginRequestDTO


# Configurar logger
logger = get_logger("login_use_case")


class LoginUserUseCase:
    """Caso de uso para autenticar usuario"""

    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
        token_provider: ITokenProvider,
    ):
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.token_provider = token_provider

    def execute(self, login_request: LoginRequestDTO) -> LoginResponseDTO:
        """
        Ejecuta el caso de uso de login

        Args:
            email: Email del usuario
            password: Contraseña del usuario

        Returns:
            Tuple con el token de acceso y la entidad del usuario

        Raises:
            AuthenticationError: Si las credenciales son inválidas
        """
        logger.info(f"Login attempt for email: {login_request.email}")

        # Buscar usuario por email
        user = self.user_repo.get_by_email(login_request.email)
        logger.debug(
            f"User lookup result for {login_request.email}: {'Found' if user else 'Not found'}"
        )

        if not user:
            logger.warning(f"Login failed - user not found: {login_request.email}")
            raise AuthenticationError("Invalid credentials")

        # Verificar contraseña
        self._validate_credentials(login_request.password, user.hashed_password)

        # Generar token
        logger.debug(f"Generating token for user: {user.email}")
        token = self.token_provider.create_access_token(TokenData(sub=user.user_id))

        logger.info(f"Successful login for user: {user.email}")
        return LoginResponseDTO(
            token=TokenResponseDTO(
                access_token=token.access_token,
            ),
            user=UserResponseDTO(
                user_id=str(user.user_id),
                email=user.email,
                role=user.role,
                virtual_currency=user.virtual_currency,
                created_at=user.created_at,
                updated_at=user.updated_at,
            ),
        )

    def _validate_credentials(self, password: str, hashed: str) -> None:
        if not self.password_hasher.verify(password, hashed):
            raise AuthenticationError("Invalid credentials")

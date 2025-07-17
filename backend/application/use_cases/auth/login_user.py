"""Caso de uso para autenticar usuario."""

from application.interfaces.base_assembler import BaseAssembler
from domain.entities.user.token_data import TokenData
from domain.exceptions import AuthenticationError
from application.interfaces.password_hasher import IPasswordHasher
from domain.interfaces.token_provider import ITokenProvider
from domain.repositories.user_repository import IUserRepository
from dtos.response.auth.auth_response_dto import LoginResponseDTO
from dtos.request.auth.auth_request import LoginRequestDTO
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from infrastructure.logging import log_execution, log_performance


class LoginUserUseCase(BaseUseCase[LoginRequestDTO, LoginResponseDTO]):
    """Caso de uso para autenticar usuario."""

    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
        token_provider: ITokenProvider,
        user_converter: EntityToDTOConverter,
        login_assembler: BaseAssembler[LoginResponseDTO],
    ):
        super().__init__()
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.token_provider = token_provider
        self.converter = user_converter
        self.login_assembler = login_assembler

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, login_request: LoginRequestDTO) -> LoginResponseDTO:
        """
        Autentica un usuario y genera token de acceso.

        Args:
            login_request: Datos de login del usuario

        Returns:
            LoginResponseDTO: Token de acceso y datos del usuario

        Raises:
            AuthenticationError: Si las credenciales son inválidas
        """
        self.logger.info(f"Login attempt for email: {login_request.email}")

        # Buscar usuario por email
        user = await self.user_repo.get_by_email(login_request.email)
        self.logger.debug(
            f"User lookup result for {login_request.email}: {'Found' if user else 'Not found'}"
        )

        if not user:
            self.logger.warning(f"Login failed - user not found: {login_request.email}")
            raise AuthenticationError("Invalid credentials")

        # Verificar contraseña
        self._validate_credentials(login_request.password, user.hashed_password)

        # Generar token
        self.logger.debug(f"Generating token for user: {user.email}")
        token_data = self.token_provider.create_access_token(
            TokenData(sub=user.user_id)
        )

        self.logger.info(f"Successful login for user: {user.email}")

        # Usar converters para mantener consistencia arquitectónica
        return self.login_assembler.assemble(user, token_data)

    def _validate_credentials(self, password: str, hashed: str) -> None:
        """Valida las credenciales del usuario."""
        if not self.password_hasher.verify(password, hashed):
            raise AuthenticationError("Invalid credentials")

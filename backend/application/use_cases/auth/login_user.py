"""
Caso de uso: Login de usuario
Responsabilidad única: Autenticar usuario y generar token
"""

from dataclasses import dataclass

from domain.entities.user import UserEntity
from domain.exceptions import AuthenticationError
from application.interfaces.password_hasher import IPasswordHasher
from domain.interfaces.token_provider import ITokenProvider
from domain.repositories.user_repository import IUserRepository
from infrastructure.auth import JWTService
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("login_use_case")


@dataclass
class LoginUserRequest:
    """Request para el caso de uso de login"""

    email: str
    password: str


@dataclass
class LoginUserResponse:
    """Response para el caso de uso de login"""

    access_token: str
    token_type: str
    user: UserEntity


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

    def execute(self, request: LoginUserRequest) -> LoginUserResponse:
        """Ejecuta el caso de uso de login"""
        logger.info(f"Login attempt for email: {request.email}")
        
        # Buscar usuario por email
        user = self.user_repo.get_by_email(request.email)
        logger.debug(f"User lookup result for {request.email}: {'Found' if user else 'Not found'}")
        
        if not user:
            logger.warning(f"Login failed - user not found: {request.email}")
            raise AuthenticationError("Invalid credentials")

        # Verificar contraseña
        password_valid = self.password_hasher.verify(request.password, user.hashed_password)
        logger.debug(f"Password verification for {request.email}: {'Valid' if password_valid else 'Invalid'}")
        
        if not password_valid:
            logger.warning(f"Login failed - invalid password for: {request.email}")
            raise AuthenticationError("Invalid credentials")

        # Generar token usando función utilitaria directamente
        logger.debug(f"Generating token for user: {user.email}")
        token = self.token_provider.create_access_token({"sub": user.email})

        logger.info(f"Successful login for user: {user.email}")
        return LoginUserResponse(access_token=token, token_type="bearer", user=user)

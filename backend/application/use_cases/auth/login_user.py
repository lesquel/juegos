"""
Caso de uso: Login de usuario
Responsabilidad única: Autenticar usuario y generar token
"""

from dataclasses import dataclass

from domain.entities.user import UserEntity
from domain.exceptions import AuthenticationError
from application.interfaces.password_hasher import IPasswordHasher
from domain.interfaces.Itoken_provider import ITokenProvider
from domain.repositories.user_repository import IUserRepository
from infrastructure.auth import JWTService


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
        # Buscar usuario por email
        user = self.user_repo.get_by_email(request.email)
        print(f"User found: {user}")
        if not user:
            raise AuthenticationError("Invalid credentials")

        # Verificar contraseña
        if not self.password_hasher.verify(request.password, user.hashed_password):
            raise AuthenticationError("Invalid credentials")
        print(f"Password verified for user: {user.email}")

        # Generar token usando función utilitaria directamente
        token = self.token_provider.create_access_token({"sub": user.email})

        return LoginUserResponse(access_token=token, token_type="bearer", user=user)

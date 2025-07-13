from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

# Importar nuestros servicios de autenticación
from application.mixins.logging_mixin import LoggingMixin
from application.use_cases.auth import LoginUserUseCase
from domain.repositories.user_repository import IUserRepository
from dtos.request.auth.auth_request_dto import LoginRequestDTO
from application.services import PasswordHasher
from infrastructure.db.connection import SessionLocal
from infrastructure.db.models.user_model import UserModel
from infrastructure.core.settings_config import settings

from application.enums import UserRole
from infrastructure.dependencies.repositories.database_repos import get_user_repository
from infrastructure.dependencies.services.auth_services import get_token_provider
from infrastructure.dependencies.use_cases.auth_use_cases import get_login_use_case

# Configurar logger


class AdminAuth(AuthenticationBackend, LoggingMixin):
    """Backend de autenticación para el panel de administración usando nuestro sistema"""

    def __init__(self, secret_key: str):
        super().__init__(secret_key)
        self.password_hasher = PasswordHasher()
        self.token_provider = get_token_provider()

    async def login(self, request: Request) -> bool:
        """Autenticar usuario usando nuestro sistema de login"""
        try:
            form = await request.form()
            email = form.get("username")
            password = form.get("password")

            self.logger.info(f"Admin login attempt for: {email}")

            if not email or not password:
                self.logger.warning("Admin login failed: missing credentials")
                return False

            with SessionLocal() as db:
                user_repo = get_user_repository(db)
                login_use_case = get_login_use_case(
                    user_repo=user_repo,
                    password_hasher=self.password_hasher,
                    token_provider=self.token_provider,
                )

                login_request = LoginRequestDTO(email=email, password=password)
                response = login_use_case.execute(login_request)

                if response.user.role != UserRole.ADMIN:
                    self.logger.warning(
                        f"Admin login failed: user {email} is not an admin"
                    )
                    return False

                request.session.update(
                    {
                        "token": response.token.access_token,
                        "user_id": response.user.user_id,
                        "email": response.user.email,
                    }
                )

                self.logger.info(f"Admin login successful for: {email}")
                return True

        except Exception as e:
            self.logger.error(f"Admin login error: {str(e)}")
            return False

    async def logout(self, request: Request) -> bool:
        """Cerrar sesión del administrador"""
        try:
            user_email = request.session.get("email", "unknown")
            request.session.clear()
            self.logger.info(f"Admin logout successful for: {user_email}")
            return True
        except Exception as e:
            self.logger.error(f"Admin logout error: {str(e)}")
            return False

    async def authenticate(self, request: Request) -> bool:
        """Verificar si el usuario está autenticado"""
        try:
            token = request.session.get("token")
            user_email = request.session.get("email")

            if not token or not user_email:
                self.logger.debug(
                    "Admin authentication failed: no token or email in session"
                )
                return False

            if not self.token_provider.verify_token(token):
                self.logger.warning(
                    f"Admin authentication failed: invalid token for {user_email}"
                )
                request.session.clear()
                return False

            with SessionLocal() as db:
                user_repo = get_user_repository(db)  # ✅ FIX
                user = user_repo.get_by_email(user_email)

                if not user:
                    self.logger.warning(
                        f"Admin authentication failed: user not found {user_email}"
                    )
                    request.session.clear()
                    return False

            self.logger.debug(f"Admin authentication successful for: {user_email}")
            return True

        except Exception as e:
            self.logger.error(f"Admin authentication error: {str(e)}")
            return False


# Crear instancia del backend de autenticación usando la configuración JWT
authentication_backend = AdminAuth(secret_key=settings.jwt_settings.jwt_secret_key)

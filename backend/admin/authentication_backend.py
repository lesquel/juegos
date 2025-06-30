from sqladmin import Admin
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse

# Importar nuestros servicios de autenticación
from application.use_cases.auth import LoginUserUseCase, LoginUserRequest
from application.services import PasswordHasher
from infrastructure.auth import get_token_provider
from infrastructure.db.connection import SessionLocal
from infrastructure.db.repositories import PostgresUserRepository
from infrastructure.core.settings_config import settings
from infrastructure.logging import get_logger

from application.enums import UserRole

# Configurar logger
logger = get_logger("admin_auth")


class AdminAuth(AuthenticationBackend):
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

            logger.info(f"Admin login attempt for: {email}")

            if not email or not password:
                logger.warning("Admin login failed: missing credentials")
                return False

            # Usar nuestro caso de uso de login
            with SessionLocal() as db:
                user_repo = PostgresUserRepository(db)
                login_use_case = LoginUserUseCase(
                    user_repo=user_repo,
                    password_hasher=self.password_hasher,
                    token_provider=self.token_provider,
                )

                try:
                    login_request = LoginUserRequest(email=email, password=password)
                    response = login_use_case.execute(login_request)

                    if response.user.role != UserRole.ADMIN:
                        logger.warning(
                            f"Admin login failed: user {email} is not an admin"
                        )
                        return False

                    # Guardar información del usuario en la sesión
                    request.session.update(
                        {
                            "token": response.access_token,
                            "user_id": response.user.user_id,
                            "email": response.user.email,
                            "username": response.user.username,
                        }
                    )

                    logger.info(f"Admin login successful for: {email}")
                    return True

                except Exception as e:
                    logger.warning(f"Admin login failed for {email}: {str(e)}")
                    return False

        except Exception as e:
            logger.error(f"Admin login error: {str(e)}")
            return False

    async def logout(self, request: Request) -> bool:
        """Cerrar sesión del administrador"""
        try:
            user_email = request.session.get("email", "unknown")
            request.session.clear()
            logger.info(f"Admin logout successful for: {user_email}")
            return True
        except Exception as e:
            logger.error(f"Admin logout error: {str(e)}")
            return False

    async def authenticate(self, request: Request) -> bool:
        """Verificar si el usuario está autenticado"""
        try:
            token = request.session.get("token")
            user_email = request.session.get("email")

            if not token or not user_email:
                logger.debug(
                    "Admin authentication failed: no token or email in session"
                )
                return False

            # Verificar que el token sea válido
            if not self.token_provider.verify_token(token):
                logger.warning(
                    f"Admin authentication failed: invalid token for {user_email}"
                )
                request.session.clear()  # Limpiar sesión inválida
                return False

            # Verificar que el usuario siga existiendo en la base de datos
            with SessionLocal() as db:
                user_repo = PostgresUserRepository(db)
                user = user_repo.get_by_email(user_email)

                if not user:
                    logger.warning(
                        f"Admin authentication failed: user not found {user_email}"
                    )
                    request.session.clear()  # Limpiar sesión inválida
                    return False

            logger.debug(f"Admin authentication successful for: {user_email}")
            return True

        except Exception as e:
            logger.error(f"Admin authentication error: {str(e)}")
            return False


# Crear instancia del backend de autenticación usando la configuración JWT
authentication_backend = AdminAuth(secret_key=settings.jwt_settings.jwt_secret_key)

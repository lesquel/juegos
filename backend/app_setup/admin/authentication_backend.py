import time
from functools import lru_cache
from typing import Dict

from application.mixins.logging_mixin import LoggingMixin
from application.use_cases.auth import LoginUserUseCase
from domain.enums import UserRole
from dtos.request.auth.auth_request import LoginRequestDTO
from infrastructure.core.settings_config import settings
from infrastructure.db.connection import AsyncSessionLocal
from infrastructure.dependencies.converters import (
    get_login_assembler,
    get_user_converter,
)
from infrastructure.dependencies.repositories.database_repos import get_user_repository
from infrastructure.dependencies.services.auth_services import (
    get_password_hasher,
    get_token_provider,
)
from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request


@lru_cache(maxsize=1)
def _get_cached_services():
    """Cache de servicios para evitar recrearlos en cada login"""
    return {
        "password_hasher": get_password_hasher(),
        "token_provider": get_token_provider(),
        "user_converter": get_user_converter(),
    }


class AdminAuth(AuthenticationBackend, LoggingMixin):
    """Backend de autenticación optimizado para el panel de administración"""

    def __init__(self, secret_key: str):
        super().__init__(secret_key)
        # Usar servicios cacheados
        cached_services = _get_cached_services()
        self.password_hasher = cached_services["password_hasher"]
        self.token_provider = cached_services["token_provider"]
        self.user_converter = cached_services["user_converter"]

    async def login(self, request: Request) -> bool:
        """Autenticar usuario usando nuestro sistema de login optimizado"""
        start_time = time.time()

        try:
            form = await request.form()
            email = form.get("username")
            password = form.get("password")

            if not email or not password:
                self.logger.warning("Admin login failed: missing credentials")
                return False

            # Validación rápida de formato de email
            if "@" not in email or len(email) < 5:
                self.logger.warning(f"Admin login failed: invalid email format {email}")
                return False

            async with AsyncSessionLocal() as db:
                user_repo = get_user_repository(db)
                login_assembler = get_login_assembler()

                login_use_case = LoginUserUseCase(
                    user_repo=user_repo,
                    password_hasher=self.password_hasher,
                    token_provider=self.token_provider,
                    user_converter=self.user_converter,
                    login_assembler=login_assembler,
                )

                login_request = LoginRequestDTO(email=email, password=password)
                response = await login_use_case.execute(login_request)

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

                elapsed_time = time.time() - start_time
                self.logger.info(
                    f"Admin login successful for: {email} ({elapsed_time:.2f}s)"
                )
                return True

        except Exception as e:
            elapsed_time = time.time() - start_time
            self.logger.error(f"Admin login error: {str(e)} ({elapsed_time:.2f}s)")
            return False

    async def logout(self, request: Request) -> bool:
        """Cerrar sesión del administrador optimizado"""
        try:
            user_email = request.session.get("email", "unknown")
            request.session.clear()
            self.logger.info(f"Admin logout successful for: {user_email}")
            return True
        except Exception as e:
            self.logger.error(f"Admin logout error: {str(e)}")
            return False

    async def authenticate(self, request: Request) -> bool:
        """Verificar si el usuario está autenticado de forma optimizada"""
        try:
            token = request.session.get("token")
            user_email = request.session.get("email")

            if not token or not user_email:
                return False

            # Verificación rápida del token sin logs innecesarios
            if not self.token_provider.verify_token(token):
                request.session.clear()
                return False

            # Cache simple en memoria para evitar consultas DB frecuentes
            cache_key = f"{user_email}_{hash(token) % 1000}"
            if not hasattr(self, "_auth_cache"):
                self._auth_cache: Dict[str, tuple] = {}

            # Si está en cache y no ha expirado (5 minutos)
            if cache_key in self._auth_cache:
                cache_time, is_valid = self._auth_cache[cache_key]
                if time.time() - cache_time < 300:  # 5 minutos
                    return is_valid

            # Verificar en base de datos solo si no está en cache
            async with AsyncSessionLocal() as db:
                user_repo = get_user_repository(db)
                user = await user_repo.get_by_email(user_email)

                is_valid = user is not None and user.role == UserRole.ADMIN

                # Guardar en cache
                self._auth_cache[cache_key] = (time.time(), is_valid)

                # Limpiar cache si crece mucho (mantener solo 100 entradas)
                if len(self._auth_cache) > 100:
                    oldest_keys = sorted(
                        self._auth_cache.keys(), key=lambda k: self._auth_cache[k][0]
                    )[:50]
                    for key in oldest_keys:
                        del self._auth_cache[key]

                if not is_valid:
                    request.session.clear()

                return is_valid

        except Exception as e:
            self.logger.error(f"Admin authentication error: {str(e)}")
            return False


# Crear instancia del backend de autenticación usando la configuración JWT
authentication_backend = AdminAuth(secret_key=settings.jwt_settings.jwt_secret_key)

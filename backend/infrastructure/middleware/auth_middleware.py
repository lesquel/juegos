from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from domain.entities.user import UserEntity
from domain.interfaces import ITokenProvider
from infrastructure.db.repositories.user_repository import PostgresUserRepository
from infrastructure.logging import get_logger
from sqlalchemy.orm import Session

# Security scheme para Swagger/OpenAPI
security = HTTPBearer()

# Configurar logger
logger = get_logger("auth_middleware")


class AuthenticationMiddleware:
    """Middleware para autenticación JWT"""

    def get_current_user_from_token(
        token: HTTPAuthorizationCredentials,
        db: Session,
        token_provider: ITokenProvider,
    ) -> UserEntity:
        """
        Extrae y valida el usuario actual desde el token JWT

        Args:
            token: Token JWT desde el header Authorization
            db: Sesión de base de datos

        Returns:
            UserEntity: Usuario autenticado

        Raises:
            HTTPException: Si el token es inválido o el usuario no existe
        """
        logger.debug("Authenticating user from token")

        try:
            
            # Decodificar token
            logger.debug("Decoding JWT token")
            payload = token_provider.decode_token(token.credentials)
            logger.debug(f"Token decoded successfully")

            user_id = payload.sub
            if user_id is None:
                logger.warning("Token validation failed - missing user_id in payload")
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token format",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            logger.debug(f"Token validation successful for user_id: {user_id}")

            # Buscar usuario
            user_repo = PostgresUserRepository(db)
            user = user_repo.get_by_id(user_id)

            if user is None:
                logger.warning(
                    f"Authentication failed - user not found for user_id: {user_id}"
                )
                raise HTTPException(
                    status_code=401,
                    detail="User not found",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            logger.info(f"User authenticated successfully: {user_id}")
            return user

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

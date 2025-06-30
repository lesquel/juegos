from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from domain.entities.user import UserEntity
from domain.interfaces import ITokenProvider
from infrastructure.db.repositories.user_repository import PostgresUserRepository
from sqlalchemy.orm import Session


# Security scheme para Swagger/OpenAPI
security = HTTPBearer()





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
        try:
            print("INSIDE AUTH MIDDLEWARE")

            print(f"Token: {token}")
            print(f"Token received: {token.credentials}")
            # Decodificar token

            print(token_provider)
            payload = token_provider.decode_token(token.credentials)
            print(f"Decoded payload: {payload}")
            email = payload.get("sub")
            print(f"Decoded email: {email}")

            if email is None:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid token format",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Buscar usuario
            user_repo = PostgresUserRepository(db)
            user = user_repo.get_by_email(email)

            if user is None:
                raise HTTPException(
                    status_code=401,
                    detail="User not found",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return user

        except Exception as e:
            print(f"Token validation error: {e}")

            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )

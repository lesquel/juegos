from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from domain.entities.user.token_data import TokenData
from domain.exceptions.auth import ExpiredTokenError, InvalidTokenError
from domain.interfaces.token_provider import ITokenProvider
from dtos.response.auth.auth_response_dto import TokenResponseDTO

from ..core.settings_config import settings


class JWTService(ITokenProvider):
    """Servicio de JWT para manejo de tokens de autenticación"""

    def create_access_token(
        self, data: TokenData, expires_delta: Optional[timedelta] = None
    ) -> TokenResponseDTO:
        """Crea un token de acceso JWT"""
        self.logger.debug(f"Creating access token for subject: {data.sub}")

        # Crear payload del JWT
        expire = datetime.now(timezone.utc) + (
            expires_delta
            or timedelta(minutes=settings.jwt_settings.jwt_expiration_time)
        )

        payload = {
            "sub": data.sub,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "access_token",
        }

        # Generar token
        token = jwt.encode(
            payload,
            settings.jwt_settings.jwt_secret_key,
            algorithm=settings.jwt_settings.jwt_algorithm,
        )

        self.logger.debug(f"Access token created successfully, expires at: {expire}")
        return TokenResponseDTO(access_token=token, token_type="bearer")

    def decode_token(self, token: str) -> TokenData:
        """Decodifica un token JWT y retorna TokenData"""
        self.logger.debug("Decoding JWT token")
        try:
            payload = jwt.decode(
                token,
                settings.jwt_settings.jwt_secret_key,
                algorithms=[settings.jwt_settings.jwt_algorithm],
            )

            # Validar que el token sea del tipo correcto
            if payload.get("type") != "access_token":
                raise jwt.InvalidTokenError("Invalid token type")

            # Validar que tenga el campo 'sub'
            sub = payload.get("sub")
            if not sub:
                raise jwt.InvalidTokenError("Token missing subject")

            self.logger.debug(f"Token decoded successfully for subject: {sub}")
            return TokenData(sub=sub)

        except jwt.ExpiredSignatureError:
            self.logger.warning("Token decode failed: token has expired")
            raise ExpiredTokenError(message="Token has expired")
        except jwt.InvalidTokenError as e:
            self.logger.warning(f"Token decode failed: invalid token - {str(e)}")
            raise InvalidTokenError("Invalid token")

    def verify_token(self, token: str) -> bool:
        """Verifica si un token JWT es válido"""
        self.logger.debug("Verifying JWT token")
        try:
            self.decode_token(token)
            self.logger.debug("Token verified successfully")
            return True
        except (jwt.InvalidTokenError, jwt.ExpiredSignatureError) as e:
            self.logger.debug(f"Token verification failed: {str(e)}")
            return False

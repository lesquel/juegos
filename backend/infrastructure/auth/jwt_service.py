# infrastructure/auth/jwt_service.py
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from domain.interfaces.token_provider import ITokenProvider
from ..core.settings_config import settings
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("jwt_service")


class JWTService(ITokenProvider):
    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        logger.debug(f"Creating access token for subject: {data.get('sub', 'unknown')}")
        try:
            to_encode = data.copy()
            expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
            to_encode.update({"exp": expire})
            
            token = jwt.encode(
                to_encode,
                settings.jwt_settings.jwt_secret_key,
                algorithm=settings.jwt_settings.jwt_algorithm,
            )
            
            logger.debug(f"Access token created successfully, expires at: {expire}")
            return token
        except Exception as e:
            logger.error(f"Error creating access token: {str(e)}")
            raise

    def decode_token(self, token: str) -> Dict[str, Any]:
        logger.debug("Decoding JWT token")
        try:
            payload = jwt.decode(
                token,
                settings.jwt_settings.jwt_secret_key,
                algorithms=[settings.jwt_settings.jwt_algorithm],
            )
            logger.debug(f"Token decoded successfully for subject: {payload.get('sub', 'unknown')}")
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token decode failed: token has expired")
            raise
        except jwt.InvalidTokenError as e:
            logger.warning(f"Token decode failed: invalid token - {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {str(e)}")
            raise

    def verify_token(self, token: str) -> bool:
        logger.debug("Verifying JWT token")
        try:
            self.decode_token(token)
            logger.debug("Token verified successfully")
            return True
        except (jwt.InvalidTokenError, jwt.ExpiredSignatureError) as e:
            logger.debug(f"Token verification failed: {str(e)}")
            return False


def get_token_provider() -> ITokenProvider:
    return JWTService()

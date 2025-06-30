# infrastructure/auth/jwt_service.py
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import jwt
from domain.interfaces.Itoken_provider import ITokenProvider
from ..core.settings_config import settings


class JWTService(ITokenProvider):
    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return jwt.encode(
            to_encode,
            settings.jwt_settings.jwt_secret_key,
            algorithm=settings.jwt_settings.jwt_algorithm,
        )

    def decode_token(self, token: str) -> Dict[str, Any]:
        return jwt.decode(
            token,
            settings.jwt_settings.jwt_secret_key,
            algorithms=[settings.jwt_settings.jwt_algorithm],
        )

    def verify_token(self, token: str) -> bool:
        try:
            self.decode_token(token)
            return True
        except (jwt.InvalidTokenError, jwt.ExpiredSignatureError):
            return False


def get_token_provider() -> ITokenProvider:
    return JWTService()

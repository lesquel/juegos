"""
Caso de uso: Validar token
Responsabilidad única: Validar token JWT
"""

from dataclasses import dataclass

from domain.exceptions import InvalidTokenError
from infrastructure.auth.jwt_service import decode_token


@dataclass
class ValidateTokenRequest:
    """Request para el caso de uso de validación de token"""

    token: str


@dataclass
class ValidateTokenResponse:
    """Response para el caso de uso de validación de token"""

    token_data: dict
    is_valid: bool


class ValidateTokenUseCase:
    """Caso de uso para validar token JWT"""

    def execute(self, request: ValidateTokenRequest) -> ValidateTokenResponse:
        """Ejecuta el caso de uso de validación de token"""
        try:
            token_data = decode_token(request.token)
            return ValidateTokenResponse(token_data=token_data, is_valid=True)
        except Exception:
            raise InvalidTokenError("Invalid or expired token")

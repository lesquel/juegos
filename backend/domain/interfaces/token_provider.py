from abc import ABC, abstractmethod
from datetime import timedelta
from typing import Optional

from dtos.response.auth.auth_response_dto import TokenResponseDTO
from domain.entities.user.token_data import TokenData
from application.mixins import LoggingMixin


class ITokenProvider(ABC, LoggingMixin):
    """Interfaz para proveedores de tokens de autenticación"""
    
    @abstractmethod
    def create_access_token(
        self, data: TokenData, expires_delta: Optional[timedelta] = None
    ) -> TokenResponseDTO:
        """
        Crea un token de acceso
        
        Args:
            data: Datos para incluir en el token
            expires_delta: Tiempo de expiración personalizado
            
        Returns:
            DTO con el token de respuesta
        """
        pass

    @abstractmethod
    def decode_token(self, token: str) -> TokenData:
        """
        Decodifica un token y extrae los datos
        
        Args:
            token: Token JWT a decodificar
            
        Returns:
            Datos extraídos del token
            
        Raises:
            InvalidTokenError: Si el token es inválido
            ExpiredSignatureError: Si el token ha expirado
        """
        pass

    @abstractmethod
    def verify_token(self, token: str) -> bool:
        """
        Verifica si un token es válido
        
        Args:
            token: Token a verificar
            
        Returns:
            True si el token es válido, False en caso contrario
        """
        pass

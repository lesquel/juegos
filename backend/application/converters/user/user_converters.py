"""
Conversores para la entidad User.

Este módulo contiene los conversores para transformar entre UserEntity
y los DTOs correspondientes (UserRegistrationRequestDTO y UserResponseDTO).
"""

from typing import Optional
from application.mixins.dto_converter_mixin import (
    EntityToDTOConverter,
    DTOToEntityConverter,
    BidirectionalConverter
)
from application.mixins.logging_mixin import LoggingMixin
from domain.entities.user.user import UserEntity
from dtos.request.user.user_request_dto import UserRegistrationRequestDTO
from dtos.response.user.user_response import UserResponseDTO
from application.enums import UserRole


class UserEntityToDTOConverter(EntityToDTOConverter[UserEntity, UserResponseDTO], LoggingMixin):
    """Convierte UserEntity a UserResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: UserEntity) -> UserResponseDTO:
        """
        Convierte una entidad User a DTO de respuesta.
        
        Args:
            entity: La entidad User a convertir
            
        Returns:
            UserResponseDTO: El DTO de respuesta convertido
        """
        self.logger.debug(f"Converting UserEntity to UserResponseDTO for user: {entity.user_id}")
        
        try:
            dto = UserResponseDTO(
                user_id=entity.user_id,
                email=entity.email,
                role=entity.role,
                virtual_currency=entity.virtual_currency,
                created_at=entity.created_at,
                updated_at=entity.updated_at
            )
            
            self.logger.debug("Successfully converted UserEntity to UserResponseDTO")
            return dto
            
        except Exception as e:
            self.logger.error(f"Error converting UserEntity to DTO: {str(e)}")
            raise




class UserDTOToEntityConverter(DTOToEntityConverter[UserRegistrationRequestDTO, UserEntity], LoggingMixin):
    """Convierte UserRegistrationRequestDTO a UserEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(
        self, 
        dto: UserRegistrationRequestDTO, 
        user_id: Optional[str] = None,
        role: UserRole = UserRole.USER,
        virtual_currency: float = 0.0
    ) -> UserEntity:
        """
        Convierte un DTO de registro User a entidad.
        
        Args:
            dto: El DTO de registro a convertir
            user_id: ID del usuario (opcional para creación)
            role: Rol del usuario
            virtual_currency: Moneda virtual inicial
            
        Returns:
            UserEntity: La entidad convertida
        """
        self.logger.debug(f"Converting UserRegistrationRequestDTO to UserEntity for email: {dto.email}")
        
        try:
            entity = UserEntity(
                user_id=user_id,
                email=dto.email,
                password=dto.password,  # Nota: debería ser hasheada antes de llegar aquí
                role=role,
                virtual_currency=virtual_currency
            )
            
            self.logger.debug("Successfully converted UserRegistrationRequestDTO to UserEntity")
            return entity
            
        except Exception as e:
            self.logger.error(f"Error converting DTO to UserEntity: {str(e)}")
            raise



class UserBidirectionalConverter(BidirectionalConverter[UserEntity, UserResponseDTO], LoggingMixin):
    """Conversor bidireccional para User."""

    def __init__(self):
        super().__init__()
        self.entity_to_dto = UserEntityToDTOConverter()
        self.dto_to_entity = UserDTOToEntityConverter()

    def to_dto(self, entity: UserEntity) -> UserResponseDTO:
        """
        Convierte entidad a DTO de respuesta.
        
        Args:
            entity: La entidad a convertir
            
        Returns:
            UserResponseDTO: El DTO convertido
        """
        self.logger.debug(f"Converting UserEntity to UserResponseDTO (bidirectional) for user: {entity.user_id}")
        return self.entity_to_dto.to_dto(entity)
        
    def to_entity(self, dto: UserResponseDTO) -> UserEntity:
        """
        Convierte DTO de respuesta a entidad.
        
        Args:
            dto: El DTO de respuesta a convertir
            
        Returns:
            UserEntity: La entidad convertida
        """
        self.logger.debug(f"Converting UserResponseDTO to UserEntity for user: {dto.user_id}")
        # Nota: Esta conversión es limitada ya que UserResponseDTO no contiene password
        return UserEntity(
            user_id=dto.user_id,
            email=dto.email,
            password="",  # No disponible en el DTO de respuesta
            role=dto.role,
            virtual_currency=dto.virtual_currency,
            created_at=dto.created_at,
            updated_at=dto.updated_at
        )

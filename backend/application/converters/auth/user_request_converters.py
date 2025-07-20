"""Conversores de DTOs de request a entidades para autenticación."""

from application.mixins import DTOToEntityConverter, LoggingMixin
from domain.entities.user.user import UserEntity
from dtos.request.auth.auth_request import UserCreateRequestDTO


class UserCreateDTOToEntityConverter(
    DTOToEntityConverter[UserCreateRequestDTO, UserEntity], LoggingMixin
):
    """Convierte UserCreateRequestDTO a UserEntity."""

    def __init__(self):
        super().__init__()

    def to_entity(self, dto: UserCreateRequestDTO) -> UserEntity:
        """Convierte UserCreateRequestDTO a UserEntity."""
        self.logger.debug(
            f"Converting UserCreateRequestDTO to UserEntity for email: {dto.email}"
        )

        try:
            entity = UserEntity(
                user_id=None,  # Se asigna en el repositorio
                email=dto.email,
                hashed_password="",  # Se asigna después del hash
                virtual_currency=0.0,  # Valor inicial
                role="USER",  # Rol por defecto
            )

            self.logger.debug(
                "Successfully converted UserCreateRequestDTO to UserEntity"
            )
            return entity

        except Exception as e:
            self.logger.error(
                f"Error converting UserCreateRequestDTO to UserEntity: {str(e)}"
            )
            raise

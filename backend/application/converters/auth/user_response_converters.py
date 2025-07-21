from application.mixins import EntityToDTOConverter, LoggingMixin
from domain.entities.user.user import UserEntity
from dtos.response.user.user_response import UserBaseResponseDTO, UserResponseDTO


class UserEntityToDTOConverter(
    EntityToDTOConverter[UserEntity, UserResponseDTO], LoggingMixin
):
    """Convierte UserEntity a UserResponseDTO."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: UserEntity) -> UserResponseDTO:
        """Convierte UserEntity a UserResponseDTO."""
        self.logger.debug(
            f"Converting UserEntity to UserResponseDTO for user: {entity.user_id}"
        )

        try:
            dto = UserResponseDTO(
                user_id=str(entity.user_id),
                email=entity.email,
                role=entity.role,
                virtual_currency=entity.virtual_currency,
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )

            self.logger.debug("Successfully converted UserEntity to UserResponseDTO")
            return dto

        except Exception as e:
            self.logger.error(
                f"Error converting UserEntity to UserResponseDTO: {str(e)}"
            )
            raise


class UserEntityToBaseResponseDTOConverter(
    EntityToDTOConverter[UserEntity, UserBaseResponseDTO], LoggingMixin
):
    """Convierte UserEntity a UserBaseResponseDTO (información básica)."""

    def __init__(self):
        super().__init__()

    def to_dto(self, entity: UserEntity) -> UserBaseResponseDTO:
        """Convierte UserEntity a UserBaseResponseDTO."""
        self.logger.debug(
            f"Converting UserEntity to UserBaseResponseDTO for user: {entity.user_id}"
        )

        try:
            dto = UserBaseResponseDTO(
                user_id=str(entity.user_id),
                email=entity.email,
                role=entity.role,
                created_at=entity.created_at,
                updated_at=entity.updated_at,
            )

            self.logger.debug(
                "Successfully converted UserEntity to UserBaseResponseDTO"
            )
            return dto

        except Exception as e:
            self.logger.error(
                f"Error converting UserEntity to UserBaseResponseDTO: {str(e)}"
            )
            raise

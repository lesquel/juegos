"""Ensamblador para respuestas de autenticación."""

from application.interfaces.base_assembler import BaseAssembler
from application.mixins import LoggingMixin
from domain.entities.user.user import UserEntity
from dtos.response.auth.auth_response_dto import LoginResponseDTO, TokenResponseDTO

from .user_response_converters import UserEntityToDTOConverter


class LoginResponseAssembler(BaseAssembler[LoginResponseDTO], LoggingMixin):
    """Ensambla la respuesta completa de login."""

    def __init__(self):
        super().__init__()
        self.user_converter = UserEntityToDTOConverter()

    def assemble(self, user: UserEntity, token: TokenResponseDTO) -> LoginResponseDTO:
        """
        Ensambla LoginResponseDTO a partir de UserEntity y TokenData.

        Implementa el método requerido por BaseAssembler.

        Args:
            user: Entidad del usuario autenticado
            token: Datos del token de autenticación

        Returns:
            LoginResponseDTO: Respuesta completa de login

        Raises:
            Exception: Si ocurre un error durante el ensamblaje
        """
        self.logger.debug(f"Assembling login response for user: {user.user_id}")

        try:
            response = LoginResponseDTO(
                token=token, user=self.user_converter.to_dto(user)
            )

            self.logger.info(
                f"Successfully assembled login response for user: {user.user_id}"
            )
            return response

        except Exception as e:
            self.logger.error(
                f"Error assembling login response for user {user.user_id}: {str(e)}"
            )
            raise

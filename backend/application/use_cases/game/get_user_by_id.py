from domain.exceptions import UserNotFoundError
from domain.repositories import IUserRepository
from infrastructure.logging import get_logger

from dtos.response.user.user_response_dto import UserResponseDTO

# Configurar logger
logger = get_logger("get_user_use_case")


class GetUserUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, user_id: str) -> UserResponseDTO:
        """
        Obtiene un usuario por ID
        
        Args:
            user_id: ID del usuario a buscar
            
        Returns:
            UserResponseDTO: Datos del usuario
            
        Raises:
            UserNotFoundError: Si el usuario no existe
        """
        logger.debug(f"Getting user with ID: {user_id}")
        
        user = self.user_repo.get_by_id(user_id)
        
        if not user:
            logger.warning(f"User not found with ID: {user_id}")
            raise UserNotFoundError(f"User with ID {user_id} not found")
            
        logger.info(f"Successfully retrieved user: {user_id}")
        return UserResponseDTO(
            user_id=str(user.user_id),
            email=user.email,
            role=user.role,
            virtual_currency=user.virtual_currency,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

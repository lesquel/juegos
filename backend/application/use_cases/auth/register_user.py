from domain.entities.user import UserEntity
from domain.exceptions import UserAlreadyExistsError, ValidationError
from domain.repositories import IUserRepository
from application.interfaces import IPasswordHasher
from dtos.response.user_response_dto import UserBaseResponseDTO
from infrastructure.logging import get_logger
from dtos.request.auth_request_dto import UserCreateRequestDTO


# Configurar logger
logger = get_logger("register_use_case")


class RegisterUserUseCase:
    """Caso de uso para registrar nuevo usuario"""

    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
    ):
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    def execute(self, request: UserCreateRequestDTO) -> UserBaseResponseDTO:
        """Ejecuta el caso de uso de registro"""
        logger.info(f"Registration attempt for email: {request.email}")

        # Validaciones básicas
        if not request.email or not request.password:
            logger.warning(
                f"Registration failed - missing required fields for email: {request.email}"
            )
            raise ValidationError("All fields are required")

        # Verificar si el usuario ya existe
        existing_user = self.user_repo.get_by_email(request.email)
        if existing_user:
            logger.warning(f"Registration failed - email already exists: {request.email}")
            raise UserAlreadyExistsError("Email already registered")

        logger.debug(f"Password hashing for user: {request.email}")
        # Hash de la contraseña
        hashed_password = self.password_hasher.hash(request.password)
        logger.debug(f"Password hashed successfully for user: {request.email}")

        # Crear nueva entidad de usuario
        new_user = UserEntity(
            user_id=None,  # Se generará en la base de datos
            email=request.email,
            hashed_password=hashed_password,
        )

        # Guardar usuario
        logger.debug(f"Saving new user to database: {request.email}")
        saved_user = self.user_repo.save(new_user)

        logger.info(f"Successful registration for user: {saved_user.email}")
        return UserBaseResponseDTO(
            user_id=str(saved_user.user_id),
            email=saved_user.email,
            role=saved_user.role, 
        )

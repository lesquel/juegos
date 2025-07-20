from application.interfaces import IPasswordHasher
from application.interfaces.base_use_case import BaseUseCase
from application.mixins.dto_converter_mixin import EntityToDTOConverter
from domain.entities.user.user import UserEntity
from domain.exceptions import UserAlreadyExistsError, ValidationError
from domain.repositories import IUserRepository
from dtos.request.auth.auth_request import UserCreateRequestDTO
from dtos.response.user.user_response import UserBaseResponseDTO
from infrastructure.logging import log_execution, log_performance


class RegisterUserUseCase(BaseUseCase[UserCreateRequestDTO, UserBaseResponseDTO]):
    """Caso de uso para registrar nuevo usuario"""

    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
        user_converter: EntityToDTOConverter,
    ):
        super().__init__()
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.user_converter = user_converter

    @log_execution(include_args=False, include_result=True, log_level="INFO")
    @log_performance(threshold_seconds=2.0)
    async def execute(self, request: UserCreateRequestDTO) -> UserBaseResponseDTO:
        """Ejecuta el caso de uso de registro"""
        self.logger.info(f"Registration attempt for email: {request.email}")

        # Validaciones básicas
        if not request.email or not request.password:
            self.logger.warning(
                f"Registration failed - missing required fields for email: {request.email}"
            )
            raise ValidationError("All fields are required")

        # Verificar si el usuario ya existe
        existing_user = await self.user_repo.get_by_email(request.email)
        if existing_user:
            self.logger.warning(
                f"Registration failed - email already exists: {request.email}"
            )
            raise UserAlreadyExistsError("Email already registered")

        self.logger.debug(f"Password hashing for user: {request.email}")
        # Hash de la contraseña
        hashed_password = self.password_hasher.hash(request.password)
        self.logger.debug(f"Password hashed successfully for user: {request.email}")

        # Crear nueva entidad de usuario
        new_user = UserEntity(
            user_id=None,  # Se generará en la base de datos
            email=request.email,
            hashed_password=hashed_password,
        )

        # Guardar usuario
        self.logger.debug(f"Saving new user to database: {request.email}")
        saved_user = await self.user_repo.save(new_user)

        self.logger.info(f"Successful registration for user: {saved_user.email}")

        # Usar converter para mantener consistencia arquitectónica
        return self.user_converter.to_dto(saved_user)

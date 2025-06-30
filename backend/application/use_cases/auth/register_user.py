from dataclasses import dataclass

from domain.entities.user import UserEntity
from domain.exceptions import UserAlreadyExistsError, ValidationError
from domain.repositories import IUserRepository
from application.interfaces import IPasswordHasher


@dataclass
class RegisterUserRequest:
    """Request para el caso de uso de registro"""

    username: str
    email: str
    password: str


@dataclass
class RegisterUserResponse:
    """Response para el caso de uso de registro"""

    user: UserEntity


class RegisterUserUseCase:
    """Caso de uso para registrar nuevo usuario"""

    def __init__(
        self,
        user_repo: IUserRepository,
        password_hasher: IPasswordHasher,
    ):
        self.user_repo = user_repo
        self.password_hasher = password_hasher

    def execute(self, request: RegisterUserRequest) -> RegisterUserResponse:
        """Ejecuta el caso de uso de registro"""
        # Validaciones básicas
        if not request.email or not request.username or not request.password:
            raise ValidationError("All fields are required")



        # Verificar si el usuario ya existe
        existing_user = self.user_repo.get_by_email(request.email)
        if existing_user:
            raise UserAlreadyExistsError("Email already registered")

        print(f"Previos password: {request.password}")

        # Hash de la contraseña
        hashed_password = self.password_hasher.hash(request.password)
        print(f"Hashed password: {hashed_password}")
    
        # Crear nueva entidad de usuario
        new_user = UserEntity(
            user_id=None,  # Se generará en la base de datos
            username=request.username,
            email=request.email,
            hashed_password=hashed_password,
        )

        # Guardar usuario
        saved_user = self.user_repo.save(new_user)

        return RegisterUserResponse(user=saved_user)

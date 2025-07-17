from fastapi import APIRouter, Depends

from application.use_cases.auth import (
    LoginUserUseCase,
    RegisterUserUseCase,
)


from infrastructure.logging import get_logger

from infrastructure.dependencies import (
    get_register_user_use_case,
    get_login_use_case,
    get_current_user_from_request_use_case,
)
from dtos.request.auth.auth_request import LoginRequestDTO, UserCreateRequestDTO
from dtos.response.user.user_response import UserBaseResponseDTO, UserResponseDTO
from dtos.response.auth.auth_response_dto import LoginResponseDTO


auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

logger = get_logger("auth_routes")


@auth_router.post("/login", response_model=LoginResponseDTO)
async def login(
    user_login: LoginRequestDTO,
    login_use_case: LoginUserUseCase = Depends(get_login_use_case),
):
    """
    Autenticar usuario y obtener token de acceso

    - **email**: Email del usuario registrado
    - **password**: Contraseña del usuario

    Retorna un token JWT que debe incluirse en el header Authorization
    para endpoints protegidos: `Authorization: Bearer <token>`
    """
    logger.info(f"Login attempt for email: {user_login.email}")

    request = LoginRequestDTO(email=user_login.email, password=user_login.password)
    response = await login_use_case.execute(request)

    logger.info(f"Successful login for user: {response.user.email}")
    return response


@auth_router.post("/register", response_model=UserBaseResponseDTO)
async def register(
    user_data: UserCreateRequestDTO,
    register_use_case: RegisterUserUseCase = Depends(get_register_user_use_case),
):
    """
    Registrar nuevo usuario en el sistema

    - **email**: Email único del usuario
    - **password**: Contraseña (mínimo 6 caracteres)
    """
    logger.info(f"Registration attempt for email: {user_data.email}")

    request = UserCreateRequestDTO(
        email=user_data.email,
        password=user_data.password,
    )

    response = await register_use_case.execute(request)

    logger.info(f"Successful registration for user: {response.email}")
    return response


@auth_router.get("/me", response_model=UserResponseDTO)
async def get_current_user_info(
    current_user: UserResponseDTO = Depends(get_current_user_from_request_use_case),
):
    """
    Obtener información del usuario autenticado

    Requiere token JWT en el header Authorization:
    `Authorization: Bearer <token>`
    """
    logger.info(f"Get current user info for: {current_user.email}")
    logger.debug(f"Successfully retrieved user info for: {current_user.email}")
    return current_user

from fastapi import APIRouter, Depends

from application.use_cases.auth import (
    LoginUserUseCase,
    LoginUserRequest,
    RegisterUserUseCase,
    RegisterUserRequest,
)

from domain.entities.user import UserEntity
from infrastructure.logging import get_logger

from interfaces.api.dependencies import (
    get_register_user_use_case,
    get_login_use_case,
    get_current_user,
)
from ..request_models.user_input import UserCreateInput, UserLoginInput
from ..response_models.user_output import UserBaseOutput, UserOutput, UserLoginOutput
from ..response_models.common_responses import SuccessResponse


auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

# Configurar logger
logger = get_logger("auth_routes")


@auth_router.post("/login", response_model=SuccessResponse[UserLoginOutput])
def login(
    user_login: UserLoginInput,
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

    try:
        request = LoginUserRequest(email=user_login.email, password=user_login.password)

        response = login_use_case.execute(request)

        login_data = UserLoginOutput(
            access_token=response.access_token,
            token_type=response.token_type,
            user=UserBaseOutput(
                user_id=response.user.user_id,
                username=response.user.username,
                email=response.user.email,
            ),
        )

        logger.info(f"Successful login for user: {response.user.email}")
        return SuccessResponse(data=login_data, message="Login successful")

    except Exception as e:
        logger.error(f"Login failed for email {user_login.email}: {str(e)}")
        raise


@auth_router.post("/register", response_model=SuccessResponse[UserBaseOutput])
def register(
    user_data: UserCreateInput,
    register_use_case: RegisterUserUseCase = Depends(get_register_user_use_case),
):
    """
    Registrar nuevo usuario en el sistema

    - **username**: Nombre de usuario único
    - **email**: Email único del usuario
    - **password**: Contraseña (mínimo 6 caracteres)
    """
    logger.info(
        f"Registration attempt for email: {user_data.email}, username: {user_data.username}"
    )

    try:
        request = RegisterUserRequest(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password,
        )

        response = register_use_case.execute(request)

        user_output = UserOutput(
            user_id=response.user.user_id,
            username=response.user.username,
            email=response.user.email,
        )

        logger.info(f"Successful registration for user: {response.user.email}")
        return SuccessResponse(data=user_output, message="User registered successfully")

    except Exception as e:
        logger.error(f"Registration failed for email {user_data.email}: {str(e)}")
        raise


@auth_router.get("/me", response_model=SuccessResponse[UserOutput])
def get_current_user_info(current_user: UserEntity = Depends(get_current_user)):
    """
    Obtener información del usuario autenticado

    Requiere token JWT en el header Authorization:
    `Authorization: Bearer <token>`
    """
    logger.info(f"Get current user info for: {current_user.email}")

    try:
        user_data = UserOutput(
            user_id=current_user.user_id,
            username=current_user.username,
            email=current_user.email,
            virtual_currency=current_user.virtual_currency,
            created_at=current_user.created_at,
            updated_at=current_user.updated_at,
        )

        logger.debug(f"Successfully retrieved user info for: {current_user.email}")
        return SuccessResponse(
            data=user_data, message="User information retrieved successfully"
        )

    except Exception as e:
        logger.error(f"Failed to retrieve user info for {current_user.email}: {str(e)}")
        raise

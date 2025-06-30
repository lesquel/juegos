from fastapi import APIRouter, Depends

from application.use_cases.auth.login_user import LoginUserUseCase, LoginUserRequest
from application.use_cases.auth.register_user import (
    RegisterUserUseCase,
    RegisterUserRequest,
)
from domain.entities.user import UserEntity

from interfaces.api.dependencies import (
    get_register_user_use_case,
    get_login_use_case,
    get_current_user,
)
from ..request_models.user_input import UserCreateInput, UserLoginInput
from ..response_models.user_output import UserBaseOutput, UserOutput, UserLoginOutput
from ..response_models.common_responses import SuccessResponse


auth_router = APIRouter(prefix="/auth", tags=["Authentication"])


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

    return SuccessResponse(data=login_data, message="Login successful")


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
    request = RegisterUserRequest(
        username=user_data.username, email=user_data.email, password=user_data.password
    )

    response = register_use_case.execute(request)

    user_data = UserOutput(
        user_id=response.user.user_id,
        username=response.user.username,
        email=response.user.email,
    )

    return SuccessResponse(data=user_data, message="User registered successfully")


@auth_router.get("/me", response_model=SuccessResponse[UserOutput])
def get_current_user_info(current_user: UserEntity = Depends(get_current_user)):
    """
    Obtener información del usuario autenticado

    Requiere token JWT en el header Authorization:
    `Authorization: Bearer <token>`
    """

    print(f"Current user: {current_user}")

    user_data = UserOutput(
        user_id=current_user.user_id,
        username=current_user.username,
        email=current_user.email,
        virtual_currency=current_user.virtual_currency,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )

    return SuccessResponse(
        data=user_data, message="User information retrieved successfully"
    )

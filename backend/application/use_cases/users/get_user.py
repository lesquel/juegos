from dataclasses import dataclass

from domain.entities.user import UserEntity
from domain.repositories import IUserRepository


@dataclass
class GetUserRequest:
    """Request para el caso de uso de obtener usuario por ID"""
    user_id: str
@dataclass
class GetUserResponse:
    """Response para el caso de uso de obtener usuario por ID"""
    user: UserEntity

class GetUserUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, request: GetUserRequest) -> GetUserResponse: 
        user = self.user_repo.get_by_id(request.user_id)
        return GetUserResponse(user=user)

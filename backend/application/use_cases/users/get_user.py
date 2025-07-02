from domain.repositories import IUserRepository

from dtos.response.user_response_dto import UserResponseDTO


class GetUserUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, user_id: str) -> UserResponseDTO:
        user = self.user_repo.get_by_id(user_id)
        return UserResponseDTO(
            user_id=str(user.user_id),
            email=user.email,
            role=user.role,
            virtual_currency=user.virtual_currency,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

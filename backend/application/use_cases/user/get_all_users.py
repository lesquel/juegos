from domain.repositories import IUserRepository
from dtos.response.user.user_response_dto import UserResponseDTO

from infrastructure.logging import get_logger

logger = get_logger("get_all_users_use_case")


class GetAllUsersUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, pagination, filters, sort_params) -> tuple[list[UserResponseDTO], int]:
        users, count = self.user_repo.get_paginated(pagination, filters, sort_params)
        if not users:
            logger.warning("No users found with the given filters and pagination")
            return [], 0
        users = [
            UserResponseDTO(
                user_id=str(user.user_id),
                email=user.email,
                role=user.role,
                virtual_currency=user.virtual_currency,
                created_at=user.created_at,
                updated_at=user.updated_at,
            )
            for user in users
        ]
        return users, count

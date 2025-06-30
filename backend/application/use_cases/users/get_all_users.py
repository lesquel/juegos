from domain.repositories import IUserRepository


class GetAllUsersUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, pagination, filters, sort_params):
        return self.user_repo.get_paginated(pagination, filters, sort_params)

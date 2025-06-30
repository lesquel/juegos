from domain.repositories import IUserRepository


class GetUserUseCase:
    def __init__(self, user_repo: IUserRepository):
        self.user_repo = user_repo

    def execute(self, user_id: str):
        return self.user_repo.get_by_id(user_id)

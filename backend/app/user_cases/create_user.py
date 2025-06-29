from ..entities import User

from data.repositories.user_repository import UserRepository

def create_user(user_data:dict, repo: UserRepository) -> User:
    user = User(
        user_id=user_data.get('user_id'),
        username=user_data.get('username'),
        email=user_data.get('email')
    )
    repo.add_user(user)
    return user

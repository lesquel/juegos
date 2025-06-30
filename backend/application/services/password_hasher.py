from passlib.context import CryptContext
from ..interfaces import IPasswordHasher


class PasswordHasher(IPasswordHasher):
    def __init__(self):
        self._pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        print(f"Verifying password: {plain_password} against hash: {hashed_password}")
        return self._pwd_context.verify(plain_password, hashed_password)

    def hash(self, password: str) -> str:
        return self._pwd_context.hash(password)

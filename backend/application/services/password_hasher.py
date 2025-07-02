from passlib.context import CryptContext
from ..interfaces import IPasswordHasher
from domain.exceptions import DomainException
from infrastructure.logging import get_logger

# Configurar logger
logger = get_logger("password_hasher")


class PasswordHasher(IPasswordHasher):
    def __init__(self):
        self._pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        logger.debug("Verifying password hash")
        try:
            result = self._pwd_context.verify(plain_password, hashed_password)
            logger.debug(f"Password verification result: {'valid' if result else 'invalid'}")
            return result
        except Exception as e:
            logger.error(f"Error during password verification: {str(e)}")
            raise DomainException("Password verification failed", 500, "password_verification_error")

    def hash(self, password: str) -> str:
        logger.debug("Hashing password")
        try:
            hashed = self._pwd_context.hash(password)
            logger.debug("Password hashed successfully")
            return hashed
        except Exception as e:
            logger.error(f"Error during password hashing: {str(e)}")
            raise DomainException("Password hashing failed", 500, "password_hashing_error")

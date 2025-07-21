from application.mixins import LoggingMixin
from domain.exceptions import DomainException
from domain.interfaces import IPasswordHasher


class PasswordHasher(IPasswordHasher, LoggingMixin):
    def __init__(self, hasher):
        super().__init__()
        self._pwd_context = hasher

    def verify(self, plain_password: str, hashed_password: str) -> bool:
        self.logger.debug("Verifying password hash")
        try:
            result = self._pwd_context.verify(plain_password, hashed_password)
            self.logger.debug(
                f"Password verification result: {'valid' if result else 'invalid'}"
            )
            return result
        except Exception as e:
            self.logger.error(f"Error during password verification: {str(e)}")
            raise DomainException(
                "Password verification failed", 500, "password_verification_error"
            )

    def hash(self, password: str) -> str:
        self.logger.debug("Hashing password")
        try:
            hashed = self._pwd_context.hash(password)
            self.logger.debug("Password hashed successfully")
            return hashed
        except Exception as e:
            self.logger.error(f"Error during password hashing: {str(e)}")
            raise DomainException(
                "Password hashing failed", 500, "password_hashing_error"
            )

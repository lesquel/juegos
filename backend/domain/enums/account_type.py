from sqlalchemy import Enum


class AccountTypeEnum(str, Enum):
    SAVINGS = "SAVINGS"
    CHECKINGS = "CHECKINGS"

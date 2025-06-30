from uuid import UUID
from pydantic import BaseModel
from datetime import datetime

from application.enums import UserRole


class UserDTO(BaseModel):
    user_id: UUID
    username: str
    email: str
    hashed_password: str
    virtual_currency: float
    role: UserRole
    created_at: datetime
    updated_at: datetime

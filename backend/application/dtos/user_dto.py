from uuid import UUID
from pydantic import BaseModel
from datetime import datetime


class UserDTO(BaseModel):
    user_id: UUID
    username: str
    email: str
    hashed_password: str
    virtual_currency: float
    created_at: datetime
    updated_at: datetime

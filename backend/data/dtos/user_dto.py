from pydantic import BaseModel
from datetime import datetime

class UserDTO(BaseModel):
    user_id: str
    username: str
    email: str
    hashed_password: str
    virtual_currency: float
    created_at: datetime
    updated_at: datetime

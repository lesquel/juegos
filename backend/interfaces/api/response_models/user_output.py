from typing import Optional
from pydantic import BaseModel
import datetime

from application.enums import UserRole

class UserBaseOutput(BaseModel):
    user_id: str
    username: str
    email: str
    role: Optional[UserRole] = None

class UserOutput(UserBaseOutput):
    virtual_currency: float
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    
    
class UserLoginOutput(BaseModel):
    access_token: str
    token_type: str
    user: UserBaseOutput
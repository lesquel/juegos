from pydantic import BaseModel, EmailStr

class UserCreateInput(BaseModel):
    username: str
    email: EmailStr
    password: str
    

class UserUpdateInput(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    

class UserLoginInput(BaseModel):
    email: EmailStr
    password: str
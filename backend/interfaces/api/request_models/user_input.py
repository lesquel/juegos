from pydantic import BaseModel, EmailStr, field_validator

from .validators import password_validator, username_validator


class UserCreateInput(BaseModel):
    username: str
    email: EmailStr
    password: str

    _validate_username = field_validator("username")(username_validator)
    _validate_password = field_validator("password")(password_validator)


class UserUpdateInput(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    
    _validate_username = field_validator("username", mode="before")(username_validator)
    _validate_password = field_validator("password", mode="before")(password_validator)


class UserLoginInput(BaseModel):
    email: EmailStr
    password: str

from pydantic import BaseModel

class UserOutput(BaseModel):
    id: str
    username: str
    email: str
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# For user registration
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

# For user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str   

# Response after user creation or login (without password)
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True  # to work seamlessly with SQLAlchemy models

# Token response
class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Optional token payload when decoding
class TokenPayload(BaseModel):
    sub: Optional[str] = None  # typically user_id or email
    exp: Optional[int] = None
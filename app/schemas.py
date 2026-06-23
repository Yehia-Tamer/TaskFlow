import re
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


class UserCreate(BaseModel):
    username:str
    email:str
    password:str

    @field_validator('password')
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Must be at least 8 characters")
        if not re.search(r'[A-Z]', value):
            raise ValueError("Must contain an uppercase letter")
        if not re.search(r'[a-z]', value):
            raise ValueError("Must contain a lowercase letter")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValueError("Must contain a special character")
        return value

class UserResponse(BaseModel):
    username:str
    email:str
    model_config =ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    username:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username:Optional[str]=None
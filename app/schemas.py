import re
from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator, EmailStr

class UserCreate(BaseModel):
    username:str
    email:EmailStr
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

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    created_at: datetime
    owner: UserResponse
    completed_today: bool = False
    current_streak: int = 0
    model_config = ConfigDict(from_attributes=True)

class TaskCreate(BaseModel):
    title:str
    description:Optional[str]=None

class TaskUpdate(TaskCreate): pass

class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username:Optional[str]=None

class TaskCompletionResponse(BaseModel):
    task_id:int
    completed_at:date
    model_config = ConfigDict(from_attributes=True)

from datetime import timedelta, datetime
from typing import Optional
from app import schemas,JWTtoken,models
from fastapi import HTTPException
from jose import jwt,JWTError

SECRET_KEY = "09d25e094faa2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict,expires_delta:Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,ALGORITHM)
    return encoded_jwt

def verify_token(token: str,credentials_exception: HTTPException):
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=JWTtoken.ALGORITHM)
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = models.User.get(username=schemas.TokenData.username)
    if user is None:
        raise credentials_exception
    return user

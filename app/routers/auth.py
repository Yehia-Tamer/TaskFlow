import os
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from app import database,models,JWTtoken,schemas
from app.hashing import Hash
from fastapi.security import OAuth2PasswordRequestForm
from app.repository import users

router = APIRouter(tags=["Authentication"],prefix="/auth")

@router.post('/login')
def login(request:OAuth2PasswordRequestForm=Depends(),db:Session = Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.username==request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Incorrect username or password")
    if not Hash.verify(request.password,user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    access_token_expires=timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")))
    access_token=JWTtoken.create_access_token(data={"sub":user.username},expires_delta=access_token_expires)
    return {"access_token":access_token,"token_type":"bearer"}

@router.post('/register',status_code=status.HTTP_201_CREATED,response_model=schemas.UserResponse)
def register(request:schemas.UserCreate,db:Session = Depends(database.get_db)):
    return users.create(request,db)
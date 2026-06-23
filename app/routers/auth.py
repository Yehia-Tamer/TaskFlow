from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from app import schemas,database,models,JWTtoken
from app.hashing import Hash

router = APIRouter(tags=["Authentication"])

@router.post('/login')
def login(request:schemas.UserLogin,db:Session = Depends(database.get_db)):
    user=db.query(models.User).filter(models.User.username==request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Incorrect username or password")
    if not Hash.verify(request.password,user.hashed_password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")
    access_token_expires=timedelta(minutes=JWTtoken.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token=JWTtoken.create_access_token(data={"username":user.username},expires_delta=access_token_expires)
    return {"access_token":access_token,"token_type":"bearer"}
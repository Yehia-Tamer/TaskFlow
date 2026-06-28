#handles the database logic
from app import models,hashing
from starlette import status
from fastapi import HTTPException

def create(request,db):
    same_username = db.query(models.User).filter(models.User.username == request.username).first()
    if same_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    same_email = db.query(models.User).filter(models.User.email == request.email).first()
    if same_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    user = models.User(username=request.username, hashed_password=hashing.Hash.bcrypt(request.password),
                       email=request.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get(user_id,db,current_user):
    if(user_id!=current_user.id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    return user


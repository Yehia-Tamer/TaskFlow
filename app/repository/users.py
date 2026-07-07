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


#handles the database logic
from app import models,hashing
from starlette import status
from fastapi import HTTPException

def create(request,db):
    same_username = db.query(models.User).filter(models.User.username == request.username).first()
    if same_username:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Username already exists")
    same_email = db.query(models.User).filter(models.User.email == request.email).first()
    if same_email:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Email already exists")

    user = models.User(username=request.username, hashed_password=hashing.Hash.bcrypt(request.password),
                       email=request.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get(user_id,db):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def delete(user_id,db):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
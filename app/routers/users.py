#handles the endpoint logic
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from app import schemas, database, oauth2
from app.repository import users

router = APIRouter(
    tags=["Users"],
    prefix="/users"
)

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(oauth2.get_current_user)):
    return current_user



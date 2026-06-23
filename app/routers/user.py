#handles the endpoint logic
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from app import schemas,database
from app.repository import users

router = APIRouter(
    tags=["Users"],
    prefix="/users"
)

@router.post('/',status_code=status.HTTP_201_CREATED,response_model=schemas.UserResponse)
def create_user(request:schemas.UserCreate,db:Session=Depends(database.get_db)):
    return users.create(request,db)
@router.get("/{user_id}",status_code=status.HTTP_200_OK,response_model=schemas.UserResponse)
def get_user(user_id:int,db:Session=Depends(database.get_db)):
    return users.get(user_id,db)

@router.delete('/{user_id}',status_code=status.HTTP_200_OK)
def delete_user(user_id:int,db:Session=Depends(database.get_db)):
    return users.delete(user_id,db)

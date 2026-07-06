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

@router.get("/{user_id}",status_code=status.HTTP_200_OK,response_model=schemas.UserResponse)
def get_user(user_id:int,current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return users.get(user_id,db,current_user)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from app.repository import tasks
from app import schemas, database, oauth2

router = APIRouter(
    tags=["Tasks"],
    prefix="/tasks"
)

@router.get('/',status_code=status.HTTP_200_OK,response_model=list[schemas.TaskResponse])
def get_tasks(current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return tasks.all(db,current_user)

@router.post('/',status_code=status.HTTP_201_CREATED,response_model=schemas.TaskResponse)
def create_task(request:schemas.TaskCreate,current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return tasks.create(request,db,current_user)

@router.get('/{id}',status_code=status.HTTP_200_OK,response_model=schemas.TaskResponse)
def get_task(id:int,current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return tasks.get(id,db,current_user)

@router.delete('/{id}',status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id:int,current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return tasks.delete(id,db,current_user)

@router.put('/{id}',status_code=status.HTTP_202_ACCEPTED,response_model=schemas.TaskResponse)
def update_task(id:int,request:schemas.TaskUpdate,current_user:schemas.UserResponse=Depends(oauth2.get_current_user),db:Session=Depends(database.get_db)):
    return tasks.update(id,request,db,current_user)
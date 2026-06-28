from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status
from app import schemas,database,oauth2
from app.repository import task_completions

router = APIRouter(
    tags=['Task Completions']
)

@router.post('/tasks/{id}/complete',status_code=status.HTTP_201_CREATED,response_model=schemas.TaskCompletionResponse)
def complete_task(id:int,current_user=Depends(oauth2.get_current_user),db:Session = Depends(database.get_db)):
    return task_completions.complete(id,current_user,db)

@router.get('/tasks/{id}/streak',status_code=status.HTTP_200_OK)
def get_streak(id:int,current_user=Depends(oauth2.get_current_user),db:Session = Depends(database.get_db)):
    return task_completions.streak(id,current_user,db)
from datetime import datetime
from fastapi import HTTPException
from starlette import status
from app import models


def all(db,current_user):
    return db.query(models.Task).filter(models.Task.owner_id==current_user.id).all()

def create(request,db,current_user):
    task = models.Task(title=request.title,description=request.description,
            created_at=datetime.now(),owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def get(task_id,db,current_user):
    task=db.query(models.Task).filter(models.Task.id == task_id,models.Task.owner_id==current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    return task

def delete(task_id,db,current_user):
    task=db.query(models.Task).filter(models.Task.id == task_id,models.Task.owner_id==current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    db.delete(task)
    db.commit()
    return None

def update(id,request,db,current_user):
    task=db.query(models.Task).filter(models.Task.id == id,models.Task.owner_id==current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    task.title = request.title
    task.description=request.description
    db.commit()
    return task
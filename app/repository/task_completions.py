from datetime import date, timedelta
from fastapi import HTTPException
from starlette import status

from app import models

def complete(id,current_user,db):
    task=db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    if(task.owner_id!=current_user.id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Not authorized")
    task_completion=models.TaskCompletion(completed_at=date.today(),task_id=id,owner_id=current_user.id)
    db.add(task_completion)
    db.commit()
    db.refresh(task_completion)
    return task_completion

def streak(id,current_user,db):
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Habit with id {id} not found")

    if(task.owner_id!=current_user.id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Not authorized")

    completions = db.query(models.TaskCompletion).filter(
        models.TaskCompletion.task_id == id
    ).all()

    dates = {c.completed_at for c in completions}

    streak = 0
    cursor = date.today()
    while cursor in dates:
        streak += 1
        cursor = cursor - timedelta(days=1)

    return {"task_id": id, "current_streak": streak}
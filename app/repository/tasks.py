from datetime import datetime, date, timedelta
from fastapi import HTTPException
from starlette import status
from app import models


def _completion_dates(db, task_id):
    completions = db.query(models.TaskCompletion).filter(
        models.TaskCompletion.task_id == task_id
    ).all()
    return {c.completed_at for c in completions}


def _current_streak(dates):
    streak = 0
    cursor = date.today()
    while cursor in dates:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def all(db, current_user):
    task_list = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()

    for task in task_list:
        dates = _completion_dates(db, task.id)
        task.completed_today = date.today() in dates
        task.current_streak = _current_streak(dates)

    return task_list


def create(request, db, current_user):
    task = models.Task(title=request.title, description=request.description,
            created_at=datetime.now(), owner_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get(task_id, db, current_user):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


def delete(task_id, db, current_user):
    task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return None


def update(id, request, db, current_user):
    task = db.query(models.Task).filter(models.Task.id == id, models.Task.owner_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    task.title = request.title
    task.description = request.description
    db.commit()
    return task
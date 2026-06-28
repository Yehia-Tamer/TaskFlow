from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True,index=True)
    username = Column(String,nullable=False,unique=True)
    hashed_password = Column(String,nullable=False)
    email = Column(String,nullable=False,unique=True)

    tasks = relationship("Task",back_populates="owner")

    task_completions = relationship("TaskCompletion",back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True,index=True)
    title = Column(String,nullable=False)
    description = Column(String,nullable=True)
    created_at = Column(DateTime,default=datetime.now)
    owner_id=Column(Integer,ForeignKey("users.id"),nullable=False)

    owner = relationship("User",back_populates="tasks")

    completion=relationship("TaskCompletion",back_populates="task")

class TaskCompletion(Base):
    __tablename__ = "task_completions"
    id=Column(Integer, primary_key=True,index=True)
    completed_at = Column(Date,nullable=False)
    task_id=Column(Integer,ForeignKey("tasks.id"),nullable=False)
    owner_id=Column(Integer,ForeignKey("users.id"),nullable=False)

    task=relationship("Task",back_populates="completion")
    owner=relationship("User",back_populates="task_completions")
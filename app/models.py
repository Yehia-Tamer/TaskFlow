from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True,index=True)
    username = Column(String,nullable=False,unique=True)
    hash_password = Column(String,nullable=False)
    email = Column(String,nullable=False,unique=True)

    tasks = relationship("Task",back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True,index=True)
    title = Column(String,nullable=False)
    description = Column(String,nullable=True)
    created_at = Column(DateTime,default=datetime.now)
    owner_id=Column(Integer,ForeignKey("users.id"),nullable=False)

    owner = relationship("owner",back_populates="tasks")
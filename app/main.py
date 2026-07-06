from fastapi import FastAPI
from app import models
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, auth, tasks, task_completions
from app.database import engine
app = FastAPI()
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"data":'starter page'}

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(auth.router)
app.include_router(task_completions.router)
from fastapi import FastAPI
from app import models
from app.routers import user,auth,tasks
from app.database import engine

app = FastAPI()
models.Base.metadata.create_all(bind=engine)
@app.get("/")
def main():
    return {"data":'starter page'}

app.include_router(user.router)
app.include_router(tasks.router)
app.include_router(auth.router)
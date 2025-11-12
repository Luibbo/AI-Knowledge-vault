import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import models
from .db.database import engine
from .api import routes_auth, routes_chat, routes_user, routes_message, routes_document
app = FastAPI()

models.Base.metadata.create_all(engine) 

app.include_router(routes_auth.router)
app.include_router(routes_chat.router)
app.include_router(routes_message.router)
app.include_router(routes_document.router)
app.include_router(routes_user.router)


origins = [
    "http://localhost:3000",  # адреса твого React фронтенду
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    # дозволяє всі методи GET, POST, OPTIONS...
    allow_headers=["*"],    # дозволяє всі заголовки
)
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 8888))
#     uvicorn.run("blog.main:app", host="0.0.0.0", port=port)
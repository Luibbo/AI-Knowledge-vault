import os
import uvicorn
from fastapi import FastAPI
from .db import models
from .db.database import engine

app = FastAPI()

models.Base.metadata.create_all(engine) 

#app.include_router(authentication.router)


# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 8888))
#     uvicorn.run("blog.main:app", host="0.0.0.0", port=port)
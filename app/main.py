import os
import uvicorn
from fastapi import FastAPI
from .db import models
from .db.database import engine
from .api import routes_auth
app = FastAPI()

models.Base.metadata.create_all(engine) 

app.include_router(routes_auth.router)

@app.get(path='/')
def index():
    return 'Its working'

# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 8888))
#     uvicorn.run("blog.main:app", host="0.0.0.0", port=port)
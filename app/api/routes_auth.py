from sqlalchemy.orm import Session
from fastapi import  Depends, status, Response, HTTPException, APIRouter
from ..db import schemas, models, database
from ..core.security import Hash, create_access_token
from typing import List
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm


get_db = database.get_db

router = APIRouter(tags=['Authentication'])

@router.post('/login', status_code=status.HTTP_200_OK)
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.login == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid credentioals")
    
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Invalid password")

    access_token = create_access_token(
        data={"sub": user.login}
    )
    return schemas.Token(access_token=access_token, token_type="bearer")
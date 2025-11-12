from sqlalchemy.orm import Session
from fastapi import  Depends, status, HTTPException, APIRouter
from ..db import schemas, models, database
from ..core.security import Hash
from sqlalchemy.orm import Session


get_db = database.get_db

router = APIRouter(prefix='/user', tags=['User'])

@router.post(path='', response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create(request: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.login == request.login).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login already exists"
        )
    new_user = models.User(
        login=request.login,
        password=Hash.mybcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get(path='/{id}', response_model=schemas.UserOut, status_code=status.HTTP_200_OK)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'User with the id {id} is not available')
    
    return user

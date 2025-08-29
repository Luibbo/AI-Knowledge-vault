from sqlalchemy.orm import Session
from fastapi import  Depends, status, Response, HTTPException, APIRouter
from ..db import schemas, models, database
from ..db.database import get_db
from ..core.security import Hash, get_current_user
from typing import List
from sqlalchemy.orm import Session

router = APIRouter(prefix='/chat', tags=['Chat'])

@router.post(path='', response_model=schemas.ChatOut, status_code=status.HTTP_201_CREATED)
def create_chat(request: schemas.ChatCreate, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):

    new_chat = models.Chat(name=request.name, user_id=current_user.id)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return new_chat

@router.get(path='', response_model=List[schemas.ChatOut], status_code=status.HTTP_200_OK)
def all_user_chats( db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chats = db.query(models.Chat).filter(models.Chat.user_id == current_user.id).all()

    return chats


@router.get(path='/{id}', response_model=schemas.ChatOut, status_code=status.HTTP_200_OK)
def get_chat(id: int,  db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == id, models.Chat.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    return chat

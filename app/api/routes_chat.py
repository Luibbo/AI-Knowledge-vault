from sqlalchemy.orm import Session
from fastapi import  Depends, status, HTTPException, APIRouter
from ..db import schemas, models
from ..db.database import get_db
from ..core.security import get_current_user
from ..services.services import delete_document_from_vector_db
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

@router.delete(path='/{chat_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(chat_id: int, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id)

    if not chat.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')

    document = db.query(models.Document).filter(models.Document.chat_id == chat.first().id)
    if document.first():
        delete_document_from_vector_db(document.first().id)
        document.delete(synchronize_session=False)

    chat.delete(synchronize_session=False)
    db.commit()
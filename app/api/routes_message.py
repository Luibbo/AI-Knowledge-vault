from sqlalchemy.orm import Session
from fastapi import  Depends, status, HTTPException, APIRouter
from ..db import schemas, models
from ..db.database import get_db
from ..core.security import get_current_user
from typing import List
from sqlalchemy.orm import Session
from ..services.services import qa, query_pinecone

router = APIRouter(
    prefix='/chat',
    tags=['Message']
)

@router.post(path='/{chat_id}/messages', response_model=schemas.MessageOut, status_code=status.HTTP_201_CREATED)
def create_message(chat_id: int, request: schemas.MessageCreate,  db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    new_message = models.Message(chat_id=chat.id, content=request.content, sender="user")
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
 
    response = qa.invoke({"question": new_message.content})
    #print(response)
    assistant_answer = response["answer"]
    
    response_message = models.Message(chat_id=chat.id, content=assistant_answer, sender="assistant")
    db.add(new_message)
    db.refresh(new_message)
    db.add(response_message)
    db.commit()
    db.refresh(response_message)

    return response_message

@router.get(path='/{chat_id}/messages', response_model=List[schemas.MessageOut], status_code=status.HTTP_200_OK)
def all_messages(chat_id: int, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    messages = db.query(models.Message).filter(models.Message.chat_id==chat.id).all()
    
    return sorted(messages, key=lambda m: m.created_at)

@router.delete(path='/{chat_id}/messages/{message_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_message(chat_id: int, message_id: int, db: Session = Depends(get_db), current_user: schemas.UserOut = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    message = db.query(models.Message).filter(models.Message.id == message_id, models.Message.chat_id == chat.id)
    if not message.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Message is not available')
    
    message.delete(synchronize_session=False)
    db.commit()

    

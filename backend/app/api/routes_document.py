from sqlalchemy.orm import Session
from fastapi import  Depends, status, HTTPException, APIRouter, UploadFile, File
from ..db import schemas, models
from ..db.database import get_db
from ..core.security import get_current_user
from typing import List
from sqlalchemy.orm import Session
from ..utils.file_parser import file_parser
from ..services.services import embed_and_store, delete_document_from_vector_db

router = APIRouter(
    prefix='/chat/{chat_id}/document',
    tags=['Document']
)

@router.get(path='/{document_id}', response_model=schemas.DocumentOut, status_code=status.HTTP_200_OK)
def get_document(chat_id: int, document_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    document = db.query(models.Document).filter(models.Document.chat_id == chat_id, models.Document.user_id == current_user.id, models.Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=status.HTTP_200_OK,
                    detail=f'Document is not available')
    
    return document

@router.get(path='', response_model=list[schemas.DocumentOut], status_code=status.HTTP_200_OK)
def get_list_documents(chat_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    documents = db.query(models.Document).filter(models.Document.chat_id == chat_id, models.Document.user_id == current_user.id)

    if not documents:
        raise HTTPException(status_code=status.HTTP_200_OK,
                    detail=f'Document is not available')
    
    return documents

@router.post(path='', response_model=schemas.DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
                        chat_id: int,
                        file: UploadFile = File(...),
                        db: Session = Depends(get_db),
                        current_user: models.User = Depends(get_current_user)):

    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    text = await file_parser(file)

    document = models.Document(
        user_id=current_user.id,
        chat_id=chat.id,
        filename=file.filename
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    await embed_and_store(text=text,
                        user_id=current_user.id,
                        chat_id=chat.id,
                        doc_id=document.id,
                        filename=document.filename)
    
    return document
    

@router.delete(path='/{document_id}', status_code=status.HTTP_204_NO_CONTENT) 
def delete_document(chat_id: int, document_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id, models.Chat.user_id == current_user.id).first()

    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Chat is not available')
    
    document = db.query(models.Document).filter(models.Document.chat_id == chat_id, models.Document.user_id == current_user.id, models.Document.id == document_id)
    if not document.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Document is not available')
    print("Trying to delete")
    delete_document_from_vector_db(doc_id=document.first().id, chat_id=chat.id)
    print("Must have deleted")
    document.delete(synchronize_session=False)
    db.commit()


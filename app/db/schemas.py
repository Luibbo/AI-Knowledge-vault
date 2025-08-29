from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

# -------------------
# User schemas
# -------------------

class UserBase(BaseModel):
    login: str


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------
# Chat schemas
# -------------------

class ChatBase(BaseModel):
    name: str


class ChatCreate(ChatBase):
    pass


class ChatOut(ChatBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# -------------------
# Message schemas
# -------------------

class MessageBase(BaseModel):
    content: str


class MessageCreate(MessageBase):
    sender: str   # "user" | "assistant" | "system"


class MessageOut(MessageBase):
    id: int
    chat_id: int
    sender: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------
# Document schemas
# -------------------

class DocumentBase(BaseModel):
    filename: str


class DocumentCreate(DocumentBase):
    content: Optional[str] = None


class DocumentOut(DocumentBase):
    id: int
    user_id: int
    chat_id: int
    content: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# -------------------
# Auth schemas
# -------------------

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    login: Optional[str] = None

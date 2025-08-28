from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class Chat(BaseModel):
    name: str

class User(BaseModel):
    login: str
    password: str

class ShowUserBase(BaseModel):
    login: str

    model_config = ConfigDict(from_attributes=True)

class ShowUser(ShowUserBase):
    chats: List[Chat] = []

    model_config = ConfigDict(from_attributes=True) 

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None        
     

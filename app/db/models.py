from .database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    chats = relationship('Chat', back_populates='user', cascade="all, delete-orphan")
    documents = relationship('Document', back_populates='user', cascade="all, delete-orphan")


class Chat(Base):
    __tablename__ = 'chats'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))

    user = relationship('User', back_populates='chats')
    messages = relationship('Message', back_populates='chat', cascade="all, delete-orphan")
    documnet = relationship('Document', back_populates='chat')




class Message(Base):
    __tablename__ = 'messages'

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey('chats.id', ondelete="CASCADE"))
    sender = Column(String, nullable=False)   # "user" | "assistant" | "system"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    chat = relationship('Chat', back_populates='messages')


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    chat_id = Column(Integer, ForeignKey('chats.id', ondelete="CASCADE"))
    filename = Column(String, nullable=False)
    # content = Column(Text)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship('User', back_populates='documents')
    chat = relationship('Chat', back_populates='document')

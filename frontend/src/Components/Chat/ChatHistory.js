import React from 'react';
import ChatCard from './ChatCard';
import './Chat.css';

export default function ChatHistory({ chats = [], selectedChatId, onSelect }) {
  return (
    <div className="sidebar">
      <div className="brand">Chats</div>
      <div className="chat-list">
        {chats.length === 0 && <div className="small-muted">No chats yet</div>}
        {chats.map((c) => (
          <ChatCard key={c.id} chat={c} selected={c.id === selectedChatId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

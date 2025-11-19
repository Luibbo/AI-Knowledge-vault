import React from 'react';
import ChatCard from './ChatCard';
import './Chat.css';
import { clearAuthToken } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function ChatHistory({ chats = [], selectedChatId, onSelect, onNewChat, onChatDeleted }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthToken();
    navigate('/login');
  }

  return (
    <div className="sidebar">
      <div className="brand">Chats</div>
      
      <button className="btn btn-sidebar" onClick={onNewChat}>+ New Chat</button>

      <div className="chat-list">
        {chats.length === 0 && <div className="small-muted">No chats yet</div>}
        {chats.map((c) => (
          <ChatCard 
            key={c.id} 
            chat={c} 
            selected={c.id === selectedChatId} 
            onSelect={onSelect}
            onDelete={onChatDeleted}
          />
        ))}
      </div>

      <button className="btn btn-sidebar btn-logout" onClick={handleLogout}>Logout</button>
    </div>
  );
}

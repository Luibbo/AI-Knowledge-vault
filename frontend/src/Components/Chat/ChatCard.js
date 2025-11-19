import React from 'react';
import './Chat.css';

export default function ChatCard({ chat, selected, onSelect }) {
  return (
    <div
      className={`chat-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(chat)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect && onSelect(chat); }}
    >
      <div style={{ fontSize: 16 }}>{chat.name}</div>
      <div style={{ fontSize: 12 }} className="small-muted">{chat.id}</div>
    </div>
  );
}

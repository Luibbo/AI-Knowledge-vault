import React, { useState } from 'react';
import './Chat.css';
import api from '../../api';

export default function ChatCard({ chat, selected, onSelect, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e) {
    e.stopPropagation();
    
    if (!window.confirm(`Delete chat "${chat.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await api.chat.remove(chat.id);
      onDelete && onDelete(chat.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete chat');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`chat-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(chat)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect && onSelect(chat); }}
    >
      <div>
        <div style={{ fontSize: 16 }}>{chat.name}</div>
        <div style={{ fontSize: 12 }} className="small-muted">{chat.id}</div>
      </div>
      <button
        className="chat-card-delete"
        onClick={handleDelete}
        disabled={deleting}
        title="Delete chat"
      >
        ✕
      </button>
    </div>
  );
}

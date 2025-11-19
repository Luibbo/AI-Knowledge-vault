import React from 'react';
import './Chat.css';

export default function Message({ message }) {
  const cls = `message ${message.sender === 'user' ? 'user' : 'assistant'}`;
  return (
    <div className={cls}>
      <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</div>
      {message.created_at && (
        <div className="message-time">{new Date(message.created_at).toLocaleString()}</div>
      )}
    </div>
  );
}

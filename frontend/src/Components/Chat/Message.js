import React from 'react';
import './Chat.css';

export default function Message({ message }) {
  const cls = `message ${message.sender === 'user' ? 'user' : 'assistant'}`;
  return (
    <div className={cls}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
      {message.created_at && (
        <div style={{ fontSize: 11, marginTop: 6 }} className="small-muted">{new Date(message.created_at).toLocaleString()}</div>
      )}
    </div>
  );
}

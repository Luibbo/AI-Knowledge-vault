import React, { useState } from 'react';
import './Chat.css';
import api from '../../api';

// NOTE: api import path uses relative path to `frontend/src/api.js` from component; adjust if your bundler resolves differently.

export default function CreateChat({ onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e && e.preventDefault();
    if (!name.trim()) return;
    try {
      setLoading(true);
      const payload = { name: name.trim() };
      const chat = await api.chat.create(payload);
      setName('');
      onCreated && onCreated(chat);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create chat');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-area">
      <h2 className="text">Create chat</h2>
      <div className="underline" style={{ width: 140 }} />

      <form className="create-form" onSubmit={handleCreate}>
        <input
          className="chat-input"
          placeholder="Chat name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
      </form>
      <div className="small-muted">Only a name is required. After created, it will appear in the left chat list.</div>
    </div>
  );
}

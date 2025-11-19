import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import api from '../../api';
import Message from './Message';

export default function MessageHistory({ chatId, onUpload }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  async function fetchMessages() {
    setLoading(true);
    try {
      const data = await api.messages.list(chatId);
      setMessages(data || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function scrollToBottom() {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }

  async function handleSend() {
    if (!text.trim()) return;
    const payload = { content: text.trim() };
    try {
      const newMsg = await api.messages.create(chatId, payload);
      setMessages((m) => [...m, { ...newMsg, sender: 'user' }]);
      setText('');
      // refetch to get assistant reply
      const after = await api.messages.list(chatId);
      setMessages(after || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to send');
    }
  }

  function handleUploadClick() {
    document.getElementById('upload-doc-input')?.click();
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = null;
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={listRef} className="message-list">
        {loading && <div className="small-muted">Loading messages...</div>}
        {!loading && messages.length === 0 && <div className="small-muted">No messages yet</div>}
        {messages.map((m) => <Message key={m.id || Math.random()} message={m} />)}
      </div>

      <div className="message-input-row">
        <textarea className="message-textarea" value={text} onChange={(e) => setText(e.target.value)} />
        <input
          id="upload-doc-input"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button className="btn" onClick={handleUploadClick} title="Upload Document">📎</button>
        <button className="btn" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

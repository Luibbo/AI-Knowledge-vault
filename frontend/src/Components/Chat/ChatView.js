import React, { useEffect, useState } from 'react';
import './Chat.css';
import ChatHistory from './ChatHistory';
import MessageHistory from './MessageHistory';
import CreateChat from './CreateChat';
import api from '../../api';

export default function ChatView() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  async function fetchChats() {
    try {
      const data = await api.chat.list();
      setChats(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreated(chat) {
    // Add to list and select
    setChats((c) => [chat, ...c]);
    setSelectedChat(chat);
  }

  async function handleNewChat() {
    const name = window.prompt('Enter new chat name');
    if (!name) return;
    try {
      const chat = await api.chat.create({ name });
      handleCreated(chat);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create chat');
    }
  }

  // upload document handler
  async function handleUpload(file) {
    if (!selectedChat) return alert('Select a chat first');
    try {
      await api.documents.upload(selectedChat.id, file);
      alert('Upload complete');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed');
    }
  }

  return (
    <div className="chat-wrapper">
      <ChatHistory chats={chats} selectedChatId={selectedChat?.id} onSelect={(c) => setSelectedChat(c)} />

      <div className="main">
        {!selectedChat ? (
          <CreateChat onCreated={handleCreated} />
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 className="text">{selectedChat.name}</h2>
                <button className="btn" onClick={handleNewChat}>New Chat</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="small-muted">id: {selectedChat.id}</div>
                <input
                  id="upload-doc-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => { if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = null; }}
                />
                <label htmlFor="upload-doc-input" className="btn" style={{ cursor: 'pointer' }}>Upload Document</label>
              </div>
            </div>
            <div className="underline" style={{ width: 220 }} />
            <div style={{ marginTop: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <MessageHistory chatId={selectedChat.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

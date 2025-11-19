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
      <ChatHistory 
        chats={chats} 
        selectedChatId={selectedChat?.id} 
        onSelect={(c) => setSelectedChat(c)}
        onNewChat={handleNewChat}
      />

      <div className="main">
        {!selectedChat ? (
          <CreateChat onCreated={handleCreated} />
        ) : (
          <>
            <div>
              <h2 className="text">{selectedChat.name}</h2>
              <div className="underline" style={{ width: 280, marginTop: 12 }} />
            </div>
            <div className="messages-container">
              <MessageHistory chatId={selectedChat.id} onUpload={handleUpload} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

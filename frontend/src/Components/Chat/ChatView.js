import React, { useEffect, useState } from 'react';
import './Chat.css';
import ChatHistory from './ChatHistory';
import MessageHistory from './MessageHistory';
import CreateChat from './CreateChat';
import DocumentModal from './DocumentModal';
import api from '../../api';

export default function ChatView() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [document, setDocument] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchDocument(selectedChat.id);
    }
  }, [selectedChat]);

  async function fetchChats() {
    try {
      const data = await api.chat.list();
      setChats(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDocument(chatId) {
    setLoadingDoc(true);
    try {
      const doc = await api.documents.get(chatId);
      setDocument(doc);
    } catch (err) {
      // Document may not exist, which is ok
      setDocument(null);
    } finally {
      setLoadingDoc(false);
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
      // Refresh document
      fetchDocument(selectedChat.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed');
    }
  }

  function handleDocumentDeleted() {
    setDocument(null);
  }

  function handleChatDeleted(chatId) {
    setChats((c) => c.filter((chat) => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setDocument(null);
    }
  }

  return (
    <div className="chat-wrapper">
      <ChatHistory 
        chats={chats} 
        selectedChatId={selectedChat?.id} 
        onSelect={(c) => setSelectedChat(c)}
        onNewChat={handleNewChat}
        onChatDeleted={handleChatDeleted}
      />

      <div className="main">
        {!selectedChat ? (
          <CreateChat onCreated={handleCreated} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'space-between' }}>
              <div>
                <h2 className="text">{selectedChat.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <DocumentModal 
                    document={document} 
                    chatId={selectedChat.id}
                    onDocumentDeleted={handleDocumentDeleted}
                  />
                  {loadingDoc && <span className="small-muted">Loading...</span>}
                </div>
              </div>
            </div>
            <div className="underline" style={{ width: 280, marginTop: 0 }} />
            <div className="messages-container">
              <MessageHistory chatId={selectedChat.id} onUpload={handleUpload} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

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
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [creatingNewChat, setCreatingNewChat] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchDocuments(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      setCreatingNewChat(false);
    }
  }, [selectedChat])

  async function fetchChats() {
    try {
      const data = await api.chat.list();
      setChats(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchDocuments(chatId) {
    setLoadingDocs(true);
    try {
      const docs = await api.documents.list(chatId);
      setDocuments(docs || []);
    } catch (err) {
      // Documents may not exist, which is ok
      setDocuments([]);
    } finally {
      setLoadingDocs(false);
    }
  }

  async function handleCreated(chat) {
    // Add to list and select
    setChats((c) => [chat, ...c]);
    setSelectedChat(chat);
  }

  function handleNewChat() {
    setCreatingNewChat(true);
  }

  function handleCreatedNewChat(chat) {
    handleCreated(chat);
    setCreatingNewChat(false);
  }

  // upload document handler
  async function handleUpload(file) {
    if (!selectedChat) return alert('Select a chat first');
    try {
      await api.documents.upload(selectedChat.id, file);
      alert('Upload complete');
      // Refresh documents
      fetchDocuments(selectedChat.id);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Upload failed');
    }
  }

  function handleDocumentDeleted(documentId) {
    setDocuments((docs) => docs.filter((doc) => doc.id !== documentId));
  }

  function handleChatDeleted(chatId) {
    setChats((c) => c.filter((chat) => chat.id !== chatId));
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
      setDocuments([]);
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
        {!selectedChat || creatingNewChat ? (
          <CreateChat onCreated={creatingNewChat ? handleCreatedNewChat : handleCreated} />
        ) : (
          <>
            <div>
              <h2 className="text">{selectedChat.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                {loadingDocs && <span className="small-muted">Loading documents...</span>}
                {!loadingDocs && documents.length === 0 && <span className="small-muted">No documents</span>}
                {documents.map((doc) => (
                  <DocumentModal 
                    key={doc.id}
                    document={doc}
                    chatId={selectedChat.id}
                    onDocumentDeleted={handleDocumentDeleted}
                  />
                ))}
              </div>
            </div>
            <div className="underline" style={{ width: 280, marginTop: 12 }} />
            <div className="messages-container">
              <MessageHistory chatId={selectedChat.id} onUpload={handleUpload} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

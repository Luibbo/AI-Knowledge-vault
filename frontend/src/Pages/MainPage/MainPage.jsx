import React from 'react';
import './MainPage.css';
import ChatView from '../../Components/Chat/ChatView';
import { clearAuthToken } from '../../api';

export default function MainPage() {
  function handleLogout() {
    clearAuthToken();
    // reload app to reflect logged-out state (adjust if you have routing)
    window.location.reload();
  }

  return (
    <div className="page-container">
      <div className="topbar">
        <div className="title">AI Knowledge Vault</div>
        <div className="topbar-actions">
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="content">
        <ChatView />
      </div>
    </div>
  );
}

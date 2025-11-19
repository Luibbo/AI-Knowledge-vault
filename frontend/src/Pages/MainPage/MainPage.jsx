import React, { useEffect } from 'react';
import './MainPage.css';
import ChatView from '../../Components/Chat/ChatView';
import { setAuthToken } from '../../api';

export default function MainPage() {
  useEffect(() => {
    // Sync token from localStorage to api module on component mount
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <div className="page-container">
      <ChatView />
    </div>
  );
}

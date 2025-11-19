import React, { useState, useRef } from 'react';
import './Chat.css';
import api from '../../api';

export default function Message({ message, chatId, onMessageDeleted }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  function handleContextMenu(e) {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  }

  async function handleDelete() {
    if (!window.confirm('Delete this message?')) {
      setShowMenu(false);
      return;
    }

    try {
      setDeleting(true);
      await api.messages.remove(chatId, message.id);
      onMessageDeleted && onMessageDeleted(message.id);
      setShowMenu(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete message');
    } finally {
      setDeleting(false);
    }
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const cls = `message ${message.sender === 'user' ? 'user' : 'assistant'}`;
  
  return (
    <>
      <div 
        className={cls}
        onContextMenu={handleContextMenu}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</div>
        {message.created_at && (
          <div className="message-time">{new Date(message.created_at).toLocaleString()}</div>
        )}
      </div>

      {showMenu && (
        <div 
          className="context-menu" 
          ref={menuRef}
          style={{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
        >
          <button
            className="context-menu-item context-menu-delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            🗑️ Delete Message
          </button>
        </div>
      )}
    </>
  );
}

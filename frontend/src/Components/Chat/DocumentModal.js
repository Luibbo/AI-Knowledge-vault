import React, { useState } from 'react';
import './Chat.css';
import api from '../../api';

export default function DocumentModal({ document, chatId, onDocumentDeleted }) {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      setDeleting(true);
      await api.documents.remove(chatId, document.id);
      onDocumentDeleted(document.id);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete document');
    } finally {
      setDeleting(false);
    }
  }

  if (!document) return null;

  return (
    <>
      <button 
        className="document-badge" 
        onClick={() => setShowModal(true)}
        title="View document details"
      >
        📄 {document.filename}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Document Details</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-item">
                <span className="detail-label">Filename:</span>
                <span className="detail-value">{document.filename}</span>
              </div>
              {document.id && (
                <div className="detail-item">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{document.id}</span>
                </div>
              )}
              {document.created_at && (
                <div className="detail-item">
                  <span className="detail-label">Uploaded:</span>
                  <span className="detail-value">
                    {new Date(document.created_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

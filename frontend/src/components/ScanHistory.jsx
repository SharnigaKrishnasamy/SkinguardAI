import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Trash2, 
  Eye, 
  Calendar, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { fetchHistory, deleteHistoryItem, clearAllHistory } from '../utils/api';

export default function ScanHistory({ onSelectScan, language }) {
  const isTamil = language === 'ta';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Custom delete confirmation state (avoids browser window.confirm being blocked)
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExecuteDelete = async (id) => {
    try {
      // Optimistic update
      setHistory(prev => prev.filter(item => String(item._id) !== String(id)));
      if (selectedRecord && String(selectedRecord._id) === String(id)) {
        setSelectedRecord(null);
      }
      setPendingDeleteId(null);

      const res = await deleteHistoryItem(id);
      if (res.success) {
        showToast(isTamil ? 'பதிவு வெற்றிகரமாக நீக்கப்பட்டது!' : 'Scan record deleted successfully!');
      } else {
        showToast(res.error || 'Failed to delete');
        loadData(); // Revert on failure
      }
    } catch (err) {
      showToast('Error deleting: ' + err.message);
      loadData();
    }
  };

  const handleClearAllConfirm = async () => {
    try {
      setHistory([]);
      setSelectedRecord(null);
      setPendingDeleteId(null);
      await clearAllHistory();
      showToast(isTamil ? 'அனைத்து பதிவுகளும் அழிக்கப்பட்டன!' : 'All history records cleared!');
    } catch (err) {
      showToast('Error clearing: ' + err.message);
      loadData();
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesUrgency = filterUrgency === 'all' || item.seeDoctorUrgency === filterUrgency;
    const condName = item.possibleConditions?.[0]?.name?.toLowerCase() || '';
    const matchesSearch = !searchQuery || condName.includes(searchQuery.toLowerCase());
    return matchesUrgency && matchesSearch;
  });

  return (
    <div style={{ marginTop: '1.5rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '84px',
          right: '24px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'slide-in 0.3s ease'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={24} color="#0284c7" />
            {isTamil ? 'சேமிக்கப்பட்ட ஸ்கேன் வரலாறு (MongoDB)' : 'Scan Records & History (MongoDB)'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {isTamil ? 'முந்தைய பகுப்பாய்வுகள் மற்றும் மருத்துவ குறிப்புகள்' : 'Historical differential screening records stored in database'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <button 
            onClick={loadData}
            className="btn-secondary" 
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>{isTamil ? 'புதுப்பி' : 'Refresh'}</span>
          </button>

          {history.length > 0 && (
            pendingDeleteId === 'all' ? (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
                  {isTamil ? 'உறுதி செய்கிறீர்களா?' : 'Confirm Clear?'}
                </span>
                <button
                  onClick={handleClearAllConfirm}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isTamil ? 'ஆம், அழி' : 'Yes, Clear All'}
                </button>
                <button
                  onClick={() => setPendingDeleteId(null)}
                  style={{
                    background: '#f1f5f9',
                    color: '#64748b',
                    border: '1px solid #cbd5e1',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setPendingDeleteId('all')}
                className="btn-secondary" 
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', color: '#dc2626', borderColor: '#fecaca' }}
              >
                <Trash2 size={14} />
                <span>{isTamil ? 'அனைத்தையும் அழி' : 'Clear All'}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '0.9rem 1.2rem',
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder={isTamil ? 'நோயின் பெயர் கொண்டு தேடு...' : 'Search by condition name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#0f172a',
              fontSize: '0.88rem',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Urgency:</span>
          {['all', 'high', 'medium', 'low'].map(u => (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              style={{
                fontSize: '0.78rem',
                textTransform: 'capitalize',
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                border: filterUrgency === u ? '1px solid #0284c7' : '1px solid #e2e8f0',
                background: filterUrgency === u ? '#e0f2fe' : '#ffffff',
                color: filterUrgency === u ? '#0284c7' : '#64748b'
              }}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* List or Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <RefreshCw size={28} className="spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: '#0284c7' }} />
          <p>{isTamil ? 'MongoDB யிலிருந்து தகவல்களை ஏற்றுகிறது...' : 'Retrieving records from MongoDB...'}</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Database size={42} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800, marginBottom: '0.4rem' }}>
            {isTamil ? 'பதிவுகள் எதுவும் இல்லை' : 'No Scans in History'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
            {isTamil ? 'புதிய தோல் படத்தை பதிவேற்றி ஆய்வு செய்தால் அது இங்கே சேமிக்கப்படும்.' : 'Uploaded scans analyzed by Clinical AI Vision will automatically appear here with MongoDB timestamps.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredHistory.map((item) => {
            const primary = item.possibleConditions?.[0] || { name: 'Unknown Condition', likelihood_percent: 0 };
            const urgency = item.seeDoctorUrgency || 'low';
            const isDeleting = pendingDeleteId === String(item._id);

            return (
              <div 
                key={item._id}
                onClick={() => setSelectedRecord(item)}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  position: 'relative',
                  borderTop: `4px solid ${urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#d97706' : '#059669'}`
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#f8fafc',
                    flexShrink: 0,
                    border: '1px solid #e2e8f0'
                  }}>
                    {item.imageThumbnail ? (
                      <img src={item.imageThumbnail} alt="Lesion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <Eye size={20} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {primary.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700 }}>
                      {primary.likelihood_percent}% Match Likelihood
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                      <Calendar size={12} />
                      <span>{new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Delete button with 2-step inline confirmation */}
                  {isDeleting ? (
                    <div 
                      onClick={(e) => e.stopPropagation()} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}
                    >
                      <button
                        onClick={() => handleExecuteDelete(item._id)}
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isTamil ? 'உறுதி செய்' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setPendingDeleteId(null)}
                        style={{
                          background: 'transparent',
                          color: '#64748b',
                          border: 'none',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        {isTamil ? 'ரத்து' : 'Cancel'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteId(String(item._id));
                      }}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: urgency === 'high' ? '#dc2626' : urgency === 'medium' ? '#d97706' : '#059669'
                  }}>
                    ● {urgency} Risk
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                    {item.bodyLocation || 'Body Area'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div 
            className="glass-panel" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 800 }}>
                  MongoDB Saved Record #{String(selectedRecord._id).slice(-6)}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>
                  {selectedRecord.possibleConditions?.[0]?.name}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button 
                  onClick={() => handleExecuteDelete(selectedRecord._id)}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    cursor: 'pointer',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  title="Delete this record"
                >
                  <Trash2 size={14} />
                  <span>{isTamil ? 'பதிவை நீக்கு' : 'Delete'}</span>
                </button>

                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.6rem' }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img 
                src={selectedRecord.imageThumbnail} 
                alt="Lesion Record" 
                style={{ maxHeight: '240px', borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#334155' }}>
              <div>
                <strong style={{ color: '#0f172a' }}>Clinical Summary:</strong>
                <p style={{ color: '#64748b', marginTop: '0.2rem' }}>{selectedRecord.clinicalSummary || 'Screened via Clinical AI Vision.'}</p>
              </div>

              <div>
                <strong style={{ color: '#0f172a' }}>Home Care Advice:</strong>
                <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem', color: '#64748b' }}>
                  {(selectedRecord.homeCareAdvice || []).map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                fontSize: '0.8rem',
                color: '#991b1b'
              }}>
                {selectedRecord.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

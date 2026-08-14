import React from 'react';

export default function ActionBottomSheet({ onAction, onClose, selectedPin, onDeletePin }) {
  return (
    <div className="bottom-sheet">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1E293B' }}>{selectedPin ? '記録を編集' : '活動を記録'}</h3>
        {onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', lineHeight: 1, padding: '0.5rem', margin: '-0.5rem', cursor: 'pointer', color: '#64748B' }}>
            &times;
          </button>
        )}
      </div>
      <div className="action-grid">
        <button className="action-btn btn-absent" onClick={() => onAction('absent')}>
          留守（チラシ投函）
        </button>
        <button className="action-btn btn-talked" onClick={() => onAction('talked')}>
          ご挨拶できた
        </button>
        <button className="action-btn btn-poster" onClick={() => onAction('poster')}>
          ポスター貼付
        </button>
        <button className="action-btn btn-speech" onClick={() => onAction('speech')}>
          街頭演説
        </button>
        <button className="action-btn btn-station-flyer" onClick={() => onAction('station_flyer')}>
          駅頭ビラ配り
        </button>
        <button className="action-btn btn-tsujidachi" onClick={() => onAction('tsujidachi')}>
          辻立ち（交差点等）
        </button>
      </div>

      {selectedPin && (
        <button 
          onClick={() => {
            if (window.confirm('この記録を削除しますか？')) {
              onDeletePin(selectedPin.id);
            }
          }}
          style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', border: '1px solid #FCA5A5', fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          🗑️ この記録を削除
        </button>
      )}
    </div>
  );
}

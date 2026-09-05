import React from 'react';
import { Mail, Users, Pin, Megaphone, FileText, UserCheck, Trash2, X, PlusCircle } from 'lucide-react';

export default function ActionBottomSheet({ onAction, onClose, selectedPin, onDeletePin, isExpanded, onToggleExpand }) {
  if (!isExpanded) {
    return (
      <div 
        className="bottom-sheet tap-scale" 
        style={{ padding: '0.65rem 1.25rem 1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={onToggleExpand}
      >
        <div className="sheet-grabber-bar" />
        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> 活動を記録する（タップで開く）
        </div>
      </div>
    );
  }

  return (
    <div className="bottom-sheet">
      <div className="sheet-grabber-bar" onClick={onToggleExpand} style={{ cursor: 'pointer' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
          {selectedPin ? '記録を編集' : '活動内容を選択してピン留め'}
        </h3>
        <button 
          onClick={onClose} 
          style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', transition: 'all 0.2s' }}
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
      </div>

      <div className="action-grid-clean">
        <button className="action-btn-clean tap-scale" onClick={() => onAction('absent')}>
          <div className="action-btn-icon-box" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <Mail size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>留守</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>チラシ投函</div>
          </div>
        </button>

        <button className="action-btn-clean tap-scale" onClick={() => onAction('talked')}>
          <div className="action-btn-icon-box" style={{ background: '#FFF7ED', color: '#EA580C' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>対話・ご挨拶</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>有権者と会話</div>
          </div>
        </button>

        <button className="action-btn-clean tap-scale" onClick={() => onAction('poster')}>
          <div className="action-btn-icon-box" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            <Pin size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>ポスター貼付</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>掲示完了箇所</div>
          </div>
        </button>

        <button className="action-btn-clean tap-scale" onClick={() => onAction('station_flyer')}>
          <div className="action-btn-icon-box" style={{ background: '#F0F9FF', color: '#0284C7' }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>駅頭ビラ配り</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>チラシ手渡し</div>
          </div>
        </button>

        <button className="action-btn-clean tap-scale" onClick={() => onAction('speech')}>
          <div className="action-btn-icon-box" style={{ background: '#FAF5FF', color: '#7C3AED' }}>
            <Megaphone size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>街頭演説</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>スポット演説</div>
          </div>
        </button>

        <button className="action-btn-clean tap-scale" onClick={() => onAction('tsujidachi')}>
          <div className="action-btn-icon-box" style={{ background: '#F0FDFA', color: '#0D9488' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>辻立ち</div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>交差点・駅立ち</div>
          </div>
        </button>
      </div>

      {selectedPin && (
        <button 
          onClick={() => {
            if (window.confirm('この記録を削除しますか？')) {
              onDeletePin(selectedPin.id);
            }
          }}
          className="tap-scale"
          style={{ width: '100%', marginTop: '1.25rem', padding: '0.875rem', background: '#FEF2F2', color: '#DC2626', borderRadius: 'var(--radius-md)', border: '1px solid #FECACA', fontWeight: 800, fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <Trash2 size={18} /> この記録を削除する
        </button>
      )}
    </div>
  );
}

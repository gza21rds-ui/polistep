import React, { useEffect, useState } from 'react';

export default function PoliDashCrossSellBanner({ visible, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, 8000); // 8秒間表示
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#FEF2F2',
      border: '2px solid #DC2626',
      borderRadius: '1rem',
      padding: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 100,
      width: '90%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, color: '#991B1B', fontSize: '1rem' }}>ポスター貼りの人手が足りないですか？</h3>
        <button onClick={() => { setShow(false); onClose(); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>&times;</button>
      </div>
      <p style={{ margin: 0, color: '#7F1D1D', fontSize: '0.875rem' }}>
        ポスター貼りは PoliDash にお任せください。最短で即日対応可能です。
      </p>
      <button 
        style={{
          background: '#DC2626',
          color: 'white',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onClick={() => {
          window.open('https://polidash.com', '_blank');
          setShow(false);
          onClose();
        }}
      >
        詳しく見る
      </button>
    </div>
  );
}

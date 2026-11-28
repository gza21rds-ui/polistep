import React, { useState, useEffect } from 'react';
import { buildPoliStepUtmUrl, trackEvent } from '../lib/analytics';

export default function PoliDashCrossSellBanner({ onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner after 2 seconds to not overwhelm user immediately
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 'max(4.5rem, calc(env(safe-area-inset-top) + 3rem))',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#F0F9FF',
      border: '2px solid #BAE6FD',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
      width: '90%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: '#0369A1', fontSize: '1rem' }}>政治活動において、効率的にポスター貼りしませんか？</h3>
          <p style={{ margin: '4px 0 0', color: '#0C4A6E', fontSize: '0.85rem' }}>
            本番用ポスター地図作成・経路最適化アプリ「PoliDash」で、ポスター貼りを劇的に効率化。
          </p>
        </div>
        <button onClick={() => { setShow(false); onClose(); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>&times;</button>
      </div>
      <button 
        style={{
          background: '#0284C7',
          color: 'white',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
        onClick={() => {
          const url = buildPoliStepUtmUrl('https://polidash.jp/', 'in_app_cross_sell_banner', 'poster_cross_sell');
          trackEvent('ecosystem_outbound_click', {
            event_category: 'ecosystem',
            target_product: 'polidash',
            cta_location: 'in_app_cross_sell_banner',
            link_url: url,
          });
          window.open(url, '_blank', 'noopener,noreferrer');
          setShow(false);
          onClose();
        }}
      >
        PoliDash を確認する
      </button>
    </div>
  );
}

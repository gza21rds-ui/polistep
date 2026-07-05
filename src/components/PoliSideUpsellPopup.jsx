import React from 'react';

export default function PoliSideUpsellPopup({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="overlay">
      <div className="modal-content">
        <h2 className="modal-title">活動データが蓄積されました！</h2>
        <p className="modal-desc">
          アクションログが1,000件を突破しました。<br />
          PoliSideの専門チームが、蓄積されたデータを元に無料で作戦を分析・提案します。
        </p>
        <button 
          className="primary-btn" 
          onClick={() => {
            window.open('https://poliside.net', '_blank');
            onClose();
          }}
        >
          無料分析を予約する
        </button>
        <button className="close-btn" onClick={onClose}>
          今はしない
        </button>
      </div>
    </div>
  );
}

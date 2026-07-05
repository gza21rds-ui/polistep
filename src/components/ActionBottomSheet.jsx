import React from 'react';

export default function ActionBottomSheet({ onAction }) {
  return (
    <div className="bottom-sheet">
      <div className="action-grid">
        <button className="action-btn btn-absent" onClick={() => onAction('absent')}>
          留守
        </button>
        <button className="action-btn btn-flyer" onClick={() => onAction('flyer')}>
          チラシ投函
        </button>
        <button className="action-btn btn-talked" onClick={() => onAction('talked')}>
          対話できた
        </button>
        <button className="action-btn btn-poster" onClick={() => onAction('poster')}>
          有力・ポスター
        </button>
      </div>
    </div>
  );
}

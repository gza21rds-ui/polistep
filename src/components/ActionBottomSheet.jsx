import React from 'react';

export default function ActionBottomSheet({ onAction }) {
  return (
    <div className="bottom-sheet">
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
      </div>
    </div>
  );
}

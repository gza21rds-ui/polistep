import React, { useEffect } from 'react';
import { Undo } from 'lucide-react';

export default function UndoSnackbar({ onUndo, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // 5秒で自動的に消える
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="snackbar">
      <span>アクションを記録しました</span>
      <button onClick={onUndo} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Undo size={16} /> 取り消し
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthScreen() {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/staff');
    }
  };

  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link to="/" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '1rem', border: 'none', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={20} /> 戻る
        </Link>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 className="logo-text" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          Welcome to PoliStep
        </h2>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#F1F5F9', padding: '0.375rem', borderRadius: '9999px' }}>
          <button 
            type="button"
            className={`btn-premium`}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              fontSize: '1rem', 
              background: role === 'admin' ? 'var(--grad-text)' : 'transparent',
              color: role === 'admin' ? 'white' : '#64748B',
              boxShadow: role === 'admin' ? 'var(--shadow-btn)' : 'none',
            }}
            onClick={() => setRole('admin')}
          >
            管理者（候補者）
          </button>
          <button 
            type="button"
            className={`btn-premium`}
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              fontSize: '1rem', 
              background: role === 'staff' ? 'var(--grad-text)' : 'transparent',
              color: role === 'staff' ? 'white' : '#64748B',
              boxShadow: role === 'staff' ? 'var(--shadow-btn)' : 'none',
            }}
            onClick={() => setRole('staff')}
          >
            スタッフ参加
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {role === 'admin' ? (
            <div style={{ animation: 'popIn 0.3s ease-out' }}>
              <input type="text" placeholder="電話番号またはメールアドレス" className="input-premium" style={{ marginBottom: '1.25rem' }} required />
              <input type="password" placeholder="パスワード" className="input-premium" required />
            </div>
          ) : (
            <div style={{ animation: 'popIn 0.3s ease-out' }}>
              <input type="text" placeholder="あなたの表示名（例: 田中）" className="input-premium" style={{ marginBottom: '1.25rem' }} required />
              <input type="text" placeholder="招待コード" className="input-premium" required />
            </div>
          )}
          
          <button type="submit" className="btn-premium" style={{ marginTop: '1rem', width: '100%' }}>
            {role === 'admin' ? 'ログイン' : '参加をリクエスト'}
          </button>
        </form>
      </div>
    </div>
  );
}

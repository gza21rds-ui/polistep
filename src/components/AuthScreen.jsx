import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('admin'); // For signup only
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- ログイン処理 ---
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // ユーザーの権限を取得
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (userError) throw userError;

        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/staff');
        }
      } else {
        // --- 新規登録処理 ---
        if (role === 'staff' && !teamId) {
          throw new Error('スタッフ登録には招待コード（チームID）が必要です。');
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // usersテーブルに情報を登録
          const newTeamId = role === 'admin' ? authData.user.id : teamId;
          const { error: insertError } = await supabase.from('users').insert({
            id: authData.user.id,
            role: role,
            display_name: displayName || (role === 'admin' ? '管理者' : 'スタッフ'),
            team_id: newTeamId,
          });

          if (insertError) throw insertError;

          // 登録後、自動的にリダイレクト
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/staff');
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        <Link to="/" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '1rem', border: 'none', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}>
          <ArrowLeft size={20} /> 戻る
        </Link>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', marginTop: '3rem' }}>
        <h2 className="logo-text" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>
          Welcome to PoliStep
        </h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => setIsLogin(true)}
            style={{ fontWeight: isLogin ? 'bold' : 'normal', borderBottom: isLogin ? '2px solid var(--primary-dark)' : 'none', paddingBottom: '0.5rem', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ログイン
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(false)}
            style={{ fontWeight: !isLogin ? 'bold' : 'normal', borderBottom: !isLogin ? '2px solid var(--primary-dark)' : 'none', paddingBottom: '0.5rem', background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            新規登録
          </button>
        </div>

        {!isLogin && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#F1F5F9', padding: '0.375rem', borderRadius: '9999px' }}>
            <button 
              type="button"
              className={`btn-premium`}
              style={{ 
                flex: 1, 
                padding: '0.6rem', 
                fontSize: '0.9rem', 
                background: role === 'admin' ? 'var(--grad-text)' : 'transparent',
                color: role === 'admin' ? 'white' : '#64748B',
                boxShadow: role === 'admin' ? 'var(--shadow-btn)' : 'none',
              }}
              onClick={() => setRole('admin')}
            >
              管理者
            </button>
            <button 
              type="button"
              className={`btn-premium`}
              style={{ 
                flex: 1, 
                padding: '0.6rem', 
                fontSize: '0.9rem', 
                background: role === 'staff' ? 'var(--grad-text)' : 'transparent',
                color: role === 'staff' ? 'white' : '#64748B',
                boxShadow: role === 'staff' ? 'var(--shadow-btn)' : 'none',
              }}
              onClick={() => setRole('staff')}
            >
              スタッフ
            </button>
          </div>
        )}

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ animation: 'popIn 0.3s ease-out' }}>
            <input 
              type="email" 
              placeholder="メールアドレス" 
              className="input-premium" 
              style={{ marginBottom: '1.25rem' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <input 
              type="password" 
              placeholder="パスワード (6文字以上)" 
              className="input-premium" 
              style={{ marginBottom: isLogin ? '0' : '1.25rem' }} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            {!isLogin && (
              <>
                <input 
                  type="text" 
                  placeholder="表示名（例: 田中）" 
                  className="input-premium" 
                  style={{ marginBottom: '1.25rem' }} 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required 
                />
                {role === 'staff' && (
                  <input 
                    type="text" 
                    placeholder="招待コード（チームID）" 
                    className="input-premium" 
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    required 
                  />
                )}
              </>
            )}
          </div>
          
          <button type="submit" className="btn-premium" style={{ marginTop: '1rem', width: '100%' }} disabled={loading}>
            {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録して始める')}
          </button>
        </form>
      </div>
    </div>
  );
}

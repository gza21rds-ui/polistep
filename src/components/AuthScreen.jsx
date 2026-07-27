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

          // Slack通知APIの呼び出し（失敗しても登録処理は続行させるためエラーは握り潰す）
          try {
            await fetch('/api/notify-slack', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email,
                displayName: displayName || (role === 'admin' ? '管理者' : 'スタッフ'),
                role: role
              })
            });
          } catch (notifyErr) {
            console.error('Slack通知の送信に失敗しました:', notifyErr);
          }

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
    <div className="auth-page-container">
      {/* ===== 左側: ビジュアルエリア (PCのみ) ===== */}
      <div className="auth-visual-side">
        <img src="/hero-yorisoi.jpg" alt="PoliStep ボランティア" className="auth-visual-img" />
        <div className="auth-logo">PoliStep</div>
        <div className="auth-quote-box">
          <div className="auth-quote">チームの力が、<br/>地域を変える。</div>
          <div className="auth-quote-author">ドブ板選挙の完全可視化ツール</div>
        </div>
      </div>

      {/* ===== 右側: フォームエリア ===== */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back-btn">
          <ArrowLeft size={18} /> ホームへ戻る
        </Link>
        
        <div className="auth-form-wrapper">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'アカウントにログインして活動を始めましょう。' : 'アカウントを作成してチームに参加しましょう。'}
          </p>

          <div className="auth-toggle-group">
            <button 
              type="button" 
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              ログイン
            </button>
            <button 
              type="button" 
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              新規登録
            </button>
          </div>

          {!isLogin && (
            <div className="auth-toggle-group" style={{ background: '#F1F5F9', marginBottom: '1.5rem' }}>
              <button 
                type="button"
                className={`auth-toggle-btn ${role === 'admin' ? 'active' : ''}`}
                style={role === 'admin' ? { background: 'var(--primary)', color: 'white' } : {}}
                onClick={() => setRole('admin')}
              >
                管理者として登録
              </button>
              <button 
                type="button"
                className={`auth-toggle-btn ${role === 'staff' ? 'active' : ''}`}
                style={role === 'staff' ? { background: 'var(--primary)', color: 'white' } : {}}
                onClick={() => setRole('staff')}
              >
                スタッフとして登録
              </button>
            </div>
          )}

          {error && (
            <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
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
            
            <button type="submit" className="btn-premium" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録して始める')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('mode') !== 'register';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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

        navigate('/admin');
      } else {
        // --- 新規登録処理（管理者のみ） ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // usersテーブルに情報を登録（team_id = 自分のID）
          const { error: insertError } = await supabase.from('users').insert({
            id: authData.user.id,
            role: 'admin',
            display_name: displayName || '管理者',
            team_id: authData.user.id,
          });

          if (insertError) throw insertError;

          // Slack通知APIの呼び出し
          try {
            await fetch('/api/notify-slack', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: email,
                displayName: displayName || '管理者',
                role: 'admin'
              })
            });
          } catch (notifyErr) {
            console.error('Slack通知の送信に失敗しました:', notifyErr);
          }

          navigate('/onboarding');
        }
      }
    } catch (err) {
      console.error(err);
      // エラーメッセージの日本語化
      let errorMsg = err.message || 'エラーが発生しました。';
      if (errorMsg.includes('Failed to fetch')) {
        errorMsg = 'サーバーとの通信に失敗しました。環境変数（VITE_SUPABASE_URL等）が正しく設定されていないか、ネットワークエラーです。';
      } else if (errorMsg.includes('Invalid login credentials')) {
        errorMsg = 'メールアドレスまたはパスワードが間違っています。';
      } else if (errorMsg.includes('User already registered')) {
        errorMsg = 'このメールアドレスは既に登録されています。';
      } else if (errorMsg.includes('Password should be at least 6 characters')) {
        errorMsg = 'パスワードは6文字以上で入力してください。';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* ===== 左側: ビジュアルエリア (PCのみ) ===== */}
      <div className="auth-visual-side">
        <img src="/hero_map_visual.jpg" alt="PoliStep ボランティア" className="auth-visual-img" />
        <div className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/polistep_logo_new.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          PoliStep
        </div>
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
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : '候補者アカウント作成'}</h2>
          <p className="auth-subtitle">
            {isLogin ? 'アカウントにログインしてダッシュボードを確認しましょう。' : '候補者としてアカウントを作成し、チームの活動を管理しましょう。'}
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
                <input 
                  type="text" 
                  placeholder="候補者名（例: 田中太郎）" 
                  className="input-premium" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required 
                />
              )}
            </div>
            
            <button type="submit" className="btn-premium" style={{ marginTop: '0.5rem' }} disabled={loading}>
              {loading ? '処理中...' : (isLogin ? 'ログイン' : '登録して始める')}
            </button>
          </form>

          {!isLogin && (
            <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center', lineHeight: 1.6 }}>
              ※ スタッフの方は登録不要です。候補者から共有されたマップURLに直接アクセスしてください。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useNoIndex from '../hooks/useNoIndex';

export default function AuthScreen() {
  useNoIndex();
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
          <div className="auth-quote-author">ドブ板活動の完全可視化ツール</div>
        </div>
      </div>

      {/* ===== 右側: フォームエリア ===== */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back-btn tap-scale" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)', padding: '0.5rem 1rem', borderRadius: '9999px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', color: '#334155', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={16} /> ホームへ
        </Link>
        
        <div className="auth-form-wrapper" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
          
          {/* モバイル用ロゴ表示 */}
          <div className="auth-mobile-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <img src="/polistep_logo_new.jpg" alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>PoliStep</span>
          </div>

          <h2 className="auth-title" style={{ textAlign: 'center', fontSize: '1.75rem' }}>
            {isLogin ? 'おかえりなさい 👋' : '候補者アカウント作成 ✨'}
          </h2>
          <p className="auth-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#64748B', lineHeight: 1.6 }}>
            {isLogin ? 'アカウントにログインして、本日の活動を開始しましょう。' : '候補者としてチームの活動をデジタル化し、効率的に管理しましょう。'}
          </p>

          <div className="auth-toggle-group" style={{ marginBottom: '2rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: '12px' }}>
            <button 
              type="button" 
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
              style={{ borderRadius: '10px', fontWeight: 700 }}
            >
              ログイン
            </button>
            <button 
              type="button" 
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
              style={{ borderRadius: '10px', fontWeight: 700 }}
            >
              新規登録
            </button>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #FECACA', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'shake 0.4s ease-in-out' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ animation: 'popIn 0.3s ease-out' }}>
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <input 
                  type="email" 
                  placeholder="メールアドレス" 
                  className="input-premium" 
                  style={{ width: '100%', paddingLeft: '1rem' }} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div style={{ position: 'relative', marginBottom: isLogin ? '0' : '1.25rem' }}>
                <input 
                  type="password" 
                  placeholder="パスワード (6文字以上)" 
                  className="input-premium" 
                  style={{ width: '100%', paddingLeft: '1rem' }} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              {!isLogin && (
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="候補者名（例: 田中太郎）" 
                    className="input-premium" 
                    style={{ width: '100%', paddingLeft: '1rem' }} 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required 
                  />
                </div>
              )}
            </div>
            
            <button type="submit" className="btn-premium tap-scale" style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', boxShadow: '0 8px 20px -4px rgba(37,99,235,0.3)' }} disabled={loading}>
              {loading ? '処理中...' : (isLogin ? 'ログインする' : '登録して始める')}
            </button>
          </form>

          {!isLogin && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                💡 <strong>ボランティアスタッフの方へ</strong><br/>
                スタッフはアカウント登録不要です。<br/>候補者から共有されたマップURLに直接アクセスしてください。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

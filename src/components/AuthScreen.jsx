import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, CheckCircle2, Users, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useNoIndex from '../hooks/useNoIndex';

export default function AuthScreen() {
  useNoIndex();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isLogin = mode !== 'register';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleMode = (loginMode) => {
    setError(null);
    setSearchParams({ mode: loginMode ? 'login' : 'register' });
  };

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

        if (userData.role === 'staff') {
          navigate('/staff');
        } else {
          navigate('/admin');
        }
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

          // GA Event Trigger (Conversion)
          if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'sign_up', {
              event_category: 'conversion',
              method: 'email'
            });
          }

          // Slack通知の送信
          const notifySlack = async () => {
            const payload = {
              email: email,
              displayName: displayName || '管理者',
              role: 'admin'
            };
            try {
              const res = await fetch('/api/notify-slack', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (!res.ok) throw new Error('API route failed');
            } catch (err) {
              try {
                const webhookUrl = atob("aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDBCS1k2UkhZNjUvQjBCTFFLQzU5SkwvQ1FSblVRM3NDZm03VlRvMWVzb0NwQlpZ");
                await fetch(webhookUrl, {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    text: `🎉 *PoliStepに新しいユーザーが登録されました！*\n・名前: ${displayName || '未設定'}\n・権限: 管理者\n・メールアドレス: ${email}`
                  })
                });
              } catch (directErr) {
                console.error('Direct Slack webhook failed:', directErr);
              }
            }
          };
          notifySlack();

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
        <img src="/auth_visual_modern.jpg" alt="PoliStep 活動マップ" className="auth-visual-img" />
        <div className="auth-visual-overlay"></div>

        {/* 上部ロゴ */}
        <Link to="/" className="auth-logo tap-scale" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
          <img src="/polistep_logo_new.jpg" alt="Logo" style={{ width: '38px', height: '38px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }} />
          <span>PoliStep</span>
        </Link>

        {/* 下部メッセージ＆ハイライト */}
        <div className="auth-quote-box">
          <div className="auth-quote-badge">
            <Sparkles size={14} />
            <span>2027年 統一地方選 応援中 · 完全0円</span>
          </div>
          <div className="auth-quote">
            チームの歩みが、<br/>地域を変える。
          </div>
          <div className="auth-quote-author">
            ドブ板活動をデジタル地図とデータで可視化し、<br/>陣営の一体感と推進力を最大化する政治活動DXツール。
          </div>

          <div className="auth-feature-pills">
            <span className="auth-pill-item">
              <CheckCircle2 size={13} color="#60A5FA" /> GPSリアルタイム同期
            </span>
            <span className="auth-pill-item">
              <CheckCircle2 size={13} color="#60A5FA" /> 目標自動逆算
            </span>
            <span className="auth-pill-item">
              <CheckCircle2 size={13} color="#60A5FA" /> 日報画像ワンタップ生成
            </span>
          </div>
        </div>
      </div>

      {/* ===== 右側: フォームエリア ===== */}
      <div className="auth-form-side">
        <Link to="/" className="auth-back-btn tap-scale">
          <ArrowLeft size={16} /> ホームへ
        </Link>
        
        <div className="auth-form-wrapper">
          
          {/* モバイル用ロゴ表示 */}
          <div className="auth-mobile-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <img src="/polistep_logo_new.jpg" alt="Logo" style={{ width: '44px', height: '44px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>PoliStep</span>
          </div>

          <h2 className="auth-title" style={{ textAlign: 'center' }}>
            {isLogin ? 'おかえりなさい 👋' : '管理者アカウント作成 ✨'}
          </h2>
          <p className="auth-subtitle" style={{ textAlign: 'center' }}>
            {isLogin ? 'アカウントにログインして、本日の活動を開始しましょう。' : '陣営の代表者としてチームをデジタル化し、効率的に管理しましょう。'}
          </p>

          <div className="auth-toggle-group">
            <button 
              type="button" 
              className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => handleToggleMode(true)}
            >
              <LogIn size={15} /> ログイン
            </button>
            <button 
              type="button" 
              className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => handleToggleMode(false)}
            >
              <UserPlus size={15} /> 新規登録
            </button>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '0.875rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #FECACA', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', animation: 'shake 0.4s ease-in-out' }}>
              <span style={{ flexShrink: 0, marginTop: '2px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* メールアドレス入力 */}
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                placeholder="メールアドレス" 
                className="input-premium has-icon" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                required 
              />
            </div>

            {/* パスワード入力 */}
            <div className="auth-input-container">
              <span className="auth-input-icon">
                <Lock size={18} />
              </span>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder={isLogin ? "パスワード" : "パスワード (6文字以上)"} 
                className="input-premium has-icon has-toggle" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={isLogin ? undefined : 6}
                required 
              />
              <button
                type="button"
                className="auth-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* 候補者・代表者名入力（新規登録時のみ） */}
            {!isLogin && (
              <div className="auth-input-container" style={{ animation: 'popIn 0.25s ease-out' }}>
                <span className="auth-input-icon">
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  placeholder="代表者・候補者名（例: 山田太郎）" 
                  className="input-premium has-icon" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="name"
                  required 
                />
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-premium tap-scale" 
              style={{ marginTop: '0.5rem' }} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>処理中...</span>
                </>
              ) : (
                isLogin ? 'ログインする' : '登録して始める'
              )}
            </button>

            {!isLogin && (
              <p style={{ fontSize: '0.78rem', color: '#64748B', textAlign: 'center', marginTop: '0.85rem', lineHeight: 1.5 }}>
                アカウント作成により、
                <Link to="/terms" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>利用規約</Link>
                および
                <Link to="/privacy" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>プライバシーポリシー</Link>
                に同意したものとみなされます。
              </p>
            )}
          </form>

          {/* ボランティアスタッフ向けガイダンス */}
          <div style={{ marginTop: '2rem', padding: '1rem 1.15rem', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.45rem', borderRadius: '8px', flexShrink: 0 }}>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5 }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.2rem', fontSize: '0.85rem' }}>ボランティアスタッフの方へ</strong>
              スタッフのアカウント登録は不要です。陣営の管理者から共有された専用マップURLに直接アクセスしてください。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

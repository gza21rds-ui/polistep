import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, BarChart2, Share2, CheckCircle2, Sparkles, MapPin, X } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [lineGuideModal, setLineGuideModal] = useState(false);

  useEffect(() => { 
    // LINEアプリ内ブラウザ（またはLIFF）でアクセスされた場合
    const isLine = typeof navigator !== 'undefined' && /Line\//i.test(navigator.userAgent);
    const lastTeamId = localStorage.getItem('polistep_last_team_id');

    if (isLine) {
      if (lastTeamId) {
        // 過去に参加したチームマップへ直行！
        navigate(`/m/${lastTeamId}`, { replace: true });
        return;
      } else {
        // LINE内なのにチーム未設定の場合、案内モーダルを表示
        setLineGuideModal(true);
      }
    }

    window.scrollTo(0, 0); 
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div className="page-container" style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', paddingBottom: showFloatingCta ? '70px' : '0' }}>
      {/* ===== Header ===== */}
      <header className="glass-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1.25rem' }}>
        <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 900 }}>
          <img src="/polistep_logo_new.jpg" alt="PoliStep Logo" style={{ width: '30px', height: '30px', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} />
          PoliStep
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/auth?mode=login" className="btn-outline tap-scale" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
            ログイン
          </Link>
          <Link to="/auth?mode=register" className="btn-primary tap-scale" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
            無料で始める <ArrowRight size={14} className="desktop-only" />
          </Link>
        </div>
      </header>

      {/* ===== Hero (Japanese Volunteer Style) ===== */}
      <div className="hero-wrapper">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="badge-pulse-dot"></span>
              <span className="badge-text">2027年 統一地方選挙 応援キャンペーン中</span>
              <span className="badge-highlight">完全0円</span>
            </div>
            <h1 className="hero-title">
              孤独なドブ板は、<br/><span className="text-gradient-animated">可視化</span>で終わる。
            </h1>
            <p className="hero-subtitle">
              終わりの見えないポスター貼りや戸別訪問。<br/>
              タップ一つであなたの活動をマップとグラフに変換し、<br/>
              自身のモチベーション維持と、チームへの日報共有を圧倒的に簡単にします。
            </p>
            <div className="hero-cta-group">
              <Link to="/auth?mode=register" className="btn-primary hero-btn-glow tap-scale">
                無料でアカウント作成 <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="hero-visual-container">
            {/* シネマティックなアンビエント光彩 */}
            <div className="ambient-glow"></div>

            {/* 洗練された極薄ベゼル・シネマフレーム */}
            <div className="cinema-video-frame">
              <div className="frame-header-minimal">
                <div className="window-dots">
                  <span className="window-dot dot-red"></span>
                  <span className="window-dot dot-yellow"></span>
                  <span className="window-dot dot-green"></span>
                </div>
              </div>
              <div className="video-aspect-box">
                <iframe 
                  className="hero-iframe"
                  src="https://www.youtube.com/embed/1LqbyVq2ByY?autoplay=1&mute=1&rel=0&playsinline=1" 
                  title="PoliStep 紹介動画" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Photo Story (Modern Journey Grid) ===== */}
      <section className="section" style={{ background: 'var(--bg-main)', padding: '6rem 1.5rem' }}>
        <div className="section-inner" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <div className="section-label" style={{ margin: '0 auto 1rem', background: '#DBEAFE', color: '#1D4ED8' }}>Story</div>
          <h2 className="section-title">政治活動の「見えない不安」を打ち破る</h2>
          <p className="section-desc" style={{ margin: '0 auto', fontSize: '1.05rem', color: '#475569' }}>
            果てしないドブ板活動。いつまでに、何をすべきか。<br className="desktop-only" />
            PoliStepがあなたの活動を可視化し、ゴールへの羅針盤になります。
          </p>
        </div>

        <div className="story-grid">
          {/* Scene 1 */}
          <div className="story-card story-card-before">
            <div className="story-card-img-wrap">
              <img src="/story1_anxiety.jpg" alt="夕暮れの住宅街で紙の地図を見て途方に暮れる" className="story-card-img" />
              <div className="story-step-badge" style={{ background: '#334155', color: '#F8FAFC' }}>STEP 01 · 課題</div>
            </div>
            <div className="story-card-body">
              <h3 className="story-card-title">「このペースで、本当に間に合うのか…？」</h3>
              <p className="story-card-desc">
                紙の地図と勘だけが頼りの活動では、ゴールが見えず常に漠然とした不安がつきまといます。自分が今日どれだけ進んだのかも分からず、焦りだけが募る日々。
              </p>
            </div>
          </div>

          {/* Scene 2 */}
          <div className="story-card">
            <div className="story-card-img-wrap">
              <img src="/story2_clarity.jpg" alt="夜の街でスマホのPoliStepアプリを操作" className="story-card-img" />
              <div className="story-step-badge" style={{ background: '#2563EB', color: '#FFFFFF' }}>STEP 02 · 逆算計画</div>
            </div>
            <div className="story-card-body">
              <h3 className="story-card-title">目標日からの逆算で、1日のノルマが明確に</h3>
              <p className="story-card-desc">
                PoliStepに決戦日と目標支持者数を入力すると、1日に必要な訪問件数やチラシ配布枚数を自動計算。今日やるべき行動量がクリアになり、迷いが自信に変わります。
              </p>
            </div>
          </div>

          {/* Scene 3 */}
          <div className="story-card">
            <div className="story-card-img-wrap">
              <img src="/story3_map.jpg" alt="スマホの画面を支援者に見せる" className="story-card-img" />
              <div className="story-step-badge" style={{ background: '#2563EB', color: '#FFFFFF' }}>STEP 03 · 日々の可視化</div>
            </div>
            <div className="story-card-body">
              <h3 className="story-card-title">歩いた軌跡が「ピン」と「達成率（％）」に</h3>
              <p className="story-card-desc">
                歩いた場所をタップするだけで、地図が鮮やかなピンで埋まり、ダッシュボードの進捗バーがぐんぐん伸びる。「あと少しで今日クリアだ」と、足が自然と前へ進みます。
              </p>
            </div>
          </div>

          {/* Scene 4 */}
          <div className="story-card story-card-success">
            <div className="story-card-img-wrap">
              <img src="/story4_success.jpg" alt="チーム全員でスマホを持ち笑顔で歩く" className="story-card-img" />
              <div className="story-step-badge" style={{ background: '#16A34A', color: '#FFFFFF' }}>STEP 04 · 達成と団結</div>
            </div>
            <div className="story-card-body">
              <h3 className="story-card-title">「やり切った！」確信とチームの一体感</h3>
              <p className="story-card-desc">
                蓄積された活動ログは、自動で美しいSNS・日報画像に変換。毎晩チームのLINEグループで共有することで、陣営全体のモチベーションと結束力が爆発的に高まります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4つの特徴 (Bento Grid) ===== */}
      <section className="section" style={{ background: '#FFFFFF', padding: '6rem 2rem' }}>
        <div className="section-inner" style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <div className="section-label" style={{ margin: '0 auto 1rem' }}>Features</div>
          <h2 className="section-title">活動のすべてを、手のひらで最大化する</h2>
          <p className="section-desc" style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            現場で歩くスタッフから、戦略を練る管理者まで。全員が迷わず動ける機能群を搭載。
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento 1 (Span 8): 直感タップ記録 */}
          <div className="bento-card bento-span-8">
            <div className="bento-card-header">
              <div className="bento-pill-tag" style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                直感的な現場操作
              </div>
              <h3 className="bento-card-title">片手で瞬時に記録。有権者の声も逃さない</h3>
              <p className="bento-card-desc">
                歩きながらでも迷わず操作。「留守」「対話」「ポスター」に加え、「街頭演説」「ビラ配り」もワンタップ。対話時にはメモや写真もその場で添付できます。
              </p>
            </div>
            <div className="bento-card-visual">
              <img src="/feature_map_blue.jpg" alt="PoliStepのマップ画面" />
            </div>
          </div>

          {/* Bento 2 (Span 4): 目標逆算 */}
          <div className="bento-card bento-span-4">
            <div className="bento-card-header">
              <div className="bento-pill-tag" style={{ background: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' }}>
                逆算プランニング
              </div>
              <h3 className="bento-card-title">1日のノルマを自動算出</h3>
              <p className="bento-card-desc">
                目標日と目標数から「今日何件回るべきか」を自動逆算。達成率がリアルタイムで可視化されます。
              </p>
            </div>
            <div className="bento-card-visual">
              <img src="/feature_dashboard_jp.jpg" alt="PoliStepのダッシュボード画面" />
            </div>
          </div>

          {/* Bento 3 (Span 4): 日報画像自動生成 */}
          <div className="bento-card bento-span-4">
            <div className="bento-card-header">
              <div className="bento-pill-tag" style={{ background: '#FAF5FF', color: '#7C3AED', border: '1px solid #E9D5FF' }}>
                自動日報合成
              </div>
              <h3 className="bento-card-title">ワンタップで美しい活動レポート</h3>
              <p className="bento-card-desc">
                その日の実績を美しい縦型画像に自動合成。チームのLINEグループやSNSへ即座に共有可能です。
              </p>
            </div>
            <div className="bento-card-visual">
              <img src="/feature_sns_blue.jpg" alt="SNSシェアジェネレーター画面" />
            </div>
          </div>

          {/* Bento 4 (Span 8): チームリアルタイム分担 */}
          <div className="bento-card bento-span-8">
            <div className="bento-card-header">
              <div className="bento-pill-tag" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                リアルタイム同期
              </div>
              <h3 className="bento-card-title">URLを渡すだけ。手分けして一気に地域を制覇</h3>
              <p className="bento-card-desc">
                スタッフはアカウント登録不要。共有URLを開くだけで同一マップ上で活動可能。誰がどこを回ったかが即座に反映され、重複訪問をゼロにします。
              </p>
            </div>
            <div className="bento-card-visual">
              <img src="/feature_team_blue.jpg" alt="リアルタイムな共有イメージ" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Pricing Section (Stripe-Grade Clean Tier Card) ===== */}
      <section className="section" style={{ background: 'var(--bg-main)', textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="section-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-label" style={{ margin: '0 auto 1rem' }}>Pricing</div>
          <h2 className="section-title">2027年 統一地方選挙 応援プラン</h2>
          <p className="section-desc" style={{ color: 'var(--text-muted)' }}>
            地域のために立ち上がる挑戦者を応援するため、現在すべての機能を無料開放しています。
          </p>

          <div className="pricing-tier-card">
            <div className="pricing-badge-pill">
              <span>● 特別応援キャンペーン</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>フルアクセスプラン</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>通常 月額 980円 (税込)</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>
                  ¥0
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-light)', marginLeft: '0.25rem' }}>/ 月</span>
                </div>
              </div>
            </div>

            <div className="pricing-feature-list">
              <div className="pricing-feature-item">
                <CheckCircle2 size={18} color="#16A34A" /> マップGPS無制限ピン打ち（留守・対話・ポスター等）
              </div>
              <div className="pricing-feature-item">
                <CheckCircle2 size={18} color="#16A34A" /> 目標日からの自動逆算ノルマ算出ダッシュボード
              </div>
              <div className="pricing-feature-item">
                <CheckCircle2 size={18} color="#16A34A" /> ボランティアスタッフ無制限招待（登録不要URL共有）
              </div>
              <div className="pricing-feature-item">
                <CheckCircle2 size={18} color="#16A34A" /> 対話メモ・写真添付・タイムライン検索機能
              </div>
              <div className="pricing-feature-item">
                <CheckCircle2 size={18} color="#16A34A" /> チーム日報・SNS報告画像の自動合成機能
              </div>
            </div>

            <Link to="/auth?mode=register" className="btn-primary tap-scale" style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 800, justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
              今すぐ無料でアカウント作成 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PoliSide Ecosystem (姉妹サービス & 専門コンサル) ===== */}
      <section style={{ background: '#FFFFFF', padding: '6rem 2rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="section-label" style={{ margin: '0 auto 1rem' }}>Ecosystem</div>
            <h2 className="section-title">勝利を確実にする「PoliSide」連携</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              アプリによる日々の活動可視化に加え、ポスター最適化やプロの戦略分析で強力にバックアップします。
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* PoliDash */}
            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'inline-block', background: '#DBEAFE', color: '#1D4ED8', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                  SISTER APP
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                  ポスター貼り最適化「PoliDash」
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  公営掲示場へのポスター貼りを最速で完了。掲示場の自動マッピングと巡回ルート最適化により、掲示初日の混乱をゼロにします。
                </p>
              </div>
              <a href="https://polidash.jp" target="_blank" rel="noopener noreferrer" className="btn-outline tap-scale" style={{ textAlign: 'center', textDecoration: 'none', fontWeight: 700, padding: '0.75rem' }}>
                PoliDash を詳しく見る →
              </a>
            </div>

            {/* PoliSide */}
            <div style={{ background: '#0F172A', color: 'white', borderRadius: 'var(--radius-xl)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-lg)' }}>
              <div>
                <div style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem' }}>
                  PREMIUM CONSULTING
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
                  プロの戦略分析「PoliSide」
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  PoliStepに蓄積された活動ログから地域ごとの反応率や死角を徹底分析。専門コンサルタントが必勝の戦略立案をご支援します。
                </p>
              </div>
              <a href="https://poliside.net" target="_blank" rel="noopener noreferrer" className="btn-primary tap-scale" style={{ textAlign: 'center', textDecoration: 'none', fontWeight: 700, padding: '0.75rem', background: '#2563EB' }}>
                専門家に相談する →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer with Legal & Structure ===== */}
      <footer className="footer-clean">
        <div className="footer-inner-clean">
          <div className="footer-disclaimer-box">
            <strong>【法的免責事項およびご利用について】</strong><br />
            ・当サービスは、政治家および立候補予定者の平時における「政治活動（後援会拡大等の日常活動）」の効率化・連絡調整を目的とした業務管理ツールです。公職選挙法で規定される選挙期間中の「選挙運動」を直接的に目的としたサービスではありません。<br />
            ・本来は月額980円の有料サービスですが、2027年の統一地方選挙に向けて今だけ「完全0円」でご提供中です。現在システムは「お試し期間（β版）」であり、万が一の不具合によるデータ消失等について完全な保証はできかねる場合がございます。あらかじめご了承ください。<br />
            ・当サービスのUI/UX、デザイン、および独自の巡回最適化アルゴリズム等の無断複製・リバースエンジニアリング・模倣を固く禁じます。
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 900, color: 'white' }}>
              <img src="/polistep_logo_new.jpg" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
              PoliStep
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
              <Link to="/terms" style={{ color: '#94A3B8', textDecoration: 'none' }}>利用規約</Link>
              <Link to="/privacy" style={{ color: '#94A3B8', textDecoration: 'none' }}>プライバシーポリシー</Link>
              <Link to="/legal" style={{ color: '#94A3B8', textDecoration: 'none' }}>特定商取引法に基づく表記</Link>
              <Link to="/auth" style={{ color: '#94A3B8', textDecoration: 'none' }}>ログイン / 新規登録</Link>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
              &copy; {new Date().getFullYear()} PoliStep. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* ===== Mobile Floating CTA Bar ===== */}
      {showFloatingCta && (
        <div className="mobile-floating-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 800 }}>統一地方選 応援</span>
            <span style={{ fontSize: '0.9rem', color: '#EF4444', fontWeight: 900 }}>完全0円で全機能開放！</span>
          </div>
          <Link to="/auth?mode=register" className="btn-primary tap-scale" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', whiteSpace: 'nowrap' }}>
            無料で始める <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* ===== LINE OA Guidance Modal (If opened without teamId) ===== */}
      {lineGuideModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '28px 24px', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(37,99,235,0.15)' }}>
              <MapPin size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
              チーム専用URLが必要です
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px', textAlign: 'left', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              PoliStepで活動を記録するには、候補者や陣営の管理者から共有された<strong>「マップ専用URL」</strong>を一度タップしてください。<br/><br/>
              一度アクセスすれば、次回からはこのリッチメニューから<strong>自動的にあなたの陣営マップが開く</strong>ようになります！
            </p>
            <button 
              onClick={() => setLineGuideModal(false)}
              className="tap-scale"
              style={{ width: '100%', padding: '14px', background: '#2563EB', color: '#ffffff', border: 'none', borderRadius: '9999px', fontWeight: 800, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', cursor: 'pointer' }}
            >
              閉じる（トップページを見る）
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

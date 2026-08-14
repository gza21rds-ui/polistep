import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, BarChart2, Share2 } from 'lucide-react';

export default function LandingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-container">
      {/* ===== Header ===== */}
      <header className="glass-header">
        <div className="logo-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/polistep_logo_new.jpg" alt="PoliStep Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          PoliStep
        </div>
        <Link to="/auth?mode=login" className="btn-outline">ログイン</Link>
      </header>

      {/* ===== Hero (Japanese Volunteer Style) ===== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="campaign-banner">
            【2027年統一地方選挙 限定】通常有料の全機能を今だけ「完全無料」で解放中！
          </div>
          <h1 className="hero-title">
            孤独なドブ板は、<br/><span className="text-gradient">可視化</span>で終わる。
          </h1>
          <p className="hero-subtitle">
            終わりの見えないポスター貼りや戸別訪問。<br/>
            タップ一つであなたの活動をマップとグラフに変換し、<br/>
            自身のモチベーション維持と、チームへの日報共有を圧倒的に簡単にします。
          </p>
          <div className="hero-cta-group">
            <Link to="/auth?mode=register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              【完全無料】アカウント登録して始める <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="hero-visual-container">
          <img src="/hero_visual_blue.jpg" alt="スマホを見て安心する候補者" className="hero-main-img" />
        </div>
      </section>

      {/* ===== Photo Story ===== */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-label">Story</div>
          <h2 className="section-title">選挙戦の「見えない不安」を打ち破る</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            果てしないドブ板活動。いつまでに、何をすべきか。PoliStepがあなたの羅針盤になります。
          </p>
        </div>

        <div className="comic-grid">
          {/* Scene 1 */}
          <div className="comic-panel">
            <img src="/story1_anxiety.jpg" alt="夕暮れの住宅街で紙の地図を見て途方に暮れる" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">「このペースで、本当に間に合うのか…？」<br/>紙の地図と勘だけが頼りの活動では、ゴールが見えず、常に漠然とした不安がつきまといます。</div>
            </div>
          </div>
          {/* Scene 2 */}
          <div className="comic-panel">
            <img src="/story2_clarity.jpg" alt="夜の街でスマホのPoliStepアプリを操作" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">PoliStepに目標を入力すると、1日に必要な「活動件数」が自動計算。今日やるべき行動計画が明確になり、迷いが消え去ります。</div>
            </div>
          </div>
          {/* Scene 3 */}
          <div className="comic-panel">
            <img src="/story3_map.jpg" alt="スマホの画面を支援者に見せる" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">毎日歩いた軌跡が、色鮮やかなピンと進捗率（％）に変わる。「今日はあと30件だ」。可視化された数字が、疲れた足を前へと進ませます。</div>
            </div>
          </div>
          {/* Scene 4 */}
          <div className="comic-panel">
            <img src="/story4_success.jpg" alt="チーム全員でスマホを持ち笑顔で歩く" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-dialogue" style={{ fontSize: '1.25rem', textAlign: 'center', background: 'transparent', border: 'none' }}>迷いなく、やり切った。</div>
              <div className="comic-narration" style={{ textAlign: 'center' }}>明確な計画のもと蓄積された膨大な記録。<br/>身内のLINEグループ等で「今日はこれだけ回った！」と日報共有し、モチベーションを高め合えます。</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4つの特徴 ===== */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-inner" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div className="section-label">Features</div>
          <h2 className="section-title">PoliStepのコア機能</h2>
        </div>

        {/* Feature 1 */}
        <div className="feature-row">
          <div className="feature-row-text">
            <div className="feature-num">01</div>
            <h3 className="feature-row-title">直感的なタップ記録と対話メモ</h3>
            <p className="section-desc">
              歩きながらでも片手で記録可能。「留守」「対話」「ポスター」に加え、「街頭演説」「ビラ配り」もタップ一つで記録。さらに対話時には簡単なメモを残せるため、有権者の生の声を取りこぼしません。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/feature_map_blue.jpg" alt="PoliStepのマップ画面" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="feature-row reverse">
          <div className="feature-row-text">
            <div className="feature-num">02</div>
            <h3 className="feature-row-title">目標からの逆算とダッシュボード</h3>
            <p className="section-desc">
              選挙日と目標件数から「1日に必要な活動数」を自動算出。どれだけ頑張ったかがパーセンテージで可視化されるため、一人で回っていても確かな達成感とモチベーションを得られます。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/feature_dashboard_jp.jpg" alt="PoliStepのダッシュボード画面" />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="feature-row">
          <div className="feature-row-text">
            <div className="feature-num">03</div>
            <h3 className="feature-row-title">チーム・身内向けの日報画像自動生成</h3>
            <p className="section-desc">
              1日の終わりに、今日の活動実績（回った地域や挨拶した件数）が自動合成された縦型の画像を作成。そのまま支援チームや身内のLINEグループに共有し、毎日の進捗報告とモチベーション維持に活用できます。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/feature_sns_blue.jpg" alt="SNSシェアジェネレーター画面" />
          </div>
        </div>

        {/* Feature 4 */}
        <div className="feature-row reverse">
          <div className="feature-row-text">
            <div className="feature-num">04</div>
            <h3 className="feature-row-title">チームメンバーとの分担・シェア</h3>
            <p className="section-desc">
              支援者やスタッフと同じマップを共有し、複数人で手分けして作業が可能。誰がどこを回ったのかがリアルタイムで反映されるため、重複訪問を防ぎ、チーム全体での効率的な活動管理を実現します。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/feature_team_blue.jpg" alt="リアルタイムな共有イメージ" />
          </div>
        </div>
      </section>

      {/* ===== PoliSide (Premium Consultation) ===== */}
      <section id="poliside" className="premium-section">
        <div className="premium-badge">PREMIUM CONSULTING</div>
        <h2 className="premium-title">プロの戦略分析「PoliSide」</h2>
        <p className="premium-desc">
          PoliStepにデータが蓄積されると、それは強力な武器に変わります。<br/>
          PoliSideの専門コンサルタントが、地域ごとの反応率を分析し「必勝の戦略」をご提案。<br/>
          アプリの提供だけではない、真の勝利への道のりを共に歩みます。
        </p>
        <a href="https://poliside.net" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-block' }}>
          専門家に相談する
        </a>
      </section>

      {/* ===== PoliDash (Sister Service) ===== */}
      <section className="section" style={{ background: '#F0F9FF', textAlign: 'center', padding: '5rem 2rem' }}>
        <div className="section-inner">
          <div className="section-label" style={{ margin: '0 auto 1rem', background: '#DBEAFE', color: '#1D4ED8' }}>Sister Service</div>
          <h2 className="section-title">ポスター貼りの効率化なら「PoliDash」</h2>
          <p className="section-desc" style={{ margin: '0 auto 2rem', maxWidth: '600px', color: '#1E293B' }}>
            選挙本番時、最も人手と時間を要する「ポスター貼り」。<br/>
            PoliDashを使えば、ポスター掲示場の地図作成や経路最適化を瞬時に行い、圧倒的な効率化を実現します。
          </p>
          <a href="https://polidash.jp" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
            PoliDash を確認する
          </a>
        </div>
      </section>

      {/* ===== Footer with Legal Links ===== */}
      <footer className="footer">
        <div className="logo-text" style={{ marginBottom: '1.5rem', justifyContent: 'center', display: 'flex' }}>PoliStep</div>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">利用規約</Link>
          <Link to="/privacy" className="footer-link">プライバシーポリシー</Link>
          <Link to="/legal" className="footer-link">特定商取引法に基づく表記</Link>
          <Link to="/auth" className="footer-link">ログイン / 新規登録</Link>
        </div>
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          ※現在PoliStepは「完全無料のお試し期間（β版）」として提供しております。<br/>万が一の不具合によるデータ消失等について完全な保証はできかねる場合がございます。あらかじめご了承ください。
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} PoliStep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

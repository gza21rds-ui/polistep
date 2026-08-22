import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, BarChart2, Share2 } from 'lucide-react';

export default function LandingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-container" style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
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
            【2027年 統一地方選挙 応援キャンペーン】本来なら月額980円のところ、今だけ「完全0円」で全機能を開放中！
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
              <div className="story-step-badge step-before">STEP 01 · 課題</div>
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
              <div className="story-step-badge step-plan">STEP 02 · 逆算計画</div>
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
              <div className="story-step-badge step-action">STEP 03 · 日々の可視化</div>
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
              <div className="story-step-badge step-success">STEP 04 · 達成と団結</div>
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
              目標日と目標件数から「1日に必要な活動数」を自動算出。どれだけ頑張ったかがパーセンテージで可視化されるため、一人で回っていても確かな達成感とモチベーションを得られます。
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

      {/* ===== Pricing Section ===== */}
      <section className="section" style={{ background: '#F8FAFC', textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="section-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-label" style={{ margin: '0 auto 1rem', background: '#DBEAFE', color: '#1D4ED8' }}>Pricing</div>
          <h2 className="section-title">2027年統一地方選挙 応援キャンペーン！</h2>
          <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', marginTop: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: '#EF4444', color: 'white', padding: '0.5rem 3rem', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.05em', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              今だけ無料
            </div>
            <p style={{ fontSize: '1.25rem', color: '#64748B', marginBottom: '1rem', fontWeight: 600 }}>通常価格</p>
            <div style={{ textDecoration: 'line-through', color: '#CBD5E1', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              月額 980円 <span style={{ fontSize: '1rem', fontWeight: 600 }}>(税込)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0' }}>
              <div style={{ background: '#EFF6FF', borderRadius: '50%', padding: '0.75rem', display: 'flex' }}>
                <ArrowRight size={24} color="#3B82F6" style={{ transform: 'rotate(90deg)' }} />
              </div>
            </div>
            <div style={{ color: '#0F172A', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1 }}>
              <span style={{ fontSize: '2rem', verticalAlign: 'top', marginRight: '0.2rem' }}>¥</span>0
              <span style={{ fontSize: '1.25rem', color: '#64748B', fontWeight: 600, marginLeft: '0.5rem' }}>/ 月</span>
            </div>
            <p style={{ marginTop: '2rem', color: '#334155', fontSize: '1.1rem', lineHeight: 1.8, fontWeight: 500, textAlign: 'left', background: '#F1F5F9', padding: '1.5rem', borderRadius: '12px' }}>
              姉妹サービス「PoliDash」と同様に、地域のために立ち上がる若手候補者の皆様を全力で応援するため、<br />
              <strong style={{ color: '#2563EB' }}>2027年の統一地方選挙に向けて、今だけ「完全0円」ですべての機能をご提供しています。</strong><br />
              ポスター貼りから毎日の挨拶回りまで、PoliStepの圧倒的な効率化をこの機会にぜひご体感ください。
            </p>
            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/auth?mode=register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', display: 'inline-flex', gap: '0.5rem' }}>
                無料でアカウント作成 <ArrowRight size={20} />
              </Link>
            </div>
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
            政治活動において、特に人手と時間を要する「ポスター貼り」。<br/>
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
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          ※本来は月額980円の有料サービスですが、2027年の統一地方選挙に向けて今だけ「完全0円」でご提供中です。<br/>現在システムは「お試し期間（β版）」であり、万が一の不具合によるデータ消失等について完全な保証はできかねる場合がございます。あらかじめご了承ください。
        </div>
        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
          ※【法的免責事項】当サービスは、政治家および立候補予定者の平時における「政治活動（後援会拡大等の日常活動）」の効率化・連絡調整を目的とした業務管理ツールです。公職選挙法で規定される選挙期間中の「選挙運動」を直接的に目的としたサービスではありません。
        </div>
        <div style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.75rem', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
          当サービスのUI/UX、デザイン、および独自の巡回最適化アルゴリズム等の無断複製・リバースエンジニアリング・模倣を固く禁じます。<br className="desktop-only" />悪質な仕様の盗用が発覚した場合は、著作権法および不正競争防止法に基づき法的措置を検討する場合があります。
        </div>
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} PoliStep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

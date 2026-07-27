import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, BarChart2, Share2 } from 'lucide-react';

export default function LandingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page-container">
      {/* ===== Header ===== */}
      <header className="glass-header">
        <div className="logo-text">PoliStep</div>
        <Link to="/auth" className="btn-outline">ログイン</Link>
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
            支援者の心を動かす「努力の証明」を生み出します。
          </p>
          <div className="hero-cta-group">
            <Link to="/auth" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              【完全無料】活動記録を始める <ArrowRight size={18} />
            </Link>
            <a href="#poliside" className="btn-secondary">
              戦略立案のプロに相談する
            </a>
          </div>
        </div>
        <div className="hero-visual-container">
          <img src="/hero-yorisoi.jpg" alt="チームで歩くボランティアと候補者" className="hero-main-img" />
        </div>
      </section>

      {/* ===== Photo Story ===== */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-label">Story</div>
          <h2 className="section-title">なぜ、活動を可視化するのか</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            IT化に批判的な現場で、PoliStepがどう壁を打ち破るのか。
          </p>
        </div>

        <div className="comic-grid">
          {/* Scene 1 */}
          <div className="comic-panel">
            <img src="/reason1-yorisoi.jpg" alt="夕暮れの住宅街で一人歩く候補者" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">「今日もどれだけ回れたんだろう…」<br/>紙の地図を片手に歩き続けるが、進捗が把握できない。これが従来の限界でした。</div>
            </div>
          </div>
          {/* Scene 2 */}
          <div className="comic-panel">
            <img src="/reason2-yorisoi.jpg" alt="スマホでPoliStepを使う様子" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">「選挙は足だ」と取り合ってくれない支援者。<br/>それでも諦めず、夜の街を歩き記録をつけ続けました。</div>
            </div>
          </div>
          {/* Scene 3 */}
          <div className="comic-panel">
            <img src="/reason3-yorisoi.jpg" alt="支援者と地図を見せ合う様子" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-narration">数日後、マップはピンで埋め尽くされました。<br/>真っ赤なマップを見た瞬間、批判的だった支援者の目が変わりました。</div>
            </div>
          </div>
          {/* Scene 4 */}
          <div className="comic-panel">
            <img src="/step2-yorisoi.jpg" alt="チームで街を歩く" className="comic-panel-img" />
            <div className="comic-text-box">
              <div className="comic-dialogue" style={{ fontSize: '1.25rem', textAlign: 'center', background: 'transparent', border: 'none' }}>これが、PoliStepの力。</div>
              <div className="comic-narration" style={{ textAlign: 'center' }}>可視化された「努力」が人の心を動かします。<br/>一人の活動が、チームの力に変わる瞬間です。</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3つの特徴 ===== */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-inner" style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <div className="section-label">Features</div>
          <h2 className="section-title">PoliStepのコア機能</h2>
        </div>

        {/* Feature 1 */}
        <div className="feature-row">
          <div className="feature-row-text">
            <div className="feature-num">01</div>
            <h3 className="feature-row-title">直感的なタップ記録</h3>
            <p className="section-desc">
              歩きながらでも片手で記録可能。「留守」「対話」「ポスター」などの大きなボタンをタップするだけで、あなたの足跡が瞬時に地図上へ記録されます。紙の地図はもう必要ありません。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/app_map.png" alt="PoliStepのマップ画面" />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="feature-row reverse">
          <div className="feature-row-text">
            <div className="feature-num">02</div>
            <h3 className="feature-row-title">活動のダッシュボード</h3>
            <p className="section-desc">
              どれだけ頑張ったかを数字とグラフで明確に表示。日々の活動がパーセンテージで可視化されるため、一人で回っていても確かな達成感とモチベーションを得られます。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/app_dashboard.png" alt="PoliStepのダッシュボード画面" />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="feature-row">
          <div className="feature-row-text">
            <div className="feature-num">03</div>
            <h3 className="feature-row-title">リアルタイムな共有</h3>
            <p className="section-desc">
              支援者やスタッフと同じマップを共有。誰がどこを回ったのかがリアルタイムで反映されるため、重複訪問を防ぎ、チーム全体での戦略的なドブ板活動を実現します。
            </p>
          </div>
          <div className="feature-row-visual">
            <img src="/step1-yorisoi.jpg" alt="PoliStepの共有イメージ" />
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
        <button className="btn-secondary" style={{ background: 'transparent', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => alert('PoliSideの相談フォームへ遷移します')}>
          専門家に相談する
        </button>
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
        <div className="footer-copy">
          &copy; {new Date().getFullYear()} PoliStep. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

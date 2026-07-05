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

      {/* ===== Hero (Claude Style) ===== */}
      <section className="hero-section">
        <div className="hero-badge">選挙活動トラッキングアプリ</div>
        <h1 className="hero-title">
          孤独なドブ板は、<br/><span className="text-gradient">可視化</span>で終わる。
        </h1>
        <p className="hero-subtitle">
          終わりの見えないポスター貼りや戸別訪問。<br/>
          タップ一つであなたの活動をマップとグラフに変換し、<br/>
          支援者の心を動かす「努力の証明」を生み出します。
        </p>
        <div className="hero-cta-group">
          <Link to="/auth" className="btn-primary">
            無料で活動記録を始める <ArrowRight size={18} />
          </Link>
          <a href="#poliside" className="btn-secondary">
            戦略立案のプロに相談する
          </a>
        </div>
        <div className="hero-visual-container">
          {/* ヒーロー画像として、ストーリーのクライマックス（全員で歩くシーン）を配置 */}
          <img src="/story8.png" alt="チームで歩く候補者" className="hero-main-img" />
        </div>
      </section>

      {/* ===== Manga Story (Webtoon Style) ===== */}
      <section className="section" style={{ background: 'var(--bg-main)' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-label">Story</div>
          <h2 className="section-title">なぜ、活動を可視化するのか</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            IT化に批判的な現場で、PoliStepがどう壁を打ち破るのか。
          </p>
        </div>

        <div className="manga-stream">
          {/* 過去編（モノクロ） */}
          <div className="manga-panel-wrapper manga-past">
            <div className="manga-image-container">
              <img src="/story1.png" alt="夕暮れの住宅街で紙の地図を見る候補者" />
            </div>
            <div className="manga-text-box">
              <div className="manga-dialogue">「今日もどれだけ回れたんだろう…」</div>
              <div className="manga-narration">夕暮れの住宅街。紙の地図を片手に、一人で歩き続ける候補者。どれだけ進んだのか、自分でも把握できない。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper reverse manga-past">
            <div className="manga-image-container">
              <img src="/story2.png" alt="ボロボロの紙の地図のアップ" />
            </div>
            <div className="manga-text-box">
              <div className="manga-narration">書き込みだらけでボロボロの紙の地図。どこを回ったのか、もう分からない。これが今の「管理」の限界だった。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper manga-past">
            <div className="manga-image-container">
              <img src="/story3.png" alt="事務所でスマホを見せるがそっぽを向かれる" />
            </div>
            <div className="manga-text-box">
              <div className="manga-dialogue">「こういうアプリで活動を管理できるんです！」</div>
              <div className="manga-dialogue" style={{ color: 'var(--text-muted)' }}>「そんなITで票が増えるか。選挙は足で稼ぐもんだ」</div>
              <div className="manga-narration">事務所でアプリの導入を提案するも、古参の支援者は取り合ってくれない。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper reverse manga-past">
            <div className="manga-image-container">
              <img src="/story4.png" alt="夜の街を一人で歩きスマホを操作する候補者" />
            </div>
            <div className="manga-text-box">
              <div className="manga-narration">それでも諦めない。誰にも認めてもらえなくても、夜の街を一人で歩き、PoliStepで一軒一軒の訪問を記録し続けた。</div>
            </div>
          </div>

          <div className="manga-divider">数日後</div>

          {/* 現代編（カラー） */}
          <div className="manga-panel-wrapper manga-present">
            <div className="manga-image-container">
              <img src="/story5.png" alt="ピンで埋め尽くされたスマホ画面" />
            </div>
            <div className="manga-text-box color-accent">
              <div className="manga-narration">数日間の活動で、マップはカラフルなピンで埋め尽くされた。一人の孤独な努力が、明確なデータとして「可視化」された瞬間。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper reverse manga-present">
            <div className="manga-image-container">
              <img src="/story6.png" alt="スマホを見せられて驚愕する支援者" />
            </div>
            <div className="manga-text-box">
              <div className="manga-dialogue">「見てください、この数日間の結果です」</div>
              <div className="manga-dialogue" style={{ color: 'var(--text-muted)' }}>「なっ…！一人でこのエリアを全部回ったのか…！？」</div>
              <div className="manga-narration">真っ赤に染まったマップを見せた瞬間、あの批判的だった支援者の目の色が変わった。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper manga-present">
            <div className="manga-image-container">
              <img src="/story7.png" alt="笑顔で肩を叩く支援者とスマホを出す" />
            </div>
            <div className="manga-text-box">
              <div className="manga-dialogue">「お前の本気、伝わったわ。俺のスマホにも入れてくれ。一緒にやろう」</div>
              <div className="manga-narration">可視化された「本気の努力」が、言葉を超えて人の心を動かした。最大の批判者が、最高の仲間に変わった瞬間。</div>
            </div>
          </div>

          <div className="manga-panel-wrapper reverse manga-present">
            <div className="manga-image-container">
              <img src="/story8.png" alt="チームで街を歩く" />
            </div>
            <div className="manga-text-box color-accent">
              <div className="manga-dialogue" style={{ fontSize: '1.25rem' }}>これが、PoliStepの力。</div>
              <div className="manga-narration">一人だった活動が、チームの力に変わる。全員がスマホを手に、同じ地図を共有しながら街を歩く。</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3つの特徴（実際のスクリーンショット） ===== */}
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
            <img src="/hero_mockup.png" alt="PoliStepの共有イメージ" />
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Link as LinkIcon, Map, Activity, Trophy, TrendingUp, Target } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="page-container" style={{ padding: 0 }}>
      <header className="glass-header">
        <h2 className="logo-text" style={{ fontSize: '1.5rem' }}>PoliStep Dashboard</h2>
        <Link to="/map" className="btn-fire" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', color: 'white', borderRadius: '9999px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <Map size={20} /> マップを開く
        </Link>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Section (Candidate Name) */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="candidate-name">田中 たろう 陣営</h1>
          <p style={{ color: '#64748B', fontSize: '1.25rem', fontWeight: 600 }}>管理者ダッシュボード</p>
        </div>

        {/* 必勝プログレスバー (ライザップ感) */}
        <section className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, rgba(220,38,38,0) 70%)', borderRadius: '50%' }}></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={28} color="#F87171" /> 必勝目標：ポスター1000枚
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>目標達成まで、残り <span style={{ color: '#F87171', fontSize: '1.5rem', fontWeight: 900 }}>245</span> 枚！チームの力で塗りつぶせ！</p>
          <div className="progress-container" style={{ height: '2rem', background: '#334155' }}>
            <div className="progress-fill" style={{ width: '75.5%', fontSize: '1rem' }}>75.5%</div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* 本日の活動サマリー */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>本日のサマリー</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E3A8A' }}>留守</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D4ED8' }}>142</div>
              </div>
              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>チラシ投函</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>89</div>
              </div>
              <div style={{ background: '#FFEDD5', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9A3412' }}>対話できた</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C2410C' }}>45</div>
              </div>
              <div style={{ background: '#FEE2E2', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991B1B' }}>ポスター貼付</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B91C1C' }}>12</div>
              </div>
            </div>
          </section>

          {/* 活動量グラフ (モック) */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={24} color="#059669" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>直近の活動推移</h3>
            </div>
            <div className="graph-container">
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '30%' }}></div><span className="graph-label">月</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '50%' }}></div><span className="graph-label">火</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '40%' }}></div><span className="graph-label">水</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '80%' }}></div><span className="graph-label">木</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '60%' }}></div><span className="graph-label">金</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '90%' }}></div><span className="graph-label">土</span></div>
              <div className="graph-bar-wrapper"><div className="graph-bar" style={{ height: '100%', background: 'var(--grad-fire)' }}></div><span className="graph-label" style={{ color: '#DC2626' }}>日</span></div>
            </div>
          </section>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* 本日のMVP (ランキング) */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Trophy size={24} color="#D97706" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>本日の活動MVP</h3>
            </div>
            <div className="ranking-list">
              <div className="ranking-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="ranking-medal medal-1">1</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>佐藤 スタッフ</div>
                </div>
                <div style={{ fontWeight: 800, color: '#D97706' }}>128 件</div>
              </div>
              <div className="ranking-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="ranking-medal medal-2">2</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>鈴木 ボランティア</div>
                </div>
                <div style={{ fontWeight: 800, color: '#64748B' }}>94 件</div>
              </div>
              <div className="ranking-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="ranking-medal medal-3">3</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>高橋 ボランティア</div>
                </div>
                <div style={{ fontWeight: 800, color: '#B45309' }}>67 件</div>
              </div>
            </div>
          </section>

          {/* スタッフ招待 */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Users size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>スタッフ招待リンク</h3>
            </div>
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              以下のリンクをボランティアスタッフに共有してください。
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexDirection: 'column' }}>
              <input 
                type="text" 
                readOnly 
                value="https://polistep.app/invite/XY92KZ" 
                className="input-premium"
                style={{ backgroundColor: '#F8FAFC', cursor: 'text' }}
              />
              <button className="btn-premium" style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>
                <LinkIcon size={20} /> リンクをコピー
              </button>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}

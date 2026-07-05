import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Target, TrendingUp, Flame } from 'lucide-react';

export default function StaffDashboard() {
  return (
    <div className="page-container" style={{ padding: 0 }}>
      <header className="glass-header">
        <h2 className="logo-text" style={{ fontSize: '1.25rem' }}>PoliStep Staff</h2>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>ボランティアチーム</p>
          <h1 className="candidate-name" style={{ fontSize: '2rem' }}>田中 たろう 陣営</h1>
        </div>

        {/* 必勝プログレスバー (陣営全体) */}
        <section className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={24} color="#F87171" /> 陣営目標：ポスター1000枚
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem' }}>目標達成まで、残り <span style={{ color: '#F87171', fontSize: '1.5rem', fontWeight: 900 }}>245</span> 枚！<br/>あなたの力が必要です！</p>
          <div className="progress-container" style={{ height: '1.5rem', background: '#334155' }}>
            <div className="progress-fill" style={{ width: '75.5%', fontSize: '0.875rem' }}>75.5%</div>
          </div>
        </section>

        {/* 個人の貢献度 */}
        <section className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
              <Flame size={32} color="#D97706" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>あなたの今日の貢献</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#D97706', lineHeight: 1, marginBottom: '1rem' }}>
            42 <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>件</span>
          </div>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            素晴らしいペースです！この調子でガンガン色を塗っていきましょう。
          </p>
        </section>

        {/* 出撃ボタン */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 0.8s 0.2s forwards', opacity: 0 }}>
          <Link to="/map" className="btn-fire" style={{ padding: '1.5rem 3rem', fontSize: '1.25rem', borderRadius: '9999px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, color: 'white', width: '100%', justifyContent: 'center', maxWidth: '400px' }}>
            <Map size={24} /> マップを開いて活動開始！
          </Link>
        </div>

      </main>
    </div>
  );
}

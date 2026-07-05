import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Target, Flame, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teamStats, setTeamStats] = useState({ poster: 0 });
  const [myStats, setMyStats] = useState({ total: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      
      supabase.from('users').select('*').eq('id', session.user.id).single()
        .then(({ data, error }) => {
          if (error || data.role !== 'staff') {
            navigate('/auth');
            return;
          }
          setUser(data);
          
          // チーム全体のポスター数
          supabase.from('pins').select('type').eq('team_id', data.team_id).eq('type', 'poster')
            .then(({ data: pinsData }) => {
              if (pinsData) {
                setTeamStats({ poster: pinsData.length });
              }
            });
            
          // 個人の貢献数（今日の件数、または全件数）
          supabase.from('pins').select('id').eq('created_by', data.id)
            .then(({ data: myPins }) => {
              if (myPins) {
                setMyStats({ total: myPins.length });
              }
            });
        });
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div className="page-container" style={{ padding: 0 }}>
      <header className="glass-header">
        <h2 className="logo-text" style={{ fontSize: '1.25rem' }}>PoliStep Staff</h2>
        <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <LogOut size={16} /> ログアウト
        </button>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>ボランティアチーム</p>
          <h1 className="candidate-name" style={{ fontSize: '2rem' }}>{user.display_name} さん</h1>
        </div>

        {/* 必勝プログレスバー (陣営全体) */}
        <section className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={24} color="#F87171" /> 陣営目標：ポスター1000枚
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1rem' }}>現在 <span style={{ color: '#F87171', fontSize: '1.5rem', fontWeight: 900 }}>{teamStats.poster}</span> 枚！<br/>あなたの力が必要です！</p>
          <div className="progress-container" style={{ height: '1.5rem', background: '#334155' }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, (teamStats.poster / 1000) * 100)}%`, fontSize: '0.875rem' }}>{((teamStats.poster / 1000) * 100).toFixed(1)}%</div>
          </div>
        </section>

        {/* 個人の貢献度 */}
        <section className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '50%' }}>
              <Flame size={32} color="#D97706" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>あなたの通算貢献</h3>
          <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#D97706', lineHeight: 1, marginBottom: '1rem' }}>
            {myStats.total} <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 600 }}>件</span>
          </div>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            素晴らしいペースです！この調子でガンガン色を塗っていきましょう。
          </p>
        </section>

        {/* 出撃ボタン */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 0.8s 0.2s forwards' }}>
          <Link to="/map" className="btn-fire" style={{ padding: '1.5rem 3rem', fontSize: '1.25rem', borderRadius: '9999px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, color: 'white', width: '100%', justifyContent: 'center', maxWidth: '400px' }}>
            <Map size={24} /> マップを開いて活動開始！
          </Link>
        </div>

      </main>
    </div>
  );
}

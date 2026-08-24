import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Target, Flame, LogOut, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import useNoIndex from '../hooks/useNoIndex';

export default function StaffDashboard() {
  useNoIndex();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teamStats, setTeamStats] = useState({ poster: 0, talked: 0, flyer: 0 });
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
          
          // チーム全体の統計
          supabase.from('pins').select('type, action_count').eq('team_id', data.team_id)
            .then(({ data: pinsData }) => {
              if (pinsData) {
                const stats = { poster: 0, talked: 0, flyer: 0 };
                pinsData.forEach(pin => {
                  if (pin.type === 'poster') stats.poster++;
                  else if (pin.type === 'talked') stats.talked++;
                  else if (pin.type === 'station_flyer') stats.flyer += (pin.action_count || 1);
                  else if (pin.type === 'flyer' || pin.type === 'absent') stats.flyer++;
                });
                setTeamStats(stats);
              }
            });
            
          // 個人の貢献数
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
        <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.4rem 0.8rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <LogOut size={16} /> ログアウト
        </button>
      </header>

      <main style={{ padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: 'max(5rem, calc(4rem + env(safe-area-inset-top)))' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>ボランティアスタッフ</p>
          <h1 className="candidate-name" style={{ fontSize: '1.75rem' }}>{user.display_name} さん</h1>
        </div>

        {/* チームの進捗サマリー */}
        <section className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0) 70%)', borderRadius: '50%' }}></div>
          
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="#60A5FA" /> チームの活動実績
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>📌 ポスター</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F87171' }}>{teamStats.poster} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>枚</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.25rem' }}>🤝 対話・挨拶</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#60A5FA' }}>{teamStats.talked} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94A3B8' }}>件</span></div>
            </div>
          </div>
        </section>

        {/* 個人の貢献度 */}
        <section className="glass-card tap-scale" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(to bottom right, #FEF3C7, #FFFBEB)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={{ background: '#FDE68A', padding: '1rem', borderRadius: '50%', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)' }}>
              <Flame size={28} color="#D97706" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#92400E', marginBottom: '0.25rem' }}>あなたの通算貢献</h3>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#D97706', lineHeight: 1, marginBottom: '0.75rem' }}>
            {myStats.total} <span style={{ fontSize: '1rem', color: '#B45309', fontWeight: 600 }}>件</span>
          </div>
          <p style={{ color: '#78350F', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>
            素晴らしいペースです！<br/>今日もガンガン色を塗っていきましょう 🔥
          </p>
        </section>

        {/* 出撃ボタン */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 0.8s 0.2s forwards' }}>
          <Link to={`/m/${user.team_id}`} className="btn-fire" style={{ padding: '1.25rem 2rem', fontSize: '1.1rem', borderRadius: '9999px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, color: 'white', width: '100%', justifyContent: 'center', maxWidth: '400px', boxShadow: '0 8px 24px rgba(220, 38, 38, 0.3)' }}>
            <Map size={22} /> 活動マップを開く <ArrowRight size={20} />
          </Link>
        </div>

      </main>
    </div>
  );
}


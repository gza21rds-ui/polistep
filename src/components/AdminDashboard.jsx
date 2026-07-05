import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Link as LinkIcon, Map, Activity, Trophy, TrendingUp, Target, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [stats, setStats] = useState({ absent: 0, flyer: 0, talked: 0, poster: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      
      supabase.from('users').select('*').eq('id', session.user.id).single()
        .then(({ data, error }) => {
          if (error || data.role !== 'admin') {
            navigate('/auth');
            return;
          }
          setUser(data);
          
          supabase.from('pins').select('*').eq('team_id', data.team_id)
            .then(({ data: pinsData }) => {
              if (pinsData) {
                setPins(pinsData);
                const newStats = { absent: 0, flyer: 0, talked: 0, poster: 0 };
                pinsData.forEach(pin => {
                  if (newStats[pin.type] !== undefined) newStats[pin.type]++;
                });
                setStats(newStats);
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
        <h2 className="logo-text" style={{ fontSize: '1.5rem' }}>PoliStep Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/map" className="btn-fire" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', color: 'white', borderRadius: '9999px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <Map size={20} /> マップを開く
          </Link>
          <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={20} /> ログアウト
          </button>
        </div>
      </header>

      <main style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header Section (Candidate Name) */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="candidate-name">{user.display_name} 陣営</h1>
          <p style={{ color: '#64748B', fontSize: '1.25rem', fontWeight: 600 }}>管理者ダッシュボード</p>
        </div>

        {/* 必勝プログレスバー */}
        <section className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: 'white', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, rgba(220,38,38,0) 70%)', borderRadius: '50%' }}></div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Target size={28} color="#F87171" /> 必勝目標：ポスター1000枚
          </h3>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem', fontSize: '1.1rem' }}>現在 <span style={{ color: '#F87171', fontSize: '1.5rem', fontWeight: 900 }}>{stats.poster}</span> 枚！チームの力で塗りつぶせ！</p>
          <div className="progress-container" style={{ height: '2rem', background: '#334155' }}>
            <div className="progress-fill" style={{ width: `${Math.min(100, (stats.poster / 1000) * 100)}%`, fontSize: '1rem' }}>{((stats.poster / 1000) * 100).toFixed(1)}%</div>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* 本日の活動サマリー */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>全体の活動サマリー</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E3A8A' }}>留守</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1D4ED8' }}>{stats.absent}</div>
              </div>
              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>チラシ投函</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{stats.flyer}</div>
              </div>
              <div style={{ background: '#FFEDD5', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9A3412' }}>対話できた</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#C2410C' }}>{stats.talked}</div>
              </div>
              <div style={{ background: '#FEE2E2', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991B1B' }}>ポスター貼付</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B91C1C' }}>{stats.poster}</div>
              </div>
            </div>
          </section>

          {/* スタッフ招待 */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Users size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>スタッフ招待コード</h3>
            </div>
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
              以下の招待コードをボランティアスタッフに共有してください。スタッフは新規登録時にこのコードを入力して参加します。
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexDirection: 'column' }}>
              <input 
                type="text" 
                readOnly 
                value={user.team_id} 
                className="input-premium"
                style={{ backgroundColor: '#F8FAFC', cursor: 'text', fontSize: '1rem', textAlign: 'center' }}
              />
              <button 
                className="btn-premium" 
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                onClick={() => {
                  navigator.clipboard.writeText(user.team_id);
                  alert('招待コードをコピーしました！');
                }}
              >
                <LinkIcon size={20} /> コードをコピー
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

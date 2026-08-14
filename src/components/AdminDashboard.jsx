import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Share2, Map, Activity, Target, LogOut, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SnsShareGenerator from './SnsShareGenerator';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [pins, setPins] = useState([]);
  const [stats, setStats] = useState({ absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0 });
  const [copied, setCopied] = useState(false);
  const [snsModalVisible, setSnsModalVisible] = useState(false);

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
                const newStats = { absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0 };
                pinsData.forEach(pin => {
                  if (newStats[pin.type] !== undefined) newStats[pin.type]++;
                  if (pin.type === 'station_flyer') {
                    newStats.flyerCount += (pin.action_count || 1);
                  }
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

  const getShareUrl = () => {
    const base = window.location.origin;
    return `${base}/m/${user.team_id}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = getShareUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  // 目標計算
  const totalActions = Object.values(stats).reduce((a, b) => a + b, 0);
  const targetActions = user.target_actions || 1000;
  
  let daysLeft = 30; // default
  let dailyTarget;
  if (user.election_date) {
    const diffTime = new Date(user.election_date) - new Date();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysLeft < 1) daysLeft = 1;
  }
  dailyTarget = Math.ceil((targetActions - totalActions) / daysLeft);
  if (dailyTarget < 0) dailyTarget = 0;
  
  const progressPercent = Math.min(100, (totalActions / targetActions) * 100);

  return (
    <div className="page-container" style={{ padding: 0 }}>
      <header className="glass-header">
        <h2 className="logo-text" style={{ fontSize: '1.5rem' }}>PoliStep Dashboard</h2>
        <div className="admin-header-controls">
          <Link to={`/m/${user.team_id}`} className="btn-fire btn-header-action" style={{ color: 'white', textDecoration: 'none' }}>
            <Map size={20} /> マップを開く
          </Link>
          <button onClick={handleLogout} className="btn-header-outline">
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

        {/* 必勝プログレスバー：個別訪問（対話） */}
        <section className="glass-card" style={{ padding: '2rem', background: 'white', color: '#1E293B', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden', marginBottom: '0' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#2563EB' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
              <Target size={24} color="#2563EB" /> 訪問・ご挨拶の進捗
            </h3>
            <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#2563EB', textDecoration: 'none', background: '#EFF6FF', padding: '0.4rem 0.8rem', borderRadius: '9999px', border: '1px solid #BFDBFE', fontWeight: 600 }}>
              目標再設定
            </Link>
          </div>
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1D4ED8', lineHeight: 1 }}>{stats.talked.toLocaleString()}</span>
              <span style={{ color: '#64748B', fontSize: '1rem', fontWeight: 600 }}>/ {user.target_visits?.toLocaleString() || '---'} 件</span>
            </div>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              残り {daysLeft} 日（1日あたり目標：<strong style={{ color: '#DC2626' }}>{Math.ceil(((user.target_visits || 0) - stats.talked) / daysLeft) > 0 ? Math.ceil(((user.target_visits || 0) - stats.talked) / daysLeft) : 0}</strong> 件）
            </p>
            <div className="progress-container" style={{ height: '1.5rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, (stats.talked / (user.target_visits || 1)) * 100)}%`, fontSize: '0.85rem', background: 'linear-gradient(90deg, #3B82F6, #2563EB)', display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: 'bold' }}>
                {((stats.talked / (user.target_visits || 1)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </section>

        {/* 必勝プログレスバー：ビラ・チラシ */}
        <section className="glass-card" style={{ padding: '2rem', background: 'white', color: '#1E293B', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '6px', height: '100%', background: '#F59E0B' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400E' }}>
              <Target size={24} color="#F59E0B" /> ビラ・チラシ配布の進捗
            </h3>
          </div>
          <div style={{ paddingLeft: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#D97706', lineHeight: 1 }}>{(stats.absent + stats.flyer + (stats.flyerCount || 0)).toLocaleString()}</span>
              <span style={{ color: '#64748B', fontSize: '1rem', fontWeight: 600 }}>/ {user.target_flyers?.toLocaleString() || '---'} 枚</span>
            </div>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              残り {daysLeft} 日（1日あたり目標：<strong style={{ color: '#DC2626' }}>{Math.ceil(((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))) / daysLeft) > 0 ? Math.ceil(((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))) / daysLeft) : 0}</strong> 枚）
            </p>
            <div className="progress-container" style={{ height: '1.5rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div className="progress-fill" style={{ width: `${Math.min(100, ((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100)}%`, fontSize: '0.85rem', background: 'linear-gradient(90deg, #FBBF24, #F59E0B)', display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: 'bold' }}>
                {(((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </section>

        <p style={{ color: '#64748B', textAlign: 'center', fontSize: '0.95rem', fontWeight: 'bold', marginTop: '-1rem' }}>
          投票日まで残り <span style={{ color: '#EF4444' }}>{daysLeft}</span> 日
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* 本日の活動サマリー */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>全体の活動サマリー</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E3A8A' }}>留守（チラシ投函）</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8' }}>{stats.absent + stats.flyer}</div>
              </div>
              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400E' }}>駅頭ビラ配り</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{stats.station_flyer} <span style={{fontSize: '1rem'}}>回</span></div>
              </div>
              <div style={{ background: '#FFEDD5', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9A3412' }}>ご挨拶できた</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#C2410C' }}>{stats.talked}</div>
              </div>
              <div style={{ background: '#FEE2E2', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991B1B' }}>ポスター貼付</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B91C1C' }}>{stats.poster}</div>
              </div>
              <div style={{ background: '#F5F3FF', padding: '1.25rem', borderRadius: '1rem', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#5B21B6' }}>街頭演説</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6D28D9' }}>{stats.speech}</div>
              </div>
              <div style={{ background: '#E0F2FE', padding: '1.25rem', borderRadius: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#075985' }}>駅頭ビラ配り</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0369A1' }}>{stats.station_flyer}</div>
              </div>
            </div>
            <button onClick={() => setSnsModalVisible(true)} className="btn-outline" style={{ width: '100%', borderRadius: '12px', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem', color: '#0F172A', borderColor: '#CBD5E1' }}>
              <Share2 size={20} /> 本日の活動をSNS用画像で出力
            </button>
          </section>

          {/* スタッフ共有リンク */}
          <section className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Share2 size={24} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>スタッフ共有リンク</h3>
            </div>
            <p style={{ color: '#475569', marginBottom: '1rem', fontSize: '1rem', lineHeight: 1.7 }}>
              以下のURLをボランティアスタッフにLINEやメールで共有するだけ！<strong>登録不要</strong>ですぐにマップで活動を記録できます。
            </p>
            <div style={{ background: '#FFFBEB', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #F59E0B', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400E' }}>
              <strong>※ご注意：</strong>スタッフ共有リンクからアクセスした画面では、この「管理者ダッシュボード（進捗グラフ等）」は閲覧できません。記録専用のマップ画面が開きます。
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexDirection: 'column' }}>
              <div style={{ width: '100%', padding: '0.875rem 1rem', background: '#F1F5F9', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', fontSize: '0.85rem', color: '#334155', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.6 }}>
                {getShareUrl()}
              </div>
              <button 
                className="btn-premium" 
                style={{ width: '100%', borderRadius: 'var(--radius-md)', gap: '0.5rem' }}
                onClick={handleCopyLink}
              >
                {copied ? <><Check size={20} /> コピーしました！</> : <><Copy size={20} /> リンクをコピー</>}
              </button>
            </div>
          </section>
        </div>

        {/* 出撃ボタン */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 0.8s 0.2s forwards' }}>
          <Link to={`/m/${user.team_id}`} className="btn-fire btn-huge-action" style={{ color: 'white', textDecoration: 'none', boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.4)' }}>
            <Map size={24} /> マップを開いて自ら活動する
          </Link>
        </div>
      </main>

      <SnsShareGenerator 
        visible={snsModalVisible} 
        onClose={() => setSnsModalVisible(false)} 
        stats={stats} 
      />
    </div>
  );
}

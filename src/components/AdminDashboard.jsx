import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Share2, Map, Activity, Target, LogOut, Copy, Check, Search, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SnsShareGenerator from './SnsShareGenerator';
import DashboardMapPreview from './DashboardMapPreview';
import DashboardTour from './DashboardTour';
import CircularProgress from './CircularProgress';
import useNoIndex from '../hooks/useNoIndex';

export default function AdminDashboard() {
  useNoIndex();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [stats, setStats] = useState({ absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0, poster_ok: 0, tsujidachi: 0 });
  const [statsToday, setStatsToday] = useState({ absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0, poster_ok: 0, tsujidachi: 0 });
  const [copied, setCopied] = useState(false);
  const [snsModalVisible, setSnsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tourRun, setTourRun] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState(null);

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
          
          // 初回ログイン時のみチュートリアル自動実行（一度起動したら即フラグ保存）
          const tourKey = `polistep_tour_seen_${data.id}`;
          const tourSeen = localStorage.getItem(tourKey) || localStorage.getItem('polistep_dashboard_tour_seen');
          if (!tourSeen) {
            localStorage.setItem(tourKey, 'true');
            localStorage.setItem('polistep_dashboard_tour_seen', 'true');
            setTimeout(() => setTourRun(true), 800);
          }
          
          supabase.from('pins').select('*').eq('team_id', data.team_id)
            .then(({ data: pinsData }) => {
              if (pinsData) {
                setPins(pinsData);
                const newStats = { absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0, poster_ok: 0, tsujidachi: 0 };
                const newStatsToday = { absent: 0, flyer: 0, talked: 0, poster: 0, speech: 0, station_flyer: 0, flyerCount: 0, poster_ok: 0, tsujidachi: 0 };
                
                // JSTの今日の日付文字列を取得 (YYYY-MM-DD)
                const now = new Date();
                const jstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
                const todayStr = jstDate.toISOString().split('T')[0];

                pinsData.forEach(pin => {
                  if (newStats[pin.type] !== undefined) newStats[pin.type]++;
                  if (pin.type === 'station_flyer') {
                    newStats.flyerCount += (pin.action_count || 1);
                  }

                  if (pin.created_at && pin.created_at.startsWith(todayStr)) {
                    if (newStatsToday[pin.type] !== undefined) newStatsToday[pin.type]++;
                    if (pin.type === 'station_flyer') {
                      newStatsToday.flyerCount += (pin.action_count || 1);
                    }
                  }
                });
                setStats(newStats);
                setStatsToday(newStatsToday);
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

  const talkedLogs = pins
    .filter(pin => pin.type === 'talked' && pin.memo)
    .map(pin => {
      let name = '';
      let content = pin.memo;
      let imageUrl = null;
      if (pin.memo.startsWith('{')) {
        try {
          const obj = JSON.parse(pin.memo);
          if (obj.name !== undefined) name = obj.name;
          if (obj.content !== undefined) content = obj.content;
          if (obj.imageUrl !== undefined) imageUrl = obj.imageUrl;
        } catch(e) {}
      }
      return { ...pin, parsedName: name, parsedContent: content, parsedImageUrl: imageUrl };
    })
    .filter(pin => {
      if (!searchText.trim()) return true;
      const q = searchText.toLowerCase();
      return (pin.parsedName && pin.parsedName.toLowerCase().includes(q)) || 
             (pin.parsedContent && pin.parsedContent.toLowerCase().includes(q));
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="page-container" style={{ padding: 0 }}>
      {/* チュートリアルツアー */}
      <DashboardTour run={tourRun} onFinish={() => setTourRun(false)} />

      <header className="glass-header admin-glass-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 className="logo-text" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>PoliStep</h2>
          <button
            onClick={() => setTourRun(true)}
            className="btn-header-outline"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2563EB', borderColor: '#BFDBFE', background: '#EFF6FF' }}
            title="使い方チュートリアルを開始"
          >
            <HelpCircle size={14} /> <span className="guide-text">使い方ガイド</span>
          </button>
        </div>
        <div className="admin-header-controls">
          <Link to={`/m/${user.team_id}`} className="btn-fire btn-header-action" style={{ color: 'white', textDecoration: 'none' }}>
            <Map size={16} /> <span>マップ</span>
          </Link>
          <button onClick={handleLogout} className="btn-header-outline">
            <LogOut size={16} /> <span>ログアウト</span>
          </button>
        </div>
      </header>

      <main className="admin-main-content" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* 陣営名ヘッダー */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <h1 className="candidate-name" style={{ fontSize: '2rem' }}>{user.display_name} 陣営</h1>
          <p style={{ color: '#64748B', fontSize: '1.1rem', fontWeight: 600 }}>管理者ダッシュボード</p>
        </div>

        {/* 1. マッププレビュー（最上部に配置して直感的に可視化） */}
        <section style={{ animation: 'fadeInUp 0.6s 0.1s forwards' }}>
          <DashboardMapPreview pins={pins} teamId={user.team_id} />
        </section>

        {/* 2. 必勝プログレスバー群 */}
        <div id="tour-progress-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 個別訪問（対話）進捗 */}
          <section className="glass-card" style={{ padding: '2rem', background: '#ffffff', color: '#1E293B', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
                <span style={{ fontSize: '1.4rem' }}>🏠</span> 訪問・ご挨拶の進捗
              </h3>
              <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#2563EB', textDecoration: 'none', background: '#EFF6FF', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700 }}>
                目標再設定
              </Link>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* ドーナツチャート（左） */}
              <CircularProgress 
                percentage={Math.min(100, (stats.talked / (user.target_visits || 1)) * 100)} 
                color="#F97316" 
                valueText={stats.talked.toString()} 
                size={140}
                strokeWidth={14}
              />
              
              {/* 数値詳細とバー（右） */}
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ color: '#475569', fontSize: '1rem', fontWeight: 700 }}>目標</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>{user.target_visits?.toLocaleString() || '---'} <span style={{ fontSize: '1rem', color: '#64748B' }}>件</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px dashed #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#475569', fontSize: '1rem', fontWeight: 700 }}>現在の訪問</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>{stats.talked.toLocaleString()}</span>
                    <span style={{ color: '#64748B', fontSize: '1rem', fontWeight: 700 }}> / {user.target_visits?.toLocaleString() || '---'} 件</span>
                  </div>
                </div>
                
                <div style={{ background: '#FFF7ED', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FFEDD5' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9A3412', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    🔥 1日あたりの目標
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#EA580C' }}>
                    {Math.max(0, Math.ceil(((user.target_visits || 0) - stats.talked) / daysLeft)).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#9A3412' }}>件/日</span>
                  </span>
                </div>

                <div>
                  <div className="progress-container" style={{ height: '1rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ '--target-width': `${Math.min(100, (stats.talked / (user.target_visits || 1)) * 100)}%`, fontSize: '0.7rem', background: '#3B82F6', display: 'flex', alignItems: 'center', padding: ((stats.talked / (user.target_visits || 1)) * 100) > 10 ? '0 0.5rem' : '0', fontWeight: 'bold', color: 'white' }}>
                      {((stats.talked / (user.target_visits || 1)) * 100) > 10 ? `${((stats.talked / (user.target_visits || 1)) * 100).toFixed(0)}%` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                      あと {(user.target_visits || 0) > stats.talked ? ((user.target_visits || 0) - stats.talked).toLocaleString() : 0} 件
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ビラ・チラシ配布の進捗 */}
          <section className="glass-card" style={{ padding: '2rem', background: '#ffffff', color: '#1E293B', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
                <span style={{ fontSize: '1.4rem' }}>📄</span> ビラ配布の進捗
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* ドーナツチャート（左） */}
              <CircularProgress 
                percentage={Math.min(100, ((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100)} 
                color="#1D4ED8" 
                valueText={(stats.absent + stats.flyer + (stats.flyerCount || 0)).toString()} 
                size={140}
                strokeWidth={14}
              />
              
              {/* 数値詳細とバー（右） */}
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ color: '#475569', fontSize: '1rem', fontWeight: 700 }}>目標</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>{user.target_flyers?.toLocaleString() || '---'} <span style={{ fontSize: '1rem', color: '#64748B' }}>枚</span></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px dashed #E2E8F0', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#475569', fontSize: '1rem', fontWeight: 700 }}>配布枚数</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>{(stats.absent + stats.flyer + (stats.flyerCount || 0)).toLocaleString()}</span>
                    <span style={{ color: '#64748B', fontSize: '1rem', fontWeight: 700 }}> / {user.target_flyers?.toLocaleString() || '---'} 枚</span>
                  </div>
                </div>
                
                <div style={{ background: '#EFF6FF', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #DBEAFE' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    🔥 1日あたりの目標
                  </span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1D4ED8' }}>
                    {Math.max(0, Math.ceil(((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))) / daysLeft)).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#1E40AF' }}>枚/日</span>
                  </span>
                </div>

                <div>
                  <div className="progress-container" style={{ height: '1rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ '--target-width': `${Math.min(100, ((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100)}%`, fontSize: '0.7rem', background: '#3B82F6', display: 'flex', alignItems: 'center', padding: (((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100) > 10 ? '0 0.5rem' : '0', fontWeight: 'bold', color: 'white' }}>
                      {(((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100) > 10 ? `${(((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100).toFixed(0)}%` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                      あと {(user.target_flyers || 0) > (stats.absent + stats.flyer + (stats.flyerCount || 0)) ? ((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))).toLocaleString() : 0} 枚
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <p style={{ color: '#64748B', textAlign: 'center', fontSize: '0.95rem', fontWeight: 'bold', margin: '0' }}>
          決戦の日（目標日）まで残り <span style={{ color: '#EF4444' }}>{daysLeft}</span> 日
        </p>

        {/* 3. サマリーと共有リンク（左右均等な2カラム） */}
        <div className="admin-dashboard-grid">
          {/* 本日の活動サマリー */}
          <section id="tour-today-summary" className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Activity size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>全体の活動サマリー</h3>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', background: '#F1F5F9', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontWeight: 600 }}>
                累計実績
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#EFF6FF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #DBEAFE' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>📮</span> 留守（チラシ投函）
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8' }}>{stats.absent + stats.flyer} <span style={{fontSize: '0.9rem', fontWeight: 600}}>件</span></div>
              </div>
              <div style={{ background: '#FEF3C7', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>📄</span> ビラ配り
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706' }}>{stats.station_flyer} <span style={{fontSize: '0.9rem', fontWeight: 600}}>回</span></div>
              </div>
              <div style={{ background: '#FFEDD5', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #FED7AA' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9A3412', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>🤝</span> ご挨拶できた
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#C2410C' }}>{stats.talked} <span style={{fontSize: '0.9rem', fontWeight: 600}}>件</span></div>
              </div>
              <div style={{ background: '#FEE2E2', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #FECACA' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>📌</span> ポスター貼付
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B91C1C' }}>{stats.poster} <span style={{fontSize: '0.9rem', fontWeight: 600}}>箇所</span></div>
              </div>
              <div style={{ background: '#F0FDF4', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>🎯</span> ポスター許可
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803D' }}>{stats.poster_ok} <span style={{fontSize: '0.9rem', fontWeight: 600}}>件</span></div>
              </div>
              <div style={{ background: '#F5F3FF', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #DDD6FE' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5B21B6', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>📢</span> 街頭演説
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#6D28D9' }}>{stats.speech} <span style={{fontSize: '0.9rem', fontWeight: 600}}>回</span></div>
              </div>
              <div style={{ background: '#ECFDF5', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #A7F3D0', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <span>🧍‍♂️</span> 辻立ち（交差点・駅前等）
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>{stats.tsujidachi} <span style={{fontSize: '0.9rem', fontWeight: 600}}>時間</span></div>
              </div>
            </div>
            <button onClick={() => setSnsModalVisible(true)} className="btn-outline tap-scale" style={{ width: '100%', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.875rem', color: '#0F172A', borderColor: '#CBD5E1', fontWeight: 700 }}>
              <Share2 size={18} /> 本日の活動をSNS用画像で出力
            </button>
          </section>

          {/* スタッフ共有リンク */}
          <section id="tour-share-link" className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Share2 size={24} color="var(--primary)" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>スタッフ共有リンク</h3>
            </div>
            <p style={{ color: '#475569', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
              以下のURLをボランティアスタッフにLINEやメールで共有するだけ！<strong>登録不要</strong>ですぐにマップで活動を記録できます。
            </p>
            <div style={{ background: '#FFFBEB', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #F59E0B', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#92400E' }}>
              <strong>※ご注意：</strong>スタッフ共有リンクからアクセスした画面では、この「管理者ダッシュボード」は閲覧できません。記録専用マップが開きます。
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch', flexDirection: 'column' }}>
              <div style={{ width: '100%', padding: '0.875rem 1rem', background: '#F1F5F9', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-light)', fontSize: '0.85rem', color: '#334155', wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.6 }}>
                {getShareUrl()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  className="btn-premium tap-scale" 
                  style={{ borderRadius: 'var(--radius-md)', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                  onClick={handleCopyLink}
                >
                  {copied ? <><Check size={18} /> コピー完了！</> : <><Copy size={18} /> URLをコピー</>}
                </button>
                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(`【PoliStep】本日の活動マップURLです。タップして記録を開始してください！\n${getShareUrl()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-line tap-scale"
                  style={{ padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                >
                  💬 LINEで送る
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* 4. ご挨拶・対話ログ検索（タイムライン） */}
        <section id="tour-timeline" className="glass-card" style={{ padding: '2rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Search size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>ご挨拶・対話ログ検索</h3>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', background: '#F1F5F9', padding: '0.35rem 0.75rem', borderRadius: '9999px', fontWeight: 600 }}>
                {talkedLogs.length} 件の対話メモ
              </span>
            </div>
            
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="お名前や会話内容で検索..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%', padding: '0.875rem 1rem', paddingRight: searchText ? '2.5rem' : '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}
                >
                  &times;
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {talkedLogs.length === 0 ? (
                <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem 0' }}>該当する記録がありません。</p>
              ) : (
                talkedLogs.map(log => (
                  <div key={log.id} style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '1.15rem' }}>
                        {log.parsedName ? log.parsedName : 'お名前なし'}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                        {new Date(log.created_at).toLocaleString('ja-JP')}
                      </span>
                    </div>

                    {log.parsedContent && (
                      <p style={{ margin: 0, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {log.parsedContent}
                      </p>
                    )}

                    {/* 添付写真の表示 */}
                    {log.parsedImageUrl && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <img
                          src={log.parsedImageUrl}
                          alt="対話メモ写真"
                          onClick={() => setSelectedImageForModal(log.parsedImageUrl)}
                          style={{
                            maxWidth: '180px',
                            maxHeight: '130px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            cursor: 'pointer',
                            border: '1px solid #CBD5E1',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                            transition: 'transform 0.2s'
                          }}
                          title="クリックして拡大"
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <Link to={`/m/${user.team_id}?lat=${log.lat}&lng=${log.lng}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: '#2563EB', textDecoration: 'none', background: '#EFF6FF', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                        <Map size={16} /> マップで見る
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        {/* 5. 出撃ボタン */}
        <div id="tour-action-button" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', animation: 'fadeInUp 0.8s 0.2s forwards' }}>
          <Link to={`/m/${user.team_id}`} className="btn-fire btn-huge-action" style={{ color: 'white', textDecoration: 'none' }}>
            <Map size={20} /> マップを開いて自ら活動する
          </Link>
        </div>
      </main>

      {/* 写真拡大プレビューモーダル */}
      {selectedImageForModal && (
        <div 
          onClick={() => setSelectedImageForModal(null)} 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img 
              src={selectedImageForModal} 
              alt="写真拡大表示" 
              style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
            />
            <button
              onClick={() => setSelectedImageForModal(null)}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* SNS共有モーダル */}
      <SnsErrorBoundary>
        <SnsShareGenerator visible={snsModalVisible} onClose={() => setSnsModalVisible(false)} stats={stats} statsToday={statsToday} user={user} />
      </SnsErrorBoundary>
    </div>
  );
}

class SnsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="overlay">
          <div className="modal-content" style={{ padding: '2rem', background: '#FEE2E2', color: '#991B1B', borderRadius: '12px' }}>
            <h3>エラーが発生しました</h3>
            <p>{this.state.error && this.state.error.toString()}</p>
            <button onClick={() => this.setState({ hasError: false })} className="btn-outline">閉じる</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

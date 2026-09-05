import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Share2, Map, Activity, Target, LogOut, Copy, Check, Search, HelpCircle,
  Users, FileText, Mail, Pin, CheckCircle2, Megaphone, UserCheck, Calendar, Flame
} from 'lucide-react';
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

      <main className="admin-main-content" style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
        
        {/* 陣営名ヘッダー ＆ カウントダウンバッジ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', animation: 'fadeInUp 0.6s ease-out' }}>
          <div>
            <h1 className="candidate-name" style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'var(--text-main)' }}>{user.display_name} 陣営</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>管理者ダッシュボード</p>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.5rem 1rem', borderRadius: '9999px', boxShadow: 'var(--shadow-sm)' }}>
            <Calendar size={16} color="#2563EB" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E40AF' }}>
              目標日まで あと <strong style={{ fontSize: '1.15rem', color: '#1D4ED8' }}>{daysLeft}</strong> 日
            </span>
          </div>
        </div>

        {/* 1. 必勝プログレスバー群（最上部に配置して今日の目標達成率を即座に把握） */}
        <div id="tour-progress-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* 個別訪問（対話）進捗 */}
          <section className="glass-card dashboard-card-clean" style={{ background: '#ffffff', color: '#1E293B', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <h3 className="heading-responsive-tight" style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
                <Users size={20} color="#EA580C" /> 訪問・ご挨拶の進捗
              </h3>
              <Link to="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#2563EB', textDecoration: 'none', background: '#EFF6FF', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 700 }}>
                目標再設定
              </Link>
            </div>
            
            <div className="progress-card-content">
              {/* ドーナツチャート（左） */}
              <div style={{ flexShrink: 0 }}>
                <CircularProgress 
                  percentage={Math.min(100, (stats.talked / (user.target_visits || 1)) * 100)} 
                  color="#EA580C" 
                  valueText={stats.talked.toString()} 
                  size={140}
                  strokeWidth={14}
                />
              </div>
              
              {/* 数値詳細とバー（右） */}
              <div className="progress-card-detail" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                
                <div style={{ background: '#FFF7ED', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #FFEDD5' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9A3412', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Flame size={16} color="#EA580C" /> 1日あたりの目標
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#EA580C' }}>
                    {Math.max(0, Math.ceil(((user.target_visits || 0) - stats.talked) / daysLeft)).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#9A3412' }}>件/日</span>
                  </span>
                </div>

                <div>
                  <div className="progress-container" style={{ height: '0.85rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ '--target-width': `${Math.min(100, (stats.talked / (user.target_visits || 1)) * 100)}%`, fontSize: '0.7rem', background: '#EA580C', display: 'flex', alignItems: 'center', padding: ((stats.talked / (user.target_visits || 1)) * 100) > 10 ? '0 0.5rem' : '0', fontWeight: 'bold', color: 'white' }}>
                      {((stats.talked / (user.target_visits || 1)) * 100) > 10 ? `${((stats.talked / (user.target_visits || 1)) * 100).toFixed(0)}%` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                      あと {(user.target_visits || 0) > stats.talked ? ((user.target_visits || 0) - stats.talked).toLocaleString() : 0} 件
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ビラ・チラシ配布の進捗 */}
          <section className="glass-card dashboard-card-clean" style={{ background: '#ffffff', color: '#1E293B', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              <h3 className="heading-responsive-tight" style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E3A8A' }}>
                <FileText size={20} color="#2563EB" /> ビラ配布の進捗
              </h3>
            </div>
            
            <div className="progress-card-content">
              {/* ドーナツチャート（左） */}
              <div style={{ flexShrink: 0 }}>
                <CircularProgress 
                  percentage={Math.min(100, ((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100)} 
                  color="#2563EB" 
                  valueText={(stats.absent + stats.flyer + (stats.flyerCount || 0)).toString()} 
                  size={140}
                  strokeWidth={14}
                />
              </div>
              
              {/* 数値詳細とバー（右） */}
              <div className="progress-card-detail" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                
                <div style={{ background: '#EFF6FF', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #DBEAFE' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Flame size={16} color="#2563EB" /> 1日あたりの目標
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1D4ED8' }}>
                    {Math.max(0, Math.ceil(((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))) / daysLeft)).toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#1E40AF' }}>枚/日</span>
                  </span>
                </div>

                <div>
                  <div className="progress-container" style={{ height: '0.85rem', background: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div className="progress-fill" style={{ '--target-width': `${Math.min(100, ((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100)}%`, fontSize: '0.7rem', background: '#2563EB', display: 'flex', alignItems: 'center', padding: (((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100) > 10 ? '0 0.5rem' : '0', fontWeight: 'bold', color: 'white' }}>
                      {(((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100) > 10 ? `${(((stats.absent + stats.flyer + (stats.flyerCount || 0)) / (user.target_flyers || 1)) * 100).toFixed(0)}%` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                      あと {(user.target_flyers || 0) > (stats.absent + stats.flyer + (stats.flyerCount || 0)) ? ((user.target_flyers || 0) - (stats.absent + stats.flyer + (stats.flyerCount || 0))).toLocaleString() : 0} 枚
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 2. マッププレビュー ＆ スタッフ共有ハブ（第2階層） */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', alignItems: 'stretch' }}>
          {/* マッププレビュー */}
          <section style={{ height: '100%', minHeight: '340px' }}>
            <DashboardMapPreview pins={pins} teamId={user.team_id} />
          </section>

          {/* スタッフ共有リンク */}
          <section id="tour-share-link" className="glass-card dashboard-card-clean" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Share2 size={20} color="#2563EB" />
                </div>
                <div>
                  <h3 className="heading-responsive-tight" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>スタッフ共有リンク</h3>
                  <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>● アカウント登録不要で即日利用可能</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                以下のURLをスタッフや支援者にLINE・メールで共有するだけで、同じマップを共有して手分け作業を行えます。
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              <div style={{ width: '100%', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', fontSize: '0.825rem', color: '#334155', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {getShareUrl()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  className="btn-premium tap-scale" 
                  style={{ borderRadius: 'var(--radius-md)', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={handleCopyLink}
                >
                  {copied ? <><Check size={16} /> コピー済</> : <><Copy size={16} /> URLコピー</>}
                </button>
                <a
                  href={`https://line.me/R/msg/text/?${encodeURIComponent(`【PoliStep】本日の活動マップURLです。タップして記録を開始してください！\n${getShareUrl()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-line tap-scale"
                  style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', borderRadius: 'var(--radius-md)' }}
                >
                  LINEで送る
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* 3. 全体の活動サマリー（脱・多色病: 洗練されたクリーンなメトリクスカード） */}
        <section id="tour-summary-cards" className="glass-card dashboard-card-clean" style={{ background: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={20} color="#0F172A" />
              </div>
              <div>
                <h3 className="heading-responsive-tight" style={{ fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)', fontWeight: 800, color: 'var(--text-main)' }}>活動種別ごとの実績サマリー</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>全メンバーによる活動実績のリアルタイム合計</p>
              </div>
            </div>
            <button onClick={() => setSnsModalVisible(true)} className="btn-outline tap-scale" style={{ borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: 700 }}>
              <Share2 size={16} /> SNS用日報画像を出力
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* 留守（チラシ） */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <Mail size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">留守（投函）</div>
                <div className="metric-value-clean">{stats.absent.toLocaleString()} <span className="metric-unit-clean">件</span></div>
              </div>
            </div>

            {/* ご挨拶できた */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                <Users size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">ご挨拶・対話</div>
                <div className="metric-value-clean">{stats.talked.toLocaleString()} <span className="metric-unit-clean">件</span></div>
              </div>
            </div>

            {/* 駅頭ビラ配り */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#F0F9FF', color: '#0284C7' }}>
                <FileText size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">駅頭ビラ</div>
                <div className="metric-value-clean">{stats.station_flyer.toLocaleString()} <span className="metric-unit-clean">回</span></div>
              </div>
            </div>

            {/* ポスター貼付 */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <Pin size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">ポスター貼付</div>
                <div className="metric-value-clean">{stats.poster.toLocaleString()} <span className="metric-unit-clean">箇所</span></div>
              </div>
            </div>

            {/* ポスター許可 */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">ポスター許可</div>
                <div className="metric-value-clean">{stats.poster_ok.toLocaleString()} <span className="metric-unit-clean">件</span></div>
              </div>
            </div>

            {/* 街頭演説 */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#FAF5FF', color: '#7C3AED' }}>
                <Megaphone size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">街頭演説</div>
                <div className="metric-value-clean">{stats.speech.toLocaleString()} <span className="metric-unit-clean">回</span></div>
              </div>
            </div>

            {/* 辻立ち */}
            <div className="metric-card-clean">
              <div className="metric-icon-bubble" style={{ background: '#F0FDFA', color: '#0D9488' }}>
                <UserCheck size={22} />
              </div>
              <div className="metric-content-box">
                <div className="metric-label-clean">辻立ち（交差点等）</div>
                <div className="metric-value-clean">{stats.tsujidachi.toLocaleString()} <span className="metric-unit-clean">時間</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ご挨拶・対話ログ検索（タイムライン） */}
        <section id="tour-timeline" className="glass-card dashboard-card-clean" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Search size={24} color="var(--primary)" />
                <h3 className="heading-responsive-tight" style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 800, color: 'var(--text-main)' }}>ご挨拶・対話ログ検索</h3>
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

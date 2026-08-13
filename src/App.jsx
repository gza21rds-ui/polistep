import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import MapScreen from './components/MapScreen';
import ActionBottomSheet from './components/ActionBottomSheet';
import UndoSnackbar from './components/UndoSnackbar';
import PoliSideUpsellPopup from './components/PoliSideUpsellPopup';
import PoliDashCrossSellBanner from './components/PoliDashCrossSellBanner';

// 新規追加ページ群
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import Onboarding from './components/Onboarding';

// 法的ページ群
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Legal from './components/Legal';

import { supabase } from './lib/supabase';

// 公開マップ画面（登録不要、URLのteamIdでアクセス）
function PublicMapApp() {
  const { teamId } = useParams();
  const [pins, setPins] = useState([]);
  const [actionCount, setActionCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [crossSellVisible, setCrossSellVisible] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  
  // Memo Feature State
  const [memoVisible, setMemoVisible] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [activePinIdForMemo, setActivePinIdForMemo] = useState(null);

  useEffect(() => {
    if (!teamId) {
      setError('チームIDが指定されていません。');
      return;
    }

    // チームのピンを取得（認証不要）
    fetchPins(teamId);
    setReady(true);
    
    // リアルタイム購読
    const channel = supabase.channel(`public-map-${teamId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pins', filter: `team_id=eq.${teamId}` }, () => {
        fetchPins(teamId);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  const fetchPins = async (tid) => {
    const { data, error } = await supabase.from('pins').select('*').eq('team_id', tid);
    if (!error && data) {
      const formatted = data.map(p => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        latest_action_type: p.type
      }));
      setPins(formatted);
      setActionCount(formatted.length);
    }
  };

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
    // マップをタップしたときにメモが入力されていなければ閉じる
    if (memoVisible && !memoText.trim()) {
      handleSkipMemo();
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedLocation) {
      alert('先に地図上の記録したい地点をタップして選択してください。');
      return;
    }

    const newPin = {
      team_id: teamId,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      type: actionType,
      // created_by は NULL（匿名スタッフ）
    };

    // DBに保存
    const { data, error } = await supabase.from('pins').insert(newPin).select().single();

    if (error) {
      console.error('ピンの保存に失敗:', error);
      alert('記録に失敗しました。もう一度お試しください。');
      return;
    }

    if (data) {
      setPins((prev) => [...prev, { id: data.id, lat: data.lat, lng: data.lng, latest_action_type: data.type }]);
      setLastAction({ id: data.id, lat: data.lat, lng: data.lng });
      setSelectedLocation(null);

      const newCount = actionCount + 1;
      setActionCount(newCount);

      if (actionType === 'talked') {
        setActivePinIdForMemo(data.id);
        setMemoText('');
        setMemoVisible(true);
      } else {
        setUndoVisible(true);
      }

      if (newCount === 10) {
        setUpsellVisible(true);
      }
      if (actionType === 'poster') {
        setCrossSellVisible(true);
      }
    }
  };

  const handleUndo = async () => {
    if (lastAction) {
      await supabase.from('pins').delete().eq('id', lastAction.id);
      
      setPins((prev) => prev.filter(p => p.id !== lastAction.id));
      setActionCount((prev) => Math.max(0, prev - 1));
      setSelectedLocation({ lat: lastAction.lat, lng: lastAction.lng });
      setLastAction(null);
    }
    setUndoVisible(false);
  };

  const handleSaveMemo = async () => {
    if (activePinIdForMemo && memoText.trim()) {
      await supabase.from('pins').update({ memo: memoText.trim() }).eq('id', activePinIdForMemo);
    }
    setMemoVisible(false);
    setActivePinIdForMemo(null);
    setUndoVisible(true); // メモ保存後でもUndoできるように表示
  };

  const handleSkipMemo = () => {
    setMemoVisible(false);
    setActivePinIdForMemo(null);
    setUndoVisible(true); // スキップ時でもUndo表示
  };

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center' }}>
        <div>
          <h2 style={{ marginBottom: '1rem', color: '#DC2626' }}>エラー</h2>
          <p style={{ color: '#64748B' }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!ready) return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;

  return (
    <div className="app-container">
      {/* 戻るボタン */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={() => window.history.back()} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B' }}>
          ← 戻る
        </button>
      </div>

      <PoliDashCrossSellBanner visible={crossSellVisible} onClose={() => setCrossSellVisible(false)} />
      <MapScreen pins={pins} selectedLocation={selectedLocation} onMapClick={handleMapClick} />
      
      {memoVisible ? (
        <div className="bottom-sheet" style={{ zIndex: 2000, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1E293B', fontWeight: 800 }}>💬 対話メモを追加（任意）</h3>
          <textarea
            placeholder="有権者の要望などを入力してください..."
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', marginBottom: '1rem', fontSize: '1rem', resize: 'none' }}
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSkipMemo} style={{ flex: 1, padding: '1rem', background: '#F1F5F9', color: '#475569', borderRadius: '9999px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              スキップ
            </button>
            <button onClick={handleSaveMemo} style={{ flex: 1, padding: '1rem', background: '#10B981', color: 'white', borderRadius: '9999px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              保存する
            </button>
          </div>
        </div>
      ) : (
        <ActionBottomSheet onAction={handleAction} />
      )}
      
      <UndoSnackbar visible={undoVisible && !memoVisible} onUndo={handleUndo} onClose={() => setUndoVisible(false)} />
      <PoliSideUpsellPopup visible={upsellVisible} onClose={() => setUpsellVisible(false)} />
    </div>
  );
}

// 認証済みユーザー用マップ（自分のチームIDへリダイレクト）
function AuthenticatedMapRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      supabase.from('users').select('team_id').eq('id', session.user.id).single()
        .then(({ data, error }) => {
          if (error || !data) {
            navigate('/auth');
            return;
          }
          navigate(`/m/${data.team_id}`, { replace: true });
        });
    });
  }, [navigate]);

  return <div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>;
}

// App コンポーネントはルーティングを担当
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/m/:teamId" element={<PublicMapApp />} />
        <Route path="/map" element={<AuthenticatedMapRedirect />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  );
}

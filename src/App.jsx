import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MapScreen from './components/MapScreen';
import ActionBottomSheet from './components/ActionBottomSheet';
import UndoSnackbar from './components/UndoSnackbar';
import PoliSideUpsellPopup from './components/PoliSideUpsellPopup';
import PoliDashCrossSellBanner from './components/PoliDashCrossSellBanner';

// 新規追加ページ群
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';

// 法的ページ群
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Legal from './components/Legal';

// 従来のメインマップ画面ロジックを MapApp コンポーネントに分離
function MapApp() {
  const navigate = useNavigate();
  const [pins, setPins] = useState([]);
  const [actionCount, setActionCount] = useState(0);
  const [teamId, setTeamId] = useState(null);
  const [userId, setUserId] = useState(null);
  
  // UI State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [crossSellVisible, setCrossSellVisible] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    import('./lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          navigate('/auth');
          return;
        }
        setUserId(session.user.id);

        // team_idを取得
        supabase.from('users').select('team_id').eq('id', session.user.id).single()
          .then(({ data, error }) => {
            if (error) {
              console.error(error);
              return;
            }
            setTeamId(data.team_id);
            // チームのピンを取得
            fetchPins(supabase, data.team_id);
            
            // リアルタイム購読
            supabase.channel('custom-all-channel')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'pins', filter: `team_id=eq.${data.team_id}` }, payload => {
                fetchPins(supabase, data.team_id);
              })
              .subscribe();
          });
      });
    });
  }, [navigate]);

  const fetchPins = async (supabase, tid) => {
    const { data, error } = await supabase.from('pins').select('*').eq('team_id', tid);
    if (!error && data) {
      // フロントエンドのフォーマットに合わせる
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
  };

  const handleAction = async (actionType) => {
    if (!selectedLocation) {
      alert('先に地図上の記録したい地点をタップして選択してください。');
      return;
    }

    const { supabase } = await import('./lib/supabase');

    const newPin = {
      team_id: teamId,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      type: actionType,
      created_by: userId
    };

    // DBに保存
    const { data, error } = await supabase.from('pins').insert(newPin).select().single();

    if (!error && data) {
      setPins((prev) => [...prev, { id: data.id, lat: data.lat, lng: data.lng, latest_action_type: data.type }]);
      setLastAction({ id: data.id, lat: data.lat, lng: data.lng });
      setUndoVisible(true);
      setSelectedLocation(null);

      const newCount = actionCount + 1;
      setActionCount(newCount);

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
      const { supabase } = await import('./lib/supabase');
      // DBから削除
      await supabase.from('pins').delete().eq('id', lastAction.id);
      
      setPins((prev) => prev.filter(p => p.id !== lastAction.id));
      setActionCount((prev) => Math.max(0, prev - 1));
      setSelectedLocation({ lat: lastAction.lat, lng: lastAction.lng });
      setLastAction(null);
    }
    setUndoVisible(false);
  };

  return (
    <div className="app-container">
      {/* 簡易ヘッダー: モック用ナビゲーション */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button onClick={() => navigate(-1)} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B' }}>
          ← 戻る
        </button>
      </div>

      <PoliDashCrossSellBanner visible={crossSellVisible} onClose={() => setCrossSellVisible(false)} />
      <MapScreen pins={pins} selectedLocation={selectedLocation} onMapClick={handleMapClick} />
      <ActionBottomSheet onAction={handleAction} />
      <UndoSnackbar visible={undoVisible} onUndo={handleUndo} onClose={() => setUndoVisible(false)} />
      <PoliSideUpsellPopup visible={upsellVisible} onClose={() => setUpsellVisible(false)} />
    </div>
  );
}

// App コンポーネントはルーティングを担当
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/map" element={<MapApp />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  );
}

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
  
  // UI State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [crossSellVisible, setCrossSellVisible] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    const mockPins = [
      { id: '1', lat: 35.6895, lng: 139.6917, latest_action_type: 'absent' },
      { id: '2', lat: 35.6905, lng: 139.6927, latest_action_type: 'flyer' },
      { id: '3', lat: 35.6885, lng: 139.6907, latest_action_type: 'talked' },
    ];
    setPins(mockPins);
  }, []);

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
  };

  const handleAction = (actionType) => {
    if (!selectedLocation) {
      alert('先に地図上の記録したい地点をタップして選択してください。');
      return;
    }

    const newPin = {
      id: Date.now().toString(),
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      latest_action_type: actionType
    };

    setPins((prev) => [...prev, newPin]);
    setLastAction(newPin);
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
  };

  const handleUndo = () => {
    if (lastAction) {
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

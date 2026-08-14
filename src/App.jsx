import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  const [memoName, setMemoName] = useState('');
  const [memoText, setMemoText] = useState('');
  const [activePinIdForMemo, setActivePinIdForMemo] = useState(null);
  const [activeActionTypeForMemo, setActiveActionTypeForMemo] = useState(null);

  const [searchParams] = useSearchParams();
  const queryLat = searchParams.get('lat');
  const queryLng = searchParams.get('lng');
  const initialCenter = queryLat && queryLng ? [parseFloat(queryLat), parseFloat(queryLng)] : null;

  const fetchPins = async (tid) => {
    const { data, error } = await supabase.from('pins').select('*').eq('team_id', tid);
    if (!error && data) {
      const formatted = data.map(p => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        latest_action_type: p.type,
        memo: p.memo,
        action_count: p.action_count
      }));
      setPins(formatted);
      setActionCount(formatted.length);
    }
  };

  useEffect(() => {
    if (!teamId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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


  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
    // マップをタップしたときにメモが入力されていなければ閉じる
    if (memoVisible && !memoText.trim()) {
      handleSkipMemo();
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedLocation) return;

    const existingPin = pins.find(p => p.lat === selectedLocation.lat && p.lng === selectedLocation.lng);
    const isCumulativeAction = ['station_flyer', 'tsujidachi', 'speech'].includes(actionType);
    const isStateAction = ['absent', 'talked', 'poster'].includes(actionType);

    if (existingPin) {
      if (isStateAction) {
        const newMemo = (actionType === (existingPin.latest_action_type || existingPin.type)) ? existingPin.memo : null;
        const { error } = await supabase.from('pins').update({ type: actionType, action_count: 1, memo: newMemo }).eq('id', existingPin.id);
        if (error) { alert('更新に失敗しました。'); return; }
        
        setPins(prev => prev.map(p => p.id === existingPin.id ? { ...p, latest_action_type: actionType, action_count: 1, memo: newMemo } : p));
        setLastAction({ id: existingPin.id, lat: selectedLocation.lat, lng: selectedLocation.lng, isUpdate: true, previousType: existingPin.latest_action_type, previousMemo: existingPin.memo });
        setSelectedLocation(null);
        
        if (actionType === 'talked') {
           setActivePinIdForMemo(existingPin.id);
           setActiveActionTypeForMemo(actionType);
           
           let parsedName = '';
           let parsedContent = newMemo || '';
           if (newMemo && newMemo.startsWith('{')) {
             try {
               const obj = JSON.parse(newMemo);
               if (obj.name !== undefined) {
                 parsedName = obj.name;
                 parsedContent = obj.content;
               }
             } catch (e) {
               // ignore
             }
           }
           setMemoName(parsedName);
           setMemoText(parsedContent);
           setMemoVisible(true);
        } else {
           setUndoVisible(true);
        }
        return;
      } 
      else if (isCumulativeAction) {
        if ((existingPin.latest_action_type || existingPin.type) === actionType) {
          if (actionType === 'speech') {
            const newCount = (existingPin.action_count || 1) + 1;
            await supabase.from('pins').update({ action_count: newCount }).eq('id', existingPin.id);
            setPins(prev => prev.map(p => p.id === existingPin.id ? { ...p, action_count: newCount } : p));
            setLastAction({ id: existingPin.id, lat: selectedLocation.lat, lng: selectedLocation.lng, isUpdate: true, previousCount: existingPin.action_count || 1 });
            setSelectedLocation(null);
            setUndoVisible(true);
            return;
          } else {
            setLastAction({ id: existingPin.id, lat: selectedLocation.lat, lng: selectedLocation.lng, isUpdate: true, previousCount: existingPin.action_count || 0 });
            setSelectedLocation(null);
            setActivePinIdForMemo(existingPin.id);
            setActiveActionTypeForMemo(actionType);
            setMemoText('');
            setMemoVisible(true);
            return;
          }
        }
      }
    }

    const initCount = ['station_flyer', 'tsujidachi'].includes(actionType) ? 0 : 1;
    const newPin = {
      team_id: teamId,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      type: actionType,
      action_count: initCount
    };
    const { data, error } = await supabase.from('pins').insert(newPin).select().single();
    if (error) { alert('記録に失敗しました。'); return; }

    setPins(prev => [...prev, { id: data.id, lat: data.lat, lng: data.lng, latest_action_type: data.type, action_count: initCount }]);
    setActionCount(prev => prev + 1);

    setLastAction({ id: data.id, lat: selectedLocation.lat, lng: selectedLocation.lng, isUpdate: false });
    setSelectedLocation(null);

    if (['talked', 'station_flyer', 'tsujidachi'].includes(actionType)) {
      setActivePinIdForMemo(data.id);
      setActiveActionTypeForMemo(actionType);
      setMemoName('');
      setMemoText('');
      setMemoVisible(true);
    } else {
      setUndoVisible(true);
    }

    if (!existingPin && actionCount + 1 === 10) setUpsellVisible(true);
    if (!existingPin && actionType === 'poster') setCrossSellVisible(true);
  };

  const handleUndo = async () => {
    if (lastAction) {
      if (lastAction.isUpdate) {
        if (lastAction.previousType) {
          await supabase.from('pins').update({ type: lastAction.previousType, memo: lastAction.previousMemo || null }).eq('id', lastAction.id);
          setPins(prev => prev.map(p => p.id === lastAction.id ? { ...p, latest_action_type: lastAction.previousType, memo: lastAction.previousMemo || null } : p));
        } else {
          await supabase.from('pins').update({ action_count: lastAction.previousCount }).eq('id', lastAction.id);
          setPins(prev => prev.map(p => p.id === lastAction.id ? { ...p, action_count: lastAction.previousCount } : p));
        }
      } else {
        await supabase.from('pins').delete().eq('id', lastAction.id);
        setPins(prev => prev.filter(p => p.id !== lastAction.id));
        setActionCount(prev => Math.max(0, prev - 1));
      }
      setSelectedLocation({ lat: lastAction.lat, lng: lastAction.lng });
      setLastAction(null);
    }
    setUndoVisible(false);
  };

  const handleSaveMemo = async () => {
    if (activePinIdForMemo && (memoText.trim() || memoName.trim())) {
      let finalMemo = memoText.trim();
      let updatePayload = { memo: finalMemo };
      
      if (activeActionTypeForMemo === 'talked') {
        const obj = {
          name: memoName.trim(),
          content: finalMemo
        };
        finalMemo = JSON.stringify(obj);
        updatePayload = { memo: finalMemo };
      } else if (['station_flyer', 'tsujidachi'].includes(activeActionTypeForMemo) && !isNaN(finalMemo)) {
        const addedVal = parseInt(finalMemo, 10);
        const prevTotal = (lastAction && lastAction.isUpdate) ? (lastAction.previousCount || 0) : 0;
        const newTotal = prevTotal + addedVal;
        
        finalMemo = activeActionTypeForMemo === 'tsujidachi' ? `${addedVal}時間` : `${addedVal}枚配布`;
        updatePayload = { memo: finalMemo, action_count: newTotal };
      }
      
      await supabase.from('pins').update(updatePayload).eq('id', activePinIdForMemo);
      setPins(prev => prev.map(p => p.id === activePinIdForMemo ? { ...p, memo: finalMemo, action_count: updatePayload.action_count || p.action_count } : p));
      setUndoVisible(true);
    } else if (activePinIdForMemo && lastAction && lastAction.isUpdate) {
      // Empty text save on update? Do nothing, basically cancel.
    }
    setMemoVisible(false);
    setActivePinIdForMemo(null);
    setActiveActionTypeForMemo(null);
  };

  const handleSkipMemo = async () => {
    if (lastAction && !lastAction.isUpdate && ['station_flyer', 'tsujidachi'].includes(activeActionTypeForMemo)) {
      await supabase.from('pins').delete().eq('id', activePinIdForMemo);
      setPins(prev => prev.filter(p => p.id !== activePinIdForMemo));
      setActionCount(prev => Math.max(0, prev - 1));
      setUndoVisible(false);
    } else if (lastAction && lastAction.isUpdate && ['station_flyer', 'tsujidachi'].includes(activeActionTypeForMemo)) {
      setUndoVisible(false);
    } else {
      setUndoVisible(true);
    }
    setMemoVisible(false);
    setActivePinIdForMemo(null);
    setActiveActionTypeForMemo(null);
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

  let memoTitle = '💬 メモを追加';
  let memoPlaceholder = '入力してください...';
  let memoIsNumber = false;
  let memoIsTalked = false;
  let unitText = '';

  if (activeActionTypeForMemo === 'talked') {
    memoTitle = '💬 ご挨拶メモ（任意）';
    memoPlaceholder = '有権者の要望などを入力してください...';
    memoIsTalked = true;
  } else if (activeActionTypeForMemo === 'station_flyer') {
    memoTitle = (lastAction && lastAction.isUpdate) ? '📄 配布枚数を追加記録' : '📄 配布枚数を記録';
    memoPlaceholder = '例: 300';
    memoIsNumber = true;
    unitText = '枚';
  } else if (activeActionTypeForMemo === 'tsujidachi') {
    memoTitle = (lastAction && lastAction.isUpdate) ? '🧍‍♂️ 実施時間を追加記録' : '🧍‍♂️ 実施時間を記録';
    memoPlaceholder = '例: 2';
    memoIsNumber = true;
    unitText = '時間';
  }

  return (
    <div className="app-container">
      {/* 戻るボタン */}
      <div style={{ position: 'absolute', top: 'max(1rem, env(safe-area-inset-top))', left: '1rem', zIndex: 1000 }}>
        <button onClick={() => window.history.back()} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B' }}>
          ← 戻る
        </button>
      </div>

      <PoliDashCrossSellBanner visible={crossSellVisible} onClose={() => setCrossSellVisible(false)} />
        <MapScreen 
          pins={pins} 
          selectedLocation={selectedLocation} 
          onMapClick={handleMapClick}
          initialCenter={initialCenter}
        />
      
      {memoVisible ? (
        <div className="bottom-sheet" style={{ zIndex: 2000, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: '#1E293B', fontWeight: 800 }}>{memoTitle}</h3>
          {memoIsNumber ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder={memoPlaceholder}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1.2rem', textAlign: 'right' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#475569' }}>{unitText}</span>
            </div>
          ) : memoIsTalked ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="お名前（任意）"
                value={memoName}
                onChange={(e) => setMemoName(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1.1rem' }}
              />
              <textarea
                placeholder={memoPlaceholder}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                style={{ width: '100%', minHeight: '120px', padding: '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1.1rem', resize: 'vertical' }}
              />
            </div>
          ) : (
            <textarea
              placeholder={memoPlaceholder}
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', marginBottom: '1rem', fontSize: '1rem', resize: 'none' }}
            />
          )}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSkipMemo} style={{ flex: 1, padding: '1rem', background: '#F1F5F9', color: '#475569', borderRadius: '9999px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              スキップ
            </button>
            <button onClick={handleSaveMemo} style={{ flex: 1, padding: '1rem', background: '#2563EB', color: 'white', borderRadius: '9999px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
              保存する
            </button>
          </div>
        </div>
      ) : (
        <ActionBottomSheet onAction={handleAction} onClose={() => setSelectedLocation(null)} />
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

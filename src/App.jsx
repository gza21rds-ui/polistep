import React, { useState, useEffect } from 'react';
import liff from '@line/liff';
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
import useNoIndex from './hooks/useNoIndex';

// 画像圧縮ヘルパー関数（長辺800px、JPEG quality 0.7で約50-80KBに圧縮）
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 公開マップ画面（登録不要、URLのteamIdでアクセス）
function PublicMapApp() {
  useNoIndex();
  const { teamId } = useParams();
  const navigate = useNavigate();
  
  // LINE Profile State
  const [lineProfile, setLineProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;
    liff.init({ liffId: '2011462282-d9h0l139' }).then(() => {
      if (!isMounted) return;
      if (liff.isLoggedIn()) {
        liff.getProfile().then(profile => {
          if (isMounted) setLineProfile(profile);
        }).catch(err => console.error('LIFF getProfile error', err));
      } else if (liff.isInClient()) {
        // LINEアプリ内で開いている場合は自動ログイン
        liff.login();
      }
    }).catch(err => console.error('LIFF init error', err));
    return () => { isMounted = false; };
  }, []);
  const [pins, setPins] = useState([]);
  const [actionCount, setActionCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [upsellVisible, setUpsellVisible] = useState(false);
  const [crossSellVisible, setCrossSellVisible] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  
  // Memo Feature State
  const [memoVisible, setMemoVisible] = useState(false);
  const [memoName, setMemoName] = useState('');
  const [memoText, setMemoText] = useState('');
  const [memoImage, setMemoImage] = useState(null);
  const [activePinIdForMemo, setActivePinIdForMemo] = useState(null);
  const [activeActionTypeForMemo, setActiveActionTypeForMemo] = useState(null);
  
  const [mapCenter, setMapCenter] = useState(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(true);
  
  const [userRole, setUserRole] = useState(null);

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
    // ログイン状態とユーザーの役割（role）をチェック
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('users').select('role').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data) setUserRole(data.role); // 'admin' or 'staff'
          });
      }
    });

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


  const handleMapClick = (latlng, pin = null) => {
    // マップをタップしたときにメモが入力されていなければ閉じる
    if (memoVisible && !memoText.trim() && !memoName.trim()) {
      handleSkipMemo();
    }

    if (pin) {
      const type = pin.latest_action_type || pin.type;
      if (['speech', 'station_flyer', 'tsujidachi'].includes(type)) {
        // 絵文字ピンの場合はメニューを挟まずに即座に実行
        handleAction(type, latlng, pin);
        return; // ここで早期リターンすることでActionBottomSheetの展開を防ぐ
      }
    }

    setSelectedLocation(latlng);
    setSelectedPin(pin);
    setIsSheetExpanded(true);
  };

  const handleMapMove = (center) => {
    setMapCenter(center);
  };

  const handleDeletePin = async (pinId) => {
    await supabase.from('pins').delete().eq('id', pinId);
    setPins(prev => prev.filter(p => p.id !== pinId));
    setActionCount(prev => Math.max(0, prev - 1));
    setSelectedLocation(null);
    setSelectedPin(null);
    setUndoVisible(false);
  };

  const handleAction = async (actionType, specificLocation = null, specificPin = null) => {
    // もし specificLocation や selectedLocation が無くても、mapCenter があればそれを使う
    const loc = specificLocation || selectedLocation || mapCenter;
    const pin = specificPin !== null ? specificPin : selectedPin;

    if (!loc) {
      alert('マップを移動して記録する場所を中央に合わせてください。');
      return;
    }

    const existingPin = pin;
    const isCumulativeAction = ['station_flyer', 'tsujidachi', 'speech'].includes(actionType);
    const isStateAction = ['absent', 'talked', 'poster', 'poster_ok'].includes(actionType);
    const existingType = existingPin ? (existingPin.latest_action_type || existingPin.type) : null;
    const canOverwrite = existingPin ? ['absent', 'talked', 'flyer'].includes(existingType) : false;

    if (existingPin) {
      if (existingType === actionType) {
        if (isCumulativeAction) {
          if (actionType === 'speech') {
            const newCount = (existingPin.action_count || 1) + 1;
            await supabase.from('pins').update({ action_count: newCount }).eq('id', existingPin.id);
            setPins(prev => prev.map(p => p.id === existingPin.id ? { ...p, action_count: newCount } : p));
            setLastAction({ id: existingPin.id, lat: existingPin.lat, lng: existingPin.lng, isUpdate: true, previousCount: existingPin.action_count || 1 });
            setSelectedLocation(null);
            setSelectedPin(null);
            setUndoVisible(true);
            return;
          } else {
            setLastAction({ id: existingPin.id, lat: existingPin.lat, lng: existingPin.lng, isUpdate: true, previousCount: existingPin.action_count || 0 });
            setSelectedLocation(null);
            setSelectedPin(null);
            setActivePinIdForMemo(existingPin.id);
            setActiveActionTypeForMemo(actionType);
            setMemoName('');
            setMemoText('');
            setMemoVisible(true);
            return;
          }
        } else {
          // SAME state action -> Edit memo
          setSelectedLocation(null);
          setSelectedPin(null);
          if (actionType === 'talked') {
             setActivePinIdForMemo(existingPin.id);
             setActiveActionTypeForMemo(actionType);
             let parsedName = '';
             let parsedContent = existingPin.memo || '';
             let parsedImage = null;
             if (existingPin.memo && existingPin.memo.startsWith('{')) {
               try {
                 const obj = JSON.parse(existingPin.memo);
                 if (obj.name !== undefined) parsedName = obj.name;
                 if (obj.content !== undefined) parsedContent = obj.content;
                 if (obj.imageUrl !== undefined) parsedImage = obj.imageUrl;
               } catch (e) {}
             }
             setMemoName(parsedName);
             setMemoText(parsedContent);
             setMemoImage(parsedImage);
             setMemoVisible(true);
          }
          return;
        }
      } else if (canOverwrite && isStateAction) {
        // OVERWRITE existing pin (e.g. absent -> talked, absent -> poster)
        const { error } = await supabase.from('pins').update({ type: actionType, action_count: 1, memo: null }).eq('id', existingPin.id);
        if (error) { alert('更新に失敗しました。'); return; }
        
        setPins(prev => prev.map(p => p.id === existingPin.id ? { ...p, latest_action_type: actionType, action_count: 1, memo: null } : p));
        setLastAction({ id: existingPin.id, lat: existingPin.lat, lng: existingPin.lng, isUpdate: true, previousType: existingType, previousMemo: existingPin.memo });
        setSelectedLocation(null);
        setSelectedPin(null);
        
        if (actionType === 'talked') {
           setActivePinIdForMemo(existingPin.id);
           setActiveActionTypeForMemo(actionType);
           setMemoName('');
           setMemoText('');
           setMemoImage(null);
           setMemoVisible(true);
        } else {
           setUndoVisible(true);
        }
        return;
      }
      // If none of the above matched, FALL THROUGH to create a new pin! (e.g. poster -> talked, speech -> talked, speech -> station_flyer)
    }

    // New pin
    const initCount = ['station_flyer', 'tsujidachi'].includes(actionType) ? 0 : 1;
    let newLat = loc ? loc.lat : (existingPin ? existingPin.lat : 0);
    let newLng = loc ? loc.lng : (existingPin ? existingPin.lng : 0);
    
    // 既存のピン上で新しいピンを作る場合、重なりを防ぐためにごく僅かなズレ（数メートル）を加える
    if (existingPin) {
      newLat += (Math.random() - 0.5) * 0.00005;
      newLng += (Math.random() - 0.5) * 0.00005;
    }

    const newPin = {
      team_id: teamId,
      lat: newLat,
      lng: newLng,
      type: actionType,
      action_count: initCount,
      // LINE連携されている場合はLINEの名前を記録
      created_by: lineProfile ? lineProfile.displayName : 'スタッフ'
    };
    
    // Safety check
    if (!newPin.lat || !newPin.lng) return;

    const { data, error } = await supabase.from('pins').insert(newPin).select().single();
    if (error) { alert('記録に失敗しました。'); return; }

    setPins(prev => [...prev, { id: data.id, lat: data.lat, lng: data.lng, latest_action_type: data.type, action_count: initCount }]);
    setActionCount(prev => prev + 1);

    setLastAction({ id: data.id, lat: data.lat, lng: data.lng, isUpdate: false });
    setSelectedLocation(null);
    setSelectedPin(null);

    if (['talked', 'station_flyer', 'tsujidachi'].includes(actionType)) {
      setActivePinIdForMemo(data.id);
      setActiveActionTypeForMemo(actionType);
      setMemoName('');
      setMemoText('');
      setMemoImage(null);
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
    if (activePinIdForMemo && (memoText.trim() || memoName.trim() || memoImage)) {
      let finalMemo = memoText.trim();
      let updatePayload = { memo: finalMemo };
      
      if (activeActionTypeForMemo === 'talked') {
        const obj = {
          name: memoName.trim(),
          content: finalMemo,
          imageUrl: memoImage || null
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
    setMemoImage(null);
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
    setMemoImage(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file);
      setMemoImage(compressedDataUrl);
    } catch (err) {
      alert('画像の処理に失敗しました。');
    }
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
    memoTitle = '💬 ご挨拶メモ＆写真（任意）';
    memoPlaceholder = '有権者の要望や対話内容を入力してください...';
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
    <div className="app-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 戻るボタン群 */}
      <div style={{ position: 'absolute', top: 'max(1rem, env(safe-area-inset-top))', left: '1rem', zIndex: 1000, display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => window.history.back()} style={{ padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
          <span>←</span> 戻る
        </button>
        {userRole && (
          <button onClick={() => navigate(userRole === 'admin' ? '/admin' : '/staff')} style={{ padding: '0.6rem 1rem', background: '#1E293B', backdropFilter: 'blur(4px)', borderRadius: '9999px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', cursor: 'pointer', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <span>⚙️</span> {userRole === 'admin' ? '管理画面へ' : 'ダッシュボードへ'}
          </button>
        )}
      </div>

      <PoliDashCrossSellBanner visible={crossSellVisible} onClose={() => setCrossSellVisible(false)} />
        <MapScreen 
          pins={pins} 
          selectedLocation={selectedLocation} 
          onMapClick={handleMapClick}
          onMapMove={handleMapMove}
          initialCenter={initialCenter}
        />
      
      {memoVisible ? (
        <div className="bottom-sheet" style={{ zIndex: 2000, boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#1E293B', fontWeight: 800 }}>{memoTitle}</h3>
            <button onClick={handleSkipMemo} style={{ background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', fontWeight: 'bold' }}>
              ✕
            </button>
          </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="お名前（任意）"
                value={memoName}
                onChange={(e) => setMemoName(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1rem' }}
              />
              <textarea
                placeholder={memoPlaceholder}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                style={{ width: '100%', minHeight: '90px', padding: '0.85rem 1rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '1rem', resize: 'vertical' }}
              />

              {/* 写真添付エリア */}
              <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '12px', border: '1.5px dashed #CBD5E1' }}>
                {memoImage ? (
                  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={memoImage} 
                      alt="添付写真プレビュー" 
                      style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                    />
                    <button
                      onClick={() => setMemoImage(null)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#EF4444',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                      title="写真を削除"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                    <span>📷 写真を追加（名刺や現場状況など）</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                )}
              </div>
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
          
          {/* 既存のピンの場合は削除ボタンを表示 */}
          {pins.find(p => p.id === activePinIdForMemo)?.action_count > 0 && (
            <button 
              onClick={() => {
                if (window.confirm('この記録を削除しますか？')) {
                  handleDeletePin(activePinIdForMemo);
                  setMemoVisible(false);
                }
              }}
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', border: '1px solid #FCA5A5', fontWeight: 'bold', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              🗑️ この記録を削除
            </button>
          )}
        </div>
      ) : (
        <ActionBottomSheet 
          isExpanded={isSheetExpanded}
          onToggleExpand={() => setIsSheetExpanded(prev => !prev)}
          onClose={() => { setSelectedLocation(null); setSelectedPin(null); setIsSheetExpanded(false); }} 
          onAction={handleAction} 
          selectedPin={selectedPin}
          onDeletePin={handleDeletePin}
        />
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

import StaffDashboard from './components/StaffDashboard';

// App コンポーネントはルーティングを担当
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/m/:teamId" element={<PublicMapApp />} />
        <Route path="/map" element={<AuthenticatedMapRedirect />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </BrowserRouter>
  );
}

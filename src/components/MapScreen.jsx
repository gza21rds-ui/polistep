import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, Crosshair } from 'lucide-react';
import L from 'leaflet';

// Create custom icons based on action type
const getIcon = (pin) => {
  const actionType = pin.latest_action_type || pin.type;
  const colors = {
    absent: '#1D4ED8',        // 留守
    flyer: '#F59E0B',         // チラシ
    talked: '#EA580C',        // ご挨拶
    poster: '#DC2626',        // ポスター貼付
    poster_ok: '#166534',     // ポスター許可
    speech: '#7C3AED',        // 街頭演説
    station_flyer: '#0284C7', // 駅頭ビラ
    tsujidachi: '#059669'     // 辻立ち
  };
  const color = colors[actionType] || '#888';
  
  let label = '';
  if (actionType === 'station_flyer') {
    const count = pin.action_count || (pin.memo ? pin.memo.replace(/[^0-9]/g, '') : '');
    if (count) label = `📃 ${count}枚`;
    else label = '📃 ビラ配り';
  } else if (actionType === 'tsujidachi') {
    const count = pin.action_count || (pin.memo ? pin.memo.replace(/[^0-9]/g, '') : '');
    if (count) label = `🙋‍♂️ ${count}時間`;
    else label = '🙋‍♂️ 辻立ち';
  } else if (actionType === 'speech') {
    const count = pin.action_count || 1;
    label = `🎤 ${count}回`;
  }

  if (label) {
    return L.divIcon({
      className: 'custom-marker-label',
      html: `<div style="background-color: ${color}; padding: 0.25rem 0.5rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); color: white; font-size: 0.75rem; font-weight: bold; white-space: nowrap; transform: translate(-50%, -50%);">${label}</div>`,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const getSelectedIcon = () => {
  return L.divIcon({
    className: 'selected-marker',
    html: `<div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(239, 68, 68, 0.25); animation: popIn 0.3s ease-out;"></div>
      <div style="background-color: #EF4444; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.6);"></div>
    </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const getCurrentLocationIcon = () => {
  return L.divIcon({
    className: 'current-location-marker',
    html: `<div class="current-location-pulse"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

function MapEventHandler({ onMapClick, onMapMove }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
    move() {
      if (onMapMove) {
        onMapMove(map.getCenter());
      }
    }
  });
  return null;
}

function MapPanHandler({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 18);
    }
  }, [center, map]);
  return null;
}

// 初回およびボタンタップ時に現在地へパンするコントローラー
function GeolocationController({ initialCenter, onLocationFound, triggerLocate, onLocatingChange }) {
  const map = useMap();
  const hasInitialized = useRef(false);
  const lastTriggerRef = useRef(0);
  const onLocationFoundRef = useRef(onLocationFound);
  const onLocatingChangeRef = useRef(onLocatingChange);

  useEffect(() => {
    onLocationFoundRef.current = onLocationFound;
    onLocatingChangeRef.current = onLocatingChange;
  }, [onLocationFound, onLocatingChange]);

  // 初回マウント時：URL指定がなければ現在地へ移動
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!initialCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          map.setView(coords, 17);
          if (onLocationFoundRef.current) onLocationFoundRef.current(coords);
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [initialCenter, map]);

  // 手動で現在地ボタンを押した時（1回のクリックにつき1回だけ実行）
  useEffect(() => {
    if (!triggerLocate || triggerLocate === lastTriggerRef.current) return;
    lastTriggerRef.current = triggerLocate;

    if (!navigator.geolocation) {
      alert('お使いの端末・ブラウザは位置情報に対応していません。');
      return;
    }

    if (onLocatingChangeRef.current) onLocatingChangeRef.current(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        const targetZoom = Math.max(map.getZoom(), 17);
        map.stop();
        map.setView(coords, targetZoom, { animate: true, duration: 0.5 });
        if (onLocationFoundRef.current) onLocationFoundRef.current(coords);
        if (onLocatingChangeRef.current) onLocatingChangeRef.current(false);
      },
      () => {
        if (onLocatingChangeRef.current) onLocatingChangeRef.current(false);
        alert('現在地を取得できませんでした。端末の位置情報設定をご確認ください。');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  }, [triggerLocate, map]);

  return null;
}

export default function MapScreen({ pins, selectedLocation, onMapClick, onMapMove, initialCenter }) {
  const center = initialCenter || [35.6895, 139.6917];
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locateTrigger, setLocateTrigger] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  return (
    <div className="map-section" style={{ position: 'relative' }}>
      {/* 画面中央の登録ターゲットピン（ここが登録される場所） */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 中心点の小さな照準リング */}
        <div style={{ position: 'relative', width: '40px', height: '40px', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.28))' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none' }}>
            {/* 地面の正確な記録位置を示す中心点 */}
            <circle cx="50" cy="50" r="14" stroke="#FFFFFF" strokeWidth="8px" />
            <circle cx="50" cy="50" r="14" stroke="#EF4444" strokeWidth="4px" />
            <circle cx="50" cy="50" r="4" fill="#EF4444" />
            {/* 中心の少し上に浮いた登録ピンシルエット */}
            <path d="M50 4 C37 4 27 14 27 27 C27 42 50 54 50 54 C50 54 73 42 73 27 C73 14 63 4 50 4 Z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" />
            <circle cx="50" cy="26" r="8" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* 現在地へジャンプするフローティングGPSボタン */}
      <button 
        className="btn-gps tap-scale" 
        onClick={() => setLocateTrigger(prev => prev + 1)}
        disabled={isLocating}
        title="現在地へ移動"
        aria-label="現在地へ移動"
      >
        <Navigation size={16} color="#FFFFFF" fill="#FFFFFF" />
        <span>{isLocating ? '測位中...' : '現在地'}</span>
      </button>

      <MapContainer center={center} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPanHandler center={initialCenter} />
        <GeolocationController 
          initialCenter={initialCenter} 
          onLocationFound={setCurrentCoords}
          triggerLocate={locateTrigger}
          onLocatingChange={setIsLocating}
        />
        <MapEventHandler onMapClick={onMapClick} onMapMove={onMapMove} />
        
        {/* 自分の現在地マーカー（青い波紋ドット） */}
        {currentCoords && (
          <Marker position={currentCoords} icon={getCurrentLocationIcon()} />
        )}

        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={getIcon(pin)}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                onMapClick({ lat: pin.lat, lng: pin.lng }, pin);
              }
            }}
          />
        ))}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={getSelectedIcon()} />
        )}
      </MapContainer>
    </div>
  );
}

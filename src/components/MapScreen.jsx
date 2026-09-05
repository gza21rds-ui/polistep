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
    html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 12px rgba(59,130,246,0.9); animation: popIn 0.3s ease-out;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
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
function GeolocationController({ initialCenter, onLocationFound, triggerLocate }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  // 初回マウント時：URL指定がなければ現在地へ移動
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!initialCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          map.setView(coords, 17);
          if (onLocationFound) onLocationFound(coords);
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [initialCenter, map, onLocationFound]);

  // 手動で現在地ボタンを押した時
  useEffect(() => {
    if (triggerLocate && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          map.flyTo(coords, 17, { duration: 1.2 });
          if (onLocationFound) onLocationFound(coords);
        },
        (err) => {
          alert('現在地を取得できませんでした。端末の位置情報設定をご確認ください。');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, [triggerLocate, map, onLocationFound]);

  return null;
}

export default function MapScreen({ pins, selectedLocation, onMapClick, onMapMove, initialCenter }) {
  const center = initialCenter || [35.6895, 139.6917];
  const [currentCoords, setCurrentCoords] = useState(null);
  const [locateTrigger, setLocateTrigger] = useState(0);

  return (
    <div className="map-section" style={{ position: 'relative' }}>
      {/* 画面中央のクロスヘア（照準） */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'relative', width: '36px', height: '36px', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none' }}>
            {/* ホワイト・アウトライン（下敷き：どんな背景でもクッキリ視認） */}
            <circle cx="50" cy="50" r="16" stroke="#FFFFFF" strokeWidth="10px" />
            <line x1="50" y1="0" x2="50" y2="24" stroke="#FFFFFF" strokeWidth="10px" strokeLinecap="round" />
            <line x1="50" y1="76" x2="50" y2="100" stroke="#FFFFFF" strokeWidth="10px" strokeLinecap="round" />
            <line x1="0" y1="50" x2="24" y2="50" stroke="#FFFFFF" strokeWidth="10px" strokeLinecap="round" />
            <line x1="76" y1="50" x2="100" y2="50" stroke="#FFFFFF" strokeWidth="10px" strokeLinecap="round" />
            <circle cx="50" cy="50" r="6" fill="#FFFFFF" />

            {/* コア・ブルーライン（メインストローク） */}
            <circle cx="50" cy="50" r="16" stroke="#2563EB" strokeWidth="5px" />
            <line x1="50" y1="2" x2="50" y2="24" stroke="#2563EB" strokeWidth="5px" strokeLinecap="round" />
            <line x1="50" y1="76" x2="50" y2="98" stroke="#2563EB" strokeWidth="5px" strokeLinecap="round" />
            <line x1="2" y1="50" x2="24" y2="50" stroke="#2563EB" strokeWidth="5px" strokeLinecap="round" />
            <line x1="76" y1="50" x2="98" y2="50" stroke="#2563EB" strokeWidth="5px" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3.5" fill="#2563EB" />
          </svg>
        </div>
      </div>

      {/* 現在地へジャンプするフローティングGPSボタン */}
      <button 
        className="btn-gps tap-scale" 
        onClick={() => setLocateTrigger(prev => prev + 1)}
        title="現在地へ移動"
      >
        <Navigation size={22} color="#2563EB" />
      </button>

      <MapContainer center={center} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPanHandler center={initialCenter} />
        <GeolocationController 
          initialCenter={initialCenter} 
          onLocationFound={(coords) => setCurrentCoords(coords)}
          triggerLocate={locateTrigger}
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

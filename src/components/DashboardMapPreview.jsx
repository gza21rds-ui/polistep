import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Maximize2, Layers } from 'lucide-react';
import L from 'leaflet';

// マップマーカーアイコン定義
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

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

// 全ピンが収まるように自動ズーム調整するコンポーネント
function AutoBounds({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (pins && pins.length > 0) {
      const validPins = pins.filter(p => p.lat && p.lng);
      if (validPins.length > 0) {
        const bounds = L.latLngBounds(validPins.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      }
    }
  }, [pins, map]);
  return null;
}

export default function DashboardMapPreview({ pins = [], teamId }) {
  const defaultCenter = [35.6895, 139.6917]; // 東京駅付近（デフォルト）
  const initialCenter = pins.length > 0 && pins[0].lat && pins[0].lng
    ? [pins[0].lat, pins[0].lng]
    : defaultCenter;

  return (
    <div id="tour-dashboard-map" className="dashboard-map-preview-container" style={{
      position: 'relative',
      width: '100%',
      height: '380px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 12px 32px -4px rgba(37, 99, 235, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
      border: '1px solid rgba(226, 232, 240, 0.9)',
      background: '#f8fafc'
    }}>
      {/* マップヘッダーバッジ */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#0F172A'
      }}>
        <Layers size={18} color="#2563EB" />
        <span>活動エリアマップ ({pins.length}件の記録)</span>
      </div>

      {/* フルマップを開くクイックボタン */}
      {teamId && (
        <Link
          to={`/m/${teamId}`}
          className="btn-fire"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            zIndex: 1000,
            textDecoration: 'none',
            color: 'white',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
          }}
        >
          <Maximize2 size={18} />
          マップを全画面で開く
        </Link>
      )}

      {/* Leaflet 地図 */}
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoBounds pins={pins} />
        {pins.map((pin) => (
          pin.lat && pin.lng ? (
            <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={getIcon(pin)}>
              <Popup>
                <div style={{ padding: '4px', maxWidth: '200px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: '#0F172A' }}>
                    {pin.type === 'poster' ? '📌 ポスター掲示' :
                     pin.type === 'talked' ? '🗣 対話・ご挨拶' :
                     pin.type === 'flyer' ? '📬 ビラ投函' :
                     pin.type === 'absent' ? '🚪 留守' :
                     pin.type === 'station_flyer' ? '📃 駅頭ビラ' :
                     pin.type === 'speech' ? '🎤 街頭演説' :
                     pin.type === 'tsujidachi' ? '🙋‍♂️ 辻立ち' : '活動記録'}
                  </p>
                  {(() => {
                    if (!pin.memo) return null;
                    let displayContent = pin.memo;
                    let displayName = '';
                    let displayImage = null;
                    if (pin.memo.startsWith('{')) {
                      try {
                        const obj = JSON.parse(pin.memo);
                        if (obj.name) displayName = obj.name;
                        if (obj.content) displayContent = obj.content;
                        if (obj.imageUrl) displayImage = obj.imageUrl;
                      } catch (e) {}
                    }
                    return (
                      <div style={{ marginTop: '4px' }}>
                        {displayName && <p style={{ margin: '0 0 2px 0', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>{displayName}</p>}
                        {displayContent && <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>{displayContent}</p>}
                        {displayImage && (
                          <img 
                            src={displayImage} 
                            alt="記録写真" 
                            style={{ width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '6px', marginTop: '6px' }} 
                          />
                        )}
                      </div>
                    );
                  })()}
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}

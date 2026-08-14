import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom icons based on action type
const getIcon = (pin) => {
  const actionType = pin.latest_action_type || pin.type;
  const colors = {
    absent: '#1D4ED8',     // 留守
    flyer: '#F59E0B',      // チラシ
    talked: '#EA580C',     // ご挨拶
    poster: '#DC2626',     // ポスター貼付
    poster_ok: '#166534',  // ポスター許可
    speech: '#7C3AED',     // 街頭演説
    station_flyer: '#0284C7', // 駅頭ビラ
    tsujidachi: '#059669'  // 辻立ち
  };
  const color = colors[actionType] || '#888';
  
  let label = '';
  if (actionType === 'station_flyer') {
    const count = pin.action_count || (pin.memo ? pin.memo.replace(/[^0-9]/g, '') : '');
    if (count) label = `${count}枚`;
  } else if (actionType === 'tsujidachi') {
    const count = pin.action_count || (pin.memo ? pin.memo.replace(/[^0-9]/g, '') : '');
    if (count) label = `🧍‍♂️ ${count}時間`;
    else label = '🧍‍♂️ 辻立ち';
  } else if (actionType === 'speech') {
    const count = pin.action_count || 1;
    label = `🎤 ${count}回`;
  }

  if (label) {
    return L.divIcon({
      className: 'custom-marker-label',
      html: `<div style="background-color: ${color}; padding: 0.25rem 0.5rem; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); color: white; font-size: 0.75rem; font-weight: bold; white-space: nowrap; transform: translate(-50%, -50%);">${label}</div>`,
      iconSize: [0, 0], // CSS handles the size, centering via transform
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

function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function MapPanHandler({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, 18);
    }
  }, [center, map]);
  return null;
}

export default function MapScreen({ pins, selectedLocation, onMapClick, initialCenter }) {
  const center = initialCenter || [35.6895, 139.6917];

  return (
    <div className="map-section">
      <MapContainer center={center} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPanHandler center={initialCenter} />
        <MapEventHandler onMapClick={onMapClick} />
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={getIcon(pin)}
            eventHandlers={{
              click: () => {
                onMapClick({ lat: pin.lat, lng: pin.lng });
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

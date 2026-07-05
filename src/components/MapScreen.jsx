import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Create custom icons based on action type
const getIcon = (actionType) => {
  const colors = {
    absent: '#1D4ED8',
    flyer: '#F59E0B',
    talked: '#EA580C',
    poster: '#DC2626'
  };
  const color = colors[actionType] || '#888';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%;"></div>`,
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

export default function MapScreen({ pins, selectedLocation, onMapClick }) {
  // Default center (e.g., Tokyo)
  const center = [35.6895, 139.6917];

  return (
    <div className="map-section">
      <MapContainer center={center} zoom={15} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventHandler onMapClick={onMapClick} />
        {pins.map((pin) => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={getIcon(pin.latest_action_type)}
          >
            <Popup>
              {pin.latest_action_type}
            </Popup>
          </Marker>
        ))}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={getSelectedIcon()} />
        )}
      </MapContainer>
    </div>
  );
}

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

// Navigation Bar
const Navigation = () => (
  <nav className="absolute top-0 left-0 right-0 z-10 p-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-sm">CC</span>
        </div>
        <span className="text-white font-medium text-lg">Crypto Connect</span>
      </div>
      <div className="flex items-center space-x-8">
        <button className="text-gray-400 hover:text-white transition-colors">Welcome</button>
        <a href="/map" className="text-gray-400 hover:text-white transition-colors">Map</a>
        <button className="text-gray-400 hover:text-white transition-colors">Login</button>
        <button className="text-gray-400 hover:text-white transition-colors">Connect Wallet</button>
      </div>
    </div>
  </nav>
);

// Google Map Component
const MapComponent = ({ center, zoom, markers, onMapClick, onMarkerClick }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [/* dark style array omitted for brevity */]
      });
      newMap.addListener('click', (e) => onMapClick(e.latLng.lat(), e.latLng.lng()));
      setMap(newMap);
    }
  }, [ref, map, center, zoom, onMapClick]);

  useEffect(() => {
    if (map) {
      googleMarkers.forEach(marker => marker.setMap(null));

      const newGoogleMarkers = markers.map((marker, index) => {
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          title: marker.label,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: marker.color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="color: #333; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${marker.label}</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">
                Lat: ${marker.lat.toFixed(6)}<br>
                Lng: ${marker.lng.toFixed(6)}
              </p>
              ${marker.info ? `<p style="margin: 8px 0 0 0; font-size: 14px;">${marker.info}</p>` : ''}
            </div>
          `
        });

        googleMarker.addListener('click', () => {
          newGoogleMarkers.forEach(m => m.infoWindow?.close());
          infoWindow.open(map, googleMarker);
          onMarkerClick(index);
        });

        googleMarker.infoWindow = infoWindow;
        return googleMarker;
      });

      setGoogleMarkers(newGoogleMarkers);
    }
  }, [map, markers, onMarkerClick]);

  return <div ref={ref} className="w-full h-full" />;
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="flex items-center justify-center h-full text-white">Loading Maps...</div>;
    case Status.FAILURE:
      return <div className="flex items-center justify-center h-full text-red-400">Failed to load Maps</div>;
    default:
      return null;
  }
};

const MapView = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [labelInput, setLabelInput] = useState('');
  const [infoInput, setInfoInput] = useState('');
  const [editingMarker, setEditingMarker] = useState(null);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [pendingMarker, setPendingMarker] = useState(null);

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#eab308' }
  ];

  const center = { lat: 40.7128, lng: -74.0060 };
  const zoom = 12;

  const handleMapClick = useCallback((lat, lng) => {
    if (markers.length >= 3) return alert('Maximum 3 markers allowed');
    setPendingMarker({ lat, lng });
    setShowLabelModal(true);
    setLabelInput('');
    setInfoInput('');
  }, [markers.length]);

  const handleAddMarker = () => {
    if (!labelInput.trim()) return alert('Please enter a label');
    const newMarker = {
      ...pendingMarker,
      color: selectedColor,
      label: labelInput.trim(),
      info: infoInput.trim(),
      id: Date.now()
    };
    setMarkers([...markers, newMarker]);
    setShowLabelModal(false);
  };

  const handleMarkerClick = useCallback((index) => {
    const marker = markers[index];
    setEditingMarker(index);
    setLabelInput(marker.label);
    setInfoInput(marker.info || '');
    setSelectedColor(marker.color);
    setShowLabelModal(true);
  }, [markers]);

  const handleUpdateMarker = () => {
    if (!labelInput.trim()) return alert('Label required');
    const updated = [...markers];
    updated[editingMarker] = {
      ...updated[editingMarker],
      label: labelInput,
      info: infoInput,
      color: selectedColor
    };
    setMarkers(updated);
    setShowLabelModal(false);
    setEditingMarker(null);
  };

  const handleDeleteMarker = () => {
    setMarkers(markers.filter((_, i) => i !== editingMarker));
    setShowLabelModal(false);
    setEditingMarker(null);
  };

  const clearAllMarkers = () => setMarkers([]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />

      <div className="pt-20 px-6 h-screen flex flex-col">
        <div className="flex justify-between mb-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border-2 border-white rounded-lg flex items-center justify-center rotate-45">
              <span className="-rotate-45 text-white font-bold text-sm">CC</span>
            </div>
            <h1 className="text-white text-2xl font-bold">Location Mapper</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-400 text-sm">Markers: {markers.length}/3</div>
            {markers.length > 0 && (
              <button onClick={clearAllMarkers} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <span className="text-gray-400 text-sm uppercase">Marker Color:</span>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-white scale-110' : 'border-gray-600'}`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 bg-[#1a1a1a] rounded-lg border border-gray-700 overflow-hidden">
          <Wrapper apiKey="AIzaSyCS_IB38aIgTPXl4ze-uo_UkolH11TaIFA" render={render}>
            <MapComponent
              center={center}
              zoom={zoom}
              markers={markers}
              onMapClick={handleMapClick}
              onMarkerClick={handleMarkerClick}
            />
          </Wrapper>
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          Click on the map to add markers • Click markers to view/edit • Max 3 markers
        </div>
      </div>

      {/* Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">{editingMarker !== null ? 'Edit Marker' : 'Add Marker'}</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Label"
                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-600 text-white rounded-lg"
              />
              <textarea
                value={infoInput}
                onChange={(e) => setInfoInput(e.target.value)}
                placeholder="Additional Info (optional)"
                className="w-full px-4 py-2 bg-[#0d0d0d] border border-gray-600 text-white rounded-lg"
              />
            </div>

            <div className="flex space-x-2 mt-4">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.value ? 'border-white scale-110' : 'border-gray-600'}`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={() => setShowLabelModal(false)} className="bg-gray-600 text-white py-2 px-4 rounded-lg">Cancel</button>
              {editingMarker !== null && (
                <button onClick={handleDeleteMarker} className="bg-red-600 text-white py-2 px-4 rounded-lg">Delete</button>
              )}
              <button
                onClick={editingMarker !== null ? handleUpdateMarker : handleAddMarker}
                className="bg-white text-black py-2 px-4 rounded-lg font-semibold"
              >
                {editingMarker !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Navigation from '../components/Navigation';

const MapComponent = ({ center, zoom, markers, onMapClick, onMarkerClick }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#212121' }] },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
          { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
          { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
          { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
          { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] },
        ]
      });

      newMap.addListener('click', (e) => {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      });

      setMap(newMap);
    }
  }, [ref, map, center, zoom, onMapClick]);

  useEffect(() => {
    if (map) {
      googleMarkers.forEach(marker => marker.setMap(null));

      const newGoogleMarkers = markers.map((marker, index) => {
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          title: marker.label,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: marker.color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
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
          markers.forEach((_, i) => {
            if (newGoogleMarkers[i] && newGoogleMarkers[i].infoWindow) {
              newGoogleMarkers[i].infoWindow.close();
            }
          });

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
      return <div className="flex items-center justify-center h-full text-red-400">Error loading Google Maps.</div>;
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
    { name: 'Yellow', value: '#eab308' },
  ];

  const center = { lat: 40.7128, lng: -74.0060 };
  const zoom = 12;

  const handleMapClick = useCallback((lat, lng) => {
    if (markers.length >= 3) {
      alert('Maximum 3 markers allowed');
      return;
    }

    setPendingMarker({ lat, lng });
    setShowLabelModal(true);
    setLabelInput('');
    setInfoInput('');
  }, [markers.length]);

  const handleAddMarker = () => {
    if (!labelInput.trim()) {
      alert('Please enter a label');
      return;
    }

    const newMarker = {
      ...pendingMarker,
      color: selectedColor,
      label: labelInput.trim(),
      info: infoInput.trim(),
      id: Date.now()
    };

    setMarkers([...markers, newMarker]);
    setShowLabelModal(false);
    setPendingMarker(null);
    setLabelInput('');
    setInfoInput('');
  };

  const handleMarkerClick = useCallback((index) => {
    setEditingMarker(index);
    setLabelInput(markers[index].label);
    setInfoInput(markers[index].info || '');
    setSelectedColor(markers[index].color);
    setShowLabelModal(true);
  }, [markers]);

  const handleUpdateMarker = () => {
    if (!labelInput.trim()) {
      alert('Please enter a label');
      return;
    }

    const updatedMarkers = [...markers];
    updatedMarkers[editingMarker] = {
      ...updatedMarkers[editingMarker],
      label: labelInput.trim(),
      info: infoInput.trim(),
      color: selectedColor
    };

    setMarkers(updatedMarkers);
    setShowLabelModal(false);
    setEditingMarker(null);
    setLabelInput('');
    setInfoInput('');
  };

  const handleDeleteMarker = () => {
    const updatedMarkers = markers.filter((_, index) => index !== editingMarker);
    setMarkers(updatedMarkers);
    setShowLabelModal(false);
    setEditingMarker(null);
    setLabelInput('');
    setInfoInput('');
  };

  const clearAllMarkers = () => setMarkers([]);

  // 🔑 INSERT YOUR API KEY HERE
  const apiKey = "AIzaSyCS_IB38aIgTPXl4ze-uo_UkolH11TaIFA";

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      <Navigation />
      <div className="pt-20 px-6 h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border-2 border-white rounded-lg rotate-45 flex items-center justify-center">
              <div className="transform -rotate-45">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold">Location Mapper</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-gray-400 text-sm">Markers: {markers.length}/3</div>
            {markers.length > 0 && (
              <button
                onClick={clearAllMarkers}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Color Selector */}
        <div className="mb-4 flex items-center space-x-4">
          <span className="text-gray-400 text-sm uppercase tracking-wider">Marker Color:</span>
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

        {/* Map Container */}
        <div className="flex-1 bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-700">
          <Wrapper apiKey={apiKey} render={render}>
            <MapComponent
              center={center}
              zoom={zoom}
              markers={markers}
              onMapClick={handleMapClick}
              onMarkerClick={handleMarkerClick}
            />
          </Wrapper>
        </div>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Click map to add markers • Click markers to view/edit • Max 3 markers
        </p>
      </div>

      {/* Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">
              {editingMarker !== null ? 'Edit Marker' : 'Add Marker'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Label *</label>
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Additional Info</label>
                <textarea
                  value={infoInput}
                  onChange={(e) => setInfoInput(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-lg text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Color</label>
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.value ? 'border-white scale-110' : 'border-gray-600'}`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowLabelModal(false);
                  setEditingMarker(null);
                  setLabelInput('');
                  setInfoInput('');
                }}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>

              {editingMarker !== null && (
                <button
                  onClick={handleDeleteMarker}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              )}

              <button
                onClick={editingMarker !== null ? handleUpdateMarker : handleAddMarker}
                className="flex-1 py-2 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100"
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

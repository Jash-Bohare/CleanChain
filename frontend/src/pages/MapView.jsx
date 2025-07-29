import React, { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { fetchLocations, claimLocation } from '../api';
import Navigation from '../components/Navigation';

const MapComponent = ({ center, zoom, markers, onClaim, walletAddress }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMarkers, setGoogleMarkers] = useState([]);
  const infoWindowRef = useRef(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [/* dark style array omitted for brevity */]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      googleMarkers.forEach(marker => marker.setMap(null));
      const newGoogleMarkers = markers.map((marker) => {
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          title: marker.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: marker.status === 'cleaned' ? '#22c55e' : marker.status === 'claimed' ? '#eab308' : '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });
        return googleMarker;
      });
      setGoogleMarkers(newGoogleMarkers);
    }
  }, [map, markers, onClaim, walletAddress]);

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
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (err) {
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    };
    loadLocations();
    setWalletAddress(localStorage.getItem('walletAddress') || '');
  }, []);

  const center = locations.length > 0
    ? { lat: locations[0].lat, lng: locations[0].lng }
    : { lat: 40.7128, lng: -74.0060 };
  const zoom = 12;

  return (
    <div className="min-h-screen bg-[#2b2d25] relative">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
          {toast}
        </div>
      )}
      <Navigation />
      <div className="pt-20 px-6 h-screen flex flex-col">
        <div className="flex justify-between mb-6 items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border-2 border-[#cb997e] rounded-lg flex items-center justify-center rotate-45">
              <span className="-rotate-45 text-[#f8f2ed] font-bold text-sm">CC</span>
            </div>
            <h1 className="text-[#f8f2ed] text-2xl font-bold">Cleanup Locations</h1>
          </div>
        </div>
        <div className="flex-1 bg-[#1f201a] rounded-lg border border-[#c6c6b6] overflow-hidden shadow-lg">
          <Wrapper apiKey="AIzaSyCS_IB38aIgTPXl4ze-uo_UkolH11TaIFA" render={render}>
            {!loading && !error && (
              <MapComponent
                center={center}
                zoom={zoom}
                markers={locations}
                onClaim={() => {}}
                walletAddress={walletAddress}
              />
            )}
            {loading && <div className="flex items-center justify-center h-full text-white">Loading locations...</div>}
            {error && <div className="flex items-center justify-center h-full text-red-400">{error}</div>}
          </Wrapper>
        </div>
        <div className="mt-4 text-center text-[#cb997e] text-sm">
          Locations are managed by CleanChain admins. Click a marker to view details. Unclaimed locations can be claimed if you are within 15km.
        </div>
      </div>
    </div>
  );
};

export default MapView;

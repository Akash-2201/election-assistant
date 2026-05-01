import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { Search, MapPin, Calendar, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNTRIES = [
  { id: 'USA', name: 'United States', lat: 37.0902, lng: -95.7129, status: 'Upcoming', timeline: 'Nov 3, 2026', type: 'Midterm Elections' },
  { id: 'IND', name: 'India', lat: 20.5937, lng: 78.9629, status: 'Ongoing', timeline: 'May 4, 2026 (Counting)', type: 'General Elections' },
  { id: 'GBR', name: 'United Kingdom', lat: 55.3781, lng: -3.4360, status: 'Completed', timeline: 'July 2024', type: 'General Elections' },
  { id: 'BRA', name: 'Brazil', lat: -14.2350, lng: -51.9253, status: 'Upcoming', timeline: 'Oct 4, 2026', type: 'General Elections' },
  { id: 'DEU', name: 'Germany', lat: 51.1657, lng: 10.4515, status: 'Upcoming', timeline: 'Sept 2025', type: 'Federal Elections' },
  { id: 'AUS', name: 'Australia', lat: -25.2744, lng: 133.7751, status: 'Upcoming', timeline: 'May 2025', type: 'Federal Elections' },
  { id: 'CAN', name: 'Canada', lat: 56.1304, lng: -106.3468, status: 'Upcoming', timeline: 'Oct 20, 2025', type: 'Federal Elections' },
  { id: 'FRA', name: 'France', lat: 46.2276, lng: 2.2137, status: 'Completed', timeline: 'June 2024', type: 'Legislative' },
  { id: 'JPN', name: 'Japan', lat: 36.2048, lng: 138.2529, status: 'Upcoming', timeline: 'Oct 2025', type: 'General Elections' },
  { id: 'ZAF', name: 'South Africa', lat: -30.5595, lng: 22.9375, status: 'Completed', timeline: 'May 2024', type: 'General Elections' },
];

const GEOJSON_URL = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

const containerStyle = { width: '100%', height: '100%' };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1e293b" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  ],
};

export default function GlobalMapTab() {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mapRef = useRef(null);
  const dataLayerRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_MAIN,
  });

  const filteredCountries = useMemo(() => 
    COUNTRIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    // Load GeoJSON data
    map.data.loadGeoJson(GEOJSON_URL);
    dataLayerRef.current = map.data;

    // Apply global style
    map.data.setStyle((feature) => {
      const isSelected = feature.getProperty('id') === selectedCountry.id || feature.getId() === selectedCountry.id;
      return {
        fillColor: isSelected ? '#6366f1' : 'transparent',
        fillOpacity: isSelected ? 0.4 : 0,
        strokeColor: isSelected ? '#6366f1' : '#334155',
        strokeWeight: isSelected ? 2 : 0.5,
        visible: true
      };
    });
  }, [selectedCountry.id]);

  useEffect(() => {
    if (mapRef.current && dataLayerRef.current) {
      // Re-style when country changes
      dataLayerRef.current.setStyle((feature) => {
        const featId = feature.getProperty('id') || feature.getId();
        const isSelected = featId === selectedCountry.id;
        if (isSelected) {
          // Fit map to feature bounds
          const bounds = new window.google.maps.LatLngBounds();
          feature.getGeometry().forEachLatLng((latlng) => bounds.extend(latlng));
          mapRef.current.fitBounds(bounds);
        }
        return {
          fillColor: isSelected ? '#6366f1' : 'transparent',
          fillOpacity: isSelected ? 0.4 : 0,
          strokeColor: isSelected ? '#6366f1' : '#334155',
          strokeWeight: isSelected ? 2 : 0.5,
        };
      });
    }
  }, [selectedCountry]);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 backdrop-blur-xl transition-all"
            placeholder="Search country..."
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl max-h-60 overflow-y-auto"
              >
                {filteredCountries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect(c)}
                    className="w-full text-left px-5 py-3 hover:bg-brand-500/20 text-slate-200 transition-colors flex items-center justify-between border-b border-slate-800 last:border-0"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] uppercase tracking-tighter text-slate-500">{c.type}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 rounded-3xl overflow-hidden border border-slate-700/50 relative shadow-2xl">
        {!isLoaded ? (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: selectedCountry.lat, lng: selectedCountry.lng }}
            zoom={4}
            options={mapOptions}
            onLoad={onLoad}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCountry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-6 left-6 w-80 glass-panel p-6 rounded-2xl border-brand-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-white">{selectedCountry.name}</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedCountry.status === 'Ongoing' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  selectedCountry.status === 'Upcoming' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                  'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                  {selectedCountry.status}
                </span>
              </div>
              <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <Calendar className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <div className="text-xs text-slate-500 mb-1">Timeline</div>
                  <div className="text-sm font-bold text-slate-200">{selectedCountry.timeline}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <Info className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <div className="text-xs text-slate-500 mb-1">Election Type</div>
                  <div className="text-sm font-bold text-slate-200">{selectedCountry.type}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

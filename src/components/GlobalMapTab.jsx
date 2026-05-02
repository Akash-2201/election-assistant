import { useState, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Info, Search, ChevronDown, Globe } from 'lucide-react';

const CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const CENTER = {
  lat: 20,
  lng: 10,
};

const GEOJSON_URL = 'https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson';

const COUNTRIES = [
  { id: 'IND', name: 'India', status: 'Upcoming', timeline: 'May 2026', type: 'General Elections' },
  { id: 'USA', name: 'United States', status: 'Ongoing', timeline: 'Nov 2026', type: 'Midterm Elections' },
  { id: 'BRA', name: 'Brazil', status: 'Upcoming', timeline: 'Oct 2026', type: 'Presidential Elections' },
  { id: 'GBR', name: 'United Kingdom', status: 'Completed', timeline: 'July 2024', type: 'General Elections' },
];

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  backgroundColor: '#020617',
  styles: [
    { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { featureType: "all", elementType: "labels.text.stroke", stylers: [{ visibility: "off" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }, { weight: 1 }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  ],
};

export default function GlobalMapTab({ selectedCountry, setSelectedCountry }) {
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
        fillColor: isSelected ? '#6366f1' : '#1e293b',
        fillOpacity: isSelected ? 0.6 : 0.2,
        strokeColor: isSelected ? '#818cf8' : '#334155',
        strokeWeight: isSelected ? 2 : 1,
      };
    });

    // Handle clicks
    map.data.addListener('click', (event) => {
      const countryId = event.feature.getProperty('id') || event.feature.getId();
      const countryData = COUNTRIES.find(c => c.id === countryId);
      if (countryData) {
        setSelectedCountry(countryData);
      }
    });
  }, [selectedCountry, setSelectedCountry]);

  return (
    <div className="h-full w-full relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950">
      {/* Search Overlay */}
      <div className="absolute top-6 right-6 z-10 w-72">
        <div className="relative">
          <div className="flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl focus-within:border-brand-500/50 transition-all">
            <div className="p-2.5 text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search global pulse..."
              className="bg-transparent border-none text-white text-xs font-bold uppercase tracking-widest focus:ring-0 w-full placeholder:text-slate-600"
            />
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2.5 text-slate-500 hover:text-white transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() => {
                        setSelectedCountry(country);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                    >
                      <Globe className="w-4 h-4 text-slate-500 group-hover:text-brand-400" />
                      <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-widest">
                        {country.name}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-full w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={CONTAINER_STYLE}
            center={CENTER}
            zoom={2.5}
            onLoad={onLoad}
            options={MAP_OPTIONS}
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
            <Globe className="w-12 h-12 text-brand-500 animate-pulse" />
            <div className="text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">Initializing Global Pulse...</div>
          </div>
        )}

        {/* Selected Country Details Card */}
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

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { GEOJSON_URL, PROVINCE_TO_REGION, DOWNLOAD_LINKS, ARABIC_PROVINCES } from '../constants';
import { BaseMapType } from '../types';

declare var ol: any;

interface MapComponentProps {
  selectedProvince: string | null;
  onProvinceClick: (name: string | null) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedProvince, onProvinceClick }) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const popupElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const vectorSourceRef = useRef<any>(null);
  
  const [baseMap, setBaseMap] = useState<BaseMapType>('OSM');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [isLayersExpanded, setIsLayersExpanded] = useState(false);

  const allProvinces = useMemo(() => Object.keys(PROVINCE_TO_REGION), []);

  const getProvinceName = useCallback((feature: any) => {
    const props = feature.getProperties();
    const possibleKeys = ["NOM-PROV", "NOM_PROV", "name", "NAME", "nom", "Nom", "الاقليم", "الإقليم"];
    for (let key of possibleKeys) {
      if (props[key]) return props[key].toString().toUpperCase().trim();
    }
    return null;
  }, []);

  const handleDemander = useCallback(() => {
    if (!selectedProvince) return;
    const paymentUrl = `/?page=payment&province=${encodeURIComponent(selectedProvince)}`;
    window.open(paymentUrl, '_blank');
  }, [selectedProvince]);

  const zoomToProvince = useCallback((provinceName: string) => {
    if (!mapRef.current || !vectorSourceRef.current || !overlayRef.current) return;

    const source = vectorSourceRef.current;
    const features = source.getFeatures();
    
    const feature = features.find((f: any) => {
      const name = getProvinceName(f);
      return name === provinceName.toUpperCase().trim();
    });

    if (feature) {
      const geometry = feature.getGeometry();
      const extent = geometry.getExtent();
      const center = ol.extent.getCenter(extent);
      
      overlayRef.current.setPosition(center);
      
      mapRef.current.getView().fit(extent, { 
        duration: 1200, 
        padding: [80, 80, 80, 80],
        maxZoom: 12,
        easing: ol.easing.easeOut
      });
    }
  }, [getProvinceName]);

  useEffect(() => {
    if (!mapElement.current || !popupElement.current) return;

    const vectorSource = new ol.source.Vector({
      url: GEOJSON_URL,
      format: new ol.format.GeoJSON()
    });
    vectorSourceRef.current = vectorSource;

    const vectorLayer = new ol.layer.Vector({
      source: vectorSource,
      style: (feature: any) => {
        const name = getProvinceName(feature);
        const isSelected = name === selectedProvince?.toUpperCase().trim();
        const hasDownload = name ? !!DOWNLOAD_LINKS[name] : false;

        let fillColor = hasDownload ? "rgba(34, 197, 94, 0.22)" : "rgba(239, 68, 68, 0.22)";
        let strokeColor = "#1e293b";
        let strokeWidth = 1.2;

        if (isSelected) {
          fillColor = "rgba(59, 130, 246, 0.4)";
          strokeWidth = 3.5;
          strokeColor = "#2563eb";
        }
        
        return new ol.style.Style({
          stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth }),
          fill: new ol.style.Fill({ color: fillColor }),
          text: new ol.style.Text({
            text: name || "", 
            font: isSelected ? "900 14px Inter, sans-serif" : "bold 10px Inter, sans-serif",
            fill: new ol.style.Fill({ color: isSelected ? "#1e40af" : "#334155" }),
            stroke: new ol.style.Stroke({ color: "#ffffff", width: 3 }),
            overflow: true,
            placement: 'point'
          })
        });
      }
    });

    const osmLayer = new ol.layer.Tile({ source: new ol.source.OSM(), visible: true, name: 'OSM' });
    const satelliteLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      }),
      visible: false,
      name: 'Satellite'
    });
    const terrainLayer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      }),
      visible: false,
      name: 'Terrain'
    });

    const overlay = new ol.Overlay({
      element: popupElement.current,
      autoPan: { animation: { duration: 250 } },
      positioning: 'bottom-center',
      stopEvent: true,
      offset: [0, -15]
    });
    overlayRef.current = overlay;

    const map = new ol.Map({
      target: mapElement.current,
      layers: [osmLayer, satelliteLayer, terrainLayer, vectorLayer],
      overlays: [overlay],
      view: new ol.View({
        center: ol.proj.fromLonLat([-7.9, 31.6]),
        zoom: 6,
        maxZoom: 18,
        minZoom: 5
      })
    });

    mapRef.current = map;

    vectorSource.on('featuresloadend', () => {
      if (selectedProvince) zoomToProvince(selectedProvince);
    });

    map.on("singleclick", (evt: any) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f);
      if (feature) {
        const name = getProvinceName(feature);
        if (name) onProvinceClick(name);
      } else {
        onProvinceClick(null);
        overlay.setPosition(undefined);
      }
    });

    map.on("pointermove", (evt: any) => {
      const coordinate = ol.proj.toLonLat(evt.coordinate);
      setCoords({ lon: coordinate[0], lat: coordinate[1] });
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    return () => map.setTarget(undefined);
  }, [onProvinceClick, getProvinceName, zoomToProvince, selectedProvince]);

  useEffect(() => {
    if (!mapRef.current) return;
    const layers = mapRef.current.getLayers().getArray();
    const vectorLayer = layers.find((l: any) => l instanceof ol.layer.Vector);
    if (vectorLayer) vectorLayer.changed();

    if (selectedProvince) {
      zoomToProvince(selectedProvince);
    } else if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }
  }, [selectedProvince, zoomToProvince]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.getLayers().getArray().forEach((layer: any) => {
      if (layer instanceof ol.layer.Tile) {
        layer.setVisible(layer.get('name') === baseMap);
      }
    });
  }, [baseMap]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }

    const normalizedQ = q.toLowerCase().trim();
    const localMatches = allProvinces
      .filter(p => p.toLowerCase().includes(normalizedQ))
      .map(p => ({ display_name: p, type: 'local', province: p }));

    const combinedLocal = Array.from(new Map(localMatches.map(item => [item.province, item])).values());
    setSuggestions(combinedLocal);
  };

  const goToLocation = (item: any) => {
    if (!mapRef.current) return;
    if (item.type === 'local') {
      onProvinceClick(item.province);
      zoomToProvince(item.province);
    }
    setSearchQuery(item.display_name);
    setSuggestions([]);
    setIsSearchExpanded(false);
  };

  return (
    <div className="w-full h-full relative group/map overflow-hidden bg-slate-200">
      <div ref={mapElement} className="w-full h-full" />
      <div 
        ref={popupElement} 
        className={`bg-white shadow-xl rounded-2xl border border-slate-200 p-5 w-64 z-[500] pointer-events-auto transition-all duration-300 transform origin-bottom ${!selectedProvince ? 'opacity-0 scale-75 translate-y-4 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'}`}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onProvinceClick(null); }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <i className="fas fa-times text-[10px]"></i>
        </button>
        <div className="flex flex-col items-center mb-4">
          <h4 className="text-lg font-bold text-slate-800 uppercase tracking-tight text-center">
            {selectedProvince}
          </h4>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block opacity-70 text-center">
            {selectedProvince ? (PROVINCE_TO_REGION[selectedProvince.toUpperCase()] || "Région") : ""}
          </span>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={(e) => { e.stopPropagation(); handleDemander(); }}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold uppercase transition-colors"
          >
            Demander
          </button>
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 rounded-sm"></div>
      </div>

      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-3">
        <button 
          onClick={() => setIsLayersExpanded(!isLayersExpanded)}
          className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 flex items-center justify-center text-slate-700 hover:bg-blue-50 transition-all active:scale-90"
        >
          <i className="fas fa-layer-group text-xl"></i>
        </button>
        {isLayersExpanded && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col w-32 animate-in fade-in slide-in-from-top-2">
            {(['OSM', 'Satellite', 'Terrain'] as BaseMapType[]).map(type => (
              <button 
                key={type} 
                onClick={() => { setBaseMap(type); setIsLayersExpanded(false); }} 
                className={`px-4 py-3 text-[10px] font-bold uppercase text-left transition-all ${baseMap === type ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-600'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
        {!isSearchExpanded ? (
          <button 
            onClick={() => setIsSearchExpanded(true)} 
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 flex items-center justify-center text-slate-700 hover:bg-blue-50 transition-all active:scale-90"
          >
            <i className="fas fa-search text-xl"></i>
          </button>
        ) : (
          <div className="relative animate-in slide-in-from-right-4 flex flex-col items-end">
            <div className="relative">
              <input 
                autoFocus 
                type="text" 
                value={searchQuery} 
                onChange={handleSearch} 
                placeholder="Rechercher..." 
                className="w-56 md:w-72 pl-9 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-2xl text-[10px] focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
              />
              <i className="fas fa-search absolute left-3 top-3.5 text-blue-500 text-xs"></i>
              <button 
                onClick={() => { setIsSearchExpanded(false); setSearchQuery(''); setSuggestions([]); }}
                className="absolute right-3 top-3 text-red-400 hover:text-red-600 transition-colors"
              >
                <i className="fas fa-times-circle text-base"></i>
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-50 overflow-hidden text-[10px] z-[600]">
                {suggestions.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => goToLocation(item)} 
                    className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 truncate font-bold flex items-center gap-2 text-blue-900"
                  >
                    <i className="fas fa-map-marker-alt text-[8px] text-blue-400"></i>
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="hidden md:flex absolute bottom-6 right-24 z-[400] bg-white/80 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/50 shadow-xl pointer-events-none items-center space-x-2">
        <span className="text-[9px] font-black text-slate-400 uppercase">Coord</span>
        <p className="text-[10px] font-mono text-slate-800 tracking-tight">
          <span className="text-blue-600 font-bold">{coords.lat.toFixed(4)}</span>, <span className="text-blue-600 font-bold">{coords.lon.toFixed(4)}</span>
        </p>
      </div>
    </div>
  );
};

export default MapComponent;
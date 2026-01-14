
import React, { useState } from 'react';
import { ProvinceData } from '../types';
import { REGIONS_LIST } from '../constants';

interface SidebarProps {
  provinces: ProvinceData[];
  onSelect: (name: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  regionFilter: string;
  setRegionFilter: (val: string) => void;
  selectedProvince: string | null;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  provinces, 
  onSelect, 
  searchTerm, 
  setSearchTerm, 
  regionFilter, 
  setRegionFilter, 
  selectedProvince,
  isOpen,
  toggle
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`
        hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-full transition-all duration-300 shadow-xl z-30
      `}>
        <div className="p-4 space-y-4 flex-shrink-0 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-black text-slate-800 flex items-center uppercase tracking-tighter">
            <i className="fas fa-layer-group mr-2 text-blue-600"></i>
            Liste des Provinces
          </h2>
          
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrer..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <i className="fas fa-search absolute left-2.5 top-2.5 text-slate-300 text-[10px]"></i>
            </div>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les régions</option>
              {REGIONS_LIST.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-slate-50">
            {provinces.map((p) => (
              <button 
                key={p.nomFr}
                onClick={() => onSelect(p.nomFr)}
                className={`w-full text-left px-4 py-2.5 transition-all flex items-center justify-between group ${selectedProvince === p.nomFr ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-50'}`}
              >
                <div className="flex-1">
                  <div className={`text-[11px] font-black uppercase ${selectedProvince === p.nomFr ? 'text-white' : 'text-slate-800'}`}>{p.nomFr}</div>
                  <div className={`text-[9px] truncate max-w-[180px] ${selectedProvince === p.nomFr ? 'text-blue-100' : 'text-slate-400 font-medium'}`}>{p.region}</div>
                </div>
                <div className="ml-2">
                  {p.downloadUrl ? (
                    <i className={`fas fa-check-circle ${selectedProvince === p.nomFr ? 'text-white' : 'text-emerald-500'} text-[10px]`}></i>
                  ) : (
                    <i className={`fas fa-lock opacity-10 text-[10px] ${selectedProvince === p.nomFr ? 'text-white' : ''}`}></i>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* --- MOBILE LIST BUTTON --- */}
      <button 
        onClick={() => setIsMobileDrawerOpen(true)}
        className="md:hidden fixed top-20 left-4 z-[450] w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-700 active:scale-90 transition-all"
      >
        <i className="fas fa-list-ul text-lg"></i>
      </button>

      {/* --- MOBILE LEFT DRAWER --- */}
      {isMobileDrawerOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[2000] animate-in fade-in duration-300"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div 
            className="absolute top-0 left-0 h-full w-[80%] max-w-[300px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-black text-blue-900 text-xs uppercase tracking-tighter">CadGIS Maroc - Liste</span>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>

            <div className="p-3 space-y-2 bg-white border-b border-slate-50">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Chercher..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-100 border-none rounded-xl text-[10px] font-bold outline-none"
                />
                <i className="fas fa-search absolute left-2.5 top-2.5 text-slate-400 text-[10px]"></i>
              </div>

              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-2 py-2 bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase text-slate-600 outline-none"
              >
                <option value="">Filtrer par Région</option>
                {REGIONS_LIST.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 py-2">
              <div className="space-y-0.5">
                {provinces.map((p) => (
                  <button
                    key={p.nomFr}
                    onClick={() => {
                      onSelect(p.nomFr);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-all ${
                      selectedProvince === p.nomFr 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white active:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-black uppercase truncate ${selectedProvince === p.nomFr ? 'text-white' : 'text-slate-800'}`}>
                        {p.nomFr}
                      </div>
                      <div className={`text-[8px] truncate opacity-70 font-bold ${selectedProvince === p.nomFr ? 'text-blue-100' : 'text-slate-400'}`}>
                        {p.region.split('. ')[1] || p.region}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

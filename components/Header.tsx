import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-amber-700 text-white shadow-xl p-4 z-50 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center space-x-4">
        <div className="bg-white rounded-xl w-11 h-11 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
          <img 
            src="https://www.esrifrance.fr/content/dam/distributor-share/esrifrance-fr/produits/en-savoir-plus/produits-apps/arcgis-for-autocad/vue-d%27ensemble/arcgis-for-autocad-220.png" 
            alt="CadGIS Logo" 
            className="w-full h-full object-cover p-1"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-2xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-sm">
            CadGIS Maroc <span className="text-amber-400">©</span>
          </h1>
          <p className="text-[10px] md:text-xs text-blue-100 hidden sm:block mt-1 font-bold opacity-90 uppercase tracking-widest">
            Plateforme GIS Professionnelle • Données Topographiques
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center space-x-6 text-[11px] font-black uppercase tracking-widest">
        <a href="/" className="hover:text-amber-400 transition-colors border-b-2 border-amber-400 pb-1">Cartographie</a>
        <a href="/?page=payment" className="hover:text-amber-400 transition-colors opacity-70 hover:opacity-100">Commander</a>
        <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-[9px]">Serveur Actif</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
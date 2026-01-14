
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ContactButtons from './components/ContactButtons';
import PaymentPage from './components/PaymentPage';
import { ProvinceData } from './types';
import { PROVINCE_TO_REGION, DOWNLOAD_LINKS, ARABIC_PROVINCES } from './constants';

const App: React.FC = () => {
  const [provinces, setProvinces] = useState<ProvinceData[]>([]);
  const [filteredProvinces, setFilteredProvinces] = useState<ProvinceData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const isPaymentPage = queryParams.get('page') === 'payment';
  const provinceFromUrl = queryParams.get('province');

  const loadData = useCallback(async () => {
    const uniqueProvinces = Object.keys(PROVINCE_TO_REGION).map(name => ({
      nomFr: name,
      nomAr: '—',
      region: PROVINCE_TO_REGION[name],
      downloadUrl: DOWNLOAD_LINKS[name] || null
    }));
    setProvinces(uniqueProvinces);
    setFilteredProvinces(uniqueProvinces);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    
    // إذا كانت خانة البحث فارغة، نطبق فلتر الجهة فقط
    if (!term) {
      const filtered = provinces.filter(p => !regionFilter || p.region === regionFilter);
      setFilteredProvinces(filtered);
      return;
    }

    // إذا بدأ المستخدم في الكتابة، نبحث في كل الأقاليم (تجاهل فلتر الجهة لإتاحة الوصول السريع)
    const filtered = provinces.filter(p => {
      // البحث بالفرنسية (الاسم والجهة)
      const matchesFrench = p.nomFr.toLowerCase().includes(term) || 
                          p.region.toLowerCase().includes(term);
      
      // البحث بالعربية (مطابقة القاموس العربي)
      const matchesArabic = Object.entries(ARABIC_PROVINCES).some(([ar, fr]) => {
        return (ar.includes(term) || ar.includes(searchTerm.trim())) && 
               fr.toUpperCase() === p.nomFr.toUpperCase();
      });

      // نكتفي بمطابقة البحث النصي فقط عند الكتابة لضمان شمولية النتائج
      return matchesFrench || matchesArabic;
    });
    
    setFilteredProvinces(filtered);
  }, [searchTerm, regionFilter, provinces]);

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedProvince(provinceName);
  };

  if (isPaymentPage) {
    return <PaymentPage provinceName={provinceFromUrl} />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 font-sans">
      <Header />
      
      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar 
          provinces={filteredProvinces}
          onSelect={handleProvinceSelect}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          regionFilter={regionFilter}
          setRegionFilter={setRegionFilter}
          selectedProvince={selectedProvince}
          isOpen={isSidebarOpen}
          toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 relative">
          <MapComponent 
            selectedProvince={selectedProvince} 
            onProvinceClick={handleProvinceSelect} 
          />
          <ContactButtons />
        </div>
      </div>
    </div>
  );
};

export default App;

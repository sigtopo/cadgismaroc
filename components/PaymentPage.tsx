import React, { useState, useEffect } from 'react';
import { DOWNLOAD_LINKS } from '../constants';

interface PaymentPageProps {
  provinceName: string | null;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ provinceName }) => {
  const downloadUrl = provinceName ? DOWNLOAD_LINKS[provinceName.toUpperCase()] : null;
  const [copied, setCopied] = useState(false);

  const displayTitle = provinceName 
    ? `CadGIS Maroc – Province de ${provinceName}` 
    : "CadGIS Maroc";

  useEffect(() => {
    document.title = displayTitle;
    return () => { document.title = "CadGIS Maroc"; };
  }, [displayTitle]);

  const copyEmail = () => {
    navigator.clipboard.writeText("jilitsig@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReturn = () => { window.location.href = '/'; };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      <header className="bg-gradient-to-br from-amber-600 to-blue-800 p-10 text-white text-center shadow-lg">
        <h1 className="text-2xl font-black uppercase">{displayTitle}</h1>
        <p className="opacity-80 text-sm mt-2">Titres fonciers | Bornes | Zonage | Limites ADM</p>
      </header>

      <div className="max-w-3xl mx-auto mt-[-2rem] bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <button onClick={handleReturn} className="mb-6 flex items-center gap-2 text-green-700 font-bold hover:translate-x-[-5px] transition-transform">
          <i className="fas fa-chevron-left"></i> Retour à la carte
        </button>

        <div className="grid grid-cols-5 gap-4 mb-8">
            <img className="h-8 object-contain" src="https://wraqi.ma/ui/Images/PaymentCashLogo/tashilat_logo.png" alt="Tashilat" />
            <img className="h-8 object-contain" src="https://wraqi.ma/ui/Images/PaymentCashLogo/barid_cash_logo.png" alt="Barid Cash" />
            <img className="h-8 object-contain" src="https://wraqi.ma/ui/Images/cash_plus_logo.jpg" alt="Cash Plus" />
            <img className="h-8 object-contain" src="https://wraqi.ma/ui/Images/PaymentCashLogo/wafa_cash_logo.png" alt="Wafa Cash" />
            <img className="h-8 object-contain" src="https://wraqi.ma/ui/Images/PaymentCashLogo/daman_cach_logo.png" alt="Damane Cash" />
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-xl font-black text-blue-800">المبلغ الرمزي للحصول على البيانات :</h2>
          <div className="inline-block bg-amber-50 text-amber-800 border border-amber-200 px-8 py-3 rounded-full text-2xl font-black shadow-inner">
            500 DH
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left">
            <h3 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-4 border-b pb-2">Virement CIH Bank</h3>
            <div className="flex justify-between items-center">
                <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Compte</span>
                    <span className="text-lg font-mono font-black text-slate-800">2806724211029200</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Bénéficiaire</span>
                    <span className="text-md font-black text-slate-800">Elmostafa JILIT</span>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <a href="https://wa.me/212668090285" target="_blank" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:bg-emerald-600 transition-colors">
                <i className="fab fa-whatsapp text-2xl"></i> Envoyer le reçu sur WhatsApp
            </a>
            <div className="flex items-center gap-3 bg-slate-100 px-6 py-2 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-600">jilitsig@gmail.com</span>
                <button onClick={copyEmail} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">{copied ? 'Copié!' : 'Copier'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
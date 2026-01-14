import React, { useState } from 'react';

const ContactButtons: React.FC = () => {
  const [showEmailLabel, setShowEmailLabel] = useState(false);
  const emailAddress = "contact@cartomaroc.com";

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmailLabel(true);
    setTimeout(() => {
      setShowEmailLabel(false);
    }, 4000);
  };

  const goToPayment = () => {
    window.location.href = "/?page=payment";
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-[1000] items-end">
      <button 
        onClick={goToPayment}
        className="w-10 h-10 flex items-center justify-center hover:scale-125 active:scale-90 transition-all group"
        title="Commander CadGIS"
      >
        <i className="fas fa-shopping-cart text-xl text-lime-500 group-hover:rotate-12 transition-transform"></i>
      </button>

      <div className="flex items-center space-x-3">
        {showEmailLabel && (
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 text-slate-800 text-[9px] font-black animate-in slide-in-from-right-4 fade-in duration-300">
            {emailAddress}
          </div>
        )}
        <button 
          onClick={handleEmailClick}
          className="w-10 h-10 bg-white text-blue-800 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all border border-slate-100 group"
          title="Afficher l'Email"
        >
          <i className="fas fa-envelope text-lg group-hover:rotate-12 transition-transform"></i>
        </button>
      </div>

      <a 
        href="https://wa.me/212668090285"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all border border-emerald-400 group"
        title="WhatsApp"
      >
        <i className="fab fa-whatsapp text-xl group-hover:scale-110 transition-transform"></i>
      </a>
    </div>
  );
};

export default ContactButtons;
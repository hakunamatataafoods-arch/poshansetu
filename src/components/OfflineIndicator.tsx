import React, { useState, useEffect } from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface OfflineIndicatorProps {
  lang?: Language;
  forcedOffline?: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  lang = 'gu',
  forcedOffline = false
}) => {
  const [isBrowserOnline, setIsBrowserOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isActuallyOffline = forcedOffline || !isBrowserOnline;

  if (!isActuallyOffline) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[390px] animate-in slide-in-from-top-3 duration-200">
      <div className="bg-amber-900/95 text-amber-50 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-amber-500/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold block text-[11px] leading-tight text-white">
              {lang === 'gu' ? 'ઑફલાઇન મોડ સક્રિય' : 'Offline Mode Active'}
            </span>
            <span className="text-[10px] text-amber-200/90 leading-tight block truncate">
              {lang === 'gu'
                ? 'તમામ એન્ટ્રીઓ ફોનમાં સુરક્ષિત સંગ્રહિત થઈ રહી છે'
                : 'All entries are being saved locally on your phone'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-200 shrink-0 pl-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'gu' ? 'સ્થાનિક સંગ્રહ' : 'Saved'}</span>
        </div>
      </div>
    </div>
  );
};

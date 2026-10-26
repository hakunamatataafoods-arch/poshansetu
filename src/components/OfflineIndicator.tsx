import React, { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
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

  const isActuallyOffline = forcedOffline || !isBrowserOnline;

  const [notification, setNotification] = useState<{
    type: 'offline' | 'online';
    title: string;
    description: string;
  } | null>(null);

  const isFirstMount = useRef(true);
  const prevOfflineRef = useRef<boolean>(isActuallyOffline);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Monitor browser network online/offline events
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

  // Show notification toast only when device status transitions
  useEffect(() => {
    const wasOffline = prevOfflineRef.current;
    prevOfflineRef.current = isActuallyOffline;

    // Clear existing timer
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }

    if (isFirstMount.current) {
      isFirstMount.current = false;
      // If starts off in offline mode, show a brief notice
      if (isActuallyOffline) {
        setNotification({
          type: 'offline',
          title: lang === 'gu' ? 'ઉપકરણ ઑફલાઇન છે' : 'Device is Offline',
          description:
            lang === 'gu'
              ? 'તમામ એન્ટ્રીઓ સ્થાનિક રીતે ફોનમાં સાચવવામાં આવશે.'
              : 'Working offline. All changes will be saved safely on your device.'
        });
        dismissTimerRef.current = setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
      return;
    }

    if (isActuallyOffline && !wasOffline) {
      // Device just went offline
      setNotification({
        type: 'offline',
        title: lang === 'gu' ? 'ઉપકરણ ઑફલાઇન થયું' : 'Device Went Offline',
        description:
          lang === 'gu'
            ? 'તમામ એન્ટ્રીઓ સ્થાનિક રીતે ફોનમાં સાચવવામાં આવશે.'
            : 'Working offline. All changes will be saved safely on your device.'
      });

      dismissTimerRef.current = setTimeout(() => {
        setNotification(null);
      }, 5000);
    } else if (!isActuallyOffline && wasOffline) {
      // Device just came back online
      setNotification({
        type: 'online',
        title: lang === 'gu' ? 'ઉપકરણ ફરીથી ઑનલાઇન થયું' : 'Device Back Online',
        description:
          lang === 'gu'
            ? 'ક્લાઉડ સાથે ડેટા સમન્વય થઈ રહ્યો છે...'
            : 'Internet restored. Syncing data with cloud...'
      });

      dismissTimerRef.current = setTimeout(() => {
        setNotification(null);
      }, 3500);
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [isActuallyOffline, lang]);

  if (!notification) return null;

  return (
    <div
      role="alert"
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[390px] animate-in slide-in-from-top-3 fade-in duration-200 pointer-events-auto"
    >
      <div
        className={`px-3.5 py-2.5 rounded-2xl shadow-xl border flex items-center justify-between text-xs backdrop-blur-md transition-all ${
          notification.type === 'offline'
            ? 'bg-amber-950/95 text-amber-50 border-amber-400/60 shadow-amber-950/30'
            : 'bg-emerald-950/95 text-emerald-50 border-emerald-400/60 shadow-emerald-950/30'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
              notification.type === 'offline'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
            }`}
          >
            {notification.type === 'offline' ? (
              <WifiOff className="w-3.5 h-3.5" />
            ) : (
              <Wifi className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[12px] leading-tight block text-white">
              {notification.title}
            </span>
            <span
              className={`text-[10.5px] leading-tight block truncate mt-0.5 ${
                notification.type === 'offline' ? 'text-amber-200/90' : 'text-emerald-200/90'
              }`}
            >
              {notification.description}
            </span>
          </div>
        </div>

        <button
          onClick={() => setNotification(null)}
          className={`p-1 rounded-lg shrink-0 transition-colors cursor-pointer ml-2 ${
            notification.type === 'offline'
              ? 'hover:bg-amber-800/80 text-amber-300'
              : 'hover:bg-emerald-800/80 text-emerald-300'
          }`}
          aria-label="Dismiss"
          title={lang === 'gu' ? 'બંધ કરો' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

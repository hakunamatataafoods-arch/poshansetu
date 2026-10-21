import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle2, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';
import { PoshanSetuEmblem } from './PoshanSetuLogo';

interface PWAInstallButtonProps {
  lang?: Language;
  variant?: 'banner' | 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang = 'gu',
  variant = 'banner'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed and running standalone, do not display
  if (isInstalled || dismissed) {
    return null;
  }

  // Handle installation action
  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General Android / Chrome instruction fallback
      alert(
        lang === 'gu'
          ? 'તમારા બ્રાઉઝરના મેનુ (⋮) પર ક્લિક કરો અને "Add to Home screen" અથવા "Install app" પસંદ કરો.'
          : 'Tap browser menu (⋮) and select "Add to Home screen" or "Install app".'
      );
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-3.5 text-white shadow-md border border-emerald-600/40 relative overflow-hidden">
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2.5 right-2.5 text-emerald-200 hover:text-white p-1 rounded-lg"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center p-1.5 shrink-0 border border-white/20">
              <PoshanSetuEmblem className="w-7 h-7" />
            </div>

            <div className="min-w-0 flex-1 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100">
                  {lang === 'gu' ? '૧૦૦% ઑફલાઇન' : '100% Offline'}
                </span>
                <span className="text-[10px] text-emerald-200 font-semibold">
                  {lang === 'gu' ? 'ઇન્ટરનેટ વગર ચાલે છે' : 'Works without internet'}
                </span>
              </div>
              <h4 className="text-xs font-black tracking-tight mt-0.5 text-white">
                {lang === 'gu' ? 'પોષણ સેતુ એપ ફોનમાં ઇન્સ્ટોલ કરો' : 'Install PoshanSetu on Your Phone'}
              </h4>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 py-2 px-3 bg-white text-emerald-950 font-black text-xs rounded-xl hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
              <span>{lang === 'gu' ? 'હમણાં ઇન્સ્ટોલ કરો (Install App)' : 'Install App on Phone'}</span>
            </button>
            {isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="py-2 px-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] rounded-xl transition-all flex items-center gap-1"
              >
                <Share className="w-3 h-3 text-emerald-200" />
                <span>iOS</span>
              </button>
            )}
          </div>
        </div>
      ) : variant === 'button' ? (
        <button
          onClick={handleInstallClick}
          className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>{lang === 'gu' ? 'મોબાઇલમાં એપ ઇન્સ્ટોલ કરો (PWA)' : 'Install App on Phone (PWA)'}</span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 flex items-center gap-1 text-[10px] font-bold"
          title="Install App"
        >
          <Download className="w-3 h-3" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  {lang === 'gu' ? 'iPhone પર એપ ઇન્સ્ટોલ કરવાની રીત' : 'Install on iPhone / iPad'}
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <p>
                  {lang === 'gu' ? (
                    <>
                      Safari બ્રાઉઝરની નીચે આપેલ <strong>શેર (Share)</strong> બટન (<Share className="w-3.5 h-3.5 inline text-blue-600" />) પર ક્લિક કરો.
                    </>
                  ) : (
                    <>
                      Tap the <strong>Share</strong> button (<Share className="w-3.5 h-3.5 inline text-blue-600" />) in the Safari toolbar.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <p>
                  {lang === 'gu' ? (
                    <>
                      નીચે સ્ક્રોલ કરીને <strong>"Add to Home Screen"</strong> (હોમ સ્ક્રીન પર ઉમેરો) પસંદ કરો.
                    </>
                  ) : (
                    <>
                      Scroll down and tap <strong>"Add to Home Screen"</strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <p>
                  {lang === 'gu' ? (
                    <>
                      ઉપર જમણી બાજુએ <strong>"Add"</strong> પર ટેપ કરો. એપ તમારા ફોનમાં ઇન્સ્ટોલ થઈ જશે!
                    </>
                  ) : (
                    <>
                      Tap <strong>"Add"</strong> in the top right corner. The app will appear on your home screen!
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              {lang === 'gu' ? 'સમજાઈ ગયું (Close)' : 'Got it, Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

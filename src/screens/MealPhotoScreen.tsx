import React, { useState } from 'react';
import { ArrowLeft, Camera, MapPin, CheckCircle2, Clock, ShieldCheck, RefreshCw, Sparkles, Home } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';

interface MealPhotoScreenProps {
  onBack: () => void;
  lang: Language;
}

export const MealPhotoScreen: React.FC<MealPhotoScreenProps> = ({ onBack, lang }) => {
  const t = translations[lang];

  const [photoTaken, setPhotoTaken] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const capturePhoto = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setPhotoTaken(true);
      setAnalyzing(false);
    }, 800);
  };

  const handleUpload = () => {
    setUploaded(true);
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Header */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs"
          aria-label={t.back}
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div className="flex flex-col items-center pt-0.5">
          <PoshanSetuLogo size="sm" />
          <span className="text-[12px] font-semibold text-[#15803D] tracking-tight mt-0.5">
            {t.tagline}
          </span>
        </div>
      </div>

      <div className="text-center pt-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.mealPhotoUploadSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'GPS Geo-Tagged Meal Quality Verification'
            : 'જીપીએસ જિયો-ટેગ કરેલ ભોજન ગુણવત્તા ચકાસણી'}
        </p>
      </div>

      {uploaded ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {lang === 'en' ? 'Photo Geo-Tagged & Submitted!' : 'ફોટો સફળતાપૂર્વક અપલોડ થયો!'}
          </h2>
          <p className="text-xs text-slate-600">
            Supervisor monitoring portal has verified nutrition compliance for today's meal.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-4">
          {/* Viewfinder Frame with GPS Watermark */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-inner flex flex-col justify-between p-3">
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-24 h-24 border border-dashed border-white rounded-lg" />
            </div>

            {/* Top Live Badges */}
            <div className="flex items-center justify-between z-10">
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md">
                <MapPin className="w-3 h-3 text-red-400" />
                22.5833° N, 72.8833° E (04 Vadtal, Taluka Anand)
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md">
                <Clock className="w-3 h-3 text-emerald-400" />
                18-Oct-2026 10:38 AM IST
              </span>
            </div>

            {/* Meal Thali inside camera preview */}
            <div className="flex-1 flex items-center justify-center py-2">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-600 flex items-center justify-center relative shadow-lg">
                <div className="w-28 h-28 rounded-full bg-slate-200 p-2 flex flex-col items-center justify-center">
                  <div className="w-12 h-10 bg-white rounded-full border border-slate-300" />
                  <div className="flex gap-2 mt-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600" />
                    <div className="w-6 h-6 rounded-full bg-amber-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Watermark Overlay */}
            <div className="z-10 bg-black/75 backdrop-blur-xs p-2 rounded-xl text-white text-[10px] space-y-0.5 border border-white/10">
              <div className="flex justify-between font-bold">
                <span>PoshanSetu GeoVerify</span>
                <span>AWVAD04</span>
              </div>
              <div className="text-slate-300 flex justify-between text-[9px]">
                <span>AWW: Shrimati Bhavnaben Patel</span>
                <span className="text-emerald-400">Supervisor: Shardaben Shah</span>
              </div>
            </div>
          </div>

          {/* AI Compliance Check Banner */}
          {photoTaken && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Nutritional Quality Standard Verified</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Balanced Thali detected with warm Sukdi, cooked pulses and vegetable portion meeting Poshan Abhiyaan hot-cooked meal criteria.
              </p>
            </div>
          )}

          {/* Camera Trigger Buttons */}
          {!photoTaken ? (
            <button
              onClick={capturePhoto}
              disabled={analyzing}
              className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Camera className="w-5 h-5 stroke-[2.2]" />
              <span>{analyzing ? 'Capturing & Geo-tagging...' : '📷 Capture Meal Photo'}</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setPhotoTaken(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Retake
              </button>
              <button
                onClick={handleUpload}
                className="flex-2 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit to Supervisor Portal</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

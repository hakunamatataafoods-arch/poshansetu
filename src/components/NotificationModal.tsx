import React, { useEffect } from 'react';
import { X, Bell, AlertTriangle, Clock, MapPin, CheckCircle2, ShieldAlert, UserCheck, Calendar } from 'lucide-react';
import { Language } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  // Play subtle government alert chime on open
  useEffect(() => {
    if (isOpen) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const now = ctx.currentTime;
          
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(659.25, now); // E5
          gain1.gain.setValueAtTime(0.15, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.3);

          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(880, now + 0.15); // A5
          gain2.gain.setValueAtTime(0.2, now + 0.15);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(now + 0.15);
          osc2.stop(now + 0.55);
        }
      } catch {
        // audio context autoplay restrictions ignored safely
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border-2 border-red-500/80">
        
        {/* Pulsing Alert Banner Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-4 ring-white/30 animate-pulse">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-200">
                  {lang === 'en' ? 'URGENT NOTIFICATION' : 'અતિ મહત્વપૂર્ણ સૂચના'}
                </span>
              </div>
              <h3 className="font-black text-lg leading-tight tracking-tight text-white drop-shadow-xs">
                {lang === 'en' ? 'Supervision is Coming!' : 'સુપરવિઝન આવી રહ્યું છે!'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Exclusive Supervision Visit Alert Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Main Inspection Callout Card */}
          <div className="bg-gradient-to-br from-rose-50 via-red-50/60 to-amber-50 border-2 border-red-400 rounded-2xl p-4.5 space-y-3.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldAlert className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-red-800 bg-red-100 px-2 py-0.5 rounded-full border border-red-300">
                  {lang === 'en' ? 'OFFICIAL INSPECTION ALERT' : 'સત્તાવાર નિરીક્ષણ ચેતવણી'}
                </span>
                <h4 className="text-base font-black text-slate-900 mt-1 leading-snug">
                  {lang === 'en'
                    ? 'Supervisor Shardaben Shah is Arriving for Supervision'
                    : 'સુપરવાઈઝર શારદાબેન શાહ મુલાકાત માટે આવી રહ્યા છે'}
                </h4>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-red-200/90 text-xs text-slate-800 font-medium leading-relaxed space-y-1.5 shadow-2xs">
              <p className="font-bold text-red-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Attention: Shrimati Bhavnaben Patel (Anganwadi Worker)'
                    : 'ધ્યાન આપો: શ્રીમતી ભાવનાબેન પટેલ (આંગણવાડી કાર્યકર)'}
                </span>
              </p>
              <p className="text-slate-700">
                {lang === 'en'
                  ? 'Supervisor Shardaben Shah is arriving today at 04 Vadtal (AWVAD04), Taluka Anand for on-site physical inspection and register audit.'
                  : 'સુપરવાઈઝર શારદાબેન શાહ આજે ૦૪ વડતાલ આંગણવાડી કેન્દ્ર (AWVAD04, તાલુકો આણંદ) ખાતે સ્થળ પર નિરીક્ષણ અને રજિસ્ટર ઓડિટ માટે આવી રહ્યા છે.'}
              </p>
            </div>

            {/* Visit Details Key Value Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-red-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                  <UserCheck className="w-3 h-3 text-red-600" />
                  {lang === 'en' ? 'Supervisor' : 'સુપરવાઈઝર'}
                </span>
                <span className="font-extrabold text-slate-900 text-[11.5px] block truncate">
                  Shardaben Shah
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-red-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                  <Clock className="w-3 h-3 text-red-600" />
                  {lang === 'en' ? 'Inspection Time' : 'મુલાકાત સમય'}
                </span>
                <span className="font-extrabold text-slate-900 text-[11.5px] block">
                  Today, 11:30 AM
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-red-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                  <MapPin className="w-3 h-3 text-red-600" />
                  {lang === 'en' ? 'Location' : 'કેન્દ્ર'}
                </span>
                <span className="font-extrabold text-slate-900 text-[11.5px] block truncate">
                  04 Vadtal (AWVAD04)
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-red-200 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 uppercase">
                  <Calendar className="w-3 h-3 text-red-600" />
                  {lang === 'en' ? 'Taluka' : 'તાલુકો'}
                </span>
                <span className="font-extrabold text-slate-900 text-[11.5px] block">
                  Taluka Anand
                </span>
              </div>
            </div>
          </div>

          {/* Immediate Action Checklist for Inspection */}
          <div className="space-y-2">
            <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-red-600 rounded-full" />
              {lang === 'en' ? 'Ready for Supervisor Inspection:' : 'સુપરવિઝન માટે આટલું તૈયાર રાખો:'}
            </h5>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold">
                  {lang === 'en'
                    ? 'Daily Food Menu Register: Verified 30g Breakfast & 50g Lunch deductions'
                    : 'દૈનિક ભોજન રજિસ્ટર: ૩૦ ગ્રામ નાસ્તો અને ૫૦ ગ્રામ ભોજન નોંધણી તૈયાર છે'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold">
                  {lang === 'en'
                    ? 'Stock Inward Register: Batch numbers & expiry dates for Rice, Atta, Oil, Bal Shakti, Matru Shakti & Poon Shakti'
                    : 'સ્ટોક આવક રજિસ્ટર: ચોખા, આટો, તેલ, બાલ શક્તિ, માતૃ શક્તિ અને પૂર્ણા શક્તિના બેચ નંબર અને એક્સપાયરી તૈયાર છે'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold">
                  {lang === 'en'
                    ? 'Student Attendance: 10/10 student attendance verified'
                    : 'બાળકોની હાજરી: ૧૦/૧૦ બાળકોની હાજરી નોંધાયેલી છે'}
                </span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold">
                  {lang === 'en'
                    ? 'Inter-AWC Transfer Ledger: Security Voucher #8491 exchanges logged'
                    : 'આંગણવાડી સ્ટોક વિનિમય રજિસ્ટર: #8491 કોડ વાઉચર્સ નોંધાયેલા છે'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Single Prominent Acknowledge Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{lang === 'en' ? 'Supervision Alert Active' : 'સુપરવિઝન એલર્ટ સક્રિય'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-[#15803D] to-[#166534] text-white text-xs font-black rounded-xl hover:opacity-95 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {lang === 'en' ? '✓ Understood • Ready' : '✓ સમજાયું • તૈયારી પૂર્ણ'}
          </button>
        </div>
      </div>
    </div>
  );
};

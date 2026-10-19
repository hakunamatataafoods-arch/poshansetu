import React from 'react';
import { X, School, MapPin, Users, Droplet, Sparkles, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface CentreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const CentreDetailsModal: React.FC<CentreDetailsModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'en' ? 'Anganwadi Centre Profile' : 'આંગણવાડી કેન્દ્રની વિગત'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'en' ? 'AWVAD04 • 04 Vadtal Centre' : 'AWVAD04 • ૦૪ વડતાલ કેન્દ્ર'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Main Badge */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">04 Vadtal Anganwadi Centre</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Taluka: Anand • District: Anand • Code: AWVAD04
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Worker: Shrimati Bhavnaben Patel • Supervisor: Shardaben Shah
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" /> Model AWC Grade A+ • Vadtal
                </span>
              </div>
            </div>
          </div>

          {/* Beneficiary Demographics */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Registered Beneficiaries' : 'નોંધાયેલા લાભાર્થીઓ'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Children (3-6 yrs)</span>
                <span className="text-lg font-bold text-slate-900">28</span>
                <span className="text-[10px] text-slate-500 block">15 Boys • 13 Girls</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Infants (6m-3 yrs)</span>
                <span className="text-lg font-bold text-slate-900">18</span>
                <span className="text-[10px] text-slate-500 block">Bal Shakti Recipients</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Pregnant Women (PW)</span>
                <span className="text-lg font-bold text-slate-900">6</span>
                <span className="text-[10px] text-slate-500 block">Matru Shakti</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Lactating Mothers (LM)</span>
                <span className="text-lg font-bold text-slate-900">8</span>
                <span className="text-[10px] text-slate-500 block">Purna Shakti</span>
              </div>
            </div>
          </div>

          {/* Centre Infrastructure Facilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {lang === 'en' ? 'Facilities & Infrastructure' : 'સુવિધાઓ અને માળખું'}
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  {lang === 'en' ? 'Safe Drinking Water (RO Tap)' : 'પીવાનું શુદ્ધ પાણી (RO)'}
                </span>
                <span className="font-semibold text-emerald-700">✓ Functional</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {lang === 'en' ? 'Clean Kitchen & Gas Stove' : 'સ્વચ્છ રસોડું અને ગેસ ચૂલો'}
                </span>
                <span className="font-semibold text-emerald-700">✓ Available</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  {lang === 'en' ? 'Digital Infantometer & Scale' : 'ડિજિટલ વજન કાંટો'}
                </span>
                <span className="font-semibold text-emerald-700">✓ Calibrated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#15803D] text-white text-xs font-semibold rounded-xl hover:bg-[#166534] transition-colors"
          >
            {lang === 'en' ? 'Close' : 'બંધ કરો'}
          </button>
        </div>
      </div>
    </div>
  );
};

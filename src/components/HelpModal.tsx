import React from 'react';
import { X, Phone, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'en' ? 'Anganwadi Worker Helpdesk' : 'આંગણવાડી કાર્યકર સહાય કેન્દ્ર'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'en' ? 'Poshan Abhiyaan Support & Guidelines' : 'પોષણ અભિયાન સહાય અને માર્ગદર્શિકા'}
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
          {/* Quick Helplines */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {lang === 'en' ? 'Official Helplines' : 'સત્તાવાર હેલ્પલાઇન નંબર'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col">
                <span className="text-[11px] text-emerald-800 font-medium">Poshan Tracker Toll-Free</span>
                <span className="text-base font-bold text-emerald-900 mt-0.5">14408</span>
                <span className="text-[10px] text-emerald-600 mt-1">9:00 AM - 6:00 PM</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col">
                <span className="text-[11px] text-orange-800 font-medium">Childline India</span>
                <span className="text-base font-bold text-orange-900 mt-0.5">1098</span>
                <span className="text-[10px] text-orange-600 mt-1">24x7 Emergency</span>
              </div>
            </div>
          </div>

          {/* Supervisor Direct Contact */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Centre Supervisor' : 'કેન્દ્ર સુપરવાઈઝર'}
                </span>
                <h5 className="text-sm font-bold text-slate-900">Shardaben Shah</h5>
                <p className="text-xs text-slate-600">04 Vadtal Centre • Taluka Anand</p>
              </div>
              <a
                href="tel:9876543210"
                className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Common FAQs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {lang === 'en' ? 'Frequently Asked Questions' : 'સામાન્ય પ્રશ્નો અને માર્ગદર્શન'}
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-900">
                  {lang === 'en' ? '1. Can I enter meal usage without internet?' : '૧. શું ઈન્ટરનેટ વગર ભોજન નોંધણી કરી શકાય?'}
                </p>
                <p className="text-slate-600 mt-1">
                  {lang === 'en'
                    ? 'Yes! All meal and stock entries save locally on your device. Once you connect to the internet, they automatically sync with the supervisor portal.'
                    : 'હા! બધી જ નોંધણી તમારા ફોનમાં સાચવવામાં આવે છે. ઈન્ટરનેટ મળતાં જ તે સુપરવાઈઝર પોર્ટલ સાથે આપમેળે સમન્વયિત થઈ જશે.'}
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-900">
                  {lang === 'en' ? '2. How does the 30g / 50g ratio work?' : '૨. ૩૦ ગ્રામ / ૫૦ ગ્રામનું નિયમ કેવી રીતે કામ કરે છે?'}
                </p>
                <p className="text-slate-600 mt-1">
                  {lang === 'en'
                    ? 'Breakfast (Morning Snack) allocates 30 gm raw weight per present student. Lunch allocates 50 gm per student. You can adjust up to 100 gm for cooking batch requirements.'
                    : 'સવારના નાસ્તા માટે બાળક દીઠ ૩૦ ગ્રામ અને બપોરના ભોજન માટે ૫૦ ગ્રામ પ્રમાણ છે.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#15803D] text-white text-xs font-semibold rounded-xl hover:bg-[#166534] transition-colors"
          >
            {lang === 'en' ? 'Done' : 'પૂર્ણ'}
          </button>
        </div>
      </div>
    </div>
  );
};

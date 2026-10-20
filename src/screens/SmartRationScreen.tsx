import React from 'react';
import { ArrowLeft, BookOpen, Scale, Award, Info, Check, Home } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';

interface SmartRationScreenProps {
  onBack: () => void;
  lang: Language;
}

export const SmartRationScreen: React.FC<SmartRationScreenProps> = ({ onBack, lang }) => {
  const t = translations[lang];

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
          {t.smartRationSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'Official POSHAN 2.0 Auto-Deduction & Recipe Norms'
            : 'પોષણ ૨.૦ ઓટો-કપાત અને રેસિપી માર્ગદર્શિકા'}
        </p>
      </div>

      {/* Dual Inventory Architecture Explanation */}
      <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            {lang === 'en' ? 'Dual-Inventory Accounting Rules' : 'બેવડી ઇન્વેન્ટરી હિસાબ પદ્ધતિ'}
          </h2>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#EAF7EE] rounded-xl border border-emerald-200">
            <span className="font-bold text-emerald-950 block">
              {lang === 'en' ? 'Track 1: Direct Sealed Packets (THR)' : 'ટ્રેક ૧: પેક કરેલ પૂરક આહાર (THR)'}
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Bal Shakti (500g), Matru Shakti (1kg), Purna Shakti (1kg) are strictly audited in whole individual packet units. Never fractionated.
            </p>
          </div>

          <div className="p-3 bg-[#FFF7ED] rounded-xl border border-orange-200">
            <span className="font-bold text-orange-950 block">
              {lang === 'en' ? 'Track 2: Raw Staples (Hot Cooked Meals)' : 'ટ્રેક ૨: કાચો અનાજ પુરવઠો (ગરમ ભોજન)'}
            </span>
            <p className="text-orange-800 text-[11px] mt-0.5">
              Whole Wheat Atta, Fortified Rice, Tuver Dal, Fortified Oil are calculated in exact decimal weights (grams and kg) multiplied by student attendance.
            </p>
          </div>
        </div>
      </div>

      {/* Official Recipe Ratios */}
      <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-700" />
          <h2 className="text-sm font-bold text-slate-900">
            {lang === 'en' ? 'Standard Child Portions' : 'બાળક દીઠ નિયત પ્રમાણ'}
          </h2>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Sukdi (Morning Breakfast)</span>
              <span className="text-emerald-700">30 gm / child</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Wheat flour (30g) roasted with pure cow ghee and fortified jaggery. Provides ~160 kcal energy.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Vegetable Khichdi (Afternoon Lunch)</span>
              <span className="text-emerald-700">50 gm / child</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Rice (35g) + Tuver Dal (15g) + Fresh green vegetables (20g) + Fortified oil (5g). Provides ~340 kcal & 12g protein.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Bal Shakti Sheera</span>
              <span className="text-emerald-700">30 gm / child</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Pre-fortified extruded cereal blend with micronutrients and essential iron/folic acid.
            </p>
          </div>
        </div>
      </div>

      {/* Return to Home Page Button */}
      <button
        onClick={onBack}
        className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <Home className="w-4 h-4 stroke-[2.2]" />
        <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
      </button>
    </div>
  );
};

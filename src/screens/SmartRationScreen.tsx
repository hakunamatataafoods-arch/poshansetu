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
              {lang === 'en' ? 'Track 1: Direct Sealed Packets (THR)' : 'ટ્રેક ૧: સીલબંધ પેકેટ્સ (ટેક હોમ રાશન - THR)'}
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              {lang === 'en'
                ? 'Bal Shakti (500g), Matru Shakti (1kg), Purna Shakti (1kg) are strictly audited in whole individual packet units. Never fractionated.'
                : 'બાલ શક્તિ (૫૦૦ગ્રા), માતૃ શક્તિ (૧કિલો), પૂર્ણા શક્તિ (૧કિલો) સંપૂર્ણ પેકેટ યુનિટમાં ઓડિટ થાય છે. તેને ક્યારેય તોડવામાં આવતા નથી.'}
            </p>
          </div>

          <div className="p-3 bg-[#FFF7ED] rounded-xl border border-orange-200">
            <span className="font-bold text-orange-950 block">
              {lang === 'en' ? 'Track 2: Raw Staples (Hot Cooked Meals)' : 'ટ્રેક ૨: કાચો અનાજ પુરવઠો (ગરમ રાંધેલું ભોજન)'}
            </span>
            <p className="text-orange-800 text-[11px] mt-0.5">
              {lang === 'en'
                ? 'Whole Wheat Atta, Fortified Rice, Tuver Dal, Fortified Oil are calculated in exact decimal weights (grams and kg) multiplied by student attendance.'
                : 'ઘઉંનો લોટ, ફોર્ટિફાઇડ ચોખા, તુવેર દાળ, ફોર્ટિફાઇડ તેલ ચોક્કસ ગ્રામ અને કિલોગ્રામમાં હાજર બાળકોની સંખ્યા સાથે ગુણીને ગણતરી થાય છે.'}
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
              <span>{lang === 'en' ? 'Sukdi (Morning Breakfast)' : 'સુખડી (સવારનો નાસ્તો)'}</span>
              <span className="text-emerald-700">{lang === 'en' ? '30 gm / child' : '૩૦ ગ્રામ / બાળક'}</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {lang === 'en'
                ? 'Wheat flour (25g) roasted with edible oil/ghee and jaggery (5g). Provides ~160 kcal energy.'
                : 'ઘઉંનો લોટ (૨૫ગ્રા), ખાદ્ય તેલ/ઘી (૫ગ્રા) અને ગોળ. બાળકને ~૧૬૦ કિલોકેલરી ઊર્જા પૂરી પાડે છે.'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>{lang === 'en' ? 'Vegetable Khichdi (Afternoon Lunch)' : 'વેજીટેબલ ખીચડી (બપોરનું ભોજન)'}</span>
              <span className="text-emerald-700">{lang === 'en' ? '50 gm / child' : '૫૦ ગ્રામ / બાળક'}</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {lang === 'en'
                ? 'Rice (35g) + Tuver Dal (15g) + Fortified oil (5g) + Fresh green vegetables. Provides ~340 kcal & 12g protein.'
                : 'ચોખા (૩૫ગ્રા) + તુવેર દાળ (૧૫ગ્રા) + ફોર્ટિફાઇડ તેલ (૫ગ્રા) + તાજા શાકભાજી. ~૩૪૦ કેલરી અને ૧૨ગ્રા પ્રોટીન આપે છે.'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>{lang === 'en' ? 'Bal Shakti Sheera' : 'બાલ શક્તિ શીરો'}</span>
              <span className="text-emerald-700">{lang === 'en' ? '30 gm / child' : '૩૦ ગ્રામ / બાળક'}</span>
            </div>
            <p className="text-[11px] text-slate-600">
              {lang === 'en'
                ? 'Pre-fortified extruded cereal blend (25g) with oil (5g), iron, and essential micronutrients.'
                : 'પૂરક આહાર બાલ શક્તિ પ્રિમિક્સ (૨૫ગ્રા) અને તેલ (૫ગ્રા), આયર્ન અને વિટામિન યુક્ત પોષક આહાર.'}
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

import React, { useState } from 'react';
import { ArrowLeft, Utensils, Scale, Info, CheckCircle2, ChevronDown, Plus, Minus, FileText } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';

interface MealUsageScreenProps {
  onBack: () => void;
  lang: Language;
  initialStudentsCount: number;
  onConfirmDeduction: (data: {
    mealType: 'breakfast' | 'lunch';
    menuName: string;
    studentsCount: number;
    ratioGm: number;
    adjustmentGm: number;
    totalGm: number;
  }) => Promise<void>;
}

export const MealUsageScreen: React.FC<MealUsageScreenProps> = ({
  onBack,
  lang,
  initialStudentsCount,
  onConfirmDeduction
}) => {
  const t = translations[lang];

  // State matching image
  const [mealType, setMealType] = useState<'breakfast' | 'lunch'>('breakfast');
  const [studentsCount, setStudentsCount] = useState<number>(initialStudentsCount || 10);
  const [selectedMenu, setSelectedMenu] = useState<string>('Sukdi (Atta)');
  const [adjustmentGm, setAdjustmentGm] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<boolean>(false);

  // Breakfast = 30gm, Lunch = 50gm
  const fixedRatio = mealType === 'breakfast' ? 30 : 50;
  const calculatedGm = studentsCount * fixedRatio;
  const totalGm = Math.max(0, calculatedGm + adjustmentGm);

  const menuOptions = [
    { id: 'sukdi', label: 'Sukdi (Atta)', defaultMeal: 'breakfast' },
    { id: 'khichdi', label: 'Vegetable Khichdi (Rice + Dal)', defaultMeal: 'lunch' },
    { id: 'bal-shakti', label: 'Bal Shakti Sheera', defaultMeal: 'breakfast' },
    { id: 'poha', label: 'Poha', defaultMeal: 'breakfast' },
    { id: 'dalia', label: 'Dalia (Sweet Wheat Porridge)', defaultMeal: 'lunch' }
  ];

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirmDeduction({
        mealType,
        menuName: selectedMenu,
        studentsCount,
        ratioGm: fixedRatio,
        adjustmentGm,
        totalGm
      });
      setSuccessBanner(true);
      setTimeout(() => {
        setSuccessBanner(false);
      }, 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Top Navigation & Brand Header (Matching poshan_setu_meal_usage_entry_2.jpg) */}
      <div className="relative flex flex-col items-center">
        {/* Back Button on top left */}
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs"
          aria-label={t.back}
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Logo & Tagline */}
        <div className="flex flex-col items-center pt-0.5">
          <PoshanSetuLogo size="sm" />
          <span className="text-[12px] font-semibold text-[#15803D] tracking-tight mt-0.5">
            {t.tagline}
          </span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="text-center pt-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.mealUsageTitle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {t.centreSubtext}
        </p>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold text-emerald-900">
            {t.deductionSuccess}
          </p>
        </div>
      )}

      {/* Main Form Card (Matching poshan_setu_meal_usage_entry_2.jpg) */}
      <div className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-xs space-y-4">
        {/* Green Banner: Meal 1 – Breakfast (with Lunch toggle) */}
        <div className="bg-[#EAF7EE] rounded-2xl p-3 flex items-center justify-between border border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700/10 text-emerald-800 flex items-center justify-center">
              <Utensils className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-bold text-slate-900 text-base">
              {mealType === 'breakfast' ? t.meal1Breakfast : t.meal2Lunch}
            </span>
          </div>

          {/* Quick toggle pill */}
          <div className="flex items-center bg-white p-0.5 rounded-xl border border-emerald-200">
            <button
              onClick={() => {
                setMealType('breakfast');
                setSelectedMenu('Sukdi (Atta)');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                mealType === 'breakfast'
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Breakfast
            </button>
            <button
              onClick={() => {
                setMealType('lunch');
                setSelectedMenu('Vegetable Khichdi (Rice + Dal)');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                mealType === 'lunch'
                  ? 'bg-[#15803D] text-white shadow-2xs'
                  : 'text-slate-600'
              }`}
            >
              Lunch
            </button>
          </div>
        </div>

        {/* No. of Students Present */}
        <div className="flex items-center justify-between pt-1">
          <label className="text-sm font-bold text-slate-800">
            {t.studentsPresent}
          </label>
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setStudentsCount((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-base transition-colors"
              aria-label="Decrease students"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="w-12 text-center font-bold text-slate-900 text-base tabular-nums">
              {studentsCount}
            </span>
            <button
              onClick={() => setStudentsCount((prev) => prev + 1)}
              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-base transition-colors"
              aria-label="Increase students"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Menu – Select */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-800 block">
            {t.menuSelect}
          </label>
          <div className="relative">
            <select
              value={selectedMenu}
              onChange={(e) => {
                setSelectedMenu(e.target.value);
                if (e.target.value.includes('Khichdi') || e.target.value.includes('Dalia')) {
                  setMealType('lunch');
                }
              }}
              className="w-full bg-white border border-slate-200 text-slate-900 font-semibold text-sm rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 shadow-2xs"
            >
              {menuOptions.map((opt) => (
                <option key={opt.id} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-4 pointer-events-none" />
          </div>
        </div>

        {/* Fixed Ratio Badge (Matching poshan_setu_meal_usage_entry_2.jpg) */}
        <div className="bg-[#EAF7EE] rounded-2xl p-3 flex items-center gap-3 border border-emerald-100/80">
          <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow-2xs shrink-0">
            <Scale className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-sm font-bold text-emerald-950 block leading-tight">
              {t.fixedRatio}
            </span>
            <span className="text-xs text-emerald-800 font-medium">
              {mealType === 'breakfast' ? t.ratioBreakfastDesc : t.ratioLunchDesc}
            </span>
          </div>
        </div>

        {/* Calculation Box: Present Students x 30 gm */}
        <div className="bg-[#F8FAFC] rounded-2xl p-3 border border-slate-200 text-center space-y-1">
          <span className="text-xs font-semibold text-slate-500 block">
            {t.calculationPrefix} {fixedRatio} {t.gm}
          </span>
          <div className="text-sm font-bold text-slate-800 tracking-wide">
            {studentsCount} × {fixedRatio} {t.gm} = <span className="text-emerald-800">{calculatedGm} {t.gm}</span>
          </div>
        </div>

        {/* Large Total Box (Matching poshan_setu_meal_usage_entry_2.jpg) */}
        <div className="bg-[#EAF7EE] rounded-2xl py-3.5 px-4 text-center border border-emerald-200/80">
          <span className="text-xl font-extrabold text-[#15803D] tracking-tight">
            {t.totalEquals} {totalGm} {t.gm}
          </span>
        </div>

        {/* Note Banner with adjustment control */}
        <div className="space-y-2">
          <div className="bg-[#F1F5F9] rounded-xl p-2.5 flex items-center gap-2 text-slate-600 text-[11px] font-medium border border-slate-200">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{t.adjustmentNote}</span>
          </div>

          {/* Quick Adjustment Controls (-100g / 0g / +100g) */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Batch adjustment:' : 'જથ્થામાં ફેરફાર:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAdjustmentGm((prev) => Math.max(-100, prev - 50))}
                className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                -50 gm
              </button>
              <span className="text-xs font-bold text-slate-800 tabular-nums px-1">
                {adjustmentGm > 0 ? `+${adjustmentGm}` : adjustmentGm} gm
              </span>
              <button
                onClick={() => setAdjustmentGm((prev) => Math.min(100, prev + 50))}
                className="px-2 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                +50 gm
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width Dark Green Button: ✓ Confirm Deduction */}
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span>{submitting ? t.syncing : t.confirmDeduction}</span>
        </button>
      </div>

      {/* Bottom Summary Card (Matching poshan_setu_meal_usage_entry_2.jpg) */}
      <div className="bg-[#EAF7EE] rounded-2xl p-4 border border-emerald-100/90 space-y-2 shadow-2xs">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
          <FileText className="w-4 h-4 text-emerald-700" />
          <span>{t.mealUsageSummary}</span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span>{t.studentsServed}</span>
            <span className="font-bold text-slate-900 tabular-nums">{studentsCount}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span>{t.plannedQuantity}</span>
            <span className="font-bold text-slate-900 tabular-nums">{totalGm} {t.gm}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

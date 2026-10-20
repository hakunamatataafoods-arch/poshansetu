import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Utensils,
  Scale,
  Info,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  FileText,
  Home,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Package,
  Trash2,
  Send,
  Calculator
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language, MealMaterialItem, InventoryItem } from '../types';
import { translations } from '../data/translations';

interface MealUsageScreenProps {
  onBack: () => void;
  lang: Language;
  initialStudentsCount: number;
  inventory?: InventoryItem[];
  onConfirmDeduction: (data: {
    mealType: 'breakfast' | 'lunch';
    menuName: string;
    studentsCount: number;
    ratioGm: number;
    adjustmentGm: number;
    totalGm: number;
    totalKg: number;
    materialsUsed: MealMaterialItem[];
    workerNote: string;
  }) => Promise<void>;
}

// Preset recipes with realistic 2 to 3 materials
interface RecipePreset {
  id: string;
  labelEn: string;
  labelGu: string;
  defaultMeal: 'breakfast' | 'lunch';
  defaultMaterials: {
    id: string;
    nameEn: string;
    nameGu: string;
    gmPerStudent: number;
  }[];
}

const RECIPE_PRESETS: RecipePreset[] = [
  {
    id: 'khichdi',
    labelEn: 'Vegetable Khichdi (Rice + Dal + Oil)',
    labelGu: 'વેજીટેબલ ખીચડી (ચોખા + દાળ + તેલ)',
    defaultMeal: 'lunch',
    defaultMaterials: [
      { id: 'rice', nameEn: 'Fortified Rice', nameGu: 'ફોર્ટિફાઇડ ચોખા', gmPerStudent: 35 },
      { id: 'dal', nameEn: 'Tuver Dal', nameGu: 'તુવેર દાળ', gmPerStudent: 15 },
      { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', gmPerStudent: 5 }
    ]
  },
  {
    id: 'sukdi',
    labelEn: 'Sukdi (Atta + Oil/Ghee)',
    labelGu: 'સુખડી (ઘઉંનો લોટ + તેલ/ઘી)',
    defaultMeal: 'breakfast',
    defaultMaterials: [
      { id: 'atta', nameEn: 'Whole Wheat Atta', nameGu: 'આખો ઘઉંનો લોટ', gmPerStudent: 25 },
      { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', gmPerStudent: 5 }
    ]
  },
  {
    id: 'bal-shakti',
    labelEn: 'Bal Shakti Sheera (Premix + Oil)',
    labelGu: 'બાલ શક્તિ શીરો (પ્રિમિક્સ + તેલ)',
    defaultMeal: 'breakfast',
    defaultMaterials: [
      { id: 'bal_shakti', nameEn: 'Bal Shakti Premix', nameGu: 'બાલ શક્તિ પ્રિમિક્સ', gmPerStudent: 25 },
      { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', gmPerStudent: 5 }
    ]
  },
  {
    id: 'poha',
    labelEn: 'Poha (Rice Flakes + Oil + Veggies)',
    labelGu: 'પૌંઆ (ચોખા + તેલ + શાકભાજી)',
    defaultMeal: 'breakfast',
    defaultMaterials: [
      { id: 'rice', nameEn: 'Fortified Rice (Poha)', nameGu: 'ફોર્ટિફાઇડ ચોખા (પૌંઆ)', gmPerStudent: 25 },
      { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', gmPerStudent: 5 }
    ]
  },
  {
    id: 'dalia',
    labelEn: 'Dalia Porridge (Wheat + Dal + Oil)',
    labelGu: 'દલિયા ખીચડી (ઘઉં + દાળ + તેલ)',
    defaultMeal: 'lunch',
    defaultMaterials: [
      { id: 'atta', nameEn: 'Wheat Dalia (Atta)', nameGu: 'ઘઉંના ફાડા (આટો)', gmPerStudent: 30 },
      { id: 'dal', nameEn: 'Tuver Dal', nameGu: 'તુવેર દાળ', gmPerStudent: 15 },
      { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', gmPerStudent: 5 }
    ]
  }
];

const AVAILABLE_MATERIALS = [
  { id: 'rice', nameEn: 'Fortified Rice', nameGu: 'ફોર્ટિફાઇડ ચોખા', defaultGm: 30 },
  { id: 'dal', nameEn: 'Tuver Dal', nameGu: 'તુવેર દાળ', defaultGm: 15 },
  { id: 'oil', nameEn: 'Fortified Edible Oil', nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', defaultGm: 5 },
  { id: 'atta', nameEn: 'Whole Wheat Atta', nameGu: 'આખો ઘઉંનો લોટ', defaultGm: 25 },
  { id: 'bal_shakti', nameEn: 'Bal Shakti Premix', nameGu: 'બાલ શક્તિ પ્રિમિક્સ', defaultGm: 25 },
  { id: 'vegetables', nameEn: 'Poshan Vatika Vegetables', nameGu: 'પોષણ વાટિકા લીલા શાકભાજી', defaultGm: 20 }
];

export const MealUsageScreen: React.FC<MealUsageScreenProps> = ({
  onBack,
  lang,
  initialStudentsCount,
  inventory = [],
  onConfirmDeduction
}) => {
  const t = translations[lang];

  // State
  const [mealType, setMealType] = useState<'breakfast' | 'lunch'>('lunch');
  const [studentsCount, setStudentsCount] = useState<number>(initialStudentsCount || 10);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('khichdi');

  // Materials currently in the recipe with editable grams
  const [materials, setMaterials] = useState<
    Array<{
      id: string;
      nameEn: string;
      nameGu: string;
      gmPerStudent: number;
    }>
  >(RECIPE_PRESETS[0].defaultMaterials);

  // Worker's Note section for superior
  const [workerNote, setWorkerNote] = useState<string>(
    lang === 'gu'
      ? 'આજે વેજીટેબલ ખીચડી માટે ચોખા, તુવેર દાળ અને તેલ એમ ૩ સામગ્રીનો ઉપયોગ કરાયો. પોષણ વાટિકામાંથી તાજી પાલક ઉમેરી તમામ બાળકોને ગરમ ભોજન પીરસાયું.'
      : 'Prepared 3-material Vegetable Khichdi using Fortified Rice, Tuver Dal, and Fortified Oil. Added fresh spinach from Poshan Vatika. All children ate full portion happily.'
  );

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showAddMaterialDropdown, setShowAddMaterialDropdown] = useState(false);

  const [deductedSummary, setDeductedSummary] = useState<{
    mealType: 'breakfast' | 'lunch';
    menuName: string;
    studentsCount: number;
    totalGm: number;
    totalKg: number;
    materialsUsed: MealMaterialItem[];
    workerNote: string;
  } | null>(null);

  // When recipe selection changes, load its default materials
  const handleSelectRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    const preset = RECIPE_PRESETS.find((r) => r.id === recipeId);
    if (preset) {
      setMealType(preset.defaultMeal);
      setMaterials(preset.defaultMaterials);
    }
  };

  // Change grams per student for a particular material
  const handleGmChange = (materialId: string, value: number) => {
    const validValue = Math.max(0, Math.min(250, value));
    setMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, gmPerStudent: validValue } : m))
    );
  };

  // Fast stepper adjustment
  const handleStepGm = (materialId: string, delta: number) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === materialId
          ? { ...m, gmPerStudent: Math.max(0, Math.min(250, m.gmPerStudent + delta)) }
          : m
      )
    );
  };

  // Add an additional material
  const handleAddMaterial = (matId: string) => {
    const existing = materials.find((m) => m.id === matId);
    if (existing) {
      // If already added, increase its grams
      handleStepGm(matId, 5);
    } else {
      const template = AVAILABLE_MATERIALS.find((m) => m.id === matId);
      if (template) {
        setMaterials((prev) => [
          ...prev,
          {
            id: template.id,
            nameEn: template.nameEn,
            nameGu: template.nameGu,
            gmPerStudent: template.defaultGm
          }
        ]);
      }
    }
    setShowAddMaterialDropdown(false);
  };

  // Remove a material
  const handleRemoveMaterial = (materialId: string) => {
    if (materials.length <= 1) {
      alert(
        lang === 'gu'
          ? 'ઓછામાં ઓછી એક સામગ્રી હોવી જરૂરી છે.'
          : 'At least one ingredient material is required.'
      );
      return;
    }
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  // Calculations:
  // Each material total = gmPerStudent * studentsCount
  const calculatedMaterials: MealMaterialItem[] = materials.map((m) => {
    const totalGm = m.gmPerStudent * studentsCount;
    const totalKg = Number((totalGm / 1000).toFixed(3));
    return {
      id: m.id,
      nameEn: m.nameEn,
      nameGu: m.nameGu,
      gmPerStudent: m.gmPerStudent,
      totalGm,
      totalKg
    };
  });

  const totalGmPerStudent = materials.reduce((sum, m) => sum + (m.gmPerStudent || 0), 0);
  const totalMealGm = calculatedMaterials.reduce((sum, m) => sum + m.totalGm, 0);
  const totalMealKg = Number((totalMealGm / 1000).toFixed(3));

  // Auto-generate materials note
  const handleAutoFillNote = () => {
    const parts = calculatedMaterials.map(
      (m) =>
        `${m.totalGm} gm ${lang === 'gu' ? m.nameGu : m.nameEn} (${m.gmPerStudent}g/બાળક)`
    );
    const currentRecipe = RECIPE_PRESETS.find((r) => r.id === selectedRecipeId);
    const recipeName = currentRecipe
      ? lang === 'gu'
        ? currentRecipe.labelGu
        : currentRecipe.labelEn
      : 'Daily Meal';

    const noteText =
      lang === 'gu'
        ? `આજે ${recipeName} માટે ${calculatedMaterials.length} સામગ્રી વપરાઈ: ${parts.join(
            ', '
          )}. કુલ ${studentsCount} હાજર બાળકોને ગરમ તાજું ભોજન પૂરું પાડવામાં આવ્યું. ગુણવત્તા સ્ટાન્ડર્ડ ચકાસાયેલ છે.`
        : `Cooked ${recipeName} using ${calculatedMaterials.length} materials: ${parts.join(
            ', '
          )}. Served to ${studentsCount} present children. Nutritional standards and hot-cooked meal quality verified by AWW.`;

    setWorkerNote(noteText);
  };

  // Append quick remark chip
  const handleAppendRemark = (text: string) => {
    setWorkerNote((prev) => (prev ? `${prev} ${text}` : text));
  };

  // Submit Handler
  const handleConfirm = async () => {
    if (totalMealGm <= 0) {
      alert(lang === 'gu' ? 'કૃપા કરીને સામગ્રીનો જથ્થો દાખલ કરો.' : 'Please enter valid ingredient grams.');
      return;
    }

    setSubmitting(true);
    const currentRecipe = RECIPE_PRESETS.find((r) => r.id === selectedRecipeId);
    const menuLabel = currentRecipe
      ? lang === 'gu'
        ? currentRecipe.labelGu
        : currentRecipe.labelEn
      : 'Custom Nutritious Meal';

    try {
      await onConfirmDeduction({
        mealType,
        menuName: menuLabel,
        studentsCount,
        ratioGm: totalGmPerStudent,
        adjustmentGm: 0,
        totalGm: totalMealGm,
        totalKg: totalMealKg,
        materialsUsed: calculatedMaterials,
        workerNote: workerNote.trim()
      });

      setDeductedSummary({
        mealType,
        menuName: menuLabel,
        studentsCount,
        totalGm: totalMealGm,
        totalKg: totalMealKg,
        materialsUsed: calculatedMaterials,
        workerNote: workerNote.trim()
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-1 pb-12 space-y-4">
      {/* Top Navigation & Brand Header */}
      <div className="relative flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs cursor-pointer"
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
          {lang === 'gu'
            ? 'ગ્રામ કેલ્ક્યુલેટર • બહુ-સામગ્રી કપાત • સુપરવાઈઝર નોંધણી'
            : 'Interactive Gram Calculator • Multi-Material Ration Entry • Superior Note'}
        </p>
      </div>

      {/* Success View: Process Completed with Return to Home Page */}
      {success && deductedSummary ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'gu'
                ? 'દૈનિક ભોજન રેશન અને નોંધ સફળતાપૂર્વક સાચવાઈ!'
                : 'Meal Usage & Superior Note Logged Successfully!'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'gu'
                ? `૦૪ વડતાલ કેન્દ્ર ખાતે ${deductedSummary.studentsCount} બાળકો માટે ${deductedSummary.materialsUsed.length} સામગ્રીનો વપરાશ નોંધાયો.`
                : `Recorded ${deductedSummary.materialsUsed.length} materials for ${deductedSummary.studentsCount} children at 04 Vadtal Centre.`}
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-emerald-700" />
                {lang === 'gu' ? 'ભોજન અને મેનૂ:' : 'Meal & Menu:'}
              </span>
              <span className="font-bold text-slate-900 text-right">
                {deductedSummary.menuName}
                <span className="text-[10px] text-slate-500 font-normal block">
                  {deductedSummary.mealType === 'breakfast'
                    ? lang === 'gu' ? 'સવારનો નાસ્તો' : 'Breakfast'
                    : lang === 'gu' ? 'બપોરનું ભોજન' : 'Lunch'}
                </span>
              </span>
            </div>

            {/* Itemized Materials Table */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                {lang === 'gu' ? 'કપાત થયેલ સામગ્રી (ગ્રામ × બાળકો):' : 'Calculated Materials Used:'}
              </span>
              <div className="space-y-1">
                {deductedSummary.materialsUsed.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                  >
                    <span className="font-bold text-slate-800">
                      {lang === 'gu' ? m.nameGu : m.nameEn}
                    </span>
                    <span className="font-black text-emerald-800 tabular-nums">
                      {m.gmPerStudent}g × {deductedSummary.studentsCount} = {m.totalGm} gm ({m.totalKg} kg)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Grand Quantity */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-700">
                {lang === 'gu' ? 'કુલ રેશન જથ્થો:' : 'Total Ration Quantity:'}
              </span>
              <span className="font-black text-emerald-800 text-sm tabular-nums">
                {deductedSummary.totalGm} gm ({deductedSummary.totalKg} kg)
              </span>
            </div>

            {/* Worker Note Highlighted for Superior */}
            {deductedSummary.workerNote && (
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  {lang === 'gu' ? 'સુપરવાઈઝર શારદાબેન શાહના ડેશબોર્ડ પર મોકલેલ નોંધ:' : 'Note Sent to Superior Shardaben Shah:'}
                </span>
                <p className="text-[11px] text-slate-700 bg-amber-50/80 p-2 rounded-lg border border-amber-200/70 italic leading-relaxed">
                  "{deductedSummary.workerNote}"
                </p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {lang === 'gu'
              ? 'ભંડારમાંથી રેશન કપાત થઈ ગઈ છે અને સુપરવાઈઝર શારદાબેન શાહના મોનિટરિંગ પોર્ટલ સાથે સિંક થઈ ગઈ છે.'
              : 'Pantry inventory updated and synchronized with Sector Supervisor Shardaben Shah\'s monitoring dashboard.'}
          </p>

          {/* Return to Home Page Button */}
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{lang === 'gu' ? 'મુખ્ય પેજ પર પાછા જાઓ' : 'Return to Home Page'}</span>
          </button>
        </div>
      ) : (
        /* Main Entry Card */
        <div className="bg-white rounded-[26px] p-4 border border-slate-200/80 shadow-xs space-y-4">
          {/* 1. Meal Type Pill (Breakfast vs Lunch) */}
          <div className="bg-[#EAF7EE] rounded-2xl p-3 flex items-center justify-between border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-700/10 text-emerald-800 flex items-center justify-center">
                <Utensils className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {mealType === 'breakfast' ? t.meal1Breakfast : t.meal2Lunch}
              </span>
            </div>

            <div className="flex items-center bg-white p-0.5 rounded-xl border border-emerald-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setMealType('breakfast')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  mealType === 'breakfast'
                    ? 'bg-[#15803D] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'gu' ? 'નાસ્તો' : 'Breakfast'}
              </button>
              <button
                type="button"
                onClick={() => setMealType('lunch')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  mealType === 'lunch'
                    ? 'bg-[#15803D] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'gu' ? 'બપોર' : 'Lunch'}
              </button>
            </div>
          </div>

          {/* 2. Students Count Multiplier */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-800 block">
                {t.studentsPresent}
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {lang === 'gu' ? 'ગણતરી માટે ગુણક સંખ્યા' : 'Multiplier for gram calculation'}
              </span>
            </div>

            <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setStudentsCount((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                aria-label="Decrease students"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="w-12 text-center font-black text-slate-900 text-base tabular-nums">
                {studentsCount}
              </span>
              <button
                type="button"
                onClick={() => setStudentsCount((prev) => prev + 1)}
                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                aria-label="Increase students"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 3. Recipe / Dish Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 block">
                {t.menuSelect}
              </label>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {materials.length} {lang === 'gu' ? 'સામગ્રી જોડાયેલ' : 'Materials Used'}
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedRecipeId}
                onChange={(e) => handleSelectRecipe(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-2xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 shadow-2xs cursor-pointer"
              >
                {RECIPE_PRESETS.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {lang === 'gu' ? recipe.labelGu : recipe.labelEn}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* 4. ITEM-BY-ITEM EDITABLE GRAM CALCULATOR */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  {lang === 'gu' ? 'સામગ્રી મુજબ ગ્રામ હિસાબ અને કેલ્ક્યુલેટર:' : 'Material Usage Gram Calculator:'}
                </h3>
                <p className="text-[10.5px] text-slate-500 font-medium">
                  {lang === 'gu'
                    ? 'દરેક સામગ્રી માટે ગ્રામ ટાઈપ કરો, કેલ્ક્યુલેટર બાળકો સાથે ગુણાકાર કરી કુલ હિસાબ કરશે.'
                    : 'Edit grams for each material; live calculator multiplies by students present.'}
                </p>
              </div>

              {/* Add Material Button */}
              <button
                type="button"
                onClick={() => setShowAddMaterialDropdown(!showAddMaterialDropdown)}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{lang === 'gu' ? '+ સામગ્રી ઉમેરો' : '+ Add Item'}</span>
              </button>
            </div>

            {/* Quick dropdown to add an extra material */}
            {showAddMaterialDropdown && (
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl space-y-1.5 animate-in fade-in zoom-in-95">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'gu' ? 'વાનગીમાં ઉમેરવા માટે સામગ્રી પસંદ કરો:' : 'Select material to add into recipe:'}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {AVAILABLE_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => handleAddMaterial(mat.id)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl text-[11px] font-semibold text-slate-800 text-left transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{lang === 'gu' ? mat.nameGu : mat.nameEn}</span>
                      <span className="text-[10px] text-emerald-700 font-bold ml-1">+{mat.defaultGm}g</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* List of Materials with Editable Gram Inputs and Live Multiplications */}
            <div className="space-y-2">
              {materials.map((mat) => {
                const itemTotalGm = (mat.gmPerStudent || 0) * studentsCount;
                const itemTotalKg = (itemTotalGm / 1000).toFixed(3);

                return (
                  <div
                    key={mat.id}
                    className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200/90 space-y-2 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    {/* Material Name & Remove Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                          <Package className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {lang === 'gu' ? mat.nameGu : mat.nameEn}
                        </span>
                      </div>

                      {materials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(mat.id)}
                          className="w-6 h-6 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Particular Gram Input & Calculator Steppers */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      {/* Left: Input for Particular Grams per Student */}
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="250"
                            step="1"
                            value={mat.gmPerStudent === 0 ? '' : mat.gmPerStudent}
                            placeholder="0"
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                              handleGmChange(mat.id, isNaN(val) ? 0 : val);
                            }}
                            className="w-16 h-9 bg-white border border-slate-300 text-slate-900 font-black text-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                          />
                          <span className="text-[11px] font-bold text-slate-500 ml-1.5 shrink-0">
                            {lang === 'gu' ? 'ગ્રામ/બાળક' : 'gm/child'}
                          </span>
                        </div>

                        {/* Quick adjustments (-5, +5) */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStepGm(mat.id, -5)}
                            className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                            title="Decrease 5 gm"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepGm(mat.id, 5)}
                            className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded-lg border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                            title="Increase 5 gm"
                          >
                            +5
                          </button>
                        </div>
                      </div>

                      {/* Right: Live Multiplied Result */}
                      <div className="text-right pl-2 border-l border-slate-200">
                        <span className="text-[10px] text-slate-500 block leading-tight font-medium">
                          {mat.gmPerStudent}g × {studentsCount} =
                        </span>
                        <span className="font-black text-emerald-800 text-xs sm:text-sm tabular-nums">
                          {itemTotalGm} gm{' '}
                          <span className="text-[10px] text-slate-500 font-bold">
                            ({itemTotalKg} kg)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Grand Calculator Card */}
            <div className="bg-[#EAF7EE] p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow-2xs shrink-0">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-900 block leading-tight">
                    {lang === 'gu' ? 'કુલ રેશન હિસાબ (સરવાળો):' : 'Grand Total Calculated:'}
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {totalGmPerStudent} gm/child × {studentsCount} students
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg sm:text-xl font-black text-emerald-950 tabular-nums leading-none block">
                  {totalMealGm} gm
                </span>
                <span className="text-[11px] font-bold text-emerald-800">
                  {totalMealKg} kg {lang === 'gu' ? 'કુલ જથ્થો' : 'Total'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. WORKER'S NOTE SECTION FOR SUPERIOR */}
          <div className="bg-[#FFFBEB] p-4 rounded-2xl border border-amber-200/90 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-700 shrink-0" />
                  <h3 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    {lang === 'gu'
                      ? 'કાર્યકરની નોંધ / સુપરવાઈઝર રિમાર્ક:'
                      : 'Worker\'s Note for Superior / Supervisor:'}
                  </h3>
                </div>
                <p className="text-[10.5px] text-amber-800/90 mt-0.5 leading-tight font-medium">
                  {lang === 'gu'
                    ? 'આ નોંધ સીધી સુપરવાઈઝર શારદાબેન શાહના ડેશબોર્ડ પર પ્રદર્શિત થશે. વપરાયેલ ૨-૩ સામગ્રી કે વિગત લખો.'
                    : 'This note is saved and displayed on Superior Shardaben Shah\'s monitoring dashboard.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoFillNote}
                className="px-2 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold shadow-2xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                title="Auto-fill materials used into note"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{lang === 'gu' ? 'સામગ્રી ઓટો-લખો' : 'Auto-Fill Materials'}</span>
              </button>
            </div>

            {/* Note Textarea */}
            <div className="relative">
              <textarea
                rows={3}
                value={workerNote}
                onChange={(e) => setWorkerNote(e.target.value)}
                placeholder={
                  lang === 'gu'
                    ? 'દા.ત. આજે ખીચડી માટે ૩ સામગ્રી (ચોખા, દાળ, તેલ) વાપરી. પોષણ વાટિકામાંથી તાજા શાકભાજી ઉમેર્યા. તમામ બાળકોએ પૂરો આહાર લીધો...'
                    : 'Write anything here (e.g. materials used: Rice + Dal + Oil, extra vegetable additions, children meal feedback)...'
                }
                className="w-full bg-white border border-amber-200/90 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner resize-none leading-relaxed font-medium"
              />
            </div>

            {/* Quick Preset Remark Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-900 block">
                {lang === 'gu' ? 'ઝડપી નોંધ પસંદ કરો:' : 'Quick Remark Presets:'}
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  lang === 'gu' ? '🌾 ૨-૩ સામગ્રી એકત્રિત કરી રાંધી' : '🌾 2-3 Materials Cooked Together',
                  lang === 'gu' ? '🥬 પોષણ વાટિકાના તાજા શાકભાજી ઉમેર્યા' : '🥬 Fresh Poshan Vatika Greens Added',
                  lang === 'gu' ? '⭐ ગુણવત્તા અને સ્વાદ ઉત્તમ રહ્યા' : '⭐ Standard Quality & Taste Verified',
                  lang === 'gu' ? '👶 નબળા બાળકોને બીજો ભાગ પીરસાયો' : '👶 Extra Portion Served to SAM/MAM'
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleAppendRemark(chip)}
                    className="px-2 py-0.5 bg-white/90 hover:bg-amber-100 text-amber-900 border border-amber-200/70 rounded-full text-[10px] font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Superior Sync Badge */}
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {lang === 'gu'
                  ? 'સુપરવાઈઝર ઓડિટ પોર્ટલ (Shardaben Shah) સાથે સિંક થશે'
                  : 'Will be synchronized to Superior Shardaben Shah\'s Dashboard'}
              </span>
            </div>
          </div>

          {/* Full-Width Dark Green Button: ✓ Confirm Deduction */}
          <button
            onClick={handleConfirm}
            disabled={submitting || totalMealGm <= 0}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span>
              {submitting
                ? t.syncing
                : lang === 'gu'
                ? `રેશન કપાત અને નોંધ સબમિટ કરો (${totalMealGm} gm)`
                : `Confirm Ration Deduction & Submit Note (${totalMealGm} gm)`}
            </span>
          </button>
        </div>
      )}

      {/* Bottom Summary Card */}
      {!success && (
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
              <span>{lang === 'gu' ? 'સામગ્રીની સંખ્યા:' : 'Materials Used:'}</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {materials.length} {lang === 'gu' ? 'વસ્તુઓ' : 'Items'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-emerald-200/50">
              <span>{t.plannedQuantity}</span>
              <span className="font-black text-emerald-900 tabular-nums">
                {totalMealGm} gm ({totalMealKg} kg)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

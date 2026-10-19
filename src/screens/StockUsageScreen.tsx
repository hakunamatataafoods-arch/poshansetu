import React, { useState } from 'react';
import { ArrowLeft, Package, Camera, CheckCircle2, ChevronDown, Plus, Minus, Home } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';

interface StockUsageScreenProps {
  onBack: () => void;
  lang: Language;
  currentTotalStock: number;
  onConfirmDistribution: (record: {
    beneficiaryName: string;
    beneficiaryCategory: string;
    photoAttached: boolean;
    distributedItems: Record<string, number>;
  }) => Promise<void>;
}

export const StockUsageScreen: React.FC<StockUsageScreenProps> = ({
  onBack,
  lang,
  currentTotalStock,
  onConfirmDistribution
}) => {
  const t = translations[lang];

  const beneficiaries = [
    { name: 'Surbhi Rawat', category: 'Lactating Mother (LM)' },
    { name: 'Shreeya Dube', category: 'Pregnant Woman (PW)' },
    { name: 'Priti Arora', category: 'Lactating Mother (LM)' },
    { name: 'Aarav Patel', category: 'Child (6m-3 yrs)' },
    { name: 'Kiranben Solanki', category: 'Pregnant Woman (PW)' }
  ];

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<boolean>(false);

  // Stepper values for the 6 items shown in poshan_setu_stock_usage_entry_2.jpg
  const [quantities, setQuantities] = useState<Record<string, number>>({
    Rice: 1,
    Oil: 1,
    'Bal Shakti': 1,
    'Matru Shakti': 1,
    'Purna Shakti': 1,
    Atta: 1
  });

  const itemsConfig = [
    { key: 'Rice', label: t.rice, unit: t.kg },
    { key: 'Oil', label: t.oil, unit: t.litre },
    { key: 'Bal Shakti', label: t.balShakti, unit: t.pack },
    { key: 'Matru Shakti', label: t.matruShakti, unit: t.pack },
    { key: 'Purna Shakti', label: t.purnaShakti, unit: t.pack },
    { key: 'Atta', label: t.atta, unit: t.kg }
  ];

  const handleQtyChange = (key: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const totalDeductedUnits = Object.values(quantities).reduce((a, b) => a + b, 0);
  const remainingStock = Math.max(0, currentTotalStock - totalDeductedUnits);

  const handleConfirm = async () => {
    if (!selectedBeneficiary) {
      alert(lang === 'en' ? 'Please select a beneficiary first.' : 'કૃપા કરીને પહેલા લાભાર્થી પસંદ કરો.');
      return;
    }

    setSubmitting(true);
    const beneObj = beneficiaries.find((b) => b.name === selectedBeneficiary);
    try {
      await onConfirmDistribution({
        beneficiaryName: selectedBeneficiary,
        beneficiaryCategory: beneObj ? beneObj.category : 'General',
        photoAttached: photoUploaded,
        distributedItems: quantities
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
      {/* Top Header & Brand Bar (Matching poshan_setu_stock_usage_entry_2.jpg) */}
      <div className="relative flex flex-col items-center">
        {/* Back Button */}
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
          {t.stockUsageTitle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {t.distributionSubtext}
        </p>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold text-emerald-900">
            {t.distributionSuccess}
          </p>
        </div>
      )}

      {/* Main Card (Matching poshan_setu_stock_usage_entry_2.jpg) */}
      <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Header: Item Distributed Entry */}
        <div className="flex items-center gap-2.5 pb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Package className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {t.itemDistributedEntry}
          </h2>
        </div>

        {/* Beneficiary Name Row */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-semibold text-slate-800 shrink-0">
            {t.beneficiaryName}
          </label>
          <div className="relative flex-1 max-w-[210px]">
            <select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 font-semibold text-xs rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8 shadow-2xs"
            >
              <option value="">{t.selectBeneficiary}</option>
              {beneficiaries.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.category.split(' ')[0]})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        {/* Beneficiary Photo Row */}
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-semibold text-slate-800 shrink-0">
            {t.beneficiaryPhoto}
          </label>
          <button
            onClick={() => setPhotoUploaded(!photoUploaded)}
            className={`flex-1 max-w-[210px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              photoUploaded
                ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                : 'bg-[#EAF7EE] text-emerald-800 border-emerald-200/80 hover:bg-[#dcf4e2]'
            }`}
          >
            {photoUploaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.photoUploaded}</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>{t.uploadBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Items Distributed List Subheader */}
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            {t.itemsDistributedList}
          </h3>
        </div>

        {/* The 6 Items with Steppers */}
        <div className="space-y-2.5">
          {itemsConfig.map((item) => {
            const qty = quantities[item.key] || 0;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {item.label}
                </span>

                {/* Stepper with light mint buttons */}
                <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 border border-slate-200">
                  <button
                    onClick={() => handleQtyChange(item.key, -1)}
                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-colors"
                    aria-label={`Decrease ${item.label}`}
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <span className="w-16 text-center font-bold text-slate-900 text-xs tabular-nums">
                    {qty} {item.unit}
                  </span>
                  <button
                    onClick={() => handleQtyChange(item.key, 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-colors"
                    aria-label={`Increase ${item.label}`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm & Record Button (Full-width dark green) */}
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <span>{submitting ? t.syncing : t.confirmAndRecord}</span>
        </button>
      </div>

      {/* Bottom Summary Card (Matching poshan_setu_stock_usage_entry_2.jpg) */}
      <div className="bg-[#EAF7EE] rounded-2xl p-4 border border-emerald-100/90 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-2xs shrink-0">
            <Home className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-xs font-bold text-slate-800 max-w-[170px] leading-snug">
            {t.remainingBalanceAfterDist}
          </span>
        </div>

        <div className="text-right pl-3 border-l border-emerald-200/60">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t.currentStock}
          </span>
          <span className="text-2xl font-black text-[#15803D] tabular-nums leading-none">
            {remainingStock}
          </span>
        </div>
      </div>
    </div>
  );
};

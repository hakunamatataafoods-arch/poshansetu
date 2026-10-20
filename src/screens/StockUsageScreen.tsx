import React, { useState } from 'react';
import { ArrowLeft, Package, Camera, CheckCircle2, ChevronDown, Plus, Minus, Home, ShieldCheck, UserCheck } from 'lucide-react';
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
  const [success, setSuccess] = useState<boolean>(false);
  const [lastDistributedSummary, setLastDistributedSummary] = useState<{
    beneficiary: string;
    category: string;
    photoAttached: boolean;
    items: Record<string, number>;
    remaining: number;
  } | null>(null);

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

  const formatRemainingBalance = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(3);
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
    const category = beneObj ? beneObj.category : 'General';
    const distributedSnapshot = { ...quantities };

    try {
      await onConfirmDistribution({
        beneficiaryName: selectedBeneficiary,
        beneficiaryCategory: category,
        photoAttached: photoUploaded,
        distributedItems: distributedSnapshot
      });

      setLastDistributedSummary({
        beneficiary: selectedBeneficiary,
        category,
        photoAttached: photoUploaded,
        items: distributedSnapshot,
        remaining: remainingStock
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Top Header & Brand Bar */}
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
          {t.stockUsageTitle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {t.distributionSubtext}
        </p>
      </div>

      {/* Distribution Success Card with Return to Home Page (Matching Stock Received design) */}
      {success && lastDistributedSummary ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Item Distributed Successfully!' : 'સામગ્રી સફળતાપૂર્વક વિતરણ થઈ ગઈ છે!'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'en'
                ? `Take-Home Ration (THR) distributed to ${lastDistributedSummary.beneficiary}`
                : `લાભાર્થી ${lastDistributedSummary.beneficiary} ને આહાર વિતરણ સફળતાપૂર્વક નોંધાઈ ગયું છે.`}
            </p>
          </div>

          {/* Detailed Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? 'Beneficiary:' : 'લાભાર્થી:'}
              </span>
              <span className="font-bold text-slate-900">
                {lastDistributedSummary.beneficiary}
                <span className="text-[10px] text-slate-500 font-normal block text-right">
                  {lastDistributedSummary.category}
                </span>
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-semibold block">
                {lang === 'en' ? 'Items Distributed:' : 'વિતરિત સામગ્રી:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(lastDistributedSummary.items)
                  .filter(([_, qty]) => qty > 0)
                  .map(([name, qty]) => {
                    const itemConf = itemsConfig.find((c) => c.key === name);
                    const unit = itemConf ? itemConf.unit : '';
                    const label = itemConf ? itemConf.label : name;
                    return (
                      <span
                        key={name}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold"
                      >
                        {label}: {qty} {unit}
                      </span>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? 'Photo Verification:' : 'ફોટો ચકાસણી:'}
              </span>
              <span className="font-bold text-emerald-700">
                {lastDistributedSummary.photoAttached
                  ? lang === 'en' ? '✓ Verified & Attached' : '✓ ચકાસાયેલ અને જોડાયેલ'
                  : lang === 'en' ? 'Not Attached' : 'જોડેલ નથી'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-slate-500 font-semibold">
                {lang === 'en' ? 'Remaining Centre Stock:' : 'કેન્દ્રમાં બાકી સ્ટોક:'}
              </span>
              <span className="font-black text-emerald-800 text-sm">
                {formatRemainingBalance(lastDistributedSummary.remaining)} Units
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {lang === 'en'
              ? 'The distribution has been updated in the POSHAN 2.0 register and logged for Supervisor audit.'
              : 'આ વિતરણ પોષણ ૨.૦ રજિસ્ટરમાં નોંધાઈ ગયું છે અને સુપરવાઈઝર ઓડિટ માટે સિંક થયેલ છે.'}
          </p>

          {/* Return to Home Page Button */}
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
          </button>
        </div>
      ) : (
        /* Main Entry Card */
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
              className={`flex-1 max-w-[210px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
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
                      className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                      aria-label={`Decrease ${item.label}`}
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-16 text-center font-bold text-slate-900 text-xs tabular-nums">
                      {qty} {item.unit}
                    </span>
                    <button
                      onClick={() => handleQtyChange(item.key, 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                      aria-label={`Increase ${item.label}`}
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm & Record Button */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span>{submitting ? t.syncing : t.confirmAndRecord}</span>
          </button>
        </div>
      )}

      {/* Bottom Summary Card */}
      {!success && (
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
              {formatRemainingBalance(remainingStock)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

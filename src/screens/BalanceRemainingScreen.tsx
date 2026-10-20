import React, { useState } from 'react';
import { ArrowLeft, Package, AlertCircle, Calendar, ShieldCheck, Download, RefreshCw, Home } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { InventoryItem, Language } from '../types';
import { translations } from '../data/translations';

interface BalanceRemainingScreenProps {
  onBack: () => void;
  lang: Language;
  inventory: InventoryItem[];
  onRefresh: () => void;
}

export const formatRemainingBalance = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(3);
};

export const BalanceRemainingScreen: React.FC<BalanceRemainingScreenProps> = ({
  onBack,
  lang,
  inventory,
  onRefresh
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'packet' | 'staple'>('all');

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const totalPackets = inventory
    .filter((i) => i.category === 'packet')
    .reduce((sum, i) => sum + i.currentStock, 0);

  const rawStaplesKg = inventory
    .filter((i) => i.category === 'staple')
    .reduce((sum, i) => sum + i.currentStock, 0);
  const totalStaplesKg = formatRemainingBalance(rawStaplesKg);

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
          {t.balanceRemainingSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en' ? 'Live Pantry Inventory & Expiry Register' : 'લાઇવ અનાજ ભંડાર અને સમાપ્તિ તારીખ નોંધ'}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#EAF7EE] p-3.5 rounded-2xl border border-emerald-200/70">
          <span className="text-[11px] font-semibold text-emerald-800 block">
            {lang === 'en' ? 'Direct Packets (THR)' : 'પોષણ પેકેટ્સ (THR)'}
          </span>
          <span className="text-2xl font-black text-emerald-950 tabular-nums">
            {totalPackets} <span className="text-xs font-semibold text-emerald-700">Packs</span>
          </span>
          <p className="text-[10px] text-emerald-600 mt-0.5">Bal, Matru & Purna Shakti</p>
        </div>

        <div className="bg-[#FFF7ED] p-3.5 rounded-2xl border border-orange-200/70">
          <span className="text-[11px] font-semibold text-orange-800 block">
            {lang === 'en' ? 'Raw Staples Weight' : 'કાચું અનાજ અને કઠોળ'}
          </span>
          <span className="text-2xl font-black text-orange-950 tabular-nums">
            {totalStaplesKg} <span className="text-xs font-semibold text-orange-700">kg/L</span>
          </span>
          <p className="text-[10px] text-orange-600 mt-0.5">Rice, Atta, Dal & Oil</p>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'All Items (7)' : 'બધી વસ્તુઓ'}
        </button>
        <button
          onClick={() => setFilter('packet')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'packet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'Packets (3)' : 'પેકેટ્સ'}
        </button>
        <button
          onClick={() => setFilter('staple')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'staple' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'Staples (4)' : 'અનાજ/તેલ'}
        </button>
      </div>

      {/* Item-wise inventory cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const percentage = Math.round((item.currentStock / item.initialStock) * 100);
          const isLow = item.currentStock <= item.minThreshold;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === 'en' ? item.nameEn : item.nameGu}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                    <span>Batch: {item.batchNo}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      Exp: {item.expiryDate}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 tabular-nums">
                    {formatRemainingBalance(item.currentStock)}{' '}
                    <span className="text-xs font-semibold text-slate-600">{item.unit}</span>
                  </span>
                  {isLow && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md mt-0.5">
                      <AlertCircle className="w-3 h-3" /> Reorder Soon
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Level Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isLow ? 'bg-amber-500' : 'bg-[#15803D]'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600">
                  <span>Capacity: {item.initialStock} {item.unit}</span>
                  <span className="font-semibold">{percentage}% remaining</span>
                </div>
              </div>
            </div>
          );
        })}
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

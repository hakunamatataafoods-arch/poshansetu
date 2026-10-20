import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  PackagePlus,
  X,
  RotateCcw
} from 'lucide-react';
import { InventoryItem, Language } from '../types';

interface LowStockAlertWidgetProps {
  inventory: InventoryItem[];
  lang: Language;
  onNavigate: (screen: string) => void;
  onUpdateInventory?: (newInventory: InventoryItem[]) => void;
}

const formatQuantity = (num: number): string => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(3);
};

export const LowStockAlertWidget: React.FC<LowStockAlertWidgetProps> = ({
  inventory,
  lang,
  onNavigate,
  onUpdateInventory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter items that fall below minThreshold
  const lowStockItems = inventory.filter((item) => item.currentStock < item.minThreshold);
  const hasLowStock = lowStockItems.length > 0;

  // If no items are below threshold, do not occupy dashboard space
  if (!hasLowStock) {
    return null;
  }

  const primaryItem = lowStockItems[0];
  const primaryName = lang === 'en' ? primaryItem.nameEn : primaryItem.nameGu;
  const otherCount = lowStockItems.length - 1;

  return (
    <>
      {/* 1-Line High-Priority Alert Banner on Dashboard */}
      <div
        role="alert"
        aria-live="assertive"
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-red-50 hover:bg-red-100/80 border border-red-300 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between gap-2 shadow-2xs transition-colors cursor-pointer group"
        title={lang === 'en' ? 'Click to view stock alert details' : 'સ્ટોક ચેતવણી વિગત જોવા ક્લિક કરો'}
      >
        {/* Left Section: Dot + High-Priority Badge + Item & Remaining in ONE LINE */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {/* Pulsing Beacon Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>

          {/* High Priority Pill Badge */}
          <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 shadow-2xs">
            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
            <span>{lang === 'en' ? 'ALERT' : 'ચેતવણી'}</span>
          </span>

          {/* Single-Line Summary: Item Name & Remaining Quantity */}
          <div className="flex items-center gap-1.5 text-xs text-slate-800 truncate min-w-0">
            <span className="font-bold text-slate-900 truncate">
              {primaryName}:
            </span>
            <span className="text-red-700 font-extrabold whitespace-nowrap">
              {formatQuantity(primaryItem.currentStock)} {primaryItem.unit} {lang === 'en' ? 'left' : 'બાકી'}
            </span>
            <span className="text-slate-500 font-medium text-[11px] whitespace-nowrap hidden xs:inline">
              ({lang === 'en' ? 'Min' : 'મર્યાદા'}: {formatQuantity(primaryItem.minThreshold)})
            </span>
            {otherCount > 0 && (
              <span className="bg-red-200/90 text-red-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                +{otherCount} {lang === 'en' ? 'more' : 'વધુ'}
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Compact Inward Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate('stock-received');
          }}
          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
          title={lang === 'en' ? 'Inward stock' : 'સ્ટોક આવક'}
        >
          <span>{lang === 'en' ? 'Inward' : 'આવક'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Small, Compact Modal (Displayed when clicked - not big!) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4 animate-in fade-in duration-150"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-[340px] bg-white rounded-2xl shadow-xl border border-red-200 p-4 space-y-3 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {lang === 'en' ? 'High-Priority Alert' : 'ઉચ્ચ અગ્રતા ચેતવણી'}
                  </h4>
                  <p className="text-[10.5px] font-medium text-red-600 leading-none mt-0.5">
                    {lang === 'en' ? 'Stock Below Minimum Limit' : 'લઘુત્તમ મર્યાદા કરતાં ઓછો સ્ટોક'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compact List of Low Stock Items */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
              {lowStockItems.map((item) => {
                const deficit = item.minThreshold - item.currentStock;
                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900">
                        {lang === 'en' ? item.nameEn : item.nameGu}
                      </span>
                      <span className="text-[11px] font-black text-red-700 whitespace-nowrap">
                        {formatQuantity(item.currentStock)} {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium">
                      <span>
                        {lang === 'en' ? 'Min threshold' : 'લઘુત્તમ મર્યાદા'}: {formatQuantity(item.minThreshold)} {item.unit}
                      </span>
                      <span className="text-red-700 font-bold">
                        {lang === 'en' ? `Deficit: -${formatQuantity(deficit)}` : `ખાધ: -${formatQuantity(deficit)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onNavigate('stock-received');
                }}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Inward Stock Now' : 'સ્ટોક આવક નોંધો'}</span>
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onNavigate('balance-remaining');
                }}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Pantry' : 'ભંડાર'}
              </button>
            </div>

            {/* Subtle Reset Simulator for Testing if onUpdateInventory is provided */}
            {onUpdateInventory && (
              <div className="pt-1 text-center">
                <button
                  onClick={() => {
                    const restored = inventory.map((i) =>
                      i.currentStock < i.minThreshold
                        ? { ...i, currentStock: i.minThreshold + 4 }
                        : i
                    );
                    onUpdateInventory(restored);
                    setIsModalOpen(false);
                  }}
                  className="text-[10px] text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'en' ? 'Test: Reset stock above minimum' : 'ટેસ્ટ: સ્ટોક સામાન્ય કરો'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

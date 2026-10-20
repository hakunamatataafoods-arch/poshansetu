import React, { useState } from 'react';
import {
  ArrowLeft,
  Package,
  AlertCircle,
  Calendar,
  ShieldCheck,
  Download,
  RefreshCw,
  Home,
  ReceiptText,
  ChevronDown,
  ChevronUp,
  Utensils,
  PlusCircle,
  UserCheck,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { InventoryItem, Language } from '../types';
import { translations } from '../data/translations';
import { INITIAL_RECENT_TRANSACTIONS, RecentTransactionItem } from '../data/transactions';

interface BalanceRemainingScreenProps {
  onBack: () => void;
  lang: Language;
  inventory: InventoryItem[];
  onRefresh: () => void;
  transactions?: RecentTransactionItem[];
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
  onRefresh,
  transactions = INITIAL_RECENT_TRANSACTIONS
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'packet' | 'staple'>('all');
  const [showRecentTransactions, setShowRecentTransactions] = useState<boolean>(true);
  const [txnFilter, setTxnFilter] = useState<'all' | 'meal_deduction' | 'stock_inward' | 'thr_distribution' | 'inter_awc_transfer'>('all');

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

  const filteredTransactions = transactions.filter((txn) => {
    if (txnFilter === 'all') return true;
    return txn.type === txnFilter;
  });

  return (
    <div className="px-4 pt-1 pb-12 space-y-4">
      {/* Header */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs cursor-pointer"
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
          {lang === 'en'
            ? 'Live Pantry Inventory & Recent Transactions Register'
            : 'લાઇવ અનાજ ભંડાર અને તાજેતરના સ્ટોક વ્યવહારોની નોંધ'}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-[#EAF7EE] p-3.5 rounded-2xl border border-emerald-200/70 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-800 block">
            {lang === 'en' ? 'Direct Packets (THR)' : 'પોષણ પેકેટ્સ (THR)'}
          </span>
          <span className="text-2xl font-black text-emerald-950 tabular-nums">
            {totalPackets} <span className="text-xs font-semibold text-emerald-700">Packs</span>
          </span>
          <p className="text-[10px] text-emerald-600 mt-0.5 font-medium">Bal, Matru & Purna Shakti</p>
        </div>

        <div className="bg-[#FFF7ED] p-3.5 rounded-2xl border border-orange-200/70 shadow-2xs">
          <span className="text-[11px] font-semibold text-orange-800 block">
            {lang === 'en' ? 'Raw Staples Weight' : 'કાચું અનાજ અને કઠોળ'}
          </span>
          <span className="text-2xl font-black text-orange-950 tabular-nums">
            {totalStaplesKg} <span className="text-xs font-semibold text-orange-700">kg/L</span>
          </span>
          <p className="text-[10px] text-orange-600 mt-0.5 font-medium">Rice, Atta, Dal & Oil</p>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'All Items' : 'તમામ સામગ્રી'}
        </button>
        <button
          onClick={() => setFilter('packet')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filter === 'packet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'Packets (THR)' : 'પેકેટ્સ (THR)'}
        </button>
        <button
          onClick={() => setFilter('staple')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            filter === 'staple' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          {lang === 'en' ? 'Raw Staples' : 'કાચું અનાજ'}
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

      {/* ==================================================================== */}
      {/* RECENT TRANSACTIONS DONE BUTTON & SECTION (AT DOWNSIDE AFTER ITEM LIST) */}
      {/* ==================================================================== */}
      <div className="pt-2 space-y-3">
        {/* The "Recent Transactions Done" Button */}
        <button
          type="button"
          onClick={() => setShowRecentTransactions(!showRecentTransactions)}
          className="w-full p-4 bg-gradient-to-r from-emerald-800 to-emerald-900 hover:from-emerald-900 hover:to-emerald-950 text-white rounded-2xl shadow-md flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] border border-emerald-700"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/15 text-emerald-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-white/20 transition-colors">
              <ReceiptText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  {lang === 'en' ? 'Recent Transactions Done' : 'તાજેતરમાં થયેલ સ્ટોક વ્યવહારો'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-400/40">
                  {transactions.length}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium leading-tight mt-0.5">
                {lang === 'en'
                  ? 'Track meal deductions, inward stock arrivals & THR distributions'
                  : 'રાંધણ વપરાશ કપાત, સ્ટોક આવક અને આહાર વિતરણની નોંધ'}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-emerald-100 shrink-0">
            {showRecentTransactions ? (
              <ChevronUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </div>
        </button>

        {/* Below that button: Recently Transactions Done List */}
        {showRecentTransactions && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Filter Pills for Recent Transactions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setTxnFilter('all')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  txnFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'en' ? 'All Transactions' : 'તમામ વ્યવહારો'} ({transactions.length})
              </button>

              <button
                type="button"
                onClick={() => setTxnFilter('meal_deduction')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  txnFilter === 'meal_deduction'
                    ? 'bg-amber-700 text-white shadow-2xs'
                    : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                <Utensils className="w-3 h-3" />
                <span>{lang === 'en' ? 'Meal Used (-)' : 'રાંધણ વપરાશ (-)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxnFilter('stock_inward')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  txnFilter === 'stock_inward'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <PlusCircle className="w-3 h-3" />
                <span>{lang === 'en' ? 'Inward Stock (+)' : 'સ્ટોક આવક (+)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxnFilter('thr_distribution')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  txnFilter === 'thr_distribution'
                    ? 'bg-purple-700 text-white shadow-2xs'
                    : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>{lang === 'en' ? 'THR Dist. (-)' : 'આહાર વિતરણ (-)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxnFilter('inter_awc_transfer')}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  txnFilter === 'inter_awc_transfer'
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
                }`}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>{lang === 'en' ? 'Transfers (⇄)' : 'આપ-લે (⇄)'}</span>
              </button>
            </div>

            {/* Transaction Items */}
            {filteredTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-500 text-xs font-semibold">
                {lang === 'en' ? 'No transactions found in this filter.' : 'આ ફિલ્ટરમાં કોઈ વ્યવહારો મળ્યા નથી.'}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((txn) => {
                  const isInward = txn.type === 'stock_inward';
                  const isMeal = txn.type === 'meal_deduction';
                  const isTHR = txn.type === 'thr_distribution';
                  const isTransfer = txn.type === 'inter_awc_transfer';

                  return (
                    <div
                      key={txn.id}
                      className={`bg-white rounded-2xl p-4 border shadow-xs transition-all space-y-3 ${
                        isInward
                          ? 'border-emerald-200/90'
                          : isMeal
                          ? 'border-amber-200/90'
                          : isTHR
                          ? 'border-purple-200/90'
                          : 'border-blue-200/90'
                      }`}
                    >
                      {/* Top Header: Badge, Date, Ref ID */}
                      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Transaction Type Tag */}
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              isInward
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isMeal
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isTHR
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {isInward && <PlusCircle className="w-3 h-3 text-emerald-700" />}
                            {isMeal && <Utensils className="w-3 h-3 text-amber-700" />}
                            {isTHR && <UserCheck className="w-3 h-3 text-purple-700" />}
                            {isTransfer && <ArrowLeftRight className="w-3 h-3 text-blue-700" />}
                            <span>
                              {isInward
                                ? lang === 'en' ? 'Stock Inward (+)' : 'સ્ટોક આવક (+)'
                                : isMeal
                                ? lang === 'en' ? 'Meal Used Deducted (-)' : 'રાંધણ વપરાશ કપાત (-)'
                                : isTHR
                                ? lang === 'en' ? 'THR Distributed (-)' : 'આહાર વિતરણ કપાત (-)'
                                : lang === 'en' ? 'Inter-AWC Transfer' : 'સેતુ શેર આપ-લે'}
                            </span>
                          </span>

                          <span className="text-[10px] font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                            {txn.referenceNo}
                          </span>
                        </div>

                        {/* Date and Time */}
                        <div className="text-right text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{txn.dateStr}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-700">{txn.timeStr}</span>
                        </div>
                      </div>

                      {/* Main Title and Context/Beneficiary/Supplier */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {lang === 'gu' ? txn.titleGu : txn.titleEn}
                        </h4>
                        {(txn.beneficiaryOrSupplierEn || txn.beneficiaryOrSupplierGu) && (
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {lang === 'gu'
                              ? txn.beneficiaryOrSupplierGu
                              : txn.beneficiaryOrSupplierEn}
                          </p>
                        )}
                      </div>

                      {/* ITEM BREAKDOWN: Exact quantities deducted / inward */}
                      <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          {isInward
                            ? lang === 'en' ? 'Items Inward Received:' : 'પ્રાપ્ત થયેલ સ્ટોક:'
                            : lang === 'en' ? 'Items Deducted from Pantry:' : 'ભંડારમાંથી કપાત થયેલ સામગ્રી:'}
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {txn.items.map((it, idx) => {
                            const isPositive = it.quantity > 0;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-slate-200/60 text-xs"
                              >
                                <span className="font-bold text-slate-800 truncate pr-2">
                                  {lang === 'gu' ? it.itemNameGu : it.itemNameEn}
                                </span>
                                <span
                                  className={`font-black tabular-nums whitespace-nowrap text-xs ${
                                    isPositive ? 'text-emerald-700' : 'text-amber-800'
                                  }`}
                                >
                                  {isPositive ? '+' : ''}
                                  {formatRemainingBalance(it.quantity)} {it.unit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Note and Verification Footer */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-[240px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">
                            {txn.authorizedBy}
                          </span>
                        </div>

                        <span className="font-black text-slate-900 text-xs shrink-0">
                          {isInward ? (
                            <span className="text-emerald-700">+{formatRemainingBalance(txn.totalQuantity)} {txn.unit}</span>
                          ) : (
                            <span className="text-amber-800">{formatRemainingBalance(txn.totalQuantity)} {txn.unit}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Return to Home Page Button */}
      <button
        onClick={onBack}
        className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer mt-2"
      >
        <Home className="w-4 h-4 stroke-[2.2]" />
        <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
      </button>
    </div>
  );
};

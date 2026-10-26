import React, { useState } from 'react';
import {
  Globe,
  Bell,
  MapPin,
  ChevronDown,
  LogOut,
  Mic,
  RefreshCw,
  WifiOff,
  ReceiptText,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import workerAvatar from '../assets/images/bhavnaben_patel_avatar_1792406640270.jpg';
import {
  StockReceivedIllustration,
  StockUsageIllustration,
  BalanceRemainingIllustration,
  SetuShareIllustration,
  DailyFoodMenuIllustration,
  StudentAttendanceIllustration,
  MealPhotoIllustration,
  SmartRationIllustration,
  DownloadReportIllustration,
  BillUploadIllustration,
  StudentActivitiesIllustration
} from '../components/GridCardIllustrations';
import { InventoryItem, Language } from '../types';
import { translations } from '../data/translations';
import { LowStockAlertWidget } from '../components/LowStockAlertWidget';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { RecentTransactionItem } from '../data/transactions';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onLogout?: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenProfile?: () => void;
  inventory?: InventoryItem[];
  onUpdateInventory?: (newInventory: InventoryItem[]) => void;
  claimsCount?: number;
  isSyncing?: boolean;
  pendingChangesCount?: number;
  syncNotice?: string | null;
  onSyncNow?: () => void;
  onAddTestPendingItem?: () => void;
  transactions?: RecentTransactionItem[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  lang,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  onOpenNotifications,
  unreadCount,
  onLogout,
  onOpenVoiceAssistant,
  onOpenProfile,
  inventory = [],
  onUpdateInventory,
  claimsCount = 3,
  isSyncing = false,
  pendingChangesCount = 0,
  syncNotice = null,
  onSyncNow,
  onAddTestPendingItem,
  transactions = []
}) => {
  const t = translations[lang];
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // Cards matching the layout and color scheme
  const gridCards = [
    {
      id: 'stock-received',
      title: t.stockReceived,
      illustration: StockReceivedIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'stock-received'
    },
    {
      id: 'stock-usage',
      title: t.stockUsage,
      illustration: StockUsageIllustration,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-100/70',
      screen: 'stock-usage'
    },
    {
      id: 'balance-remaining',
      title: t.balanceRemaining,
      illustration: BalanceRemainingIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'balance-remaining'
    },
    {
      id: 'setu-share',
      title: t.setuShareExchange,
      illustration: SetuShareIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'setu-share'
    },
    {
      id: 'food-menu',
      title: t.dailyFoodMenu,
      illustration: DailyFoodMenuIllustration,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-100/70',
      screen: 'food-menu'
    },
    {
      id: 'student-attendance',
      title: t.studentAttendance,
      illustration: StudentAttendanceIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'student-attendance'
    },
    {
      id: 'meal-photo',
      title: t.mealPhotoUpload,
      illustration: MealPhotoIllustration,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-100/70',
      screen: 'meal-photo'
    },
    {
      id: 'smart-ration',
      title: t.smartRation,
      illustration: SmartRationIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'smart-ration'
    },
    {
      id: 'download-report',
      title: t.downloadReport,
      illustration: DownloadReportIllustration,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-100/70',
      screen: 'download-report'
    },
    {
      id: 'bill-reimbursement',
      title: t.billReimbursement,
      illustration: BillUploadIllustration,
      bg: 'bg-[#EAF7EE]',
      border: 'border-emerald-100/70',
      screen: 'bill-reimbursement'
    },
    {
      id: 'student-activities',
      title: t.studentActivities,
      illustration: StudentActivitiesIllustration,
      bg: 'bg-[#FFF7ED]',
      border: 'border-orange-100/70',
      screen: 'student-activities'
    }
  ];

  return (
    <div className="px-4 pt-3 pb-6 space-y-3.5">
      {/* 1. Brand Bar & Controls (Matching poshan_setu_homepage_logo_first.png: Logo First!) */}
      <div className="flex items-center justify-between pt-0.5">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-2">
          <PoshanSetuLogo size="sm" />
        </div>

        {/* Right Action Controls: Language Selector Dropdown, Voice Assistant & Notification Bell */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'en' ? 'English' : 'ગુજરાતી'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer ${
                    lang === 'en' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  English {lang === 'en' && '✓'}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('gu');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer ${
                    lang === 'gu' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ગુજરાતી {lang === 'gu' && '✓'}
                </button>
              </div>
            )}
          </div>

          {/* Poshan Vani Voice Assistant Button */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/80 flex items-center justify-center text-emerald-700 transition-all relative shadow-2xs cursor-pointer group"
              title={lang === 'en' ? 'Poshan Vani Voice Assistant' : 'પોષણ વાણી અવાજ સહાયક'}
              aria-label="Poshan Vani Voice Assistant"
            >
              <Mic className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
              {/* Pulsing Voice Ready Indicator */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white animate-pulse" />
            </button>
          )}

          {/* Notification Bell with Orange Alert Dot for Supervision Inspection */}
          <button
            onClick={onOpenNotifications}
            className="w-9 h-9 rounded-full bg-white border border-slate-200/90 hover:border-red-300 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors relative shadow-2xs cursor-pointer group"
            title={lang === 'en' ? 'Supervision Alert: Inspection is Coming!' : 'સુપરવિઝન એલર્ટ: મુલાકાત આવી રહી છે!'}
            aria-label="Supervision Alert"
          >
            <Bell className="w-4 h-4 text-slate-800 fill-slate-800/80" />
            {/* Orange Alert Indicator Dot (matches screenshot) */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EA580C] ring-1.5 ring-white" />
          </button>

          {/* Quick Logout Button */}
          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm(lang === 'en' ? 'Log out of Poshan Setu?' : 'શું તમે લોગ આઉટ કરવા માંગો છો?')) {
                  onLogout();
                }
              }}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/90 hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title={lang === 'en' ? 'Log Out' : 'લોગ આઉટ'}
              aria-label="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Worker Profile Card (Clickable to open Anganwadi Worker Profile) */}
      <div
        onClick={onOpenProfile}
        className="bg-[#EAF7EE] hover:bg-[#e2f4e7] border border-emerald-200/80 hover:border-emerald-300 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99] group"
        title={lang === 'en' ? 'Click to view Anganwadi Worker profile' : 'આંગણવાડી કાર્યકર પ્રોફાઇલ જોવા ક્લિક કરો'}
      >
        {/* Worker Avatar & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden bg-white border-2 border-emerald-400 group-hover:border-emerald-600 shadow-xs shrink-0 flex items-center justify-center relative transition-colors">
            <img
              src={workerAvatar}
              alt={t.workerName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback avatar SVG in background */}
            <div className="absolute inset-0 bg-[#FCE7F3] flex items-center justify-center -z-10">
              <span className="text-xs font-bold text-pink-700">BP</span>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-[14px] sm:text-[15.5px] tracking-tight leading-snug truncate group-hover:text-emerald-800 transition-colors">
              {lang === 'en' ? 'Smt. BhavnaBen Patel' : 'શ્રીમતી ભાવનાબેન પટેલ'}
            </h2>
            <p className="text-[11.5px] text-slate-600 font-medium leading-tight mt-0.5 truncate">
              {lang === 'en' ? 'Anganwadi Worker • View Profile →' : 'આંગણવાડી કાર્યકર • પ્રોફાઇલ જુઓ →'}
            </p>
          </div>
        </div>

        {/* Location & Online Status Pill */}
        <div
          className="flex flex-col items-end justify-center gap-1.5 shrink-0 pl-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 text-[11.5px] font-bold text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600 shrink-0" />
            <span className="leading-tight">{lang === 'en' ? '04-Vadtal Centre' : '૦૪-વડતાલ કેન્દ્ર'}</span>
          </div>

          {/* Online/Offline/Syncing Dynamic Status Pill */}
          <button
            onClick={onToggleOnline}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isSyncing
                ? 'bg-sky-100 text-sky-950 border border-sky-300'
                : isOnline
                ? 'bg-[#DCFCE7] text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-950 border border-amber-300'
            }`}
            title={
              isSyncing
                ? 'Syncing with cloud...'
                : isOnline
                ? 'Online • Click to test offline mode'
                : 'Offline mode • Click to go online and sync'
            }
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-2.5 h-2.5 text-sky-600 animate-spin" />
                <span>{lang === 'en' ? 'Syncing...' : 'સિંકિંગ...'}</span>
              </>
            ) : isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{lang === 'en' ? 'Online' : 'ઓનલાઇન'}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-2.5 h-2.5 text-amber-700" />
                <span>
                  {lang === 'en'
                    ? `Offline${pendingChangesCount > 0 ? ` (${pendingChangesCount})` : ''}`
                    : `ઑફલાઇન${pendingChangesCount > 0 ? ` (${pendingChangesCount})` : ''}`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PWA 1-Tap Offline Install Banner */}
      <PWAInstallButton lang={lang} variant="banner" />

      {/* 2.5 High-Priority Low Stock Alert Widget */}
      <LowStockAlertWidget
        inventory={inventory}
        lang={lang}
        onNavigate={onNavigate}
        onUpdateInventory={onUpdateInventory}
      />

      {/* 3. Illustrated Grid (All 11 dashboard icon cards in matching style, rounded-3xl, and aspect ratio) */}
      <div className="grid grid-cols-6 gap-2.5 sm:gap-3 pt-0.5">
        {gridCards.map((card, idx) => {
          const Illustration = card.illustration;
          const colClass =
            idx === 9
              ? 'col-span-3 sm:col-span-2 sm:col-start-2'
              : idx === 10
              ? 'col-span-3 sm:col-span-2 sm:col-start-4'
              : 'col-span-2';

          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.screen)}
              className={`${card.bg} ${card.border} ${colClass} border rounded-3xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center transition-all duration-200 active:scale-[0.97] hover:shadow-md shadow-2xs aspect-[4/5.2] cursor-pointer group`}
            >
              {/* Illustration Area */}
              <div className="w-full flex-1 flex items-center justify-center transition-transform group-hover:scale-105 duration-200 py-1">
                <Illustration className="w-full h-full max-h-[82px]" />
              </div>

              {/* Title with Balanced Wrap and Center Alignment */}
              <div className="w-full mt-1 min-h-[32px] flex items-center justify-center">
                <span className="text-[12px] font-bold text-slate-900 leading-[1.2] tracking-tight whitespace-pre-line text-center">
                  {card.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Recent Transactions Done Quick Preview Widget */}
      <div className="bg-white rounded-3xl p-3.5 border border-emerald-200/90 shadow-2xs space-y-2.5 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7EE] text-[#15803D] flex items-center justify-center">
              <ReceiptText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 tracking-tight">
                  {lang === 'en' ? 'Recent Transactions Done' : 'તાજેતરના સ્ટોક વ્યવહારો'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {transactions.length}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {isOnline
                  ? lang === 'en'
                    ? '✓ Synced with Cloud RTDB'
                    : '✓ ક્લાઉડ RTDB સાથે સિંક'
                  : lang === 'en'
                  ? '⏳ Saved locally on device'
                  : '⏳ સ્થાનિક સંગ્રહિત'}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('balance-remaining')}
            className="text-[11px] font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-0.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <span>{lang === 'en' ? 'View All' : 'બધા જુઓ'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Latest 2 Transactions Snippet */}
        {transactions.length > 0 ? (
          <div className="space-y-1.5">
            {transactions.slice(0, 2).map((txn) => {
              const isPositive = txn.type === 'stock_inward';
              return (
                <div
                  key={txn.id}
                  onClick={() => onNavigate('balance-remaining')}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200/60 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        txn.synced !== false ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-[11px] truncate leading-tight">
                        {lang === 'gu' ? txn.titleGu : txn.titleEn}
                      </p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {txn.timeStr} • {txn.referenceNo}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-black tabular-nums ${
                        isPositive ? 'text-emerald-700' : 'text-amber-800'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {txn.totalQuantity} {txn.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-1">
            {lang === 'en' ? 'No recent transactions yet.' : 'હજી કોઈ વ્યવહારો થયેલ નથી.'}
          </p>
        )}
      </div>
    </div>
  );
};

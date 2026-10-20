import React, { useState } from 'react';
import { Globe, Bell, MapPin, ChevronDown, LogOut, Mic } from 'lucide-react';
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
  DownloadReportIllustration
} from '../components/GridCardIllustrations';
import { InventoryItem, Language } from '../types';
import { translations } from '../data/translations';
import { LowStockAlertWidget } from '../components/LowStockAlertWidget';

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
  onUpdateInventory
}) => {
  const t = translations[lang];
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // 9 Cards matching the screenshot layout and color scheme
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
        className="bg-[#EAF7EE] hover:bg-[#e2f4e7] border border-emerald-200/60 hover:border-emerald-300 rounded-3xl p-3 sm:p-3.5 flex items-center justify-between shadow-2xs cursor-pointer transition-all active:scale-[0.99] group"
        title={lang === 'en' ? 'Click to view Anganwadi Worker profile' : 'આંગણવાડી કાર્યકર પ્રોફાઇલ જોવા ક્લિક કરો'}
      >
        {/* Worker Avatar & Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-13 h-13 rounded-full overflow-hidden bg-white border-2 border-emerald-400 group-hover:border-emerald-600 shadow-xs shrink-0 flex items-center justify-center relative transition-colors">
            <img
              src={workerAvatar}
              alt={t.workerName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Graceful fallback to initial initials if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback avatar SVG in background */}
            <div className="absolute inset-0 -z-10 bg-[#FCE7F3] flex items-center justify-center">
              <span className="text-xs font-bold text-pink-700">BP</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-slate-900 text-[14.5px] sm:text-[15.5px] tracking-tight leading-tight truncate group-hover:text-emerald-800 transition-colors">
                {lang === 'en' ? 'Smt. BhavnaBen Patel' : 'શ્રીમતી ભાવનાબેન પટેલ'}
              </h2>
            </div>
            <p className="text-[11.5px] text-slate-600 font-medium leading-none mt-1">
              {lang === 'en' ? 'Anganwadi Worker • View Profile →' : 'આંગણવાડી કાર્યકર • પ્રોફાઇલ જુઓ →'}
            </p>
          </div>
        </div>

        {/* Location & Online Status Pill */}
        <div
          className="flex flex-col items-end gap-1.5 shrink-0 pl-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1 text-[11.5px] font-bold text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600" />
            <span>{lang === 'en' ? '04-Vadtal Centre' : '૦૪-વડતાલ કેન્દ્ર'}</span>
          </div>

          {/* Online/Offline Toggle Button */}
          <button
            onClick={onToggleOnline}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isOnline
                ? 'bg-[#DCFCE7] text-emerald-900 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
            title="Click to toggle online/offline status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            />
            <span>{isOnline ? (lang === 'en' ? 'Online' : 'ઓનલાઇન') : (lang === 'en' ? 'Offline' : 'ઓફલાઇન')}</span>
          </button>
        </div>
      </div>

      {/* 2.5 High-Priority Low Stock Alert Widget */}
      <LowStockAlertWidget
        inventory={inventory}
        lang={lang}
        onNavigate={onNavigate}
        onUpdateInventory={onUpdateInventory}
      />

      {/* 3. 3x3 Illustrated Grid (Matching the exact card layout, rounded-3xl, and styling) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-0.5">
        {gridCards.map((card) => {
          const Illustration = card.illustration;
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.screen)}
              className={`${card.bg} ${card.border} border rounded-3xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center transition-all duration-200 active:scale-[0.97] hover:shadow-md shadow-2xs aspect-[4/5.2] cursor-pointer group`}
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
    </div>
  );
};

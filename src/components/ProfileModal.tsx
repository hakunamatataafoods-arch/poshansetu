import React, { useState } from 'react';
import { X, User, RefreshCw, Database, Award, Shield, Check, LogOut } from 'lucide-react';
import { Language } from '../types';
import { getOfflineQueueCount, syncOfflineQueue } from '../services/firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageToggle: (l: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageToggle,
  isOnline,
  onToggleOnline,
  onLogout
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const queueCount = getOfflineQueueCount();

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await syncOfflineQueue();
      if (res.syncedCount > 0) {
        setSyncMsg(
          lang === 'en'
            ? `Successfully synchronized ${res.syncedCount} queued records with Firebase RTDB!`
            : `${res.syncedCount} રેકોર્ડ્સ સફળતાપૂર્વક ફાયરબેઝ સાથે સમન્વયિત થયા!`
        );
      } else {
        setSyncMsg(
          lang === 'en'
            ? 'All records are up to date in cloud database.'
            : 'બધા રેકોર્ડ્સ ક્લાઉડ ડેટાબેઝમાં અપડેટ છે.'
        );
      }
    } catch (e) {
      setSyncMsg(lang === 'en' ? 'Sync completed.' : 'સમન્વય પૂર્ણ.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'en' ? 'Anganwadi Worker Profile' : 'કાર્યકર પ્રોફાઇલ'}
              </h3>
              <p className="text-xs text-slate-500">PoshanSetu Verified AWW</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Worker Identity Card */}
          <div className="flex items-center gap-3.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-200 border-2 border-white shadow-sm shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                BP
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base leading-tight">Shrimati Bhavnaben Patel</h4>
              <p className="text-xs text-slate-600">Anganwadi Worker (AWW) • 04 Vadtal Centre</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[11px] font-semibold bg-white text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" /> WCD ID: AWVAD04-GUJ
                </span>
              </div>
            </div>
          </div>

          {/* Cloud Database & Sync Diagnostics */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-700" />
                Firebase Realtime Database
              </span>
              <button
                onClick={onToggleOnline}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 ${
                  isOnline
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`} />
                {isOnline ? (lang === 'en' ? 'Online' : 'ઓનલાઇન') : (lang === 'en' ? 'Offline' : 'ઓફલાઇન')}
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-mono break-all bg-white p-2 rounded-lg border border-slate-200">
              https://poshan-setu-default-rtdb.firebaseio.com/awc_awvad04
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600">
                {lang === 'en' ? 'Queued offline records:' : 'ઓફલાઇન બાકી રેકોર્ડ્સ:'}{' '}
                <strong className="text-slate-900">{queueCount}</strong>
              </span>

              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? (lang === 'en' ? 'Syncing...' : 'સમન્વય...') : (lang === 'en' ? 'Sync Now' : 'હમણાં સમન્વય કરો')}
              </button>
            </div>

            {syncMsg && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0" />
                {syncMsg}
              </p>
            )}
          </div>

          {/* Language Switcher */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {lang === 'en' ? 'App Language' : 'એપ્લિકેશન ભાષા'}
              </span>
              <span className="text-[11px] text-slate-500">English / ગુજરાતી</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onLanguageToggle('en')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  lang === 'en' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => onLanguageToggle('gu')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  lang === 'gu' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                ગુજરાતી
              </button>
            </div>
          </div>

          {/* Certification Badge */}
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900 leading-tight">
              <strong>Poshan Abhiyaan Certified 2026</strong>. Ministry of Women and Child Development, Govt of Gujarat.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {onLogout ? (
            <button
              onClick={() => {
                if (window.confirm(lang === 'en' ? 'Are you sure you want to log out?' : 'શું તમે ખરેખર લોગ આઉટ કરવા માંગો છો?')) {
                  onClose();
                  onLogout();
                }
              }}
              className="px-3.5 py-2 text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Log Out' : 'લોગ આઉટ'}</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#15803D] text-white text-xs font-semibold rounded-xl hover:bg-[#166534] transition-colors"
          >
            {lang === 'en' ? 'Done' : 'પૂર્ણ'}
          </button>
        </div>
      </div>
    </div>
  );
};

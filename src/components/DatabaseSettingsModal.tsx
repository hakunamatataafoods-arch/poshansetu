import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Wifi,
  WifiOff,
  Copy,
  Check
} from 'lucide-react';
import { Language } from '../types';
import {
  getDatabaseURL,
  setDatabaseURL,
  resetDatabaseURL,
  testDatabaseConnection,
  getOfflineQueueCount,
  syncOfflineQueue
} from '../services/firebase';
import { playPopClickSound, playTransactionSuccessSound, playTransactionErrorSound } from '../utils/audioEffects';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [syncingQueue, setSyncingQueue] = useState(false);
  const [queueCount, setQueueCount] = useState(0);
  const [copiedRules, setCopiedRules] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status: 'connected' | 'permission_denied' | 'not_found' | 'offline';
    message: string;
    latencyMs?: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrlInput(getDatabaseURL());
      setQueueCount(getOfflineQueueCount());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async (testUrl?: string) => {
    playPopClickSound();
    setTesting(true);
    setTestResult(null);

    const target = testUrl || urlInput;
    const res = await testDatabaseConnection(target);
    setTesting(false);
    setTestResult(res);

    if (res.success) {
      playTransactionSuccessSound();
    } else {
      playTransactionErrorSound();
    }
  };

  const handleSaveUrl = () => {
    playPopClickSound();
    const clean = setDatabaseURL(urlInput);
    setUrlInput(clean);
    handleTestConnection(clean);
  };

  const handleResetDefault = () => {
    playPopClickSound();
    const def = resetDatabaseURL();
    setUrlInput(def);
    setTestResult(null);
  };

  const handleSyncPending = async () => {
    playPopClickSound();
    setSyncingQueue(true);
    const res = await syncOfflineQueue();
    setSyncingQueue(false);
    setQueueCount(getOfflineQueueCount());
    if (res.success) {
      playTransactionSuccessSound();
    }
  };

  const copyRulesToClipboard = () => {
    const rulesJson = '{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}';
    navigator.clipboard.writeText(rulesJson);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-2xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {lang === 'gu' ? 'ક્લાઉડ ડેટાબેઝ & સિંક સેટિંગ્સ' : 'Cloud Database & Sync Settings'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'gu' ? 'Firebase Realtime Database કનેક્શન' : 'Firebase Realtime Database Connection'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Explanation Banner */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-1">
            <p className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>{lang === 'gu' ? 'ડેશબોર્ડ સાથે સિંક કેવી રીતે થાય છે?' : 'How Sync Works with Dashboard'}</span>
            </p>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              {lang === 'gu'
                ? 'આ એપ અને સુપરવાઇઝર ડેશબોર્ડ બંને એક જ Firebase Realtime Database સાથે જોડાય છે. જો ડેટા સિંક ન થતો હોય, તો તમારો પોતાનો Firebase ડેટાબેઝ બનાવી નીચે URL દાખલ કરો.'
                : 'Both this worker app and your supervisor dashboard read & write to the same Firebase Realtime Database URL. If changes are not appearing, connect your own Firebase project below.'}
            </p>
          </div>

          {/* Database URL Input Form */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              {lang === 'gu' ? 'Firebase Realtime Database URL' : 'Firebase Realtime Database URL'}
            </label>
            <div className="space-y-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-project-default-rtdb.firebaseio.com"
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-[11px] rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <p className="text-[10px] text-slate-500">
                {lang === 'gu'
                  ? 'ઉદાહરણ: https://poshan-setu-anand-default-rtdb.asia-southeast1.firebasedatabase.app'
                  : 'Example: https://poshan-setu-anand-default-rtdb.asia-southeast1.firebasedatabase.app'}
              </p>
            </div>
          </div>

          {/* Action Buttons: Test Connection & Save */}
          <div className="flex gap-2">
            <button
              onClick={() => handleTestConnection()}
              disabled={testing || !urlInput.trim()}
              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-emerald-400 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? (lang === 'gu' ? 'ટેસ્ટિંગ...' : 'Testing...') : (lang === 'gu' ? 'ટેસ્ટ કનેક્શન' : 'Test Connection')}</span>
            </button>

            <button
              onClick={handleSaveUrl}
              className="flex-1 py-2 px-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'સેવ કરો' : 'Save URL'}</span>
            </button>
          </div>

          {/* Test Diagnostic Result Alert */}
          {testResult && (
            <div
              className={`p-3 rounded-2xl border space-y-1.5 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : testResult.status === 'permission_denied'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : 'bg-red-50 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-start gap-2">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-xs leading-snug">
                    {testResult.success
                      ? lang === 'gu'
                        ? 'કનેક્શન સફળ! ડેટાબેઝ સિંક ચાલુ છે'
                        : 'Connection Successful! Database Online'
                      : testResult.status === 'permission_denied'
                      ? lang === 'gu'
                        ? 'પરમિશન નકારી (Rules Locked)'
                        : 'Permission Denied (Firebase Rules Locked)'
                      : lang === 'gu'
                        ? 'કનેક્શન નિષ્ફળ'
                        : 'Connection Failed'}
                  </h4>
                  <p className="text-[11px] leading-relaxed mt-0.5 font-medium">
                    {testResult.message}
                  </p>
                </div>
              </div>

              {testResult.status === 'permission_denied' && (
                <div className="pt-1 border-t border-amber-200 space-y-1.5">
                  <span className="font-bold text-[10.5px] block text-amber-900">
                    {lang === 'gu' ? 'ઉકેલ: Firebase Rules માં આ કોડ પેસ્ટ કરો:' : 'Fix: Paste these open test rules in Firebase Console:'}
                  </span>
                  <div className="bg-slate-900 text-emerald-400 p-2 rounded-lg font-mono text-[10px] flex items-center justify-between">
                    <span>{'{ ".read": true, ".write": true }'}</span>
                    <button
                      onClick={copyRulesToClipboard}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[9.5px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedRules ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedRules ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Offline Sync Queue Card */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                {lang === 'gu' ? 'ઑફલાઇન સિંક કતાર (Queue)' : 'Pending Offline Queue'}
              </span>
              <span className="text-[11px] text-slate-500">
                {queueCount} {lang === 'gu' ? 'આઇટમ બાકી છે' : 'items pending sync'}
              </span>
            </div>

            <button
              onClick={handleSyncPending}
              disabled={syncingQueue || queueCount === 0}
              className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${syncingQueue ? 'animate-spin' : ''}`} />
              <span>{syncingQueue ? 'Syncing...' : (lang === 'gu' ? 'હવે સિંક કરો' : 'Sync Now')}</span>
            </button>
          </div>

          {/* Quick Guide to Create Firebase RTDB in 3 Steps */}
          <div className="border border-slate-200 rounded-2xl p-3 space-y-2 bg-slate-50/50">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>{lang === 'gu' ? 'પોતાનો નવો ડેટાબેઝ કેવી રીતે બનાવવો? (૨ મિનિટ)' : 'How to Create Your Own Firebase Database'}</span>
            </h4>

            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-slate-700 leading-snug">
              <li>
                <span>
                  {lang === 'gu' ? 'ગૂગલમાં ' : 'Go to '}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-emerald-700 underline inline-flex items-center gap-0.5"
                  >
                    console.firebase.google.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  {lang === 'gu' ? ' ખોલી પ્રોજેક્ટ બનાવો.' : ' and click "Add Project".'}
                </span>
              </li>
              <li>
                <span>
                  {lang === 'gu'
                    ? 'ડાબી બાજુ Build > '
                    : 'In left sidebar, go to Build > '}
                  <strong>Realtime Database</strong>
                  {lang === 'gu' ? ' પર ક્લિક કરી Create Database કરો.' : ' and click "Create Database".'}
                </span>
              </li>
              <li>
                <span>
                  {lang === 'gu'
                    ? 'Rules ટેબમાં જઈ { ".read": true, ".write": true } સેટ કરો અને ઉપર દેખાતી URL અહીં પેસ્ટ કરો.'
                    : 'Go to Rules tab, set read and write to true, and paste your database URL here.'}
                </span>
              </li>
            </ol>
          </div>

          {/* Reset button */}
          <div className="pt-1 flex justify-center">
            <button
              onClick={handleResetDefault}
              className="text-[11px] text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              {lang === 'gu' ? 'ડિફોલ્ટ URL પર ફરી સેટ કરો' : 'Reset to default placeholder URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

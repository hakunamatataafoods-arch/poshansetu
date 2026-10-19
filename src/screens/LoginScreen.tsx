import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, Globe, ChevronDown, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  lang,
  onLanguageChange
}) => {
  const t = translations[lang];

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = userId.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMsg(
        lang === 'en'
          ? 'Please enter both User ID and Password.'
          : 'કૃપા કરીને યુઝર આઈડી અને પાસવર્ડ બંને દાખલ કરો.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // User requested: user ID = worker, password = 1234
      if (trimmedUser === 'worker' && trimmedPass === '1234') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg(t.invalidCredentials);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setUserId('worker');
    setPassword('1234');
    setErrorMsg(null);
  };

  return (
    <div className="px-5 pt-3 pb-8 space-y-5 animate-in fade-in duration-300">
      {/* Top Language Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-emerald-800 bg-[#EAF7EE] px-2.5 py-1 rounded-full border border-emerald-200">
          Govt. of Gujarat • WCD
        </span>

        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'en' ? 'English' : 'ગુજરાતી'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onLanguageChange('en');
                  setLangMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
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
                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${
                  lang === 'gu' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                ગુજરાતી {lang === 'gu' && '✓'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Brand Hero Welcome Section */}
      <div className="flex flex-col items-center text-center pt-2 space-y-2">
        <div className="p-3 bg-white rounded-3xl border border-emerald-100 shadow-sm">
          <PoshanSetuLogo size="lg" />
        </div>

        <div className="pt-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {t.welcomeTitle}
          </h1>
          <p className="text-sm font-bold text-[#15803D] mt-0.5">
            {t.welcomeSubtitle}
          </p>
          <p className="text-xs text-slate-600 mt-1 max-w-[320px] leading-relaxed">
            {t.loginPrompt}
          </p>
        </div>
      </div>

      {/* Centre Profile Banner */}
      <div className="bg-[#EAF7EE] border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
          AW
        </div>
        <div className="text-left text-xs">
          <span className="font-extrabold text-slate-900 block">
            04 Vadtal (AWVAD04) • Taluka Anand
          </span>
          <span className="text-slate-600 block text-[11px] mt-0.5">
            AWW: Shrimati Bhavnaben Patel • Sup: Shardaben Shah
          </span>
        </div>
      </div>

      {/* Login Card Form */}
      <div className="bg-white rounded-[26px] p-5 border border-slate-200/90 shadow-sm space-y-4">
        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-900 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-tight font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* User ID Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-800 block">
              {t.userIdLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={t.userIdPlaceholder}
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl pl-10 pr-3 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-800 block">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold text-sm rounded-xl pl-10 pr-10 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo Credentials Quick Fill Banner */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full p-2.5 bg-amber-50 hover:bg-amber-100/80 rounded-xl border border-amber-200 text-left flex items-center justify-between text-xs transition-colors group cursor-pointer"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-amber-950 block text-[11px]">
                  {lang === 'en' ? 'Click here to Autofill Demo Credentials' : 'ડેમો પાસવર્ડ આપમેળે ભરવા અહીં ક્લિક કરો'}
                </span>
                <span className="text-[10px] text-amber-800 font-mono">
                  ID: <strong>worker</strong> • Password: <strong>1234</strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-white px-2 py-1 rounded-md border border-amber-200 group-hover:bg-amber-200/60 transition-colors">
                {lang === 'en' ? 'Auto Fill' : 'ભરો'}
              </span>
            </button>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? t.syncing : t.loginButton}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>

      {/* Official Security Disclaimer */}
      <div className="flex items-center justify-center gap-2 text-slate-600 text-[11px] pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          {lang === 'en'
            ? 'Authorized Anganwadi Personnel Access Only'
            : 'માત્ર અધિકૃત આંગણવાડી સ્ટાફ માટે પ્રવેશ'}
        </span>
      </div>
    </div>
  );
};

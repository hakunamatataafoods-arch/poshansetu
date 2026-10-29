import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  Heart,
  Baby,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Package,
  CheckCircle2,
  X,
  CreditCard,
  Plus,
  Send,
  Eye,
  Filter
} from 'lucide-react';
import { Language } from '../types';
import { RegisteredBeneficiary } from '../data/beneficiaries';
import {
  playPopClickSound,
  playTransactionSuccessSound,
  playTransactionErrorSound
} from '../utils/audioEffects';

interface BeneficiaryScreenProps {
  onBack: () => void;
  lang: Language;
  beneficiaries: RegisteredBeneficiary[];
  onAddBeneficiary: (newB: RegisteredBeneficiary) => void;
  onSelectForDistribution: (b: RegisteredBeneficiary) => void;
}

export const BeneficiaryScreen: React.FC<BeneficiaryScreenProps> = ({
  onBack,
  lang,
  beneficiaries,
  onAddBeneficiary,
  onSelectForDistribution
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pregnant' | 'lactating' | 'infant' | 'children'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Registration Form State
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameGu, setFormNameGu] = useState('');
  const [formCategory, setFormCategory] = useState<'pregnant' | 'lactating' | 'infant' | 'children'>('pregnant');
  const [formAge, setFormAge] = useState('');
  const [formParentSpouse, setFormParentSpouse] = useState('');
  const [formPhone, setFormPhone] = useState('+91 ');
  const [formAddress, setFormAddress] = useState('Vadtal, Anand');
  const [formCardNo, setFormCardNo] = useState(`MCP-GJ-2026-${Math.floor(4400 + Math.random() * 590)}`);

  // Count summaries
  const totalCount = beneficiaries.length;
  const pregnantCount = beneficiaries.filter((b) => b.category === 'pregnant').length;
  const lactatingCount = beneficiaries.filter((b) => b.category === 'lactating').length;
  const infantCount = beneficiaries.filter((b) => b.category === 'infant').length;
  const childrenCount = beneficiaries.filter((b) => b.category === 'children').length;

  // Filtered List
  const filteredBeneficiaries = beneficiaries.filter((b) => {
    if (selectedCategory !== 'all' && b.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameEn = b.nameEn.toLowerCase();
    const nameGu = b.nameGu.toLowerCase();
    const card = (b.mcpCardNo || '').toLowerCase();
    const phone = (b.phone || '').toLowerCase();
    const address = (b.addressEn + ' ' + b.addressGu).toLowerCase();
    return nameEn.includes(q) || nameGu.includes(q) || card.includes(q) || phone.includes(q) || address.includes(q);
  });

  const getEntitlementText = (category: string) => {
    switch (category) {
      case 'pregnant':
        return lang === 'gu'
          ? 'માતૃ શક્તિ THR (૪ પેકેટ/માસ) + આયર્ન ફોલિક'
          : 'Matru Shakti THR (4 Packs/mo) + IFA';
      case 'lactating':
        return lang === 'gu'
          ? 'માતૃ શક્તિ THR (૪ પેકેટ/માસ) + કેલ્શિયમ'
          : 'Matru Shakti THR (4 Packs/mo) + Calcium';
      case 'infant':
        return lang === 'gu'
          ? 'બાલ શક્તિ પૂરક આહાર (૭ પેકેટ/માસ)'
          : 'Bal Shakti Premix THR (7 Packs/mo)';
      case 'children':
        return lang === 'gu'
          ? 'દૈનિક ગરમ નાસ્તો અને ભોજન + દૂધ સંજીવની'
          : 'Daily Morning Snack & Hot Meal + Dudh Sanjeevani';
      default:
        return lang === 'gu' ? 'સરકારી પોષણ સહાય' : 'Govt Nutrition Entitlement';
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim() && !formNameGu.trim()) {
      playTransactionErrorSound();
      alert(lang === 'gu' ? 'કૃપા કરીને લાભાર્થીનું નામ દાખલ કરો.' : 'Please enter beneficiary name.');
      return;
    }

    const finalNameEn = formNameEn.trim() || formNameGu.trim();
    const finalNameGu = formNameGu.trim() || formNameEn.trim();

    let subCategoryEn = '';
    let subCategoryGu = '';
    if (formCategory === 'pregnant') {
      subCategoryEn = 'Pregnant Woman (Matru Shakti)';
      subCategoryGu = 'સગર્ભા માતા (માતૃ શક્તિ)';
    } else if (formCategory === 'lactating') {
      subCategoryEn = 'Lactating Mother (Matru Shakti)';
      subCategoryGu = 'ધાત્રી માતા (માતૃ શક્તિ)';
    } else if (formCategory === 'infant') {
      subCategoryEn = 'Infant 6m-3y (Bal Shakti)';
      subCategoryGu = 'શિશુ ૬માસ-૩ વર્ષ (બાલ શક્તિ)';
    } else {
      subCategoryEn = 'Pre-School Child (3-6 yrs)';
      subCategoryGu = 'પૂર્વ પ્રાથમિક બાળક (૩-૬ વર્ષ)';
    }

    const newBeneficiary: RegisteredBeneficiary = {
      id: `ben-${Date.now()}`,
      nameEn: finalNameEn,
      nameGu: finalNameGu,
      ageEn: formAge || (formCategory === 'children' ? '4 Years' : '25 Years'),
      ageGu: formAge || (formCategory === 'children' ? '૪ વર્ષ' : '૨૫ વર્ષ'),
      addressEn: formAddress,
      addressGu: formAddress,
      category: formCategory,
      parentOrSpouseEn: formParentSpouse || (formCategory === 'children' || formCategory === 'infant' ? 'Parent: Registered Guardian' : 'Husband: Registered'),
      parentOrSpouseGu: formParentSpouse || (formCategory === 'children' || formCategory === 'infant' ? 'વાલી: નોંધાયેલ વાલી' : 'પતિ: નોંધાયેલ'),
      subCategoryEn,
      subCategoryGu,
      mcpCardNo: formCardNo,
      phone: formPhone
    };

    onAddBeneficiary(newBeneficiary);
    playTransactionSuccessSound();

    // Reset Form
    setFormNameEn('');
    setFormNameGu('');
    setFormAge('');
    setFormParentSpouse('');
    setFormPhone('+91 ');
    setFormAddress('Vadtal, Anand');
    setFormCardNo(`MCP-GJ-2026-${Math.floor(4400 + Math.random() * 590)}`);
    setIsAddModalOpen(false);

    setSuccessToast(
      lang === 'gu'
        ? `✓ ${finalNameGu} ની સત્તાવાર નોંધણી સફળતાપૂર્વક પૂર્ણ થઈ ગઈ છે!`
        : `✓ ${finalNameEn} registered successfully in PoshanSetu!`
    );

    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 text-slate-900">
      {/* 1. Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 px-4 py-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playPopClickSound();
                onBack();
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-colors border border-slate-200/80 cursor-pointer"
              title={lang === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {lang === 'gu' ? 'લાભાર્થી નોંધણી & રજિસ્ટર' : 'Beneficiary Registry'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {totalCount} {lang === 'gu' ? 'નોંધાયેલ' : 'Active'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {lang === 'gu'
                  ? 'AWC ૦૪ વડતાલ • મમતા કાર્ડ & ICDS લાભાર્થી યાદી'
                  : 'AWC 04 Vadtal • Mamata Card & ICDS Registered Beneficiaries'}
              </p>
            </div>
          </div>

          {/* Quick Register Beneficiary Button */}
          <button
            onClick={() => {
              playPopClickSound();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? '+ નવો લાભાર્થી' : '+ Register'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Success Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <span>{successToast}</span>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-black cursor-pointer px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2. Overview Stats Cards */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => {
              playPopClickSound();
              setSelectedCategory('pregnant');
            }}
            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedCategory === 'pregnant'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/30'
                : 'bg-white border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-600 fill-rose-100 mx-auto mb-1" />
            <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
              {pregnantCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block truncate">
              {lang === 'gu' ? 'સગર્ભા (PW)' : 'Pregnant'}
            </span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setSelectedCategory('lactating');
            }}
            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedCategory === 'lactating'
                ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-400/30'
                : 'bg-white border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-pink-600 mx-auto mb-1" />
            <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
              {lactatingCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block truncate">
              {lang === 'gu' ? 'ધાત્રી (LM)' : 'Lactating'}
            </span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setSelectedCategory('infant');
            }}
            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedCategory === 'infant'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <Baby className="w-4 h-4 text-amber-600 mx-auto mb-1" />
            <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
              {infantCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block truncate">
              {lang === 'gu' ? 'શિશુ (૬મ-૩વ)' : 'Infant 6m-3y'}
            </span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setSelectedCategory('children');
            }}
            className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedCategory === 'children'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/30'
                : 'bg-white border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <span className="text-base sm:text-lg font-black text-slate-900 block leading-tight">
              {childrenCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 block truncate">
              {lang === 'gu' ? 'બાળક (૩-૬વ)' : 'Child 3-6y'}
            </span>
          </button>
        </div>

        {/* 3. Search and Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'gu'
                  ? 'લાભાર્થીનું નામ, મમતા કાર્ડ નં. અથવા ફોન દ્વારા શોધો...'
                  : 'Search by beneficiary name, MCP card, or phone...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/90 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-3 py-2.5 rounded-2xl bg-slate-200 text-slate-700 font-bold text-xs shrink-0 cursor-pointer hover:bg-slate-300 transition-colors"
            >
              {lang === 'gu' ? 'બધા જુઓ' : 'Reset'}
            </button>
          )}
        </div>

        {/* 4. Beneficiaries List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800">
              {lang === 'gu' ? 'નોંધાયેલા લાભાર્થીઓ' : 'Registered Beneficiaries'} ({filteredBeneficiaries.length})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {lang === 'gu' ? 'આહાર વિતરણ માટે સીધું પસંદ કરો' : 'Tap to distribute ration directly'}
            </span>
          </div>

          {filteredBeneficiaries.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                {lang === 'gu' ? 'કોઈ લાભાર્થી મળ્યા નથી.' : 'No beneficiaries match your search.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {lang === 'gu' ? 'તમામ ફિલ્ટર રીસેટ કરો' : 'Clear search filters'}
              </button>
            </div>
          ) : (
            filteredBeneficiaries.map((b) => {
              const displayName = lang === 'gu' ? b.nameGu : b.nameEn;
              const displayAge = lang === 'gu' ? b.ageGu : b.ageEn;
              const displaySubCategory = lang === 'gu' ? b.subCategoryGu : b.subCategoryEn;
              const displayParentSpouse = lang === 'gu' ? b.parentOrSpouseGu : b.parentOrSpouseEn;
              const displayAddress = lang === 'gu' ? b.addressGu : b.addressEn;

              let badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              if (b.category === 'pregnant') badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
              if (b.category === 'lactating') badgeBg = 'bg-pink-100 text-pink-800 border-pink-200';
              if (b.category === 'infant') badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-3.5 border border-slate-200/90 hover:border-emerald-300 shadow-2xs transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Beneficiary Identity */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-800 font-black text-sm">
                        {displayName.slice(0, 2)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-black text-slate-900 text-sm leading-tight truncate">
                            {displayName}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${badgeBg}`}>
                            {displaySubCategory}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                          {displayAge} • {displayParentSpouse}
                        </p>
                      </div>
                    </div>

                    {/* Quick Distribute Button */}
                    <button
                      onClick={() => {
                        playPopClickSound();
                        onSelectForDistribution(b);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shrink-0 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                      title={lang === 'gu' ? 'આ લાભાર્થીને આહાર વિતરણ કરો' : 'Distribute Ration to Beneficiary'}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>{lang === 'gu' ? 'વિતરણ કરો' : 'Distribute'}</span>
                    </button>
                  </div>

                  {/* Mamata Card & Contact Info strip */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-medium bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/60">
                    <div className="flex items-center gap-1.5 text-slate-700 truncate">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {b.mcpCardNo || (lang === 'gu' ? 'નોંધણી નં: AWVAD04' : 'Reg: AWVAD04')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-700 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.phone || '+91 98250 00000'}</span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1.5 text-slate-600 truncate pt-0.5 border-t border-slate-200/50">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{displayAddress}</span>
                    </div>
                  </div>

                  {/* Entitlement Notice */}
                  <div className="flex items-center justify-between text-[10.5px] font-bold text-emerald-800 bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{getEntitlementText(b.category)}</span>
                    </span>
                    <span className="text-[10px] text-emerald-700">ICDS Gujarat</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: REGISTER NEW BENEFICIARY                               */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {lang === 'gu' ? 'નવા લાભાર્થીની નોંધણી' : 'Register New Beneficiary'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'gu'
                      ? 'વિગતો ભરો અને સ્ટોક વિતરણ સાથે જોડો'
                      : 'Fill details to add to distribution registry'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'gu' ? 'લાભાર્થી શ્રેણી / પ્રકાર *' : 'Beneficiary Category *'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormCategory('pregnant')}
                    className={`p-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      formCategory === 'pregnant'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🤰 {lang === 'gu' ? 'સગર્ભા માતા (PW)' : 'Pregnant Woman'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormCategory('lactating')}
                    className={`p-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      formCategory === 'lactating'
                        ? 'bg-pink-50 border-pink-400 text-pink-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🤱 {lang === 'gu' ? 'ધાત્રી માતા (LM)' : 'Lactating Mother'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormCategory('infant')}
                    className={`p-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      formCategory === 'infant'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>👶 {lang === 'gu' ? 'શિશુ (૬માસ-૩ વર્ષ)' : 'Infant (6m-3y)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormCategory('children')}
                    className={`p-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      formCategory === 'children'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>🧒 {lang === 'gu' ? 'બાળક (૩-૬ વર્ષ)' : 'Child (3-6y)'}</span>
                  </button>
                </div>
              </div>

              {/* Names (Gujarati & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'લાભાર્થીનું નામ (ગુજરાતીમાં) *' : 'Name in Gujarati *'}
                  </label>
                  <input
                    type="text"
                    value={formNameGu}
                    onChange={(e) => setFormNameGu(e.target.value)}
                    placeholder="દા.ત. મીનાબેન રમેશભાઈ પટેલ"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'લાભાર્થીનું નામ (અંગ્રેજીમાં)' : 'Name in English'}
                  </label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Minaben Ramesh Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Age & Husband / Father */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'ઉંમર / માસ' : 'Age / Months'}
                  </label>
                  <input
                    type="text"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    placeholder={formCategory === 'children' || formCategory === 'infant' ? 'દા.ત. ૧૪ મહિના / ૪ વર્ષ' : 'દા.ત. ૨૬ વર્ષ'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'પતિ / પિતાનું નામ' : 'Spouse / Parent Name'}
                  </label>
                  <input
                    type="text"
                    value={formParentSpouse}
                    onChange={(e) => setFormParentSpouse(e.target.value)}
                    placeholder="દા.ત. રમેશભાઈ પટેલ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Mamata Card & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'મમતા કાર્ડ / RCH આઈડી' : 'Mamata Card / RCH ID'}
                  </label>
                  <input
                    type="text"
                    value={formCardNo}
                    onChange={(e) => setFormCardNo(e.target.value)}
                    placeholder="MCP-GJ-2026-XXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'સંપર્ક નંબર' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 9825X XXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Address / Faliyu */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'gu' ? 'ફળિયું / સરનામું (વડતાલ)' : 'Address / Faliyu'}
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="દા.ત. સ્વામિનારાયણ મંદિર પાસે, ફળિયું ૨, વડતાલ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                />
              </div>

              {/* Auto Entitlement Box */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block">
                  {lang === 'gu' ? 'સરકારી રાશન પાત્રતા (ICDS ગુજરાત):' : 'ICDS Ration Entitlement:'}
                </span>
                <p className="text-xs font-bold text-emerald-800">
                  {getEntitlementText(formCategory)}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'નોંધણી પૂર્ણ કરો' : 'Save Beneficiary'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

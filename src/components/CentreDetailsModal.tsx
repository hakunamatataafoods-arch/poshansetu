import React, { useState } from 'react';
import {
  X,
  School,
  MapPin,
  Users,
  Droplet,
  Sparkles,
  ShieldCheck,
  Baby,
  Heart,
  Search,
  ArrowLeft,
  Phone,
  Calendar,
  UserCheck,
  FileText,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { REGISTERED_BENEFICIARIES, RegisteredBeneficiary } from '../data/beneficiaries';
import { getRegisteredBeneficiaries } from '../services/beneficiaryRegistry';

export type BeneficiaryCategory = 'overview' | 'children' | 'infant' | 'pregnant';

interface CentreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialCategory?: BeneficiaryCategory;
}

export const CentreDetailsModal: React.FC<CentreDetailsModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialCategory = 'overview'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BeneficiaryCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync category if initialCategory changes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory || 'overview');
      setSearchQuery('');
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  // Include any newly registered beneficiaries from localStorage
  const customStorage = getRegisteredBeneficiaries().filter((b) => b.isCustom);
  const customMapped: RegisteredBeneficiary[] = customStorage.map((b) => ({
    id: b.id,
    nameEn: b.nameEn,
    nameGu: b.nameGu,
    ageEn: b.ageEn || 'N/A',
    ageGu: b.ageGu || 'N/A',
    addressEn: b.addressEn || 'AWC 04 Vadtal',
    addressGu: b.addressGu || 'આંગણવાડી ૦૪ વડતાલ',
    category:
      b.categoryType === 'pregnant' || b.categoryType === 'lactating'
        ? 'pregnant'
        : b.categoryType === 'infant'
        ? 'infant'
        : 'children',
    parentOrSpouseEn: b.parentOrSpouseEn || '',
    parentOrSpouseGu: b.parentOrSpouseGu || '',
    mcpCardNo: b.mcpCardNo,
    phone: b.phone,
    subCategoryEn: b.categoryEn,
    subCategoryGu: b.categoryGu
  }));

  const allBeneficiaries = [...customMapped, ...REGISTERED_BENEFICIARIES];

  const childrenList = allBeneficiaries.filter((b) => b.category === 'children');
  const infantList = allBeneficiaries.filter((b) => b.category === 'infant');
  const pregnantList = allBeneficiaries.filter((b) => b.category === 'pregnant');

  const currentList =
    selectedCategory === 'children'
      ? childrenList
      : selectedCategory === 'infant'
      ? infantList
      : selectedCategory === 'pregnant'
      ? pregnantList
      : [];

  const filteredList = currentList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = (lang === 'gu' ? item.nameGu : item.nameEn).toLowerCase();
    const address = (lang === 'gu' ? item.addressGu : item.addressEn).toLowerCase();
    const age = (lang === 'gu' ? item.ageGu : item.ageEn).toLowerCase();
    return name.includes(query) || address.includes(query) || age.includes(query);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-slate-100">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            {selectedCategory !== 'overview' ? (
              <button
                onClick={() => setSelectedCategory('overview')}
                className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Back to Overview"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                <School className="w-5 h-5 stroke-[2.2]" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {selectedCategory === 'overview'
                  ? lang === 'en'
                    ? 'Anganwadi Centre Profile'
                    : 'આંગણવાડી કેન્દ્રની પ્રોફાઇલ'
                  : selectedCategory === 'children'
                  ? lang === 'en'
                    ? 'Registered Children (3-6y)'
                    : 'નોંધાયેલા બાળકોની વિગત'
                  : selectedCategory === 'infant'
                  ? lang === 'en'
                    ? 'Registered Infants (0-3y)'
                    : 'નોંધાયેલા શિશુઓની વિગત'
                  : lang === 'en'
                  ? 'Pregnant Women (PW)'
                  : 'સગર્ભા માતાઓની વિગત'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {selectedCategory === 'overview'
                  ? 'AWVAD04 • 04 Vadtal Centre • Anand'
                  : `${filteredList.length} ${
                      lang === 'en' ? 'Verified Profiles' : 'ચકાસાયેલ પ્રોફાઇલ'
                    }`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Category Navigation Bar (Children, Infant, Pregnant Woman, Overview) */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-center">
          <button
            onClick={() => setSelectedCategory('overview')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedCategory === 'overview'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span className="truncate">{lang === 'en' ? 'Centre' : 'કેન્દ્ર'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('children')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedCategory === 'children'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Baby className="w-3.5 h-3.5 text-emerald-700" />
            <span className="truncate">{lang === 'en' ? 'Children' : 'બાળકો'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('infant')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedCategory === 'infant'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span className="truncate">{lang === 'en' ? 'Infant' : 'શિશુ'}</span>
          </button>

          <button
            onClick={() => setSelectedCategory('pregnant')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
              selectedCategory === 'pregnant'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate">{lang === 'en' ? 'Pregnant' : 'સગર્ભા'}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(92vh-130px)]">
          {/* ================================================================ */}
          {/* OVERVIEW TAB: Centre Profile & Clickable Cards to Beneficiaries  */}
          {/* ================================================================ */}
          {selectedCategory === 'overview' ? (
            <>
              {/* Centre Official Identity Badge */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 shadow-2xs">
                <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {lang === 'en' ? '04 Vadtal Anganwadi Centre' : '૦૪ વડતાલ આંગણવાડી કેન્દ્ર'}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {lang === 'en' ? 'Model AWC Grade A+' : 'આદર્શ આંગણવાડી ગ્રેડ A+'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lang === 'en'
                      ? 'Taluka: Anand • District: Anand • Code: AWVAD04'
                      : 'તાલુકો: આણંદ • જિલ્લો: આણંદ • કેન્દ્ર કોડ: AWVAD04'}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {lang === 'en' ? 'Worker:' : 'કાર્યકર:'}{' '}
                    <strong>{lang === 'en' ? 'Shrimati Bhavnaben Patel' : 'શ્રીમતી ભાવનાબેન પટેલ'}</strong> (AWW)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'en' ? 'Supervisor:' : 'સુપરવાઈઝર:'}{' '}
                    <strong>{lang === 'en' ? 'Smt. Shardaben Shah' : 'શ્રીમતી શારદાબેન શાહ'}</strong> ({lang === 'en' ? 'ICDS Sector Vadtal' : 'ICDS સેક્ટર વડતાલ'})
                  </p>
                </div>
              </div>

              {/* Beneficiary Demographics: CLICKABLE CARDS for Children, Infant, Pregnant Woman */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {lang === 'en' ? 'Registered Beneficiaries Directory' : 'નોંધાયેલા લાભાર્થી કેન્દ્ર વિગત'}
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {lang === 'en' ? 'Click card to view profiles' : 'વિગત જોવા કાર્ડ પર ક્લિક કરો'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card 1: Children (3-6 yrs) - CLICKABLE */}
                  <div
                    onClick={() => setSelectedCategory('children')}
                    className="p-3.5 bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100/70 hover:to-emerald-50 rounded-2xl border-2 border-emerald-200/90 shadow-2xs cursor-pointer transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-2xs">
                        <Baby className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        {lang === 'en' ? 'View List →' : 'યાદી જુઓ →'}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-2xl font-black text-slate-900 block leading-none">
                        {childrenList.length}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs block mt-1">
                        {lang === 'en' ? 'Children (3-6 yrs)' : 'બાળકો (૩-૬ વર્ષ)'}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium block">
                        {lang === 'en' ? 'Pre-School & Daily Hot Meals' : 'પૂર્વ-પ્રાથમિક શિક્ષણ અને ગરમ ભોજન'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Infant (6m-3 yrs) - CLICKABLE */}
                  <div
                    onClick={() => setSelectedCategory('infant')}
                    className="p-3.5 bg-gradient-to-br from-pink-50 to-white hover:from-pink-100/70 hover:to-pink-50 rounded-2xl border-2 border-pink-200/90 shadow-2xs cursor-pointer transition-all hover:scale-[1.02] group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-2xs">
                        <Heart className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold text-pink-800 bg-white px-2 py-0.5 rounded-full border border-pink-200 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        {lang === 'en' ? 'View List →' : 'યાદી જુઓ →'}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-2xl font-black text-slate-900 block leading-none">
                        {infantList.length}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs block mt-1">
                        {lang === 'en' ? 'Infant (0-3 yrs)' : 'શિશુ (૦-૩ વર્ષ)'}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium block">
                        {lang === 'en' ? 'Bal Shakti THR Recipients' : 'બાલ શક્તિ પૂરક આહાર (THR)'}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Pregnant Woman (PW) - CLICKABLE */}
                  <div
                    onClick={() => setSelectedCategory('pregnant')}
                    className="p-3.5 bg-gradient-to-br from-amber-50 to-white hover:from-amber-100/70 hover:to-amber-50 rounded-2xl border-2 border-amber-200/90 shadow-2xs cursor-pointer transition-all hover:scale-[1.02] group col-span-2 sm:col-span-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-2xs">
                        <Users className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        {lang === 'en' ? 'View List →' : 'યાદી જુઓ →'}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <span className="text-2xl font-black text-slate-900 block leading-none">
                        {pregnantList.length}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs block mt-1">
                        {lang === 'en' ? 'Pregnant Woman (PW)' : 'સગર્ભા માતાઓ (PW)'}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-medium block">
                        {lang === 'en' ? 'Matru Shakti & ANC Roster' : 'માતૃ શક્તિ અને તપાસ રોસ્ટર'}
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Certified Summary */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-800 block">
                        {lang === 'en' ? 'TOTAL REGISTERED' : 'કુલ નોંધાયેલ લાભાર્થી'}
                      </span>
                      <span className="text-2xl font-black text-emerald-800 block leading-none mt-1">
                        {REGISTERED_BENEFICIARIES.length}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-500 mt-2 font-medium">
                      {lang === 'en'
                        ? 'All records verified by Sector Supervisor & Poshan Tracker'
                        : 'તમામ રેકોર્ડ સેક્ટર સુપરવાઈઝર અને પોષણ ટ્રેકર દ્વારા પ્રમાણિત'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Centre Infrastructure Facilities */}
              <div>
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Centre Facilities & Amenities' : 'કેન્દ્ર સુવિધાઓ અને માળખું'}
                </h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-500" />
                      {lang === 'en' ? 'Safe RO Drinking Water Tap' : 'પીવાનું શુદ્ધ RO પાણીનું કનેક્શન'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {lang === 'en' ? '✓ Functional' : '✓ કાર્યરત'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {lang === 'en' ? 'Clean Kitchen & Gas Stove' : 'સ્વચ્છ રસોડું અને LPG ગેસ જોડાણ'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {lang === 'en' ? '✓ Certified Clean' : '✓ પ્રમાણિત સ્વચ્છ'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-500" />
                      {lang === 'en' ? 'Digital Infantometer & Weight Scale' : 'ડિજિટલ વજન કાંટો અને ઊંચાઈ સ્કેલ'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {lang === 'en' ? '✓ Calibrated' : '✓ પ્રમાણિત કેલિબ્રેટેડ'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* ================================================================ */
            /* BENEFICIARY DIRECTORY LIST: Children, Infant, or Pregnant Woman  */
            /* ================================================================ */
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    selectedCategory === 'children'
                      ? lang === 'en' ? 'Search children by name or address...' : 'બાળકનું નામ અથવા સરનામું શોધો...'
                      : selectedCategory === 'infant'
                      ? lang === 'en' ? 'Search infant by name or address...' : 'શિશુનું નામ અથવા સરનામું શોધો...'
                      : lang === 'en' ? 'Search pregnant woman by name...' : 'સગર્ભા માતાનું નામ અથવા સરનામું શોધો...'
                  }
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl pl-9 pr-8 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sub-header Banner */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="font-bold text-slate-700">
                  {selectedCategory === 'children'
                    ? lang === 'en' ? 'Registered Children (3-6 Years)' : 'નોંધાયેલા બાળકો (૩ થી ૬ વર્ષ)'
                    : selectedCategory === 'infant'
                    ? lang === 'en' ? 'Registered Infants (0-3 Years)' : 'નોંધાયેલા શિશુઓ (૦ થી ૩ વર્ષ)'
                    : lang === 'en' ? 'Registered Pregnant Women (PW)' : 'નોંધાયેલી સગર્ભા માતાઓ'}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {filteredList.length} {lang === 'en' ? 'Beneficiaries' : 'લાભાર્થી'}
                </span>
              </div>

              {/* The List: Name, Age, and Address Prominently Shown */}
              {filteredList.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    {lang === 'en' ? 'No beneficiaries match your search.' : 'કોઈ લાભાર્થી મળ્યા નથી.'}
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    {lang === 'en' ? 'Clear search filter' : 'શોધ ફિલ્ટર સાફ કરો'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredList.map((item, idx) => {
                    const isBoy = item.gender === 'M';
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all space-y-2"
                      >
                        {/* Row 1: Name and Age Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                                selectedCategory === 'children'
                                  ? isBoy
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : selectedCategory === 'infant'
                                  ? 'bg-pink-100 text-pink-800 border border-pink-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {item.rollNo || `#${idx + 1}`}
                            </div>

                            <div className="min-w-0">
                              <h5 className="font-extrabold text-slate-900 text-sm leading-tight truncate">
                                {lang === 'gu' ? item.nameGu : item.nameEn}
                              </h5>
                              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5 truncate">
                                {lang === 'gu' ? item.parentOrSpouseGu : item.parentOrSpouseEn}
                              </span>
                            </div>
                          </div>

                          {/* Age Pill Badge */}
                          <div className="text-right shrink-0">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                selectedCategory === 'children'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                  : selectedCategory === 'infant'
                                  ? 'bg-pink-50 text-pink-800 border border-pink-300'
                                  : 'bg-amber-50 text-amber-900 border border-amber-300'
                              }`}
                            >
                              <Calendar className="w-3 h-3 stroke-[2.5]" />
                              <span>{lang === 'gu' ? item.ageGu : item.ageEn}</span>
                            </span>
                          </div>
                        </div>

                        {/* Row 2: Address with MapPin Icon */}
                        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-2 text-xs">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              {lang === 'en' ? 'Residential Address' : 'રહેઠાણ સરનામું'}
                            </span>
                            <span className="font-semibold text-slate-800 leading-snug block mt-0.5">
                              {lang === 'gu' ? item.addressGu : item.addressEn}
                            </span>
                          </div>
                        </div>

                        {/* Row 3: Meta & Contact action */}
                        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                          <span className="font-medium text-emerald-800">
                            {lang === 'gu' ? item.subCategoryGu : item.subCategoryEn}
                          </span>
                          {item.phone && (
                            <a
                              href={`tel:${item.phone}`}
                              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{item.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          {selectedCategory !== 'overview' ? (
            <button
              onClick={() => setSelectedCategory('overview')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Back to Overview' : 'કેન્દ્ર વિગત પર પાછા જાઓ'}</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium">
              {lang === 'en' ? 'Vadtal Sector • AWC AWVAD04' : 'વડતાલ સેક્ટર • કેન્દ્ર AWVAD04'}
            </span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {lang === 'en' ? 'Close' : 'બંધ કરો'}
          </button>
        </div>
      </div>
    </div>
  );
};

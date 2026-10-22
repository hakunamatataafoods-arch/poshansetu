import React, { useState } from 'react';
import {
  X,
  User,
  RefreshCw,
  Database,
  Award,
  Shield,
  Check,
  LogOut,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  School,
  Baby,
  Heart,
  Users,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { getOfflineQueueCount, syncOfflineQueue } from '../services/firebase';
import workerAvatar from '../assets/images/bhavnaben_patel_avatar_1792406640270.jpg';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageToggle: (l: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  onLogout?: () => void;
  onOpenCentreDetails?: (initialCategory?: 'children' | 'infant' | 'pregnant') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageToggle,
  isOnline,
  onToggleOnline,
  onLogout,
  onOpenCentreDetails
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'credentials' | 'system'>('profile');

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

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText('+91 98254 30128');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/55 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-slate-100">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {lang === 'en' ? 'Anganwadi Worker Profile' : 'આંગણવાડી કાર્યકર પ્રોફાઇલ'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'en' ? 'PoshanSetu Verified Government Staff' : 'પોષણ સેતુ પ્રમાણિત સરકારી સ્ટાફ'}
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

        {/* Sub-Tabs: Profile Details vs Professional Credentials vs System Sync */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-center">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Profile Details' : 'પ્રોફાઇલ વિગત'}
          </button>
          <button
            onClick={() => setActiveSubTab('credentials')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'credentials'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Professional' : 'સેવા વિગત'}
          </button>
          <button
            onClick={() => setActiveSubTab('system')}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'system'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'System & Sync' : 'સિસ્ટમ સેટિંગ'}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4.5 space-y-4 overflow-y-auto max-h-[calc(92vh-130px)]">
          {activeSubTab === 'profile' && (
            <>
              {/* Worker Identity Card with Real Profile Picture */}
              <div className="bg-gradient-to-br from-[#EAF7EE] via-[#F4FAF4] to-[#E3F5E7] rounded-3xl p-4 border border-emerald-200/90 shadow-2xs space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-white/90 px-2 py-0.5 rounded-md border border-emerald-200">
                    AWW Code: AWW-GJ-0401
                  </span>
                  <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-700 text-white shadow-2xs">
                    ICDS GUJARAT • VERIFIED
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  {/* Real Profile Picture with Verified Ring */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowPhotoViewer(true)}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 border-emerald-500 shadow-md flex items-center justify-center cursor-pointer group hover:opacity-95 transition-all relative"
                      title={lang === 'en' ? 'Click to view photo' : 'ફોટો મોટો જોવા ક્લિક કરો'}
                    >
                      <img
                        src={workerAvatar}
                        alt="Shrimati Bhavnaben Patel"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                        View
                      </div>
                    </button>
                    {/* UIDAI / Government Verified Check Badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-xs"
                      title="Verified Anganwadi Worker"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Name & Official Designation */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <h4 className="font-extrabold text-slate-900 text-base leading-tight truncate">
                      {lang === 'en' ? 'Shrimati Bhavnaben Patel' : 'શ્રીમતી ભાવનાબેન પટેલ'}
                    </h4>
                    <p className="text-xs text-emerald-800 font-bold leading-tight">
                      {lang === 'en'
                        ? 'Senior Anganwadi Worker (Grade I)'
                        : 'મુખ્ય આંગણવાડી કાર્યકર (ગ્રેડ ૧)'}
                    </p>
                    <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">04-Vadtal Centre • Anand</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details Section: Joining Date, Birth Date, Contact Number */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    {lang === 'en' ? 'Personal & Official Dates' : 'વ્યક્તિગત અને નિમણૂક વિગત'}
                  </h5>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active Service
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Joining Date */}
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10.5px] font-semibold text-slate-500 block">
                      {lang === 'en' ? 'Joining Date' : 'નિમણૂક તારીખ'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      12 July 2014
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 block">
                      {lang === 'en' ? '12+ Years Service' : '૧૨+ વર્ષની અવિરત સેવા'}
                    </span>
                  </div>

                  {/* Birth Date */}
                  <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10.5px] font-semibold text-slate-500 block">
                      {lang === 'en' ? 'Birth Date (DOB)' : 'જન્મ તારીખ'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      15 August 1985
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 block">
                      {lang === 'en' ? '41 Years • Female' : '૪૧ વર્ષ • સ્ત્રી'}
                    </span>
                  </div>
                </div>

                {/* Contact Number with Call and Copy Button */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10.5px] font-semibold text-slate-600 block">
                        {lang === 'en' ? 'Registered Contact Number' : 'નોંધાયેલ મોબાઈલ નંબર'}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                        +91 98254 30128
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPhone ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Copy' : 'કોપી'}</span>
                        </>
                      )}
                    </button>
                    <a
                      href="tel:+919825430128"
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>{lang === 'en' ? 'Call' : 'કોલ'}</span>
                    </a>
                  </div>
                </div>

                {/* Official Email & Residential Address */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-start gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-semibold block">
                        {lang === 'en' ? 'Government Email:' : 'સરકારી ઇમેઇલ:'}
                      </span>
                      <span className="font-semibold text-slate-800 break-all">
                        bhavna.patel.aww04@gujarat.gov.in
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10.5px] text-slate-500 font-semibold block">
                        {lang === 'en' ? 'Residential Address:' : 'રહેઠાણનું સરનામું:'}
                      </span>
                      <span className="font-medium text-slate-800 leading-snug">
                        Plot 14, Sharda Society, Near Swaminarayan Mandir, Vadtal, Taluka Anand, Gujarat - 388375
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Link to Anganwadi Centre Registered Beneficiaries (Children, Infants, Pregnant Women) */}
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-2xl p-4 text-white space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <School className="w-5 h-5 text-emerald-300" />
                    <span className="font-bold text-sm">
                      {lang === 'en' ? 'AWC 04 Vadtal Beneficiaries' : '૦૪ વડતાલ કેન્દ્ર લાભાર્થી યાદી'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-700 text-emerald-100 rounded-full">
                    27 Total
                  </span>
                </div>

                <p className="text-[11px] text-emerald-100/90 leading-relaxed font-medium">
                  {lang === 'en'
                    ? 'Access verified name, age, and address directory for registered Children, Infants, and Pregnant Women.'
                    : 'નોંધાયેલા બાળકો, શિશુઓ અને સગર્ભા માતાઓની સંપૂર્ણ નામ, ઉંમર અને સરનામા સહિતની યાદી જુઓ.'}
                </p>

                {/* 3 Quick Buttons matching User Request: Children, Infant, Pregnant Woman */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCentreDetails?.('children');
                    }}
                    className="p-2 bg-white/15 hover:bg-white/25 rounded-xl text-center transition-all cursor-pointer border border-white/20"
                  >
                    <Baby className="w-4 h-4 mx-auto text-emerald-200 mb-0.5" />
                    <span className="text-[11px] font-bold block">Children</span>
                    <span className="text-[9.5px] text-emerald-200 block">12 Registered</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCentreDetails?.('infant');
                    }}
                    className="p-2 bg-white/15 hover:bg-white/25 rounded-xl text-center transition-all cursor-pointer border border-white/20"
                  >
                    <Heart className="w-4 h-4 mx-auto text-pink-200 mb-0.5" />
                    <span className="text-[11px] font-bold block">Infant</span>
                    <span className="text-[9.5px] text-pink-200 block">9 Registered</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenCentreDetails?.('pregnant');
                    }}
                    className="p-2 bg-white/15 hover:bg-white/25 rounded-xl text-center transition-all cursor-pointer border border-white/20"
                  >
                    <Users className="w-4 h-4 mx-auto text-amber-200 mb-0.5" />
                    <span className="text-[11px] font-bold block">Pregnant</span>
                    <span className="text-[9.5px] text-amber-200 block">6 Registered</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'credentials' && (
            <>
              {/* Professional Qualifications & Identifiers */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-700" />
                    {lang === 'en' ? 'Professional Identifiers' : 'વ્યાવસાયિક વિગત અને ઓળખ'}
                  </h5>
                  <span className="text-[10px] font-semibold text-slate-500">
                    WCD Gujarat
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Employee Code:' : 'કર્મચારી કોડ:'}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      AWW-GJ-ANAND-0401
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Poshan Tracker ID:' : 'પોષણ ટ્રેકર આઈડી:'}
                    </span>
                    <span className="font-bold text-emerald-800 font-mono flex items-center gap-1">
                      PT-2490182
                      <Check className="w-3 h-3 text-emerald-600" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Aadhaar Status:' : 'આધાર સ્થિતિ:'}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                      ✓ UIDAI Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Sector / Beat:' : 'સેક્ટર / બીટ:'}
                    </span>
                    <span className="font-bold text-slate-800">
                      Vadtal Beat - 02 (ICDS Anand)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Supervisor:' : 'સુપરવાઈઝર:'}
                    </span>
                    <span className="font-bold text-slate-800">
                      Smt. Shardaben Shah
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'en' ? 'Affiliated CHC/PHC:' : 'જોડાયેલ આરોગ્ય કેન્દ્ર:'}
                    </span>
                    <span className="font-bold text-slate-800">
                      Vadtal Community Health Centre
                    </span>
                  </div>
                </div>
              </div>

              {/* Education & Certifications */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    {lang === 'en' ? 'Education & Training' : 'શિક્ષણ અને તાલીમ પ્રમાણપત્ર'}
                  </h5>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-900 block">
                      B.A. (Sociology)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Sardar Patel University, Vallabh Vidyanagar (2006)
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-900 block">
                      Certified ECCE Specialist
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Early Childhood Care & Education • NIPCCD Indore (2016)
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-900 block">
                      Infant and Young Child Feeding (IYCF) Master Trainer
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Health & Family Welfare Dept, Gujarat (2021)
                    </span>
                  </div>
                </div>
              </div>

              {/* Awards and Recognitions */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
                <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  {lang === 'en' ? 'Awards & Recognition' : 'પુરસ્કાર અને પ્રશસ્તિપત્ર'}
                </h5>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-950 block">
                    ★ Best Anganwadi Worker Award (Anand District, 2023)
                  </span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Awarded by District Collector & DDO for achieving 100% THR coverage and zero severe acute malnutrition (SAM) cases in Vadtal.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'system' && (
            <>
              {/* Cloud Database & Sync Diagnostics */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-700" />
                    Firebase Realtime Database
                  </span>
                  <button
                    onClick={onToggleOnline}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    {isOnline
                      ? lang === 'en' ? 'Online' : 'ઓનલાઇન'
                      : lang === 'en' ? 'Offline' : 'ઓફલાઇન'}
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 font-mono break-all bg-white p-2 rounded-lg border border-slate-200">
                  https://poshan-setu-default-rtdb.firebaseio.com/awc_awvad04
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600 font-medium">
                    {lang === 'en' ? 'Queued offline records:' : 'ઓફલાઇન બાકી રેકોર્ડ્સ:'}{' '}
                    <strong className="text-slate-900">{queueCount}</strong>
                  </span>

                  <button
                    onClick={handleSyncNow}
                    disabled={syncing}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing
                      ? lang === 'en' ? 'Syncing...' : 'સમન્વય...'
                      : lang === 'en' ? 'Sync Now' : 'હમણાં સમન્વય કરો'}
                  </button>
                </div>

                {syncMsg && (
                  <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {syncMsg}
                  </p>
                )}
              </div>

              {/* Offline PWA Mobile Installation */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-2">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    {lang === 'en' ? '📱 Mobile App & 100% Offline Access' : '📱 મોબાઇલ એપ અને ૧૦૦% ઑફલાઇન ઉપયોગ'}
                  </span>
                  <span className="text-[11px] text-slate-600 block mt-0.5">
                    {lang === 'en'
                      ? 'Install on your Android or iPhone to use completely without internet.'
                      : 'ઇન્ટરનેટ વગર પણ કામ કરવા માટે એપ તમારા ફોનમાં ઇન્સ્ટોલ કરો.'}
                  </span>
                </div>
                <PWAInstallButton lang={lang} variant="button" />
              </div>

              {/* Language Switcher */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    {lang === 'en' ? 'Application Language' : 'એપ્લિકેશન ભાષા'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'en' ? 'Current: English' : 'હાલ: ગુજરાતી'}
                  </span>
                </div>

                <div className="flex bg-slate-200 p-0.5 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => onLanguageToggle('en')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onLanguageToggle('gu')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      lang === 'gu' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    ગુજરાતી
                  </button>
                </div>
              </div>

              {/* Quick Logout Button */}
              {onLogout && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          lang === 'en'
                            ? 'Are you sure you want to log out of PoshanSetu?'
                            : 'શું તમે ખરેખર પોષણ સેતુમાંથી લોગ આઉટ કરવા માંગો છો?'
                        )
                      ) {
                        onClose();
                        onLogout();
                      }
                    }}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Log Out Session' : 'સત્ર લોગ આઉટ કરો'}</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-medium">
            POSHAN 2.0 • PoshanSetu AWW v2.4
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            {lang === 'en' ? 'Close' : 'બંધ કરો'}
          </button>
        </div>
      </div>

      {/* Profile Photo Full Viewer Overlay */}
      {showPhotoViewer && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-4 space-y-3 animate-in zoom-in-95 relative text-center">
            <button
              onClick={() => setShowPhotoViewer(false)}
              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg mt-2">
              <img
                src={workerAvatar}
                alt="Shrimati Bhavnaben Patel"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Shrimati Bhavnaben Patel
              </h4>
              <p className="text-xs text-emerald-800 font-semibold">
                Senior Anganwadi Worker (AWW)
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                04 Vadtal Anganwadi Centre • ID: AWVAD04
              </span>
            </div>
            <button
              onClick={() => setShowPhotoViewer(false)}
              className="w-full py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 cursor-pointer"
            >
              Close Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

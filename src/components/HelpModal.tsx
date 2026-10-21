import React, { useState } from 'react';
import {
  X,
  Phone,
  HelpCircle,
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Building2,
  Globe
} from 'lucide-react';
import { Language } from '../types';
import { generateWorkerManualPdf, ManualLanguage } from '../utils/workerManualPdf';
import { playPopClickSound, playTransactionSuccessSound } from '../utils/audioEffects';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'helpline' | 'faqs'>('manual');
  const [downloadingLang, setDownloadingLang] = useState<ManualLanguage | null>(null);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleDownloadManual = async (manualLang: ManualLanguage) => {
    try {
      playPopClickSound();
      setDownloadingLang(manualLang);
      await generateWorkerManualPdf(manualLang);
      playTransactionSuccessSound();

      const label =
        manualLang === 'gu'
          ? 'ગુજરાતી માર્ગદર્શિકા PDF સફળતાપૂર્વક ડાઉનલોડ થઈ!'
          : manualLang === 'en'
          ? 'English Worker Manual PDF Downloaded Successfully!'
          : 'Bilingual Guide PDF Downloaded Successfully!';
      setDownloadSuccessNotice(label);
      setTimeout(() => setDownloadSuccessNotice(null), 4500);
    } catch (err) {
      console.error('Failed to generate manual PDF:', err);
    } finally {
      setDownloadingLang(null);
    }
  };

  const manualSteps = [
    {
      num: '1',
      titleEn: 'Login & Offline Mode',
      titleGu: 'લોગિન અને ઑફલાઇન ઉપયોગ',
      icon: '🔐',
      contentGu:
        'યુઝર આઈડી: worker અને પાસવર્ડ: 1234 વડે લોગિન કરો. ઇન્ટરનેટ ન હોય તો પણ બધી નોંધણી ચાલુ રાખી શકાય છે.',
      contentEn:
        'Sign in using User ID: worker and PIN: 1234. Works 100% offline without internet connectivity.'
    },
    {
      num: '2',
      titleEn: 'Daily Student Attendance',
      titleGu: 'બાળકોની દૈનિક હાજરી',
      icon: '👶',
      contentGu:
        'ભોજન રાંધતા પહેલા હાજર બાળકોની સંખ્યા નોંધો. "બધા હાજર" બટનથી ૧-ક્લિકમાં હાજરી પૂરો.',
      contentEn:
        'Mark students present before meal preparation. Use "Mark All" for 1-tap fast roll call.'
    },
    {
      num: '3',
      titleEn: 'Daily Meal Menu & Ration',
      titleGu: 'દૈનિક ભોજન અને રાશન હિસાબ',
      icon: '🍲',
      contentGu:
        'નાસ્તા માટે ૩૦ ગ્રામ અને બપોરના ભોજન માટે ૫૦ ગ્રામ નિયમ મુજબ સામગ્રી આપમેળે ગોડાઉનમાંથી બાદ થાય છે.',
      contentEn:
        'Fixed 30g Breakfast and 50g Lunch auto-deducts grain rations directly from warehouse stock.'
    },
    {
      num: '4',
      titleEn: 'Local Purchase & Bill Upload',
      titleGu: 'સ્થાનિક ખરીદી અને બિલ અપલોડ',
      icon: '🧾',
      contentGu:
        'સરકારી પુરવઠા સિવાય ખરીદેલ શાકભાજી, મસાલા અને ગેસના બિલનો ફોટો પાડી અપલોડ કરો. નાણાં સીધા બેંક ખાતામાં જમા થશે.',
      contentEn:
        'Upload bills for items bought out-of-pocket (Vegetables, Gas, Spices). Government credits reimbursement directly via DBT.'
    },
    {
      num: '5',
      titleEn: 'Warehouse Stock Inward',
      titleGu: 'ગોડાઉન સ્ટોક આવક (ચલણ)',
      icon: '🚚',
      contentGu:
        'સરકારી ગોડાઉનમાંથી આવેલ ચોખા, તેલ, બાલ શક્તિની ચલણ નંબર અને બેચ નંબર સાથે આવક નોંધો.',
      contentEn:
        'Record delivery challan numbers, batch numbers, and expiry dates when stock arrives.'
    },
    {
      num: '6',
      titleEn: 'Inter-Centre Setu Share',
      titleGu: 'સેતુ શેર આપસી વિનિમય',
      icon: '🤝',
      contentGu:
        'નજીકના આંગણવાડી કેન્દ્ર સાથે ૪-અંકના સુરક્ષિત ઓટીપી કોડ વડે સામગ્રીની આપ-લે કરો.',
      contentEn:
        'Transfer or borrow emergency food supplies with neighboring AWCs using 4-digit verification.'
    },
    {
      num: '7',
      titleEn: 'Monthly Report MPR-6 Download',
      titleGu: 'માસિક પ્રગતિ રિપોર્ટ ડાઉનલોડ',
      icon: '📊',
      contentGu:
        'મહિનાના અંતે સત્તાવાર ફોર્મ MPR-6 પીડીએફ પ્રિન્ટ કાઢો અથવા એક્સેલ/CSV ફાઇલ ડાઉનલોડ કરો.',
      contentEn:
        'Download official Gujarat Govt Form MPR-6 for supervisor submission in PDF or Excel format.'
    },
    {
      num: '8',
      titleEn: 'Poshan Vani Voice Assistant',
      titleGu: 'પોષણ વાણી અવાજ સહાયક',
      icon: '🎙️',
      contentGu:
        'ગુજરાતીમાં બોલીને સ્ટોક જાણો, હાજરી પૂરો અથવા રિપોર્ટ ખોલો. નીચે જમણે માઇક બટન દબાવો.',
      contentEn:
        'Speak in Gujarati or English to check balance, mark attendance, and operate hands-free.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {lang === 'en' ? 'Poshan Setu Worker Guide' : 'આંગણવાડી કાર્યકર માર્ગદર્શિકા'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'en' ? 'User Manual & Support Desk' : 'સત્તાવાર વપરાશ પુસ્તિકા અને સહાય'}
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

        {/* Success Download Banner */}
        {downloadSuccessNotice && (
          <div className="px-4 py-2.5 bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>{downloadSuccessNotice}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-4 pt-3 pb-1 bg-white border-b border-slate-100 flex items-center gap-1.5">
          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('manual');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'User Manual (PDF)' : 'માર્ગદર્શિકા (PDF)'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('helpline');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'helpline'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Helpline' : 'હેલ્પલાઇન'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('faqs');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'FAQs' : 'પ્રશ્નો'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* ================= TAB 1: USER MANUAL & PDF DOWNLOADS ================= */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              {/* Highlighted PDF Download Card */}
              <div className="bg-gradient-to-br from-[#EAF7EE] via-[#E2F4E7] to-white p-4 rounded-3xl border border-emerald-300 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {lang === 'en'
                        ? 'Download Official Worker Manual (PDF)'
                        : 'સત્તાવાર કાર્યકર માર્ગદર્શિકા PDF ડાઉનલોડ કરો'}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {lang === 'en'
                        ? 'Complete step-by-step guidebook with illustrated instructions for all features.'
                        : 'એપ્લિકેશન કેવી રીતે વાપરવી તેની સંપૂર્ણ ગુજરાતી સચિત્ર માર્ગદર્શિકા.'}
                    </p>
                  </div>
                </div>

                {/* 3 Download Action Buttons (Gujarati, English, Bilingual) */}
                <div className="space-y-2 pt-1">
                  {/* 1. Gujarati Manual (Primary) */}
                  <button
                    onClick={() => handleDownloadManual('gu')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs shadow-xs flex items-center justify-between transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇮🇳</span>
                      <span>
                        {downloadingLang === 'gu'
                          ? 'PDF તૈયાર થઈ રહ્યું છે...'
                          : 'ડાઉનલોડ ગુજરાતી માર્ગદર્શિકા (Gujarati PDF)'}
                      </span>
                    </div>
                    <Download className="w-4 h-4 shrink-0" />
                  </button>

                  {/* 2. English Manual */}
                  <button
                    onClick={() => handleDownloadManual('en')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇬🇧</span>
                      <span>
                        {downloadingLang === 'en'
                          ? 'Generating PDF...'
                          : 'Download English Worker Manual (PDF)'}
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  </button>

                  {/* 3. Bilingual Complete Guide */}
                  <button
                    onClick={() => handleDownloadManual('both')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📑</span>
                      <span>
                        {downloadingLang === 'both'
                          ? 'Generating Dual Edition...'
                          : 'Complete Bilingual Edition (દ્વિભાષી સંપૂર્ણ)'}
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* In-Modal Step-by-Step Reader */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'en'
                      ? 'Quick In-App Steps (Read on Phone)'
                      : 'મોબાઇલમાં ઝડપી પગલાંવાર માર્ગદર્શન'}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">8 Steps</span>
                </div>

                <div className="space-y-2">
                  {manualSteps.map((step, idx) => {
                    const isExpanded = expandedStep === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-white border-emerald-300 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <button
                          onClick={() => {
                            playPopClickSound();
                            setExpandedStep(isExpanded ? null : idx);
                          }}
                          className="w-full p-3 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{step.icon}</span>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-800 block">
                                STEP {step.num}
                              </span>
                              <h5 className="text-xs font-bold text-slate-900 leading-tight">
                                {lang === 'en' ? step.titleEn : step.titleGu}
                              </h5>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isExpanded ? 'rotate-90 text-emerald-700' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 text-xs text-slate-700 border-t border-slate-100 space-y-1.5 animate-in fade-in">
                            <p className="leading-relaxed font-medium">
                              {lang === 'en' ? step.contentEn : step.contentGu}
                            </p>
                            {lang === 'en' && (
                              <p className="text-[11px] text-slate-500 leading-normal">
                                {step.contentGu}
                              </p>
                            )}
                            {lang === 'gu' && (
                              <p className="text-[10.5px] text-slate-500 leading-normal">
                                {step.contentEn}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: OFFICIAL HELPLINES ================= */}
          {activeTab === 'helpline' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Official Helplines' : 'સત્તાવાર હેલ્પલાઇન નંબર'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 font-semibold block">
                        Poshan Tracker Toll-Free
                      </span>
                      <span className="text-base font-black text-emerald-900 mt-1 block">
                        14408
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium mt-1">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-orange-800 font-semibold block">
                        Childline India
                      </span>
                      <span className="text-base font-black text-orange-900 mt-1 block">
                        1098
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-700 font-medium mt-1">
                      24x7 Emergency
                    </span>
                  </div>
                </div>
              </div>

              {/* Supervisor Direct Contact */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">
                      {lang === 'en' ? 'Centre Supervisor' : 'કેન્દ્ર સુપરવાઈઝર'}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900">Shardaben Shah</h5>
                    <p className="text-xs text-slate-600">04 Vadtal Centre • Taluka Anand</p>
                  </div>
                  <a
                    href="tel:9876543210"
                    className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs hover:bg-emerald-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* CDPO Office Contact */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">CDPO Office • Anand Rural</p>
                <p className="text-[11px] text-slate-600">
                  Taluka Panchayat Bhavan, Anand • Phone: 02692-245901
                </p>
                <p className="text-[10.5px] text-slate-500">
                  Monday to Saturday: 10:30 AM to 6:10 PM
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FAQS ================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {lang === 'en' ? 'Frequently Asked Questions' : 'સામાન્ય પ્રશ્નો અને માર્ગદર્શન'}
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">
                    {lang === 'en'
                      ? '1. How do I get money refunded for local purchases?'
                      : '૧. સ્થાનિક ખરીદીના નાણાં કેવી રીતે પાછા મળશે?'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {lang === 'en'
                      ? 'Take a photo of the bill, enter the invoice number and amount under "Bill Upload & Reimbursement". Once supervisor and CDPO verify it, money will be directly credited to your linked Bank of Baroda account.'
                      : '"બિલ અપલોડ અને ભરપાઈ" મોડ્યુલમાં જઈને બિલનો ફોટો પાડો, પહોંચ નંબર અને રકમ દાખલ કરો. સુપરવાઇઝર ચકાસ્યા પછી રકમ આપના બેંક ખાતામાં જમા થઈ જશે.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">
                    {lang === 'en'
                      ? '2. Can I enter meal usage without internet?'
                      : '૨. શું ઈન્ટરનેટ વગર ભોજન નોંધણી કરી શકાય?'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {lang === 'en'
                      ? 'Yes! All meal and stock entries save locally on your phone. Once you connect to the internet, they automatically sync.'
                      : 'હા! બધી જ નોંધણી તમારા ફોનમાં સાચવવામાં આવે છે. ઈન્ટરનેટ મળતાં જ તે આપમેળે સિંક થઈ જશે.'}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900">
                    {lang === 'en'
                      ? '3. How does the 30g / 50g ratio work?'
                      : '૩. ૩૦ ગ્રામ / ૫૦ ગ્રામનું નિયમ કેવી રીતે કામ કરે છે?'}
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11.5px]">
                    {lang === 'en'
                      ? 'Breakfast (Morning Snack) allocates 30 gm raw weight per present student. Lunch allocates 50 gm per student. You can adjust up to 100 gm for cooking batch requirements.'
                      : 'સવારના નાસ્તા માટે બાળક દીઠ ૩૦ ગ્રામ અને બપોરના ભોજન માટે ૫૦ ગ્રામ પ્રમાણ છે. રસોઈ માટે ૧૦૦ ગ્રામ સુધી વધ-ઘટ કરી શકો છો.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => handleDownloadManual('gu')}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ગુજરાતી PDF ડાઉનલોડ</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#15803D] text-white text-xs font-semibold rounded-xl hover:bg-[#166534] transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'બંધ કરો'}
          </button>
        </div>
      </div>
    </div>
  );
};

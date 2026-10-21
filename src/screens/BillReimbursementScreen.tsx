import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Clock,
  Sparkles,
  DollarSign,
  Download,
  Eye,
  Check,
  ChevronRight,
  HelpCircle,
  X,
  CreditCard,
  ShieldCheck,
  Store,
  Calendar,
  Tag
} from 'lucide-react';
import { Language, ExpenseClaimRecord } from '../types';
import { translations } from '../data/translations';
import {
  playTransactionSuccessSound,
  playTransactionErrorSound,
  playPopClickSound
} from '../utils/audioEffects';

interface BillReimbursementScreenProps {
  onBack: () => void;
  lang: Language;
  claims: ExpenseClaimRecord[];
  onAddClaim: (newClaim: ExpenseClaimRecord) => void;
}

export const BillReimbursementScreen: React.FC<BillReimbursementScreenProps> = ({
  onBack,
  lang,
  claims,
  onAddClaim
}) => {
  const t = translations[lang];

  // Active sub-tab: 'upload' or 'history'
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  // Form State
  const [category, setCategory] = useState<ExpenseClaimRecord['category']>('vegetables');
  const [itemName, setItemName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [vendorName, setVendorName] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank_transfer'>('cash');
  const [remarks, setRemarks] = useState('');
  const [billPhotoUrl, setBillPhotoUrl] = useState<string>('');
  const [previewPhotoName, setPreviewPhotoName] = useState<string>('');

  // UI feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [successClaim, setSuccessClaim] = useState<ExpenseClaimRecord | null>(null);
  const [viewingClaim, setViewingClaim] = useState<ExpenseClaimRecord | null>(null);

  // Category Configuration
  const categories: {
    id: ExpenseClaimRecord['category'];
    nameEn: string;
    nameGu: string;
    icon: string;
    color: string;
    sampleReason: { en: string; gu: string };
  }[] = [
    {
      id: 'vegetables',
      nameEn: 'Fresh Vegetables & Lemons',
      nameGu: 'તાજા શાકભાજી અને લીંબુ',
      icon: '🥦',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      sampleReason: {
        en: 'Fresh local green vegetables for daily nutritious hot cooked meal.',
        gu: 'બાળકોના ગરમ પૌષ્ટિક ભોજન માટે સ્થાનિક બજારમાંથી લીલા શાકભાજી ખરીદ્યા.'
      }
    },
    {
      id: 'gas',
      nameEn: 'LPG Gas Cylinder Refill',
      nameGu: 'એલપીજી ગેસ સિલિન્ડર રિફિલ',
      icon: '⛽',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      sampleReason: {
        en: 'Kitchen cooking LPG cylinder refilled for meal preparation.',
        gu: 'રસોઈ માટેનો ગેસ સિલિન્ડર ખાલી થતાં ભોજન રાંધવા તાત્કાલિક રિફિલ કરાવેલ.'
      }
    },
    {
      id: 'spices',
      nameEn: 'Spices, Salt & Condiments',
      nameGu: 'મસાલા, હળદર અને મીઠું',
      icon: '🧂',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      sampleReason: {
        en: 'Haldi, jeera, mustard seeds and iodized salt for daily dal and khichdi.',
        gu: 'દાળ અને ખીચડી માટે મસાલા, હળદર, જીરું અને આયોડાઇઝ્ડ મીઠું ખરીદેલ.'
      }
    },
    {
      id: 'fruits',
      nameEn: 'Local Seasonal Fruits',
      nameGu: 'સ્થાનિક મોસમી ફળ (કેળા/ચીકુ)',
      icon: '🍎',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      sampleReason: {
        en: 'Seasonal bananas and apples for supplementary nutrition day.',
        gu: 'પૂરક પોષણ દિવસ નિમિત્તે બાળકો માટે સ્થાનિક ફળો ખરીદ્યા.'
      }
    },
    {
      id: 'cleaning',
      nameEn: 'Hygiene & Cleaning Soap',
      nameGu: 'સફાઈ સામગ્રી અને સાબુ',
      icon: '🧼',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      sampleReason: {
        en: 'Handwashing soaps and floor cleaning phenyl for centre sanitization.',
        gu: 'કેન્દ્રની સ્વચ્છતા અને બાળકોના હાથ ધોવા માટે સાબુ અને ફિનાઇલ ખરીદ્યા.'
      }
    },
    {
      id: 'repairs',
      nameEn: 'Utensil & Centre Maintenance',
      nameGu: 'વાસણ અને કેન્દ્ર સમારકામ',
      icon: '🛠️',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      sampleReason: {
        en: 'Cooking pressure cooker gasket and handle repair for safe meal preparation.',
        gu: 'રસોઈના કુકરનું સમારકામ અને ગેસ્કેટ બદલવાનો સ્થાનિક ખર્ચ.'
      }
    },
    {
      id: 'stationery',
      nameEn: 'Registers & Stationery',
      nameGu: 'રજિસ્ટર અને સ્ટેશનરી',
      icon: '📝',
      color: 'bg-slate-50 text-slate-800 border-slate-200',
      sampleReason: {
        en: 'Daily attendance register and drawing colors for pre-school activities.',
        gu: 'દૈનિક હાજરી રજિસ્ટર અને પૂર્વ-પ્રાથમિક પ્રવૃત્તિ માટે સ્ટેશનરી ખરીદી.'
      }
    },
    {
      id: 'other',
      nameEn: 'Other Contingency Expenses',
      nameGu: 'અન્ય આકસ્મિક ખર્ચ',
      icon: '📦',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      sampleReason: {
        en: 'Approved local contingency purchase for Anganwadi centre.',
        gu: 'આંગણવાડી કેન્દ્ર માટે માન્ય આકસ્મિક સ્થાનિક ખરીદી.'
      }
    }
  ];

  // Quick Sample Bills for Instant 1-Tap Testing
  const sampleBills = [
    {
      titleGu: '🥦 તાજા શાકભાજી બિલ (₹380)',
      titleEn: 'Fresh Veggies Bill (₹380)',
      cat: 'vegetables' as const,
      item: 'Palak, Tomato, Dudhi & Lemon (5 kg)',
      vendor: 'શ્રીજી શાકભાજી ભંડાર, વડતાલ',
      inv: 'SHR-2026-904',
      amt: '380',
      photo: 'https://images.unsplash.com/photo-1554415707-9e4466750538?auto=format&fit=crop&w=600&q=80',
      photoName: 'shreeji_veggies_bill_oct.jpg',
      reasonGu: 'સરકારી પુરવઠામાં શાકભાજી ઉપલબ્ધ ન હોવાથી બાળકો માટે તાજા શાકભાજી સ્થાનિક બજારમાંથી ખરીદ્યા.',
      reasonEn: 'Fresh green vegetables purchased locally for midday nutrition.'
    },
    {
      titleGu: '⛽ એલપીજી ગેસ રિફિલ (₹920)',
      titleEn: 'LPG Cylinder Bill (₹920)',
      cat: 'gas' as const,
      item: '14.2 kg Cooking Gas Refill',
      vendor: 'આણંદ ઇન્ડેન ગેસ સર્વિસ',
      inv: 'IND-2026-781',
      amt: '920',
      photo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
      photoName: 'indane_gas_receipt_inv781.jpg',
      reasonGu: 'રસોઈ માટેનો ગેસ સિલિન્ડર ખાલી થઈ જતાં ભોજન રાંધવા તાત્કાલિક રિફિલ કરાવેલ.',
      reasonEn: 'Cooking gas cylinder refilled for daily meal preparation.'
    },
    {
      titleGu: '🧂 મસાલા અને મીઠું (₹310)',
      titleEn: 'Spices & Salt Bill (₹310)',
      cat: 'spices' as const,
      item: 'Haldi, Jeera, Salt 2kg',
      vendor: 'જલારામ કિરાણા સ્ટોર, વડતાલ',
      inv: 'JAL-2026-448',
      amt: '310',
      photo: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      photoName: 'jalaram_spices_cashmemo.jpg',
      reasonGu: 'દાળ અને ખીચડી રાંધવા માટે મસાલા અને આયોડાઇઝ્ડ મીઠું ખરીદેલ.',
      reasonEn: 'Spices and iodized salt purchased for meal cooking.'
    }
  ];

  const handleApplySample = (sample: typeof sampleBills[0]) => {
    playPopClickSound();
    setCategory(sample.cat);
    setItemName(sample.item);
    setVendorName(sample.vendor);
    setInvoiceNumber(sample.inv);
    setAmount(sample.amt);
    setBillPhotoUrl(sample.photo);
    setPreviewPhotoName(sample.photoName);
    setRemarks(lang === 'gu' ? sample.reasonGu : sample.reasonEn);
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playPopClickSound();
      setPreviewPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBillPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Metrics calculation
  const totalClaimed = claims.reduce((sum, c) => sum + c.amount, 0);
  const totalCredited = claims
    .filter((c) => c.status === 'credited_to_bank')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPending = claims
    .filter((c) => c.status === 'submitted' || c.status === 'approved_by_supervisor')
    .reduce((sum, c) => sum + c.amount, 0);

  // Form submission with distinct Pop Sounds
  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const parsedAmount = parseFloat(amount);
    if (!invoiceNumber.trim()) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને બિલ અથવા પહોંચ નંબર દાખલ કરો.'
          : 'Please enter the Bill / Invoice Number.'
      );
      return;
    }

    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને માન્ય રકમ (₹) દાખલ કરો.'
          : 'Please enter a valid bill amount (₹).'
      );
      return;
    }

    if (!vendorName.trim()) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને દુકાનદાર અથવા વેપારીનું નામ લખો.'
          : 'Please enter the Vendor or Shop Name.'
      );
      return;
    }

    if (!billPhotoUrl) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને બિલનો ફોટો અપલોડ કરો જેથી સરકાર ભરપાઈ મંજૂર કરી શકે.'
          : 'Please attach/upload a photo of the physical bill for government reimbursement approval.'
      );
      return;
    }

    const currentCatObj = categories.find((c) => c.id === category);

    const newClaim: ExpenseClaimRecord = {
      id: `CLM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date(billDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      timestamp: new Date().toISOString(),
      invoiceNumber: invoiceNumber.trim().toUpperCase(),
      category,
      categoryLabelEn: currentCatObj?.nameEn || 'Contingency Purchase',
      categoryLabelGu: currentCatObj?.nameGu || 'સ્થાનિક ખરીદી',
      itemName: itemName.trim() || currentCatObj?.nameGu || 'સ્થાનિક ખરીદી',
      vendorName: vendorName.trim(),
      vendorContact: vendorContact.trim(),
      amount: parsedAmount,
      paymentMode,
      billPhotoUrl,
      remarks: remarks.trim() || (lang === 'gu' ? currentCatObj?.sampleReason.gu || '' : currentCatObj?.sampleReason.en || ''),
      workerName: 'શ્રીમતી ભાવનાબેન પટેલ',
      workerBankName: 'Bank of Baroda (Vadtal Branch)',
      workerAccountLast4: '4821',
      awcCode: 'AWVAD04',
      status: 'submitted'
    };

    // Play Success Pop Sound!
    playTransactionSuccessSound();

    onAddClaim(newClaim);
    setSuccessClaim(newClaim);
    setFormError(null);

    // Reset fields
    setItemName('');
    setInvoiceNumber('');
    setVendorName('');
    setVendorContact('');
    setAmount('');
    setRemarks('');
    setBillPhotoUrl('');
    setPreviewPhotoName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                playPopClickSound();
                onBack();
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
              title={lang === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {lang === 'gu' ? 'બિલ અપલોડ અને ભરપાઈ' : 'Local Bill Upload & Reimbursement'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                {lang === 'gu'
                  ? 'આંગણવાડી આકસ્મિક ખર્ચ • સીધી બેંક ખાતામાં ભરપાઈ'
                  : 'AWC Contingency Fund • Direct Benefit Transfer (DBT)'}
              </p>
            </div>
          </div>

          {/* Badge */}
          <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>04-Vadtal</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-[440px] mx-auto">
        {/* 2. Top Summary KPI Cards (Total Claimed, Credited, Pending) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Total Claimed */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {lang === 'gu' ? 'કુલ ક્લેઇમ' : 'Total Claimed'}
            </span>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
              ₹{totalClaimed.toLocaleString('en-IN')}
            </div>
            <span className="text-[9.5px] text-slate-400 font-medium mt-0.5">
              {claims.length} {lang === 'gu' ? 'બિલ' : 'Bills'}
            </span>
          </div>

          {/* Credited to Bank */}
          <div className="bg-[#EAF7EE] p-3 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">
              {lang === 'gu' ? 'ખાતામાં જમા' : 'Credited (DBT)'}
            </span>
            <div className="text-base sm:text-lg font-black text-emerald-900 mt-1">
              ₹{totalCredited.toLocaleString('en-IN')}
            </div>
            <span className="text-[9.5px] text-emerald-700 font-medium mt-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang === 'gu' ? 'મળેલ' : 'Paid'}
            </span>
          </div>

          {/* Under Verification */}
          <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
              {lang === 'gu' ? 'ચકાસણી હેઠળ' : 'In Process'}
            </span>
            <div className="text-base sm:text-lg font-black text-amber-900 mt-1">
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
            <span className="text-[9.5px] text-amber-700 font-medium mt-0.5 flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-amber-600" />
              {lang === 'gu' ? 'ચાલુ' : 'Pending'}
            </span>
          </div>
        </div>

        {/* 3. Tab Switcher: "Upload New Bill" vs "Claim History" */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('upload');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'gu' ? 'નવું બિલ અપલોડ કરો' : 'Upload New Bill'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('history');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>
              {lang === 'gu' ? 'બિલ ઇતિહાસ & સ્ટેટસ' : 'Claim History & Passbook'} ({claims.length})
            </span>
          </button>
        </div>

        {/* ================= TAB 1: UPLOAD BILL FORM ================= */}
        {activeTab === 'upload' && (
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            {/* Quick 1-Tap Sample Bills Demo Helper */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-3 rounded-2xl border border-emerald-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  {lang === 'gu' ? 'ઝડપી ડેમો બિલ (૧-ક્લિક ટેસ્ટિંગ):' : 'Quick Test Sample Bills (1-Tap):'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Demo Auto-Fill</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {sampleBills.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplySample(s)}
                    className="p-1.5 bg-white border border-emerald-200/90 rounded-xl text-left hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="text-[10.5px] font-bold text-slate-900 group-hover:text-emerald-800 leading-tight truncate">
                      {lang === 'gu' ? s.titleGu : s.titleEn}
                    </div>
                    <div className="text-[9.5px] text-emerald-700 font-semibold mt-0.5">
                      ₹{s.amt} • {s.inv}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <p className="font-semibold leading-relaxed">{formError}</p>
              </div>
            )}

            {/* Step 1: Select Category */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'gu' ? '૧. ખર્ચનો પ્રકાર પસંદ કરો' : '1. Select Expense Category'}
              </label>

              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        playPopClickSound();
                        setCategory(cat.id);
                        if (!remarks) {
                          setRemarks(lang === 'gu' ? cat.sampleReason.gu : cat.sampleReason.en);
                        }
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'
                          }`}
                        >
                          {lang === 'gu' ? cat.nameGu : cat.nameEn}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {cat.id === 'vegetables'
                            ? 'શાકભાજી/લીંબુ'
                            : cat.id === 'gas'
                            ? 'રાંધણ ગેસ'
                            : cat.id === 'spices'
                            ? 'મસાલા/મીઠું'
                            : 'સ્થાનિક ખરીદી'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Bill & Vendor Details */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'gu' ? '૨. બિલ અને વેપારીની વિગત' : '2. Bill & Shopkeeper Details'}
              </label>

              {/* Item / Commodity Description */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'gu' ? 'ખરીદેલી વસ્તુનું નામ' : 'Item Description'} *
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder={
                    lang === 'gu'
                      ? 'દા.ત. ટામેટાં, પાલક અને લીંબુ (૫ કિલો)'
                      : 'e.g. Fresh Tomatoes, Spinach & Lemon'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  required
                />
              </div>

              {/* Invoice Number & Date in 2 columns */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'gu' ? 'બિલ / પહોંચ નંબર' : 'Invoice / Bill No.'} *
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="e.g. INV-2026-891"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'gu' ? 'બિલની તારીખ' : 'Bill Date'}
                  </label>
                  <input
                    type="date"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Vendor Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'gu' ? 'દુકાનદાર / વેપારીનું નામ' : 'Shop / Vendor Name'} *
                  </label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder={
                      lang === 'gu' ? 'શ્રીજી શાકભાજી ભંડાર, વડતાલ' : 'e.g. Shreeji Vegetable Store'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'gu' ? 'વેપારી મોબાઇલ નંબર (વૈકલ્પિક)' : 'Vendor Phone (Optional)'}
                  </label>
                  <input
                    type="tel"
                    value={vendorContact}
                    onChange={(e) => setVendorContact(e.target.value)}
                    placeholder="+91 98251 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Bill Amount in Rupees & Payment Mode */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    {lang === 'gu' ? 'બિલની કુલ રકમ (₹)' : 'Total Amount (₹)'} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-sm font-bold text-emerald-700">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border-2 border-emerald-300 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 bg-emerald-50/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'gu' ? 'ચુકવણી પદ્ધતિ' : 'Paid By Worker'}
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  >
                    <option value="cash">{lang === 'gu' ? 'રોકડ (Cash)' : 'Cash'}</option>
                    <option value="upi">{lang === 'gu' ? 'યુપીઆઈ (UPI / PhonePe)' : 'UPI / GPay'}</option>
                    <option value="bank_transfer">{lang === 'gu' ? 'બેંક ટ્રાન્સફર' : 'Bank Transfer'}</option>
                  </select>
                </div>
              </div>

              {/* Remarks / Justification note */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {lang === 'gu'
                    ? 'શેરો / કારણ (સરકારમાં રજૂ કરવા)'
                    : 'Remarks / Reason for Local Purchase'}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    lang === 'gu'
                      ? 'સરકારી પુરવઠામાં શાકભાજી ન હોવાથી બાળકોના સુપોષણ માટે સ્થાનિક બજારમાંથી ખરીદ્યા.'
                      : 'Bought locally as regular supply was not received.'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Step 3: Photo Upload of the Bill */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {lang === 'gu' ? '૩. બિલનો ફોટો અપલોડ કરો' : '3. Upload Photo of Bill / Receipt'} *
                </label>
                {billPhotoUrl && (
                  <span className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {lang === 'gu' ? 'ફોટો જોડાયેલ છે' : 'Attached'}
                  </span>
                )}
              </div>

              {billPhotoUrl ? (
                /* Preview attached photo */
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 group">
                  <img
                    src={billPhotoUrl}
                    alt="Uploaded Bill Preview"
                    className="w-full h-44 object-cover object-center group-hover:scale-102 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-md shadow-xs">
                        {lang === 'gu' ? 'વેલિડ બિલ ફોટો' : 'Verified Receipt'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          playPopClickSound();
                          setBillPhotoUrl('');
                          setPreviewPhotoName('');
                        }}
                        className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                        title={lang === 'gu' ? 'ફોટો દૂર કરો' : 'Remove Photo'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-white text-xs">
                      <p className="font-bold truncate">{previewPhotoName || 'Physical Bill Slip'}</p>
                      <p className="text-[10px] text-emerald-200">
                        {lang === 'gu'
                          ? 'આ ફોટો સરકારી ઓડિટ અને સીડીપીઓ મંજૂરી માટે મોકલાશે'
                          : 'Ready for CDPO audit & bank reimbursement'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Buttons: Camera or File */
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition-all">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center mb-2.5">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {lang === 'gu' ? 'બિલની સ્પષ્ટ તસવીર લો અથવા પસંદ કરો' : 'Take a photo or upload bill receipt'}
                  </p>
                  <p className="text-[10.5px] text-slate-500 mt-1 max-w-[260px] mx-auto">
                    {lang === 'gu'
                      ? 'દુકાનદારની પહોંચ, બિલ નંબર અને રકમ સ્પષ્ટ દેખાય તે રીતે ફોટો પાડો'
                      : 'Ensure Invoice No, Date, Shop Name, and Total ₹ are clearly readable'}
                  </p>

                  <div className="mt-3.5 flex items-center justify-center gap-2">
                    <label className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lang === 'gu' ? 'કેમેરાથી ફોટો લો' : 'Take Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>{lang === 'gu' ? 'ગેલેરીમાંથી ચૂંટો' : 'Browse Files'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Benefit Transfer (DBT) Worker Bank Account Guarantee Info Card */}
            <div className="bg-[#EAF7EE] p-3.5 rounded-3xl border border-emerald-200 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700 min-w-0">
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <span>{lang === 'gu' ? 'સીધા બેંક ખાતામાં ભરપાઈ (DBT)' : 'Direct Benefit Transfer (DBT)'}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 inline" />
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  {lang === 'gu'
                    ? 'મંજૂર થયેલ રકમ શ્રીમતી ભાવનાબેન પટેલના બેંક ઓફ બરોડા ખાતા (•••• 4821) માં સીધી જમા થશે.'
                    : 'Reimbursed funds will be credited directly to Smt. BhavnaBen Patel - Bank of Baroda A/c (•••• 4821).'}
                </p>
              </div>
            </div>

            {/* Submit Claim Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-emerald-950/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {lang === 'gu'
                  ? 'પુષ્ટિ કરો અને બિલ સબમિટ કરો'
                  : 'Confirm & Submit Reimbursement Claim'}
              </span>
            </button>
          </form>
        )}

        {/* ================= TAB 2: CLAIM HISTORY & PASSBOOK ================= */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {lang === 'gu' ? 'પાછલા બિલ ક્લેઇમ અને સ્ટેટસ' : 'Submitted Claims & Status'}
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                {claims.length} {lang === 'gu' ? 'રેકોર્ડ' : 'records'}
              </span>
            </div>

            {claims.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  {lang === 'gu' ? 'કોઈ બિલ ક્લેઇમ મળ્યો નથી' : 'No Claims Submitted Yet'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {lang === 'gu'
                    ? 'તમારી સ્થાનિક ખરીદીના બિલ અપલોડ કરવા "નવું બિલ અપલોડ કરો" ટેબ પર જાઓ.'
                    : 'Switch to Upload New Bill to submit your first local purchase claim.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {claims.map((claim) => {
                  const isCredited = claim.status === 'credited_to_bank';
                  const isApproved = claim.status === 'approved_by_supervisor';

                  return (
                    <div
                      key={claim.id}
                      onClick={() => {
                        playPopClickSound();
                        setViewingClaim(claim);
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                    >
                      {/* Row 1: Category, Status Pill, Amount */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {claim.category === 'vegetables'
                              ? '🥦'
                              : claim.category === 'gas'
                              ? '⛽'
                              : claim.category === 'spices'
                              ? '🧂'
                              : claim.category === 'fruits'
                              ? '🍎'
                              : claim.category === 'cleaning'
                              ? '🧼'
                              : '📦'}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
                              {claim.id} • {claim.date}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {claim.itemName}
                            </h4>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 block">
                            ₹{claim.amount.toLocaleString('en-IN')}
                          </span>
                          {/* Status badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                              isCredited
                                ? 'bg-emerald-100 text-emerald-800'
                                : isApproved
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCredited ? (
                              <>
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {lang === 'gu' ? 'ખાતામાં જમા' : 'Credited'}
                              </>
                            ) : isApproved ? (
                              <>
                                <Check className="w-2.5 h-2.5" />
                                {lang === 'gu' ? 'સુપરવાઇઝર મંજૂર' : 'Approved'}
                              </>
                            ) : (
                              <>
                                <Clock className="w-2.5 h-2.5" />
                                {lang === 'gu' ? 'ચકાસણી હેઠળ' : 'In Review'}
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Vendor, Invoice No & Details */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="truncate max-w-[220px]">
                          <Store className="w-3 h-3 inline mr-1 text-slate-400" />
                          {claim.vendorName}
                        </span>
                        <span className="font-mono text-[10.5px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          #{claim.invoiceNumber}
                        </span>
                      </div>

                      {/* Bank Credited Info or UTR */}
                      {isCredited && claim.utrNumber && (
                        <div className="bg-[#EAF7EE] px-2.5 py-1.5 rounded-xl text-[10px] text-emerald-900 flex items-center justify-between">
                          <span className="font-medium">
                            {lang === 'gu' ? 'બેંક યુટીઆર સંદર્ભ:' : 'DBT UTR:'}{' '}
                            <span className="font-mono font-bold">{claim.utrNumber}</span>
                          </span>
                          <span className="font-bold text-emerald-800">BOB ••••4821</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: SUCCESS VOUCHER SLIP ================= */}
      {successClaim && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-[#15803D] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {lang === 'gu' ? 'બિલ સફળતાપૂર્વક અપલોડ થયું!' : 'Bill Claim Submitted Successfully!'}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {lang === 'gu' ? 'આકસ્મિક ખર્ચ વાઉચર સ્લિપ' : 'AWC Contingency Voucher Slip'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSuccessClaim(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Voucher Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto text-xs text-slate-800">
              {/* Receipt Visual Header */}
              <div className="border border-dashed border-emerald-300 bg-emerald-50/50 p-3 rounded-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Voucher #{successClaim.id}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{successClaim.itemName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">{successClaim.date}</span>
                    <span className="text-base font-black text-emerald-800">
                      ₹{successClaim.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">{lang === 'gu' ? 'દુકાનદાર:' : 'Vendor:'}</span>
                    <span className="font-bold text-slate-900">{successClaim.vendorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'gu' ? 'બિલ નંબર:' : 'Invoice No:'}</span>
                    <span className="font-mono font-bold text-slate-900">#{successClaim.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'gu' ? 'આંગણવાડી કેન્દ્ર:' : 'AWC Centre:'}</span>
                    <span className="font-semibold text-slate-900">04 Vadtal (AWVAD04)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{lang === 'gu' ? 'કાર્યકર:' : 'Worker:'}</span>
                    <span className="font-semibold text-slate-900">{successClaim.workerName}</span>
                  </div>
                </div>

                {successClaim.remarks && (
                  <div className="pt-2 border-t border-emerald-200/60 text-[10.5px] text-slate-600">
                    <span className="font-bold text-slate-700">{lang === 'gu' ? 'નોંધ:' : 'Note:'} </span>
                    {successClaim.remarks}
                  </div>
                )}
              </div>

              {/* Photo preview in voucher */}
              {successClaim.billPhotoUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {lang === 'gu' ? 'બિલની તસવીર (પુરાવો)' : 'Attached Receipt Proof'}
                  </span>
                  <img
                    src={successClaim.billPhotoUrl}
                    alt="Bill Proof"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}

              {/* Bank Credit Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                <div className="text-[11px] text-blue-950">
                  <p className="font-bold">
                    {lang === 'gu' ? 'સીડીપીઓ કચેરીને મોકલાયેલ' : 'Forwarded for Supervisor & CDPO Sanction'}
                  </p>
                  <p className="text-blue-800 text-[10.5px] mt-0.5">
                    {lang === 'gu'
                      ? 'મંજૂર થતાં જ ₹' + successClaim.amount + ' આપના બેંક ઓફ બરોડા ખાતામાં જમા થશે.'
                      : 'Upon verification, ₹' + successClaim.amount + ' will be credited via DBT.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  window.print();
                }}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'વાઉચર સ્લિપ સેવ' : 'Save Slip'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  setSuccessClaim(null);
                  setActiveTab('history');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#15803D] text-white text-xs font-bold hover:bg-[#166534] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'ઇતિહાસ જુઓ' : 'View in History'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW EXISTING CLAIM DETAIL ================= */}
      {viewingClaim && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom flex flex-col max-h-[88vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  {viewingClaim.id} • {viewingClaim.date}
                </span>
                <h3 className="font-bold text-sm leading-tight">{viewingClaim.itemName}</h3>
              </div>
              <button
                onClick={() => setViewingClaim(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto text-xs text-slate-800">
              {/* Photo */}
              {viewingClaim.billPhotoUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src={viewingClaim.billPhotoUrl}
                    alt="Physical Bill"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {/* Details List */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'gu' ? 'રકમ:' : 'Amount:'}</span>
                  <span className="font-black text-emerald-800 text-sm">
                    ₹{viewingClaim.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'gu' ? 'દુકાનદાર:' : 'Shop:'}</span>
                  <span className="font-bold text-slate-900">{viewingClaim.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'gu' ? 'બિલ નંબર:' : 'Invoice No:'}</span>
                  <span className="font-mono font-bold text-slate-900">#{viewingClaim.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{lang === 'gu' ? 'સ્થિતિ (Status):' : 'Status:'}</span>
                  <span className="font-bold text-emerald-700 capitalize">
                    {viewingClaim.status.replace(/_/g, ' ')}
                  </span>
                </div>
                {viewingClaim.utrNumber && (
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">{lang === 'gu' ? 'બેંક UTR:' : 'DBT UTR:'}</span>
                    <span className="font-mono font-bold text-blue-700">{viewingClaim.utrNumber}</span>
                  </div>
                )}
              </div>

              {viewingClaim.remarks && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700">
                  <p className="font-bold text-slate-900 mb-0.5">{lang === 'gu' ? 'શેરો / નોંધ:' : 'Remarks:'}</p>
                  <p className="text-[11px] leading-relaxed">{viewingClaim.remarks}</p>
                </div>
              )}
            </div>

            <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingClaim(null)}
                className="px-5 py-2 bg-[#15803D] text-white text-xs font-bold rounded-xl hover:bg-[#166534]"
              >
                {lang === 'gu' ? 'બંધ કરો' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

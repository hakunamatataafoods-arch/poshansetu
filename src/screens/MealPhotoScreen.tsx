import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Camera,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Home,
  Upload,
  Image as ImageIcon,
  Users,
  Utensils,
  Calendar,
  X,
  Eye,
  RefreshCw,
  FileText,
  Check,
  Award
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language, MealPhotoRecord } from '../types';
import { translations } from '../data/translations';
import { pushFirebaseData, loadLocal, saveLocal } from '../services/firebase';
import {
  playTransactionSuccessSound,
  playTransactionErrorSound,
  playPopClickSound
} from '../utils/audioEffects';

interface MealPhotoScreenProps {
  onBack: () => void;
  lang: Language;
  isOnline?: boolean;
}

// Seed historical meal photo records
const INITIAL_MEAL_PHOTOS: MealPhotoRecord[] = [
  {
    id: 'MPH-2026-901',
    date: '18-Oct-2026',
    time: '11:15 AM',
    timestamp: '2026-10-18T11:15:00.000Z',
    mealType: 'lunch',
    menuName: 'પૌષ્ટિક દાળ-ભાત અને મિક્સ શાકભાજી (Nutritious Dal-Rice & Vegetables)',
    childrenCount: 18,
    photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    photoName: 'dal_rice_thali_18oct.jpg',
    remarks: 'આજે બાળકોને આયોડિન યુક્ત શાકભાજી અને ગરમ દાળ-ભાત પીરસવામાં આવ્યા. બધા બાળકોએ ઉત્સાહથી ભોજન લીધું.',
    location: '04 Vadtal Anganwadi Centre, Taluka Anand',
    gpsCoordinates: '22.5833° N, 72.8833° E',
    awcCode: 'AWVAD04',
    workerName: 'શ્રીમતી ભાવનાબેન પટેલ',
    supervisorName: 'શ્રીમતી શારદાબેન શાહ',
    status: 'verified'
  },
  {
    id: 'MPH-2026-894',
    date: '17-Oct-2026',
    time: '09:45 AM',
    timestamp: '2026-10-17T09:45:00.000Z',
    mealType: 'breakfast',
    menuName: 'ગરમ ઘઉંની સુખડી અને પૌષ્ટિક દૂધ (Warm Wheat Sukdi & Fortified Milk)',
    childrenCount: 19,
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    photoName: 'wheat_sukdi_breakfast_17oct.jpg',
    remarks: 'સવારના નાસ્તામાં તાજી ઘઉં અને ગોળની સુખડી સ્વચ્છ વાસણમાં આપવામાં આવી.',
    location: '04 Vadtal Anganwadi Centre, Taluka Anand',
    gpsCoordinates: '22.5833° N, 72.8833° E',
    awcCode: 'AWVAD04',
    workerName: 'શ્રીમતી ભાવનાબેન પટેલ',
    supervisorName: 'શ્રીમતી શારદાબેન શાહ',
    status: 'verified'
  },
  {
    id: 'MPH-2026-882',
    date: '16-Oct-2026',
    time: '11:20 AM',
    timestamp: '2026-10-16T11:20:00.000Z',
    mealType: 'lunch',
    menuName: 'મગની દાળ ખીચડી અને દહીં (Moong Dal Khichdi & Curd)',
    childrenCount: 17,
    photoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    photoName: 'moong_khichdi_16oct.jpg',
    remarks: 'બાળકોએ સ્વચ્છ હાથ ધોઈને પોષણયુક્ત મગ ખીચડી આરોગી. પોષણ નિયમોનું પાલન થયેલ.',
    location: '04 Vadtal Anganwadi Centre, Taluka Anand',
    gpsCoordinates: '22.5833° N, 72.8833° E',
    awcCode: 'AWVAD04',
    workerName: 'શ્રીમતી ભાવનાબેન પટેલ',
    supervisorName: 'શ્રીમતી શારદાબેન શાહ',
    status: 'verified'
  }
];

export const MealPhotoScreen: React.FC<MealPhotoScreenProps> = ({
  onBack,
  lang,
  isOnline = true
}) => {
  const t = translations[lang];

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-tabs: 'upload' or 'history'
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');

  // Form states
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'snack'>('lunch');
  const [menuName, setMenuName] = useState<string>('પૌષ્ટિક દાળ-ભાત અને મિક્સ શાકભાજી');
  const [childrenCount, setChildrenCount] = useState<number>(18);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoName, setPhotoName] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // History and inspection modal
  const [mealPhotos, setMealPhotos] = useState<MealPhotoRecord[]>(() => {
    return loadLocal<MealPhotoRecord[]>('meal_photos', INITIAL_MEAL_PHOTOS);
  });
  const [submittedRecord, setSubmittedRecord] = useState<MealPhotoRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MealPhotoRecord | null>(null);

  // Update menu default when language changes or meal type changes
  useEffect(() => {
    if (mealType === 'lunch') {
      setMenuName(
        lang === 'gu'
          ? 'પૌષ્ટિક દાળ-ભાત અને મિક્સ શાકભાજી'
          : 'Nutritious Dal-Rice & Mixed Vegetables'
      );
    } else if (mealType === 'breakfast') {
      setMenuName(
        lang === 'gu'
          ? 'ગરમ ઘઉંની સુખડી અને પૌષ્ટિક દૂધ'
          : 'Warm Wheat Sukdi & Fortified Milk'
      );
    } else {
      setMenuName(
        lang === 'gu'
          ? 'બાફેલા દેશી ચણા અને ફળ'
          : 'Boiled Gram & Fresh Seasonal Fruits'
      );
    }
  }, [mealType, lang]);

  // 1-Tap Quick Sample Meals for instant testing
  const sampleMeals = [
    {
      labelGu: '🍲 દાળ-ભાત અને શાક (બપોરનું ભોજન)',
      labelEn: '🍲 Dal-Rice & Veggies (Lunch)',
      type: 'lunch' as const,
      menuGu: 'પૌષ્ટિક દાળ-ભાત અને લીલા શાકભાજી',
      menuEn: 'Nutritious Dal-Rice & Fresh Green Vegetables',
      children: 18,
      photo: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      photoName: 'sample_dal_rice_thali.jpg',
      remarkGu: 'બધા બાળકોએ ઉત્સાહપૂર્વક સ્વચ્છ વાસણમાં ગરમ ભોજન લીધું. પોષણ ધોરણો મુજબ તૈયાર કરેલ.',
      remarkEn: 'All children enthusiastically had hot cooked meals in clean plates. Verified as per Poshan guidelines.'
    },
    {
      labelGu: '🥣 ગરમ સુખડી અને દૂધ (સવારનો નાસ્તો)',
      labelEn: '🥣 Warm Sukdi & Milk (Breakfast)',
      type: 'breakfast' as const,
      menuGu: 'ઘઉં અને દેશી ગોળની સુખડી',
      menuEn: 'Traditional Wheat & Jaggery Sukdi',
      children: 19,
      photo: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      photoName: 'sample_wheat_sukdi.jpg',
      remarkGu: 'સવારના નાસ્તામાં ગરમા-ગરમ સુખડી પીરસાઈ. બાળકો ખૂબ ખુશ થયા.',
      remarkEn: 'Warm fresh sukdi served for morning breakfast nutrition.'
    },
    {
      labelGu: '🥗 મગ ખીચડી અને દહીં (બપોરનું ભોજન)',
      labelEn: '🥗 Moong Khichdi & Curd (Lunch)',
      type: 'lunch' as const,
      menuGu: 'મગની દાળ ખીચડી અને ઘરનું તાજું દહીં',
      menuEn: 'Moong Dal Khichdi & Fresh Curd',
      children: 17,
      photo: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      photoName: 'sample_moong_khichdi.jpg',
      remarkGu: 'હળવું અને પચવામાં સરળ એવું પૌષ્ટિક ખીચડી-દહીં પીરસવામાં આવ્યું.',
      remarkEn: 'Nutritious moong dal khichdi and curd served to registered children.'
    }
  ];

  const handleApplySample = (s: typeof sampleMeals[0]) => {
    playPopClickSound();
    setMealType(s.type);
    setMenuName(lang === 'gu' ? s.menuGu : s.menuEn);
    setChildrenCount(s.children);
    setPhotoUrl(s.photo);
    setPhotoName(s.photoName);
    setRemarks(lang === 'gu' ? s.remarkGu : s.remarkEn);
    setFormError(null);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playPopClickSound();
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    playPopClickSound();
    cameraInputRef.current?.click();
  };

  const triggerFilePicker = () => {
    playPopClickSound();
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને કેમેરાથી ભોજનનો ફોટો પાડો અથવા અપલોડ કરો.'
          : 'Please capture or attach the hot meal photo.'
      );
      return;
    }

    if (!menuName.trim()) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને પીરસાયેલ વાનગીનું નામ દાખલ કરો.'
          : 'Please enter the dish / menu name.'
      );
      return;
    }

    if (!childrenCount || childrenCount <= 0) {
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'કૃપા કરીને લાભાર્થી બાળકોની સાચી સંખ્યા દાખલ કરો.'
          : 'Please enter valid number of children served.'
      );
      return;
    }

    setSubmitting(true);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newRecord: MealPhotoRecord = {
      id: `MPH-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: formattedDate,
      time: formattedTime,
      timestamp: now.toISOString(),
      mealType,
      menuName: menuName.trim(),
      childrenCount,
      photoUrl,
      photoName: photoName || 'live_meal_capture.jpg',
      remarks: remarks.trim() || (lang === 'gu' ? 'દૈનિક ગરમ રાંધેલું ભોજન સફળતાપૂર્વક પીરસાયું.' : 'Daily hot-cooked meal successfully served.'),
      location: '04 Vadtal Anganwadi Centre, Taluka Anand',
      gpsCoordinates: '22.5833° N, 72.8833° E',
      awcCode: 'AWVAD04',
      workerName: lang === 'gu' ? 'શ્રીમતી ભાવનાબેન પટેલ' : 'Shrimati Bhavnaben Patel',
      supervisorName: lang === 'gu' ? 'શ્રીમતી શારદાબેન શાહ' : 'Smt. Shardaben Shah',
      status: 'verified'
    };

    try {
      // 1. Push to Firebase 'meal_photos' collection
      await pushFirebaseData(
        'meal_photos',
        {
          id: newRecord.id,
          date: newRecord.date,
          time: newRecord.time,
          timestamp: newRecord.timestamp,
          mealType: newRecord.mealType,
          menuName: newRecord.menuName,
          childrenCount: newRecord.childrenCount,
          remarks: newRecord.remarks,
          gpsCoordinates: newRecord.gpsCoordinates,
          location: newRecord.location,
          awcCode: newRecord.awcCode,
          workerName: newRecord.workerName,
          status: newRecord.status
        },
        isOnline
      );

      // 2. Persist locally
      const updatedList = [newRecord, ...mealPhotos];
      setMealPhotos(updatedList);
      saveLocal('meal_photos', updatedList);

      // 3. Audio & Success state
      playTransactionSuccessSound();
      setSubmittedRecord(newRecord);
      setFormError(null);
    } catch (err) {
      console.error('Error saving meal photo:', err);
      playTransactionErrorSound();
      setFormError(
        lang === 'gu'
          ? 'સેવ કરતી વખતે ક્ષતિ આવી. સ્થાનિક સ્ટોરેજમાં સાચવી લીધું છે.'
          : 'Error submitting photo. Saved locally in offline queue.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForNewUpload = () => {
    playPopClickSound();
    setSubmittedRecord(null);
    setPhotoUrl('');
    setPhotoName('');
    setRemarks('');
    setActiveTab('upload');
  };

  return (
    <div className="px-4 pt-1 pb-12 space-y-4">
      {/* Hidden File Inputs for Device Camera & Gallery */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handlePhotoCapture}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoCapture}
      />

      {/* Screen Header */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs cursor-pointer"
          aria-label={t.back}
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div className="flex flex-col items-center pt-0.5">
          <PoshanSetuLogo size="sm" />
          <span className="text-[12px] font-semibold text-[#15803D] tracking-tight mt-0.5">
            {t.tagline}
          </span>
        </div>
      </div>

      <div className="text-center pt-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.mealPhotoUploadSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'GPS Geo-Tagged Hot Cooked Meal Verification & Cloud Database Sync'
            : 'જીપીએસ જિયો-ટેગ કરેલ ભોજન ગુણવત્તા ચકાસણી અને ડેટાબેઝ સિંક'}
        </p>
      </div>

      {/* Top Segmented Sub-Tabs: Upload vs Gallery/History */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => {
            playPopClickSound();
            setActiveTab('upload');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Upload Photo' : 'ફોટો અપલોડ'}</span>
        </button>

        <button
          onClick={() => {
            playPopClickSound();
            setActiveTab('history');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Photo Gallery' : 'અગાઉના ફોટા'}</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-black">
            {mealPhotos.length}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: UPLOAD PHOTO FORM OR SUCCESS SLIP                       */}
      {/* ============================================================== */}
      {activeTab === 'upload' && (
        <>
          {submittedRecord ? (
            /* Successful Submission Slip */
            <div className="bg-white rounded-[26px] p-5 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {lang === 'en' ? 'Logged to Firebase meal_photos' : 'ફાયરબેઝ meal_photos માં નોંધાયેલ'}
                </span>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1.5">
                  {lang === 'en' ? 'Meal Photo Verified & Saved!' : 'ભોજનનો ફોટો સફળતાપૂર્વક અપલોડ થયો!'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {lang === 'en'
                    ? 'Geo-tagged with GPS coordinates and recorded into PoshanSetu cloud database.'
                    : 'જીપીએસ લોકેશન અને તારીખ-સમય સાથે ક્લાઉડ ડેટાબેઝમાં સાચવવામાં આવ્યો છે.'}
                </p>
              </div>

              {/* Photo with Watermark Badge */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-300 shadow-xs max-h-56">
                <img
                  src={submittedRecord.photoUrl}
                  alt={submittedRecord.menuName}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 text-white text-left text-[10.5px]">
                  <div className="flex justify-between font-bold">
                    <span>PoshanSetu GeoVerify • AWVAD04</span>
                    <span className="text-emerald-400">✓ Compliance OK</span>
                  </div>
                  <div className="text-[9.5px] text-slate-300 flex justify-between mt-0.5">
                    <span>{submittedRecord.date} {submittedRecord.time}</span>
                    <span>{submittedRecord.childrenCount} {lang === 'en' ? 'Children Served' : 'બાળકો હાજર'}</span>
                  </div>
                </div>
              </div>

              {/* Details voucher */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Record ID:' : 'રેકોર્ડ આઈડી:'}</span>
                  <span className="font-mono font-bold text-slate-900">{submittedRecord.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Meal Type:' : 'આહારનો પ્રકાર:'}</span>
                  <span className="font-bold text-emerald-800 uppercase">
                    {submittedRecord.mealType === 'breakfast'
                      ? lang === 'en' ? 'Breakfast' : 'સવારનો નાસ્તો'
                      : submittedRecord.mealType === 'lunch'
                      ? lang === 'en' ? 'Hot Lunch' : 'બપોરનું ગરમ ભોજન'
                      : lang === 'en' ? 'Special Nutrition' : 'પૂરક આહાર'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Dish / Menu:' : 'વાનગી મેનૂ:'}</span>
                  <span className="font-bold text-slate-800 truncate max-w-[180px]">{submittedRecord.menuName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{lang === 'en' ? 'GPS Coordinates:' : 'જીપીએસ લોકેશન:'}</span>
                  <span className="font-mono font-bold text-slate-700">{submittedRecord.gpsCoordinates}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Supervisor Verification:' : 'સુપરવાઈઝર ચકાસણી:'}</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Shardaben Shah (Verified)' : 'શારદાબેન શાહ (ચકાસાયેલ)'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleResetForNewUpload}
                  className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-4 h-4 stroke-[2.2]" />
                  <span>{lang === 'en' ? 'Upload Another Meal Photo' : 'બીજો ભોજન ફોટો અપલોડ કરો'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playPopClickSound();
                      setActiveTab('history');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'View in Gallery' : 'ગેલેરીમાં જુઓ'}
                  </button>
                  <button
                    onClick={onBack}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Return to Home' : 'મુખ્ય પેજ પર જાઓ'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-4">
              {/* Form Error Banner */}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center justify-between">
                  <span>{formError}</span>
                  <button
                    type="button"
                    onClick={() => setFormError(null)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* 1-Tap Quick Sample Meals */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                  <span>{lang === 'en' ? '⚡ 1-Tap Quick Sample Meals (Testing):' : '⚡ ૧-ક્લિક નમૂના ભોજન (ટેસ્ટિંગ):'}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{lang === 'en' ? 'Instant auto-fill' : 'આપોઆપ ભરાશે'}</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {sampleMeals.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplySample(s)}
                      className="px-3 py-2 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl text-left text-xs font-bold text-emerald-900 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="truncate">{lang === 'gu' ? s.labelGu : s.labelEn}</span>
                      <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                        {lang === 'en' ? 'Fill' : 'પસંદ'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Photo Viewfinder / Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Meal Photo Capture *' : 'ભોજનનો ફોટો *'}
                </label>

                {photoUrl ? (
                  /* Photo Captured / Selected with Official GPS Watermark */
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-900">
                    <img
                      src={photoUrl}
                      alt="Meal Preview"
                      className="w-full h-56 object-cover"
                    />

                    {/* Top Watermark Overlay */}
                    <div className="absolute top-2 inset-x-2 flex justify-between items-center z-10 pointer-events-none">
                      <span className="flex items-center gap-1 text-[9.5px] font-bold text-white bg-black/65 backdrop-blur-xs px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-red-400" />
                        22.5833° N, 72.8833° E (04 Vadtal)
                      </span>
                      <span className="flex items-center gap-1 text-[9.5px] font-bold text-white bg-black/65 backdrop-blur-xs px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        LIVE IST
                      </span>
                    </div>

                    {/* Bottom Watermark Overlay */}
                    <div className="absolute bottom-2 inset-x-2 bg-black/80 backdrop-blur-xs p-2 rounded-xl text-white text-[10px] space-y-0.5 border border-white/10 pointer-events-none">
                      <div className="flex justify-between font-bold">
                        <span>PoshanSetu GeoVerify</span>
                        <span>AWVAD04</span>
                      </div>
                      <div className="text-slate-300 flex justify-between text-[9px]">
                        <span>AWW: Shrimati Bhavnaben Patel</span>
                        <span className="text-emerald-400">Supervisor: Shardaben Shah</span>
                      </div>
                    </div>

                    {/* Retake / Change Button */}
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl('');
                          setPhotoName('');
                        }}
                        className="p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer shadow-md"
                        title={lang === 'en' ? 'Remove Photo' : 'ફોટો દૂર કરો'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Viewfinder Frame with GPS watermark placeholder & Trigger Buttons */
                  <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-dashed border-slate-600 flex flex-col justify-between p-3.5 relative overflow-hidden shadow-inner">
                    {/* Viewfinder crosshairs */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
                      <div className="w-28 h-28 border border-dashed border-white rounded-xl" />
                    </div>

                    {/* Top Live Badges */}
                    <div className="flex items-center justify-between z-10">
                      <span className="flex items-center gap-1 text-[9.5px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md">
                        <MapPin className="w-3 h-3 text-red-400" />
                        22.5833° N, 72.8833° E (04 Vadtal)
                      </span>
                      <span className="flex items-center gap-1 text-[9.5px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        LIVE IST
                      </span>
                    </div>

                    {/* Center Icon and instructions */}
                    <div className="flex flex-col items-center justify-center text-center space-y-2 z-10 py-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 flex items-center justify-center">
                        <Camera className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">
                          {lang === 'en' ? 'Capture Today\'s Hot Meal Plate' : 'આજના ગરમ ભોજનનો ફોટો પાડો'}
                        </p>
                        <p className="text-slate-400 text-[10.5px] mt-0.5">
                          {lang === 'en'
                            ? 'Camera auto-embeds GPS, time & centre identity'
                            : 'કેમેરા આપોઆપ જીપીએસ, તારીખ અને સમય ટેગ કરશે'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Trigger Buttons */}
                    <div className="grid grid-cols-2 gap-2 z-10">
                      <button
                        type="button"
                        onClick={triggerCamera}
                        className="py-2.5 px-3 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Camera className="w-4 h-4 stroke-[2.2]" />
                        <span>{lang === 'en' ? '📷 Open Camera' : '📷 કેમેરા શરૂ કરો'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={triggerFilePicker}
                        className="py-2.5 px-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/30 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Upload File' : 'ફાઇલ પસંદ કરો'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Meal Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Meal Timing / Category' : 'આહારનો પ્રકાર'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playPopClickSound();
                      setMealType('breakfast');
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      mealType === 'breakfast'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🥣 {lang === 'en' ? 'Breakfast' : 'નાસ્તો'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPopClickSound();
                      setMealType('lunch');
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      mealType === 'lunch'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🍲 {lang === 'en' ? 'Hot Lunch' : 'ગરમ ભોજન'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPopClickSound();
                      setMealType('snack');
                    }}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      mealType === 'snack'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🥗 {lang === 'en' ? 'Nutri Snack' : 'પૂરક આહાર'}
                  </button>
                </div>
              </div>

              {/* Menu / Dish Name & Children Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Menu Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'en' ? 'Dish / Menu Name *' : 'પીરસાયેલ વાનગીનું નામ *'}
                  </label>
                  <input
                    type="text"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? 'e.g. Dal-Rice & Vegetables'
                        : 'દા.ત. દાળ-ભાત અને લીલા શાકભાજી'
                    }
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                  />
                </div>

                {/* Children Count */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'en' ? 'Children Served Count *' : 'લાભાર્થી બાળકોની સંખ્યા *'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        playPopClickSound();
                        setChildrenCount((prev) => Math.max(1, prev - 1));
                      }}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      className="flex-1 text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        playPopClickSound();
                        setChildrenCount((prev) => prev + 1);
                      }}
                      className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Remark / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'en' ? 'Remark / Description' : 'શેરો / વિશેષ નોંધ'}
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Note nutritional quality, taste or attendance details...'
                      : 'ભોજનની ગુણવત્તા, સ્વાદ અથવા હાજરી સંબંધિત નોંધ દાખલ કરો...'
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              {/* Submit to Firebase Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'en' ? 'Geo-tagging & Syncing to Firebase...' : 'જીપીએસ ટેગિંગ અને ફાયરબેઝ સિંક...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                    <span>
                      {lang === 'en'
                        ? 'Confirm & Save Meal Photo to Database'
                        : 'પુષ્ટિ કરો અને ભોજન ફોટો ડેટાબેઝમાં સાચવો'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MEAL PHOTO GALLERY / HISTORY REGISTER                   */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
            <span>
              {lang === 'en' ? 'Cloud Verified Meal Photo Archive' : 'પ્રમાણિત ભોજન ફોટો સંગ્રહ'}
            </span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10.5px]">
              {mealPhotos.length} {lang === 'en' ? 'Records' : 'ફોટા'}
            </span>
          </div>

          <div className="space-y-3">
            {mealPhotos.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden hover:border-emerald-300 transition-all"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-900">
                  <img
                    src={item.photoUrl}
                    alt={item.menuName}
                    className="w-full h-full object-cover"
                  />
                  {/* Top overlay */}
                  <div className="absolute top-2 inset-x-2 flex justify-between items-center text-[9.5px] font-bold text-white">
                    <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      {item.date} • {item.time}
                    </span>
                    <span className="bg-emerald-700 text-white px-2 py-0.5 rounded-md uppercase text-[9px] font-black">
                      {item.mealType === 'breakfast'
                        ? lang === 'en' ? 'Breakfast' : 'નાસ્તો'
                        : item.mealType === 'lunch'
                        ? lang === 'en' ? 'Lunch' : 'બપોરનું ભોજન'
                        : lang === 'en' ? 'Snack' : 'પૂરક આહાર'}
                    </span>
                  </div>

                  {/* Bottom overlay */}
                  <div className="absolute bottom-2 inset-x-2 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-xl text-white text-[9.5px] flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {item.gpsCoordinates}
                    </span>
                    <span className="text-emerald-300 font-bold">
                      {item.childrenCount} {lang === 'en' ? 'Served' : 'બાળકો'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-extrabold text-slate-900 leading-snug">
                      {item.menuName}
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                      ✓ {item.status}
                    </span>
                  </div>

                  {item.remarks && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic leading-relaxed">
                      "{item.remarks}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>AWC: {item.awcCode} (04 Vadtal)</span>
                    <button
                      type="button"
                      onClick={() => {
                        playPopClickSound();
                        setViewingRecord(item);
                      }}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'en' ? 'View Slip' : 'વિગત જુઓ'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FULL PHOTO / VOUCHER MODAL                                     */}
      {/* ============================================================== */}
      {viewingRecord && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 space-y-3 animate-in zoom-in-95 relative text-left">
            <button
              onClick={() => setViewingRecord(null)}
              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {lang === 'en' ? 'Meal Geo-Verification Record' : 'ભોજન જિયો-વેરિફિકેશન સ્લિપ'}
              </h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-emerald-300 shadow-sm relative">
              <img
                src={viewingRecord.photoUrl}
                alt={viewingRecord.menuName}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-xs p-2 text-white text-[9.5px]">
                <div className="flex justify-between font-bold">
                  <span>AWVAD04 • 04 Vadtal</span>
                  <span className="text-emerald-400">22.5833° N, 72.8833° E</span>
                </div>
              </div>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Dish:' : 'વાનગી:'}</span>
                <span className="font-bold text-slate-900">{viewingRecord.menuName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Date & Time:' : 'તારીખ અને સમય:'}</span>
                <span className="font-bold text-slate-900">{viewingRecord.date} {viewingRecord.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Children Count:' : 'બાળકોની સંખ્યા:'}</span>
                <span className="font-bold text-emerald-800">{viewingRecord.childrenCount} {lang === 'en' ? 'Served' : 'હાજર'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Supervisor:' : 'સુપરવાઈઝર:'}</span>
                <span className="font-bold text-slate-800">{viewingRecord.supervisorName}</span>
              </div>
            </div>

            <button
              onClick={() => setViewingRecord(null)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'en' ? 'Close' : 'બંધ કરો'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Plus,
  Minus,
  FileCheck,
  Calendar,
  Hash,
  Clock,
  Package,
  Home,
  Trash2,
  PlusCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language, InwardItemDetail } from '../types';
import { translations } from '../data/translations';
import {
  playTransactionSuccessSound,
  playTransactionErrorSound,
  playPopClickSound
} from '../utils/audioEffects';

interface StockReceivedScreenProps {
  onBack: () => void;
  lang: Language;
  onConfirmInward: (data: {
    inwardDate: string;
    challanNo: string;
    supplier: string;
    items: InwardItemDetail[];
  }) => Promise<void>;
}

// Master list of available commodities for adding
const AVAILABLE_COMMODITIES: {
  itemId: string;
  itemNameEn: string;
  itemNameGu: string;
  unit: string;
  defaultBatchPrefix: string;
  defaultExpiry: string;
}[] = [
  { itemId: 'rice', itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', unit: 'kg', defaultBatchPrefix: 'RIC-VAD-26', defaultExpiry: '12-2027' },
  { itemId: 'atta', itemNameEn: 'Whole Wheat Atta', itemNameGu: 'ઘઉંનો લોટ', unit: 'kg', defaultBatchPrefix: 'ATT-VAD-26', defaultExpiry: '04-2027' },
  { itemId: 'oil', itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', unit: 'litre', defaultBatchPrefix: 'OIL-VAD-26', defaultExpiry: '08-2027' },
  { itemId: 'bal_shakti', itemNameEn: 'Bal Shakti Premix', itemNameGu: 'બાલ શક્તિ પૂરક આહાર', unit: 'Pack', defaultBatchPrefix: 'BAL-VAD-26', defaultExpiry: '06-2027' },
  { itemId: 'matru_shakti', itemNameEn: 'Matru Shakti Premix', itemNameGu: 'માતૃ શક્તિ પૂરક આહાર', unit: 'Pack', defaultBatchPrefix: 'MAT-VAD-26', defaultExpiry: '07-2027' },
  { itemId: 'purna_shakti', itemNameEn: 'Poon Shakti (Purna Shakti)', itemNameGu: 'પૂર્ણા શક્તિ પૂરક આહાર', unit: 'Pack', defaultBatchPrefix: 'PUR-VAD-26', defaultExpiry: '07-2027' },
  { itemId: 'dal', itemNameEn: 'Tuver Dal (Split Red Gram)', itemNameGu: 'તુવેર દાળ', unit: 'kg', defaultBatchPrefix: 'DAL-VAD-26', defaultExpiry: '10-2027' }
];

export const StockReceivedScreen: React.FC<StockReceivedScreenProps> = ({
  onBack,
  lang,
  onConfirmInward
}) => {
  const t = translations[lang];

  const [inwardDate, setInwardDate] = useState('18-Oct-2026');
  const [challanNo, setChallanNo] = useState('INW-2026-1044');
  const [supplier] = useState('District Food & Civil Supplies Godown, Anand');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<'standard' | 'custom'>('standard');

  // Custom bought item form state
  const [customTitle, setCustomTitle] = useState('');
  const [customUnit, setCustomUnit] = useState<string>('kg');
  const [customCategory, setCustomCategory] = useState<'staple' | 'packet'>('staple');
  const [customQuantity, setCustomQuantity] = useState('10');
  const [customBatchNo, setCustomBatchNo] = useState(`BUY-VAD-26-0${Math.floor(1 + Math.random() * 9)}`);
  const [customExpiry, setCustomExpiry] = useState('12-2027');
  const [customError, setCustomError] = useState<string | null>(null);

  // Each item with individual batch number and expiry date as requested
  const [items, setItems] = useState<InwardItemDetail[]>([
    {
      itemId: 'rice',
      itemName: 'Fortified Rice',
      quantity: 25,
      unit: 'kg',
      batchNo: 'RIC-VAD-26-04',
      expiryDate: '12-2027'
    },
    {
      itemId: 'atta',
      itemName: 'Whole Wheat Atta',
      quantity: 20,
      unit: 'kg',
      batchNo: 'ATT-VAD-26-11',
      expiryDate: '04-2027'
    },
    {
      itemId: 'oil',
      itemName: 'Fortified Edible Oil',
      quantity: 10,
      unit: 'litre',
      batchNo: 'OIL-VAD-26-09',
      expiryDate: '08-2027'
    },
    {
      itemId: 'bal_shakti',
      itemName: 'Bal Shakti Premix',
      quantity: 15,
      unit: 'Pack',
      batchNo: 'BAL-VAD-26-22',
      expiryDate: '06-2027'
    },
    {
      itemId: 'matru_shakti',
      itemName: 'Matru Shakti Premix',
      quantity: 10,
      unit: 'Pack',
      batchNo: 'MAT-VAD-26-18',
      expiryDate: '07-2027'
    },
    {
      itemId: 'purna_shakti',
      itemName: 'Poon Shakti (Purna Shakti)',
      quantity: 10,
      unit: 'Pack',
      batchNo: 'PUR-VAD-26-05',
      expiryDate: '07-2027'
    },
    {
      itemId: 'dal',
      itemName: 'Tuver Dal (Split Red Gram)',
      quantity: 10,
      unit: 'kg',
      batchNo: 'DAL-VAD-26-33',
      expiryDate: '10-2027'
    }
  ]);

  const getItemDisplayName = (it: InwardItemDetail) => {
    const c = AVAILABLE_COMMODITIES.find((x) => x.itemId === it.itemId);
    if (c) {
      return lang === 'gu' ? c.itemNameGu : c.itemNameEn;
    }
    return it.itemName;
  };

  const updateItem = (index: number, field: keyof InwardItemDetail, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const getGramsFactorForInward = (itemId: string): number => {
    if (itemId === 'bal_shakti') return 500;
    return 1000;
  };

  const getBaseUnitForInward = (itemId: string, itemUnit?: string): string => {
    const c = AVAILABLE_COMMODITIES.find((x) => x.itemId === itemId);
    if (c) return c.unit;
    if (itemUnit && itemUnit !== 'g') return itemUnit;
    return 'kg';
  };

  // Toggle unit between Base (kg / litre / Pack) and Grams (g)
  const handleToggleInwardUnit = (index: number) => {
    playPopClickSound();
    const it = items[index];
    const baseUnit = getBaseUnitForInward(it.itemId, it.unit);
    const factor = getGramsFactorForInward(it.itemId);

    if (it.unit === 'g') {
      const converted = Number((it.quantity / factor).toFixed(3));
      setItems((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], unit: baseUnit, quantity: converted };
        return copy;
      });
    } else {
      const converted = Number((it.quantity * factor).toFixed(1));
      setItems((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], unit: 'g', quantity: converted };
        return copy;
      });
    }
  };

  // Step quantity
  const handleStepInward = (index: number, deltaDir: 1 | -1) => {
    playPopClickSound();
    const it = items[index];
    const step = it.unit === 'g' ? 500 : 5;
    const newQty = Math.max(0, Number((it.quantity + deltaDir * step).toFixed(3)));
    updateItem(index, 'quantity', newQty);
  };

  // Quick preset addition
  const handleQuickAddInward = (index: number, addAmount: number) => {
    playPopClickSound();
    const it = items[index];
    const newQty = Math.max(0, Number((it.quantity + addAmount).toFixed(3)));
    updateItem(index, 'quantity', newQty);
  };

  // Delete item from delivery
  const handleDeleteItem = (index: number) => {
    playPopClickSound();
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Set item quantity to exactly 0 (not received)
  const handleSetZero = (index: number) => {
    playPopClickSound();
    updateItem(index, 'quantity', 0);
  };

  // Add commodity from standard warehouse list
  const handleAddCommodity = (comm: typeof AVAILABLE_COMMODITIES[0]) => {
    playPopClickSound();
    const newItem: InwardItemDetail = {
      itemId: comm.itemId,
      itemName: lang === 'gu' ? comm.itemNameGu : comm.itemNameEn,
      quantity: 10,
      unit: comm.unit,
      batchNo: `${comm.defaultBatchPrefix}-${Math.floor(10 + Math.random() * 89)}`,
      expiryDate: comm.defaultExpiry,
      category: comm.unit === 'Pack' ? 'packet' : 'staple',
      isCustom: false
    };
    setItems((prev) => [...prev, newItem]);
    setShowAddModal(false);
  };

  // Add custom bought item according to title, quantity, batch and expiry date
  const handleAddCustomBoughtItem = () => {
    if (!customTitle.trim()) {
      playTransactionErrorSound();
      setCustomError(
        lang === 'gu'
          ? 'કૃપા કરીને સામગ્રીનું નામ દાખલ કરો.'
          : 'Please enter item title / commodity name.'
      );
      return;
    }

    const qty = parseFloat(customQuantity);
    if (isNaN(qty) || qty <= 0) {
      playTransactionErrorSound();
      setCustomError(
        lang === 'gu'
          ? 'કૃપા કરીને યોગ્ય જથ્થો દાખલ કરો (૦ કરતાં વધુ).'
          : 'Please enter a valid quantity greater than 0.'
      );
      return;
    }

    playTransactionSuccessSound();
    const slug = customTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const cleanId = `bought_${slug}_${Date.now().toString().slice(-4)}`;

    const newItem: InwardItemDetail = {
      itemId: cleanId,
      itemName: customTitle.trim(),
      quantity: Number(qty.toFixed(3)),
      unit: customUnit,
      batchNo: customBatchNo.trim() || `BUY-VAD-26-0${Math.floor(1 + Math.random() * 9)}`,
      expiryDate: customExpiry.trim() || '12-2027',
      category: customCategory,
      isCustom: true
    };

    setItems((prev) => [...prev, newItem]);

    // Reset custom form
    setCustomTitle('');
    setCustomQuantity('10');
    setCustomBatchNo(`BUY-VAD-26-0${Math.floor(1 + Math.random() * 9)}`);
    setCustomExpiry('12-2027');
    setCustomError(null);
    setShowAddModal(false);
  };

  const handleConfirm = async () => {
    if (!challanNo.trim()) {
      playTransactionErrorSound();
      alert(lang === 'gu' ? 'કૃપા કરીને ચલણ નંબર દાખલ કરો.' : 'Please enter Challan Number.');
      return;
    }

    if (items.length === 0) {
      playTransactionErrorSound();
      alert(lang === 'gu' ? 'કૃપા કરીને ઓછામાં ઓછી ૧ સામગ્રી ઉમેરો.' : 'Please add at least one item.');
      return;
    }

    // Filter out 0 quantity items or confirm inward of received items
    const receivedItems = items.filter((i) => i.quantity > 0);
    const zeroItems = items.filter((i) => i.quantity === 0);

    setSubmitting(true);
    try {
      await onConfirmInward({
        inwardDate,
        challanNo,
        supplier,
        items
      });
      playTransactionSuccessSound();
      setSuccess(true);
    } catch (err) {
      playTransactionErrorSound();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Header */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs"
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
          {t.stockReceived}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'Stock Inward Register • Add/Delete Items & Zero Quantity Option'
            : 'સ્ટોક આવક રજિસ્ટર • વસ્તુ ઉમેરો/કાઢી નાખો અને શૂન્ય (૦) જથ્થો નોંધણી'}
        </p>
      </div>

      {success ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {lang === 'en' ? 'Stock Added to Centre Inventory!' : 'સ્ટોક કેન્દ્રના ભંડારમાં ઉમેરાયો!'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Challan <strong>#{challanNo}</strong> recorded for <strong>04 Vadtal Centre</strong>. All individual batch numbers and expiry dates updated and added to MIS Report.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-4">
          {/* Challan Card with Purchase Date */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {lang === 'en' ? 'Purchase/Inward Date:' : 'ખરીદી/આવક તારીખ:'}
              </span>
              <input
                type="text"
                value={inwardDate}
                onChange={(e) => setInwardDate(e.target.value)}
                className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-right text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-700" />
                {lang === 'en' ? 'Challan Number:' : 'ચલણ નંબર:'}
              </span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                {challanNo}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                {lang === 'en' ? 'Supplier Godown:' : 'પુરવઠા ગોડાઉન:'}
              </span>
              <span className="font-bold text-slate-800 text-[11px] text-right max-w-[180px] truncate">
                {lang === 'gu' ? 'જિલ્લા અન્ન અને નાગરિક પુરવઠા ગોડાઉન, આણંદ' : supplier}
              </span>
            </div>
          </div>

          {/* Action Row: Title + Add Standard Item & Add Bought Item Buttons */}
          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Received Items & Quantities' : 'આવેલ સામગ્રી અને જથ્થો'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === 'en'
                  ? 'Govt warehouse quota & custom bought items'
                  : 'સરકારી પુરવઠો અને વધારાની ખરીદેલી સામગ્રી'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  setActiveAddTab('custom');
                  setShowAddModal(true);
                }}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title={lang === 'gu' ? 'નવી ખરીદેલી સામગ્રી ઉમેરો' : 'Add Bought Item'}
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>{lang === 'en' ? '+ Bought Item' : '+ નવી ખરીદી'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  setActiveAddTab('standard');
                  setShowAddModal(true);
                }}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? '+ Quota' : '+ સરકારી'}</span>
              </button>
            </div>
          </div>

          {/* Individual items list with 0 quantity, delete, and add capabilities */}
          <div className="space-y-3">
            {items.map((item, idx) => {
              const isZero = item.quantity === 0;

              return (
                <div
                  key={item.itemId + '-' + idx}
                  className={`p-3 rounded-2xl border transition-all space-y-2.5 ${
                    isZero
                      ? 'bg-amber-50/50 border-amber-200'
                      : item.isCustom
                      ? 'bg-[#FEFCE8]/60 border-amber-200/90'
                      : 'bg-[#F8FAFC] border-slate-200'
                  }`}
                >
                  {/* Item Header & Unit Selection Toggle */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isZero
                            ? 'bg-amber-100 text-amber-800'
                            : item.isCustom
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100/70 text-emerald-800'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {getItemDisplayName(item)}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                              {lang === 'gu' ? 'ખરીદેલી વસ્તુ' : 'Bought Item'}
                            </span>
                          )}
                          {isZero && (
                            <span className="text-[9.5px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                              {lang === 'gu' ? '૦ નથી મળેલ' : '0 Not Received'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unit Switcher: Base (kg/litre/Pack) vs Grams (g) */}
                    <div className="inline-flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.unit === 'g') handleToggleInwardUnit(idx);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          item.unit !== 'g'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {getBaseUnitForInward(item.itemId)}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.unit !== 'g') handleToggleInwardUnit(idx);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          item.unit === 'g'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'gu' ? 'ગ્રામ (g)' : 'Grams (g)'}
                      </button>
                    </div>
                  </div>

                  {/* Quantity Stepper & Direct Typing Input & Quick Zero & Delete */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    {/* Live Equivalent Conversion Badge */}
                    <div className="min-w-0">
                      {item.quantity > 0 ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold">
                          <span>=</span>
                          <span>
                            {item.unit === 'g'
                              ? `${(item.quantity / getGramsFactorForInward(item.itemId)).toFixed(3)} ${getBaseUnitForInward(item.itemId)}`
                              : `${(item.quantity * getGramsFactorForInward(item.itemId)).toLocaleString()} g`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-semibold">
                          {lang === 'gu' ? 'જથ્થો: ૦ (નથી મળેલ)' : 'Quantity: 0 (Not Received)'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Set 0 quick button if > 0 */}
                      {item.quantity > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetZero(idx)}
                          className="px-1.5 py-1 text-[10px] font-bold text-slate-500 hover:text-amber-800 hover:bg-amber-100/80 rounded-md transition-colors cursor-pointer"
                          title={lang === 'gu' ? '૦ કરો (નથી મળેલ)' : 'Set to 0 (Not Received)'}
                        >
                          = 0
                        </button>
                      )}

                      {/* Stepper with typable figure input */}
                      <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-300 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleStepInward(idx, -1)}
                          className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                          title={item.unit === 'g' ? '-500g' : '-5'}
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>

                        <div className="flex items-center px-1">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={item.quantity === 0 ? '' : item.quantity}
                            placeholder="0"
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              updateItem(idx, 'quantity', isNaN(val) || val < 0 ? 0 : val);
                            }}
                            className={`w-14 sm:w-18 text-center font-black text-xs sm:text-sm focus:outline-none ${
                              isZero ? 'text-amber-700' : 'text-slate-900'
                            }`}
                          />
                          <span className="text-[10.5px] font-bold text-slate-500 pr-0.5 select-none">
                            {item.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStepInward(idx, 1)}
                          className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                          title={item.unit === 'g' ? '+500g' : '+5'}
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        title={lang === 'gu' ? 'આ વસ્તુ કાઢી નાખો' : 'Delete Item'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quick-add preset chips for inward delivery */}
                  <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {lang === 'gu' ? 'ઝડપી:' : 'Quick:'}
                    </span>
                    {item.unit === 'g' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 500)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +500g
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 1000)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +1,000g (1kg)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 5000)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +5,000g (5kg)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 25000)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +25,000g (25kg)
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 1)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 5)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 10)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddInward(idx, 25)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +25
                        </button>
                      </>
                    )}
                  </div>

                  {/* Batch Number & Expiry Inputs */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        {lang === 'en' ? 'Batch No.' : 'બેચ નંબર'}
                      </label>
                      <input
                        type="text"
                        value={item.batchNo}
                        onChange={(e) => updateItem(idx, 'batchNo', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-800 text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        {lang === 'en' ? 'Expiry Date' : 'સમાપ્તિ તારીખ'}
                      </label>
                      <input
                        type="text"
                        value={item.expiryDate}
                        onChange={(e) => updateItem(idx, 'expiryDate', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 text-[11px] focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <p className="text-xs font-bold text-slate-700">
                {lang === 'gu' ? 'તમામ વસ્તુઓ દૂર કરવામાં આવી છે' : 'All items removed'}
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800"
              >
                + {lang === 'gu' ? 'સામગ્રી ઉમેરો' : 'Add Item'}
              </button>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={submitting || items.length === 0}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            <FileCheck className="w-4 h-4 stroke-[2.5]" />
            <span>
              {submitting
                ? t.syncing
                : lang === 'en'
                ? 'Confirm & Inward All Batches'
                : 'તમામ બેચ ચકાસો અને સ્ટોકમાં જમા કરો'}
            </span>
          </button>
        </div>
      )}

      {/* ================= MODAL: ADD ITEM (QUOTA OR CUSTOM BOUGHT) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-sm">
                  {lang === 'gu' ? 'સ્ટોક આવકમાં સામગ્રી ઉમેરો' : 'Add Item to Inward Register'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="flex items-center p-2 bg-slate-100 border-b border-slate-200 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  setActiveAddTab('custom');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeAddTab === 'custom'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? '+ નવી ખરીદેલી સામગ્રી' : '+ Bought Item (New)'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopClickSound();
                  setActiveAddTab('standard');
                }}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeAddTab === 'standard'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>{lang === 'gu' ? 'સરકારી ગોડાઉન જથ્થો' : 'Govt Warehouse Quota'}</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 overflow-y-auto">
              {activeAddTab === 'custom' ? (
                /* TAB 2: ADD NEW CUSTOM BOUGHT ITEM FORM */
                <div className="space-y-3.5">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900 leading-snug">
                    <span className="font-bold">
                      {lang === 'gu' ? '💡 નવી સામગ્રી આપોઆપ સંતુલનમાં ઉમેરાશે:' : '💡 New bought item will be added to balance:'}
                    </span>{' '}
                    {lang === 'gu'
                      ? 'તમે જે પણ નવી વસ્તુ ખરીદી હોય તેનું નામ, જથ્થો, બેચ અને એક્સપાયરી આપો. તે આપોઆપ ભંડાર બેલેન્સ અને વપરાશ પેજમાં નોંધાઈ જશે.'
                      : 'Provide title, quantity, batch and expiry. It will be added to Balance & will appear in Usage Screen.'}
                  </div>

                  {customError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{customError}</span>
                    </div>
                  )}

                  {/* 1. Title / Name of the item */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                      {lang === 'gu' ? '૧. સામગ્રીનું નામ / શીર્ષક *' : '1. Title / Name of Item *'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        lang === 'gu'
                          ? 'દા.ત. ચણા દાળ, ગોળ, લીલા મગ, સીંગદાણા, દૂધ...'
                          : 'e.g. Chana Dal, Jaggery / Gol, Peanuts, Green Moong...'
                      }
                      value={customTitle}
                      onChange={(e) => {
                        setCustomTitle(e.target.value);
                        if (customError) setCustomError(null);
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />

                    {/* Quick suggestion tags */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
                      <span className="text-[9.5px] text-slate-400 font-semibold shrink-0">
                        {lang === 'gu' ? 'ઝડપી નામ:' : 'Suggestions:'}
                      </span>
                      {[
                        { en: 'Chana Dal', gu: 'ચણા દાળ' },
                        { en: 'Jaggery (Gol)', gu: 'ગોળ (Jaggery)' },
                        { en: 'Green Moong', gu: 'લીલા મગ' },
                        { en: 'Peanuts', gu: 'સીંગદાણા' },
                        { en: 'Milk Powder', gu: 'દૂધ પાવડર' },
                        { en: 'Ragi Flour', gu: 'રાગી લોટ' },
                        { en: 'Spices & Salt', gu: 'મસાલા / મીઠું' }
                      ].map((sugg) => (
                        <button
                          key={sugg.en}
                          type="button"
                          onClick={() => {
                            setCustomTitle(lang === 'gu' ? sugg.gu : sugg.en);
                            if (customError) setCustomError(null);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-[10px] font-semibold text-slate-700 hover:text-emerald-800 border border-slate-200 shrink-0 cursor-pointer transition-colors"
                        >
                          {lang === 'gu' ? sugg.gu : sugg.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Unit and Category */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                        {lang === 'gu' ? '૨. એકમ (Unit) *' : '2. Unit *'}
                      </label>
                      <select
                        value={customUnit}
                        onChange={(e) => {
                          const u = e.target.value;
                          setCustomUnit(u);
                          if (u === 'Pack' || u === 'Pieces') {
                            setCustomCategory('packet');
                          } else {
                            setCustomCategory('staple');
                          }
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      >
                        <option value="kg">{lang === 'gu' ? 'કિલો (kg)' : 'kg (Kilogram)'}</option>
                        <option value="litre">{lang === 'gu' ? 'લિટર (litre)' : 'litre (Litre)'}</option>
                        <option value="Pack">{lang === 'gu' ? 'પેકેટ (Pack)' : 'Pack (Packet)'}</option>
                        <option value="g">{lang === 'gu' ? 'ગ્રામ (g)' : 'g (Grams)'}</option>
                        <option value="Pieces">{lang === 'gu' ? 'નંગ (Pieces)' : 'Pieces / Nos'}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                        {lang === 'gu' ? 'પ્રકાર (Category)' : 'Category'}
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value as 'staple' | 'packet')}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      >
                        <option value="staple">{lang === 'gu' ? 'કાચું અનાજ (Staple)' : 'Raw Staple'}</option>
                        <option value="packet">{lang === 'gu' ? 'પેકેટ (Packet)' : 'Pre-packed'}</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Quantity of the item */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                      {lang === 'gu' ? '૩. સામગ્રીનો જથ્થો (Quantity) *' : '3. Quantity of Item *'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 10"
                        value={customQuantity}
                        onChange={(e) => {
                          setCustomQuantity(e.target.value);
                          if (customError) setCustomError(null);
                        }}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs tabular-nums"
                      />
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                        {customUnit}
                      </span>
                    </div>

                    {/* Quick quantity addition buttons */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {['1', '5', '10', '25', '50'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setCustomQuantity(preset);
                            if (customError) setCustomError(null);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-[10.5px] font-bold text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors cursor-pointer"
                        >
                          {preset} {customUnit}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Batch Number & 5. Expiry Date */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                        {lang === 'gu' ? '૪. બેચ નંબર (Batch No.)' : '4. Batch Number'}
                      </label>
                      <input
                        type="text"
                        placeholder="BUY-VAD-26-01"
                        value={customBatchNo}
                        onChange={(e) => setCustomBatchNo(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                        {lang === 'gu' ? '૫. સમાપ્તિ તારીખ (Expiry)' : '5. Expiry Date'}
                      </label>
                      <input
                        type="text"
                        placeholder="MM-YYYY (e.g. 12-2027)"
                        value={customExpiry}
                        onChange={(e) => setCustomExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Submit Button for Custom Item */}
                  <button
                    type="button"
                    onClick={handleAddCustomBoughtItem}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all mt-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>
                      {lang === 'gu'
                        ? '✓ આ ખરીદેલી વસ્તુ આવક યાદીમાં ઉમેરો'
                        : '✓ Add This Bought Item to Inward'}
                    </span>
                  </button>
                </div>
              ) : (
                /* TAB 1: STANDARD WAREHOUSE QUOTA LIST */
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 mb-1 font-medium">
                    {lang === 'gu'
                      ? 'સરકારી પુરવઠા ચલણમાંથી આવેલ સામગ્રી પસંદ કરો:'
                      : 'Select commodity received from warehouse quota:'}
                  </p>

                  {AVAILABLE_COMMODITIES.map((comm) => {
                    const alreadyAdded = items.some((i) => i.itemId === comm.itemId);
                    return (
                      <button
                        key={comm.itemId}
                        type="button"
                        onClick={() => handleAddCommodity(comm)}
                        className="w-full p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                      >
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                            {lang === 'gu' ? comm.itemNameGu : comm.itemNameEn}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            Unit: {comm.unit} • Expiry: {comm.defaultExpiry}
                          </span>
                        </div>

                        <span className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 group-hover:bg-emerald-800">
                          <Plus className="w-3 h-3" />
                          {lang === 'gu' ? 'ઉમેરો' : 'Add'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
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

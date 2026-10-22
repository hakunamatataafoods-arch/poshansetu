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

  const updateItem = (index: number, field: keyof InwardItemDetail, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
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

  // Add commodity to inward list
  const handleAddCommodity = (comm: typeof AVAILABLE_COMMODITIES[0]) => {
    playPopClickSound();
    const newItem: InwardItemDetail = {
      itemId: comm.itemId,
      itemName: lang === 'gu' ? comm.itemNameGu : comm.itemNameEn,
      quantity: 10,
      unit: comm.unit,
      batchNo: `${comm.defaultBatchPrefix}-${Math.floor(10 + Math.random() * 89)}`,
      expiryDate: comm.defaultExpiry
    };
    setItems((prev) => [...prev, newItem]);
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
                {supplier}
              </span>
            </div>
          </div>

          {/* Action Row: Title + Add Item Button */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'en' ? 'Received Items & Quantities' : 'આવેલ સામગ્રી અને જથ્થો'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === 'en'
                  ? 'Set 0 if not received, or delete/add items'
                  : 'નથી મળેલ વસ્તુ માટે ૦ દાખલ કરો અથવા ડિલીટ કરો'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                playPopClickSound();
                setShowAddModal(true);
              }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? '+ Add Item' : '+ નવી વસ્તુ'}</span>
            </button>
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
                      : 'bg-[#F8FAFC] border-slate-200'
                  }`}
                >
                  {/* Item Header & Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isZero
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100/70 text-emerald-800'
                        }`}
                      >
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-xs block truncate">
                          {item.itemName}
                        </span>
                        {isZero && (
                          <span className="text-[9.5px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                            {lang === 'gu' ? '૦ નથી મળેલ' : '0 Not Received'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Direct 0 Button & Delete */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Set 0 quick button if > 0 */}
                      {item.quantity > 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetZero(idx)}
                          className="px-1.5 py-1 text-[10px] font-bold text-slate-500 hover:text-amber-800 hover:bg-amber-100/80 rounded-md transition-colors"
                          title={lang === 'gu' ? '૦ કરો (નથી મળેલ)' : 'Set to 0 (Not Received)'}
                        >
                          = 0
                        </button>
                      )}

                      {/* Stepper with 0 support */}
                      <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            playPopClickSound();
                            updateItem(idx, 'quantity', Math.max(0, item.quantity - 5));
                          }}
                          className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs"
                          title="-5"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            updateItem(idx, 'quantity', isNaN(val) || val < 0 ? 0 : val);
                          }}
                          className={`w-10 text-center font-bold text-xs focus:outline-none ${
                            isZero ? 'text-amber-700' : 'text-slate-900'
                          }`}
                        />
                        <span className="text-[10px] text-slate-500 pr-1">{item.unit}</span>

                        <button
                          type="button"
                          onClick={() => {
                            playPopClickSound();
                            updateItem(idx, 'quantity', item.quantity + 5);
                          }}
                          className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs"
                          title="+5"
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

      {/* ================= MODAL: ADD NEW ITEM TO INWARD ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom flex flex-col max-h-[85vh]">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm">
                  {lang === 'gu' ? 'આવક માટે નવી સામગ્રી ઉમેરો' : 'Add Received Item to Inward'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 overflow-y-auto">
              <p className="text-xs text-slate-600 mb-2 font-medium">
                {lang === 'gu'
                  ? 'ગોડાઉનમાંથી આવેલ વધારાની સામગ્રી પસંદ કરો:'
                  : 'Select commodity received from warehouse challan:'}
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

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
              >
                {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

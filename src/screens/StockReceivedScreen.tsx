import React, { useState } from 'react';
import { ArrowLeft, Truck, CheckCircle2, Plus, Minus, FileCheck, Calendar, Hash, Clock, Package } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language, InwardItemDetail } from '../types';
import { translations } from '../data/translations';

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

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirmInward({
        inwardDate,
        challanNo,
        supplier,
        items
      });
      setSuccess(true);
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
            ? 'Stock Inward Register • Batch No. & Expiry Entry'
            : 'સ્ટોક આવક રજિસ્ટર • બેચ નંબર અને સમાપ્તિ તારીખ નોંધણી'}
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
            className="w-full py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs rounded-xl transition-colors"
          >
            {lang === 'en' ? 'Return to Home' : 'મુખ્ય પેજ પર પાછા જાઓ'}
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

          <div className="flex items-center justify-between pt-1">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Item Batches & Expiry Dates' : 'વસ્તુ મુજબ બેચ નંબર અને સમાપ્તિ તારીખ'}
            </h3>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {items.length} Items
            </span>
          </div>

          {/* Individual items with batch numbers and expiry dates */}
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.itemId}
                className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-200 space-y-2.5"
              >
                {/* Item Name & Quantity Stepper */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900 text-xs">
                      {item.itemName}
                    </span>
                  </div>

                  <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateItem(idx, 'quantity', Math.max(1, item.quantity - 5))}
                      className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="w-14 text-center font-bold text-slate-900 text-xs tabular-nums">
                      +{item.quantity} {item.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(idx, 'quantity', item.quantity + 5)}
                      className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
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
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
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
    </div>
  );
};

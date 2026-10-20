import React, { useState } from 'react';
import {
  ArrowLeft,
  Package,
  Camera,
  CheckCircle2,
  ChevronDown,
  Plus,
  Minus,
  Home,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  AlertCircle,
  X,
  PackageX,
  Info
} from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language, InventoryItem } from '../types';
import { translations } from '../data/translations';

interface StockUsageScreenProps {
  onBack: () => void;
  lang: Language;
  currentTotalStock: number;
  inventory?: InventoryItem[];
  onConfirmDistribution: (record: {
    beneficiaryName: string;
    beneficiaryCategory: string;
    photoAttached: boolean;
    distributedItems: Record<string, number>;
  }) => Promise<void>;
}

interface AlertNotificationState {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  unit: string;
  availableStock: number;
  requestedStock?: number;
  type: 'out_of_stock' | 'limit_exceeded' | 'validation_error';
}

export const StockUsageScreen: React.FC<StockUsageScreenProps> = ({
  onBack,
  lang,
  currentTotalStock,
  inventory = [],
  onConfirmDistribution
}) => {
  const t = translations[lang];

  const beneficiaries = [
    { name: 'Surbhi Rawat', category: 'Lactating Mother (LM)' },
    { name: 'Shreeya Dube', category: 'Pregnant Woman (PW)' },
    { name: 'Priti Arora', category: 'Lactating Mother (LM)' },
    { name: 'Aarav Patel', category: 'Child (6m-3 yrs)' },
    { name: 'Kiranben Solanki', category: 'Pregnant Woman (PW)' }
  ];

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>('');
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [lastDistributedSummary, setLastDistributedSummary] = useState<{
    beneficiary: string;
    category: string;
    photoAttached: boolean;
    items: Record<string, number>;
    remaining: number;
  } | null>(null);

  // Pop notification modal state for stock out or exceeding available stock
  const [alertNotification, setAlertNotification] = useState<AlertNotificationState | null>(null);

  // Fallback defaults if inventory is empty
  const defaultInventoryMap: Record<string, number> = {
    rice: 40,
    oil: 12,
    bal_shakti: 18,
    matru_shakti: 24,
    purna_shakti: 6,
    atta: 50
  };

  const getItemStock = (invId: string): number => {
    const found = inventory.find((i) => i.id === invId);
    if (found) return found.currentStock;
    return defaultInventoryMap[invId] ?? 0;
  };

  const itemsConfig = [
    { key: 'Rice', invId: 'rice', label: t.rice, unit: t.kg },
    { key: 'Oil', invId: 'oil', label: t.oil, unit: t.litre },
    { key: 'Bal Shakti', invId: 'bal_shakti', label: t.balShakti, unit: t.pack },
    { key: 'Matru Shakti', invId: 'matru_shakti', label: t.matruShakti, unit: t.pack },
    { key: 'Purna Shakti', invId: 'purna_shakti', label: t.purnaShakti, unit: t.pack },
    { key: 'Atta', invId: 'atta', label: t.atta, unit: t.kg }
  ];

  // Initialize quantities: if stock is 0, start at 0, otherwise start at 1 (or max available)
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    itemsConfig.forEach((item) => {
      const stock = getItemStock(item.invId);
      initial[item.key] = stock > 0 ? Math.min(1, stock) : 0;
    });
    return initial;
  });

  const formatRemainingBalance = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(3);
  };

  // Quantity Change Handler with Live Stock Availability Checks & Pop Notification
  const handleQtyChange = (key: string, delta: number) => {
    const itemConf = itemsConfig.find((c) => c.key === key);
    if (!itemConf) return;

    const availableStock = getItemStock(itemConf.invId);
    const currentQty = quantities[key] || 0;

    // Decreasing
    if (delta < 0) {
      setQuantities((prev) => ({
        ...prev,
        [key]: Math.max(0, currentQty + delta)
      }));
      return;
    }

    // Increasing: Check if stock is completely 0 (Out of stock)
    if (availableStock <= 0) {
      setAlertNotification({
        isOpen: true,
        type: 'out_of_stock',
        itemName: itemConf.label,
        unit: itemConf.unit,
        availableStock: 0,
        requestedStock: 1,
        title: lang === 'gu' ? 'સ્ટોક ખાલી છે (Item Out of Stock)!' : 'Item Out of Stock!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો સ્ટોક આંગણવાડી કેન્દ્રમાં સંપૂર્ણપણે ખાલી (૦ ${itemConf.unit}) છે! જ્યાં સુધી નવો જથ્થો પ્રાપ્ત ન થાય ત્યાં સુધી આ સામગ્રીનું વિતરણ થઈ શકશે નહીં.`
            : `${itemConf.label} is currently completely OUT OF STOCK (0 ${itemConf.unit} available) at AWC 04 Vadtal. You cannot distribute this item until new stock is received.`
      });
      return;
    }

    // Increasing: Check if selecting beyond available stock
    const nextQty = currentQty + delta;
    if (nextQty > availableStock) {
      setAlertNotification({
        isOpen: true,
        type: 'limit_exceeded',
        itemName: itemConf.label,
        unit: itemConf.unit,
        availableStock,
        requestedStock: nextQty,
        title: lang === 'gu' ? 'સ્ટોક મર્યાદા ઓળંગાઈ ગઈ (Stock Limit Reached)!' : 'Stock Limit Exceeded!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો કેન્દ્રમાં માત્ર ${formatRemainingBalance(availableStock)} ${itemConf.unit} સ્ટોક ઉપલબ્ધ છે. ઉપલબ્ધ જથ્થા કરતાં વધુ (${nextQty} ${itemConf.unit}) પસંદ કરી શકાતો નથી.`
            : `Only ${formatRemainingBalance(availableStock)} ${itemConf.unit} of ${itemConf.label} is available in stock. You cannot select beyond the available stock limit.`
      });
      return;
    }

    // Normal increment within available stock
    setQuantities((prev) => ({
      ...prev,
      [key]: nextQty
    }));
  };

  const totalDeductedUnits = Object.values(quantities).reduce((a, b) => a + b, 0);
  const remainingStock = Math.max(0, currentTotalStock - totalDeductedUnits);

  const handleConfirm = async () => {
    if (!selectedBeneficiary) {
      setAlertNotification({
        isOpen: true,
        type: 'validation_error',
        itemName: '',
        unit: '',
        availableStock: 0,
        title: lang === 'gu' ? 'લાભાર્થી પસંદ કરો' : 'Beneficiary Required',
        message:
          lang === 'gu'
            ? 'કૃપા કરીને વિતરણ નોંધતા પહેલા લાભાર્થીનું નામ પસંદ કરો.'
            : 'Please select a beneficiary name before confirming distribution.'
      });
      return;
    }

    if (totalDeductedUnits <= 0) {
      setAlertNotification({
        isOpen: true,
        type: 'validation_error',
        itemName: '',
        unit: '',
        availableStock: 0,
        title: lang === 'gu' ? 'સામગ્રી જથ્થો પસંદ કરો' : 'No Items Selected',
        message:
          lang === 'gu'
            ? 'કૃપા કરીને વિતરણ માટે ઓછામાં ઓછી એક સામગ્રીનો જથ્થો પસંદ કરો.'
            : 'Please select a quantity greater than zero for at least one item to distribute.'
      });
      return;
    }

    // Strict validation against available stock
    for (const item of itemsConfig) {
      const selected = quantities[item.key] || 0;
      const stock = getItemStock(item.invId);

      if (selected > 0 && stock <= 0) {
        setAlertNotification({
          isOpen: true,
          type: 'out_of_stock',
          itemName: item.label,
          unit: item.unit,
          availableStock: 0,
          requestedStock: selected,
          title: lang === 'gu' ? 'સ્ટોક ખાલી છે!' : 'Item Out of Stock!',
          message:
            lang === 'gu'
              ? `${item.label} નો સ્ટોક ખાલી હોવાથી વિતરણ કરી શકાતું નથી. કૃપા કરીને જથ્થો ૦ કરો.`
              : `${item.label} is completely out of stock. Please remove this item (set to 0) to proceed.`
        });
        return;
      }

      if (selected > stock) {
        setAlertNotification({
          isOpen: true,
          type: 'limit_exceeded',
          itemName: item.label,
          unit: item.unit,
          availableStock: stock,
          requestedStock: selected,
          title: lang === 'gu' ? 'સ્ટોક મર્યાદા બહાર!' : 'Stock Limit Exceeded!',
          message:
            lang === 'gu'
              ? `${item.label} માટે પસંદ કરેલ જથ્થો (${selected} ${item.unit}) ઉપલબ્ધ સ્ટોક (${formatRemainingBalance(stock)} ${item.unit}) કરતાં વધારે છે!`
              : `Selected quantity (${selected} ${item.unit}) for ${item.label} exceeds available stock (${formatRemainingBalance(stock)} ${item.unit})!`
        });
        return;
      }
    }

    setSubmitting(true);
    const beneObj = beneficiaries.find((b) => b.name === selectedBeneficiary);
    const category = beneObj ? beneObj.category : 'General';
    const distributedSnapshot = { ...quantities };

    try {
      await onConfirmDistribution({
        beneficiaryName: selectedBeneficiary,
        beneficiaryCategory: category,
        photoAttached: photoUploaded,
        distributedItems: distributedSnapshot
      });

      setLastDistributedSummary({
        beneficiary: selectedBeneficiary,
        category,
        photoAttached: photoUploaded,
        items: distributedSnapshot,
        remaining: remainingStock
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Top Header & Brand Bar */}
      <div className="relative flex flex-col items-center">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs cursor-pointer"
          aria-label={t.back}
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center Logo & Tagline */}
        <div className="flex flex-col items-center pt-0.5">
          <PoshanSetuLogo size="sm" />
          <span className="text-[12px] font-semibold text-[#15803D] tracking-tight mt-0.5">
            {t.tagline}
          </span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="text-center pt-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.stockUsageTitle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {t.distributionSubtext}
        </p>
      </div>

      {/* Distribution Success Card with Return to Home Page */}
      {success && lastDistributedSummary ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Item Distributed Successfully!' : 'સામગ્રી સફળતાપૂર્વક વિતરણ થઈ ગઈ છે!'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'en'
                ? `Take-Home Ration (THR) distributed to ${lastDistributedSummary.beneficiary}`
                : `લાભાર્થી ${lastDistributedSummary.beneficiary} ને આહાર વિતરણ સફળતાપૂર્વક નોંધાઈ ગયું છે.`}
            </p>
          </div>

          {/* Detailed Summary Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? 'Beneficiary:' : 'લાભાર્થી:'}
              </span>
              <span className="font-bold text-slate-900">
                {lastDistributedSummary.beneficiary}
                <span className="text-[10px] text-slate-500 font-normal block text-right">
                  {lastDistributedSummary.category}
                </span>
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-semibold block">
                {lang === 'en' ? 'Items Distributed:' : 'વિતરિત સામગ્રી:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(lastDistributedSummary.items)
                  .filter(([_, qty]) => qty > 0)
                  .map(([name, qty]) => {
                    const itemConf = itemsConfig.find((c) => c.key === name);
                    const unit = itemConf ? itemConf.unit : '';
                    const label = itemConf ? itemConf.label : name;
                    return (
                      <span
                        key={name}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold"
                      >
                        {label}: {formatRemainingBalance(qty)} {unit}
                      </span>
                    );
                  })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? 'Photo Verification:' : 'ફોટો ચકાસણી:'}
              </span>
              <span className="font-bold text-emerald-700">
                {lastDistributedSummary.photoAttached
                  ? lang === 'en' ? '✓ Verified & Attached' : '✓ ચકાસાયેલ અને જોડાયેલ'
                  : lang === 'en' ? 'Not Attached' : 'જોડેલ નથી'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-slate-500 font-semibold">
                {lang === 'en' ? 'Remaining Centre Stock:' : 'કેન્દ્રમાં બાકી સ્ટોક:'}
              </span>
              <span className="font-black text-emerald-800 text-sm">
                {formatRemainingBalance(lastDistributedSummary.remaining)} Units
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {lang === 'en'
              ? 'The distribution has been updated in the POSHAN 2.0 register and logged for Supervisor audit.'
              : 'આ વિતરણ પોષણ ૨.૦ રજિસ્ટરમાં નોંધાઈ ગયું છે અને સુપરવાઈઝર ઓડિટ માટે સિંક થયેલ છે.'}
          </p>

          {/* Return to Home Page Button */}
          <button
            onClick={onBack}
            className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Home className="w-4 h-4 stroke-[2.2]" />
            <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
          </button>
        </div>
      ) : (
        /* Main Entry Card */
        <div className="bg-white rounded-[26px] p-4.5 border border-slate-200/80 shadow-xs space-y-4">
          {/* Header: Item Distributed Entry */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Package className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {t.itemDistributedEntry}
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
              AWC 04 Vadtal
            </span>
          </div>

          {/* Beneficiary Name Row */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-800 shrink-0">
              {t.beneficiaryName}
            </label>
            <div className="relative flex-1 max-w-[210px]">
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-900 font-semibold text-xs rounded-xl px-3 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-8 shadow-2xs"
              >
                <option value="">{t.selectBeneficiary}</option>
                {beneficiaries.map((b) => (
                  <option key={b.name} value={b.name}>
                    {b.name} ({b.category.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Beneficiary Photo Row */}
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-slate-800 shrink-0">
              {t.beneficiaryPhoto}
            </label>
            <button
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className={`flex-1 max-w-[210px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                photoUploaded
                  ? 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
                  : 'bg-[#EAF7EE] text-emerald-800 border-emerald-200/80 hover:bg-[#dcf4e2]'
              }`}
            >
              {photoUploaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.photoUploaded}</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>{t.uploadBtn}</span>
                </>
              )}
            </button>
          </div>

          {/* Items Distributed List Subheader & Live Stock Status Info */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {t.itemsDistributedList}
            </h3>
            <span className="text-[10px] font-medium text-slate-500">
              {lang === 'gu' ? 'ઉપલબ્ધ સ્ટોક ચકાસણી સક્રિય' : 'Live Stock Guard Active'}
            </span>
          </div>

          {/* The 6 Items with Steppers and Live Available Stock & Stock Limit Guards */}
          <div className="space-y-3">
            {itemsConfig.map((item) => {
              const qty = quantities[item.key] || 0;
              const availableStock = getItemStock(item.invId);
              const isOutOfStock = availableStock <= 0;
              const isAtMaxStock = availableStock > 0 && qty >= availableStock;

              return (
                <div
                  key={item.key}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isOutOfStock
                      ? 'bg-rose-50/60 border-rose-200'
                      : isAtMaxStock
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/70 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Item Name & Stock Status Badge */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">
                          {item.label}
                        </span>
                        {isOutOfStock && (
                          <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                            {lang === 'gu' ? 'સ્ટોક ખાલી' : 'Out of Stock'}
                          </span>
                        )}
                        {isAtMaxStock && (
                          <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                            {lang === 'gu' ? 'મહત્તમ સ્ટોક' : 'Max Available'}
                          </span>
                        )}
                      </div>

                      {/* Stock availability info */}
                      <div className="text-[11px] text-slate-500 font-medium">
                        {isOutOfStock ? (
                          <span className="text-rose-600 font-semibold">
                            {lang === 'gu' ? '૦ ઉપલબ્ધ (વિતરણ અશક્ય)' : '0 available in stock'}
                          </span>
                        ) : (
                          <>
                            <span>{lang === 'gu' ? 'કેન્દ્રમાં ઉપલબ્ધ: ' : 'Available Stock: '}</span>
                            <span className="font-bold text-emerald-800">
                              {formatRemainingBalance(availableStock)} {item.unit}
                            </span>
                            {qty > 0 && (
                              <span className="text-slate-400 ml-1">
                                • {lang === 'gu' ? 'બાકી રહેશે: ' : 'Remains: '}
                                <strong className="text-slate-700">
                                  {formatRemainingBalance(Math.max(0, availableStock - qty))}
                                </strong>
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stepper with click feedback that pops notification on limit / stock out */}
                    <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-2xs">
                      <button
                        onClick={() => handleQtyChange(item.key, -1)}
                        disabled={qty <= 0}
                        className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-30 disabled:hover:bg-emerald-50 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                        aria-label={`Decrease ${item.label}`}
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <span
                        className={`w-16 text-center font-black text-xs tabular-nums ${
                          isOutOfStock
                            ? 'text-rose-600'
                            : isAtMaxStock
                            ? 'text-amber-800'
                            : 'text-slate-900'
                        }`}
                      >
                        {formatRemainingBalance(qty)} {item.unit}
                      </span>

                      <button
                        onClick={() => handleQtyChange(item.key, 1)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : isAtMaxStock
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        aria-label={`Increase ${item.label}`}
                        title={
                          isOutOfStock
                            ? 'Item is out of stock'
                            : isAtMaxStock
                            ? 'Maximum available stock reached'
                            : 'Increase quantity'
                        }
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm & Record Button */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <span>{submitting ? t.syncing : t.confirmAndRecord}</span>
          </button>
        </div>
      )}

      {/* Bottom Summary Card: Remaining Balance Calculation */}
      {!success && (
        <div className="bg-[#EAF7EE] rounded-2xl p-4 border border-emerald-100/90 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-2xs shrink-0">
              <Home className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-snug">
                {t.remainingBalanceAfterDist}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {lang === 'gu'
                  ? 'દરેક વિતરણ પછી બાકી સ્ટોક આપમેળે ગણાઈ જાય છે'
                  : 'Automated 3-decimal precision balance calculation'}
              </span>
            </div>
          </div>

          <div className="text-right pl-3 border-l border-emerald-200/60">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t.currentStock}
            </span>
            <span className="text-2xl font-black text-[#15803D] tabular-nums leading-none">
              {formatRemainingBalance(remainingStock)}
            </span>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* Pop End Notification Modal: Item Out of Stock or Quantity Exceeded */}
      {/* ==================================================================== */}
      {alertNotification && alertNotification.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 relative">
            {/* Close Button Top Right */}
            <button
              onClick={() => setAlertNotification(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Notification Icon & Header */}
            <div className="flex items-center gap-3 pt-1">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                  alertNotification.type === 'out_of_stock'
                    ? 'bg-rose-100 text-rose-700 ring-4 ring-rose-50'
                    : alertNotification.type === 'limit_exceeded'
                    ? 'bg-amber-100 text-amber-800 ring-4 ring-amber-50'
                    : 'bg-emerald-100 text-emerald-800 ring-4 ring-emerald-50'
                }`}
              >
                {alertNotification.type === 'out_of_stock' ? (
                  <PackageX className="w-6 h-6 stroke-[2.2]" />
                ) : alertNotification.type === 'limit_exceeded' ? (
                  <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <AlertCircle className="w-6 h-6 stroke-[2.2]" />
                )}
              </div>

              <div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider block ${
                    alertNotification.type === 'out_of_stock'
                      ? 'text-rose-700'
                      : alertNotification.type === 'limit_exceeded'
                      ? 'text-amber-800'
                      : 'text-slate-600'
                  }`}
                >
                  {alertNotification.type === 'out_of_stock'
                    ? lang === 'gu' ? 'સ્ટોક ખાલી સૂચના' : 'Out of Stock Warning'
                    : alertNotification.type === 'limit_exceeded'
                    ? lang === 'gu' ? 'મહત્તમ સ્ટોક મર્યાદા' : 'Stock Limit Exceeded'
                    : lang === 'gu' ? 'જરૂરી ચકાસણી' : 'Validation Alert'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {alertNotification.title}
                </h3>
              </div>
            </div>

            {/* Detailed Notification Message Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {alertNotification.message}
              </p>

              {alertNotification.itemName && (
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">
                    {lang === 'gu' ? 'સામગ્રી:' : 'Item:'}
                  </span>
                  <span className="font-bold text-slate-900">
                    {alertNotification.itemName}
                  </span>
                </div>
              )}

              {alertNotification.type !== 'validation_error' && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-semibold">
                    {lang === 'gu' ? 'કેન્દ્રમાં ઉપલબ્ધ જથ્થો:' : 'Available in Centre:'}
                  </span>
                  <span
                    className={`font-black ${
                      alertNotification.availableStock <= 0
                        ? 'text-rose-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {formatRemainingBalance(alertNotification.availableStock)}{' '}
                    {alertNotification.unit}
                  </span>
                </div>
              )}

              {alertNotification.requestedStock !== undefined &&
                alertNotification.requestedStock > 0 && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">
                      {lang === 'gu' ? 'તમે પસંદ કરેલ જથ્થો:' : 'Attempted Quantity:'}
                    </span>
                    <span className="font-black text-rose-600">
                      {alertNotification.requestedStock} {alertNotification.unit}
                    </span>
                  </div>
                )}
            </div>

            {/* Official Guidance Note */}
            <div className="flex items-start gap-2 text-[10.5px] text-slate-500">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                {lang === 'gu'
                  ? 'પોષણ ૨.૦ નિયમ મુજબ ઉપલબ્ધ સ્ટોક કરતાં વધુ અથવા સ્ટોક ખાલી હોય તેવી સામગ્રીનું વિતરણ થઈ શકતું નથી.'
                  : 'As per POSHAN 2.0 guidelines, distributions cannot exceed certified physically verified stock.'}
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setAlertNotification(null)}
              className={`w-full py-3 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                alertNotification.type === 'out_of_stock'
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-[#15803D] hover:bg-[#166534]'
              }`}
            >
              <span>{lang === 'gu' ? 'સમજાઈ ગયું (Understood)' : 'Understood, Got It'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

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
import {
  playTransactionSuccessSound,
  playTransactionErrorSound,
  playPopClickSound
} from '../utils/audioEffects';

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
    { nameEn: 'Surbhi Rawat', nameGu: 'સુરભી રાવત', categoryEn: 'Lactating Mother (LM)', categoryGu: 'ધાત્રી માતા (LM)' },
    { nameEn: 'Shreeya Dube', nameGu: 'શ્રીયા દુબે', categoryEn: 'Pregnant Woman (PW)', categoryGu: 'સગર્ભા માતા (PW)' },
    { nameEn: 'Priti Arora', nameGu: 'પ્રીતિ અરોરા', categoryEn: 'Lactating Mother (LM)', categoryGu: 'ધાત્રી માતા (LM)' },
    { nameEn: 'Aarav Patel', nameGu: 'આરવ પટેલ', categoryEn: 'Child (6m-3 yrs)', categoryGu: 'બાળક (૬માસ-૩ વર્ષ)' },
    { nameEn: 'Kiranben Solanki', nameGu: 'કિરણબેન સોલંકી', categoryEn: 'Pregnant Woman (PW)', categoryGu: 'સગર્ભા માતા (PW)' }
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
    atta: 50,
    dal: 25
  };

  const getItemStock = (invId: string): number => {
    const found = inventory.find((i) => i.id === invId);
    if (found) return found.currentStock;
    return defaultInventoryMap[invId] ?? 0;
  };

  // Standard commodity key mapping for translations
  const standardKeyMap: Record<string, { key: string; label: string; unit: string; gFactor: number }> = {
    rice: { key: 'Rice', label: t.rice, unit: t.kg, gFactor: 1000 },
    oil: { key: 'Oil', label: t.oil, unit: t.litre, gFactor: 1000 },
    bal_shakti: { key: 'Bal Shakti', label: t.balShakti, unit: t.pack, gFactor: 500 },
    matru_shakti: { key: 'Matru Shakti', label: t.matruShakti, unit: t.pack, gFactor: 1000 },
    purna_shakti: { key: 'Purna Shakti', label: t.purnaShakti, unit: t.pack, gFactor: 1000 },
    atta: { key: 'Atta', label: t.atta, unit: t.kg, gFactor: 1000 },
    dal: { key: 'Tuver Dal', label: t.dal, unit: t.kg, gFactor: 1000 }
  };

  // Build itemsConfig dynamically from the live inventory prop!
  // Any newly bought or custom items added in Stock Received will be present in inventory and thus displayed here automatically!
  const itemsConfig = React.useMemo(() => {
    if (!inventory || inventory.length === 0) {
      return Object.entries(standardKeyMap).map(([id, info]) => ({
        key: info.key,
        invId: id,
        label: info.label,
        unit: info.unit,
        rawUnit: 'kg',
        gFactor: info.gFactor,
        isCustom: false,
        category: 'staple' as const,
        batchNo: undefined as string | undefined,
        expiryDate: undefined as string | undefined
      }));
    }

    return inventory.map((inv) => {
      const std = standardKeyMap[inv.id];
      if (std) {
        return {
          key: std.key,
          invId: inv.id,
          label: std.label,
          unit: std.unit,
          rawUnit: inv.unit,
          gFactor: std.gFactor,
          isCustom: false,
          category: inv.category,
          batchNo: inv.batchNo,
          expiryDate: inv.expiryDate
        };
      }

      // Custom / bought item!
      const displayLabel = lang === 'gu' ? inv.nameGu : inv.nameEn;
      let displayUnit = inv.unit;
      if (inv.unit === 'kg') displayUnit = t.kg;
      else if (inv.unit === 'litre') displayUnit = t.litre;
      else if (inv.unit === 'Pack') displayUnit = t.pack;

      return {
        key: inv.nameEn,
        invId: inv.id,
        label: displayLabel,
        unit: displayUnit,
        rawUnit: inv.unit,
        gFactor: 1000,
        isCustom: true,
        category: inv.category,
        batchNo: inv.batchNo,
        expiryDate: inv.expiryDate
      };
    });
  }, [inventory, lang, t]);

  // Unit selection mode per item: 'base' (kg/litre/pack) or 'g' (grams)
  const [itemUnits, setItemUnits] = useState<Record<string, 'base' | 'g'>>(() => {
    const init: Record<string, 'base' | 'g'> = {};
    itemsConfig.forEach((it) => {
      init[it.key] = 'base';
    });
    return init;
  });

  // Direct typed string values for inputs (allows typing any figure, decimal, or grams)
  const [typedInputs, setTypedInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    itemsConfig.forEach((item) => {
      const stock = getItemStock(item.invId);
      initial[item.key] = stock > 0 ? '1' : '0';
    });
    return initial;
  });

  // Keep itemUnits and typedInputs in sync when inventory updates (e.g. new bought items added)
  React.useEffect(() => {
    setItemUnits((prev) => {
      const next = { ...prev };
      itemsConfig.forEach((it) => {
        if (!next[it.key]) next[it.key] = 'base';
      });
      return next;
    });

    setTypedInputs((prev) => {
      const next = { ...prev };
      itemsConfig.forEach((it) => {
        if (next[it.key] === undefined) {
          const stock = getItemStock(it.invId);
          next[it.key] = stock > 0 ? '1' : '0';
        }
      });
      return next;
    });
  }, [itemsConfig]);

  const formatRemainingBalance = (num: number): string => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(3);
  };

  const getGramsFactor = (itemKey: string): number => {
    const conf = itemsConfig.find((c) => c.key === itemKey);
    return conf?.gFactor || 1000;
  };

  // Convert typed value to base inventory unit (kg / litre / pack)
  const getBaseQuantity = (itemKey: string, inputVal: number, mode: 'base' | 'g'): number => {
    if (mode === 'base') return inputVal;
    const factor = getGramsFactor(itemKey);
    return inputVal / factor;
  };

  const getUnitDisplay = (item: typeof itemsConfig[0], mode: 'base' | 'g'): string => {
    if (mode === 'g') {
      return lang === 'gu' ? 'ગ્રામ' : 'g';
    }
    return item.unit;
  };

  // Unit Toggle Handler
  const handleToggleUnit = (key: string) => {
    const currentMode = itemUnits[key] || 'base';
    const nextMode: 'base' | 'g' = currentMode === 'base' ? 'g' : 'base';
    const valNum = parseFloat(typedInputs[key]) || 0;
    const factor = getGramsFactor(key);

    let nextVal: number;
    if (nextMode === 'g') {
      // Base -> Grams
      nextVal = Number((valNum * factor).toFixed(1));
    } else {
      // Grams -> Base
      nextVal = Number((valNum / factor).toFixed(3));
    }

    playTransactionSuccessSound();
    setItemUnits((prev) => ({ ...prev, [key]: nextMode }));
    setTypedInputs((prev) => ({ ...prev, [key]: nextVal.toString() }));
  };

  // Direct typing handler for numeric input
  const handleInputChange = (key: string, rawText: string) => {
    const itemConf = itemsConfig.find((c) => c.key === key);
    if (!itemConf) return;

    setTypedInputs((prev) => ({ ...prev, [key]: rawText }));

    if (rawText.trim() === '') return;
    const val = parseFloat(rawText);
    if (isNaN(val) || val < 0) return;

    const mode = itemUnits[key] || 'base';
    const baseQty = getBaseQuantity(key, val, mode);
    const availableStock = getItemStock(itemConf.invId);

    if (baseQty > availableStock) {
      playTransactionErrorSound();
      const factor = getGramsFactor(key);
      const maxInUnit = mode === 'g' ? availableStock * factor : availableStock;
      setAlertNotification({
        isOpen: true,
        type: 'limit_exceeded',
        itemName: itemConf.label,
        unit: getUnitDisplay(itemConf, mode),
        availableStock: maxInUnit,
        requestedStock: val,
        title: lang === 'gu' ? 'સ્ટોક મર્યાદા ઓળંગાઈ ગઈ!' : 'Stock Limit Exceeded!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો ઉપલબ્ધ સ્ટોક માત્ર ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} છે. ઉપલબ્ધ જથ્થા કરતાં વધુ દાખલ કરી શકાતો નથી.`
            : `Only ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} of ${itemConf.label} is available in stock. You cannot enter beyond available stock limit.`
      });
    }
  };

  // Stepper increment / decrement
  const handleStep = (key: string, deltaDir: 1 | -1) => {
    const itemConf = itemsConfig.find((c) => c.key === key);
    if (!itemConf) return;

    const mode = itemUnits[key] || 'base';
    const currentVal = parseFloat(typedInputs[key]) || 0;
    const stepSize = mode === 'g' ? 100 : 1;
    const nextVal = Math.max(0, Number((currentVal + deltaDir * stepSize).toFixed(3)));

    const baseQty = getBaseQuantity(key, nextVal, mode);
    const availableStock = getItemStock(itemConf.invId);

    if (deltaDir > 0 && availableStock <= 0) {
      playTransactionErrorSound();
      setAlertNotification({
        isOpen: true,
        type: 'out_of_stock',
        itemName: itemConf.label,
        unit: getUnitDisplay(itemConf, mode),
        availableStock: 0,
        requestedStock: nextVal,
        title: lang === 'gu' ? 'સ્ટોક ખાલી છે!' : 'Item Out of Stock!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો સ્ટોક આંગણવાડી કેન્દ્રમાં સંપૂર્ણપણે ખાલી (૦) છે!`
            : `${itemConf.label} is currently completely OUT OF STOCK at AWC 04 Vadtal.`
      });
      return;
    }

    if (deltaDir > 0 && baseQty > availableStock) {
      playTransactionErrorSound();
      const factor = getGramsFactor(key);
      const maxInUnit = mode === 'g' ? availableStock * factor : availableStock;
      setAlertNotification({
        isOpen: true,
        type: 'limit_exceeded',
        itemName: itemConf.label,
        unit: getUnitDisplay(itemConf, mode),
        availableStock: maxInUnit,
        requestedStock: nextVal,
        title: lang === 'gu' ? 'સ્ટોક મર્યાદા ઓળંગાઈ ગઈ!' : 'Stock Limit Exceeded!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો ઉપલબ્ધ જથ્થો માત્ર ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} છે.`
            : `Only ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} of ${itemConf.label} is available in stock.`
      });
      return;
    }

    setTypedInputs((prev) => ({ ...prev, [key]: nextVal.toString() }));
  };

  // Quick Gram preset helper (+100g, +250g, +500g)
  const handleQuickAdd = (key: string, amount: number) => {
    const itemConf = itemsConfig.find((c) => c.key === key);
    if (!itemConf) return;

    const mode = itemUnits[key] || 'base';
    const currentVal = parseFloat(typedInputs[key]) || 0;
    const nextVal = Math.max(0, Number((currentVal + amount).toFixed(3)));
    const baseQty = getBaseQuantity(key, nextVal, mode);
    const availableStock = getItemStock(itemConf.invId);

    if (baseQty > availableStock) {
      playTransactionErrorSound();
      const factor = getGramsFactor(key);
      const maxInUnit = mode === 'g' ? availableStock * factor : availableStock;
      setAlertNotification({
        isOpen: true,
        type: 'limit_exceeded',
        itemName: itemConf.label,
        unit: getUnitDisplay(itemConf, mode),
        availableStock: maxInUnit,
        requestedStock: nextVal,
        title: lang === 'gu' ? 'સ્ટોક મર્યાદા ઓળંગાઈ ગઈ!' : 'Stock Limit Exceeded!',
        message:
          lang === 'gu'
            ? `${itemConf.label} નો ઉપલબ્ધ જથ્થો માત્ર ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} છે.`
            : `Only ${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(itemConf, mode)} of ${itemConf.label} is available in stock.`
      });
      return;
    }

    setTypedInputs((prev) => ({ ...prev, [key]: nextVal.toString() }));
  };

  // Compute total distributed units in base inventory units
  const totalDeductedUnits = itemsConfig.reduce((acc, it) => {
    const val = parseFloat(typedInputs[it.key]) || 0;
    const mode = itemUnits[it.key] || 'base';
    return acc + getBaseQuantity(it.key, val, mode);
  }, 0);

  const remainingStock = Math.max(0, Number((currentTotalStock - totalDeductedUnits).toFixed(3)));

  const handleConfirm = async () => {
    if (!selectedBeneficiary) {
      playTransactionErrorSound();
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
      playTransactionErrorSound();
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
      const mode = itemUnits[item.key] || 'base';
      const typedVal = parseFloat(typedInputs[item.key]) || 0;
      const baseQty = getBaseQuantity(item.key, typedVal, mode);
      const stock = getItemStock(item.invId);

      if (baseQty > 0 && stock <= 0) {
        playTransactionErrorSound();
        setAlertNotification({
          isOpen: true,
          type: 'out_of_stock',
          itemName: item.label,
          unit: item.unit,
          availableStock: 0,
          requestedStock: typedVal,
          title: lang === 'gu' ? 'સ્ટોક ખાલી છે!' : 'Item Out of Stock!',
          message:
            lang === 'gu'
              ? `${item.label} નો સ્ટોક ખાલી હોવાથી વિતરણ કરી શકાતું નથી. કૃપા કરીને જથ્થો ૦ કરો.`
              : `${item.label} is completely out of stock. Please remove this item (set to 0) to proceed.`
        });
        return;
      }

      if (baseQty > stock) {
        playTransactionErrorSound();
        const factor = getGramsFactor(item.key);
        const maxInUnit = mode === 'g' ? stock * factor : stock;
        setAlertNotification({
          isOpen: true,
          type: 'limit_exceeded',
          itemName: item.label,
          unit: getUnitDisplay(item, mode),
          availableStock: maxInUnit,
          requestedStock: typedVal,
          title: lang === 'gu' ? 'સ્ટોક મર્યાદા બહાર!' : 'Stock Limit Exceeded!',
          message:
            lang === 'gu'
              ? `${item.label} માટે દાખલ કરેલ જથ્થો (${typedVal} ${getUnitDisplay(item, mode)}) ઉપલબ્ધ સ્ટોક (${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(item, mode)}) કરતાં વધારે છે!`
              : `Entered quantity (${typedVal} ${getUnitDisplay(item, mode)}) for ${item.label} exceeds available stock (${formatRemainingBalance(maxInUnit)} ${getUnitDisplay(item, mode)})!`
        });
        return;
      }
    }

    setSubmitting(true);
    const beneObj = beneficiaries.find((b) => b.nameEn === selectedBeneficiary || b.nameGu === selectedBeneficiary);
    const category = beneObj ? (lang === 'gu' ? beneObj.categoryGu : beneObj.categoryEn) : 'General';

    // Construct base distribution map for inventory reduction
    const distributedSnapshot: Record<string, number> = {};
    itemsConfig.forEach((it) => {
      const mode = itemUnits[it.key] || 'base';
      const val = parseFloat(typedInputs[it.key]) || 0;
      if (val > 0) {
        distributedSnapshot[it.key] = Number(getBaseQuantity(it.key, val, mode).toFixed(3));
      }
    });

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

      playTransactionSuccessSound();
      setSuccess(true);
    } catch (err) {
      playTransactionErrorSound();
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
                {beneficiaries.map((b) => {
                  const bName = lang === 'gu' ? b.nameGu : b.nameEn;
                  const bCat = lang === 'gu' ? b.categoryGu : b.categoryEn;
                  return (
                    <option key={b.nameEn} value={bName}>
                      {bName} ({bCat})
                    </option>
                  );
                })}
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

          {/* Items with Unit Selector (Grams / Base) and Direct Figure Typing Input */}
          <div className="space-y-3">
            {itemsConfig.map((item) => {
              const mode = itemUnits[item.key] || 'base';
              const typedVal = typedInputs[item.key] ?? '0';
              const numVal = parseFloat(typedVal) || 0;
              const baseQty = getBaseQuantity(item.key, numVal, mode);
              const availableStock = getItemStock(item.invId);
              const factor = getGramsFactor(item.key);
              const availableInActiveUnit = mode === 'g' ? availableStock * factor : availableStock;
              const remainingInActiveUnit = Math.max(0, availableInActiveUnit - numVal);

              const isOutOfStock = availableStock <= 0;
              const isAtMaxStock = availableStock > 0 && baseQty >= availableStock;

              return (
                <div
                  key={item.key}
                  className={`p-3 rounded-2xl border transition-all space-y-2.5 ${
                    isOutOfStock
                      ? 'bg-rose-50/60 border-rose-200'
                      : isAtMaxStock
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-slate-50/80 border-slate-200/80'
                  }`}
                >
                  {/* Item Header & Unit Selection Toggle (kg ⇄ grams) */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {item.label}
                      </span>
                      {item.isCustom && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                          {lang === 'gu' ? 'ખરીદેલી સામગ્રી' : 'Bought Item'}
                        </span>
                      )}
                      {item.batchNo && (
                        <span className="text-[9.5px] font-mono text-slate-400 font-semibold">
                          #{item.batchNo}
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black bg-rose-100 text-rose-700 border border-rose-300 flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                          {lang === 'gu' ? 'સ્ટોક ખાલી' : 'Out of Stock'}
                        </span>
                      )}
                    </div>

                    {/* Unit Switcher: Base vs Grams (g) */}
                    <div className="inline-flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (mode !== 'base') handleToggleUnit(item.key);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                          mode === 'base'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {item.unit}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (mode !== 'g') handleToggleUnit(item.key);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                          mode === 'g'
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'gu' ? 'ગ્રામ (g)' : 'Grams (g)'}
                      </button>
                    </div>
                  </div>

                  {/* Stock Availability Info */}
                  <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between flex-wrap gap-1">
                    {isOutOfStock ? (
                      <span className="text-rose-600 font-semibold">
                        {lang === 'gu' ? '૦ ઉપલબ્ધ (વિતરણ અશક્ય)' : '0 available in stock'}
                      </span>
                    ) : (
                      <>
                        <div>
                          <span>{lang === 'gu' ? 'ઉપલબ્ધ: ' : 'Available: '}</span>
                          <span className="font-bold text-emerald-800">
                            {formatRemainingBalance(availableInActiveUnit)} {getUnitDisplay(item, mode)}
                          </span>
                          {mode === 'g' && (
                            <span className="text-slate-400 text-[10px] ml-1">
                              ({formatRemainingBalance(availableStock)} {item.unit})
                            </span>
                          )}
                        </div>

                        {numVal > 0 && (
                          <div className="text-slate-600">
                            <span>{lang === 'gu' ? 'બાકી રહેશે: ' : 'Remains: '}</span>
                            <strong className="text-slate-800">
                              {formatRemainingBalance(remainingInActiveUnit)} {getUnitDisplay(item, mode)}
                            </strong>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Typing Input & Stepper Controls */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    {/* Live Conversion Equivalent Badge */}
                    <div className="min-w-0">
                      {numVal > 0 ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold">
                          <span>=</span>
                          <span>
                            {mode === 'g'
                              ? `${formatRemainingBalance(baseQty)} ${item.unit}`
                              : `${(numVal * factor).toLocaleString()} g`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">
                          {lang === 'gu' ? 'જથ્થો ટાઈપ કરો' : 'Type or step quantity'}
                        </span>
                      )}
                    </div>

                    {/* Numeric Typable Input with Steppers */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center bg-white rounded-xl p-1 border border-slate-300 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleStep(item.key, -1)}
                          disabled={numVal <= 0}
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:opacity-30 disabled:hover:bg-emerald-50 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                          aria-label={`Decrease ${item.label}`}
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>

                        <div className="flex items-center px-1">
                          <input
                            type="number"
                            step="any"
                            min="0"
                            value={typedInputs[item.key]}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            placeholder="0"
                            className="w-16 sm:w-20 text-center font-black text-xs sm:text-sm text-slate-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded py-0.5"
                          />
                          <span className="text-[10.5px] font-bold text-slate-500 pl-0.5 select-none">
                            {mode === 'g' ? 'g' : item.unit}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStep(item.key, 1)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                            isOutOfStock
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : isAtMaxStock
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          aria-label={`Increase ${item.label}`}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick-add chips for fast entry */}
                  <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {lang === 'gu' ? 'ઝડપી ઉમેરો:' : 'Quick:'}
                    </span>
                    {mode === 'g' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 100)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +100g
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 250)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +250g
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 500)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +500g
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 1000)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +1000g (1kg)
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 0.5)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +0.5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 1)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(item.key, 2)}
                          className="px-2 py-0.5 rounded-md bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          +2
                        </button>
                      </>
                    )}

                    {numVal > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          playPopClickSound();
                          setTypedInputs((prev) => ({ ...prev, [item.key]: '0' }));
                        }}
                        className="ml-auto text-[10px] text-slate-400 hover:text-amber-700 font-semibold transition-colors cursor-pointer"
                      >
                        {lang === 'gu' ? '૦ કરો' : 'Clear (0)'}
                      </button>
                    )}
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

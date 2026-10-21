import React, { useState } from 'react';
import { ArrowLeft, Repeat, ShieldCheck, KeyRound, CheckCircle2, ArrowRightLeft, Building2, Home } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Language } from '../types';
import { translations } from '../data/translations';
import { playTransactionSuccessSound, playTransactionErrorSound } from '../utils/audioEffects';

interface ShareExchangeScreenProps {
  onBack: () => void;
  lang: Language;
  onConfirmTransfer: (data: {
    peerAwc: string;
    item: string;
    quantity: number;
    unit: string;
    verificationCode: string;
    action: 'borrow' | 'lend';
  }) => Promise<void>;
}

export const ShareExchangeScreen: React.FC<ShareExchangeScreenProps> = ({
  onBack,
  lang,
  onConfirmTransfer
}) => {
  const t = translations[lang];

  const peerAwcList = [
    { id: 'AWVAD02', name: 'AWC-02 Mogri (Taluka Anand)', distance: '1.2 km', worker: 'Kokilaben Parmar' },
    { id: 'AWVAD03', name: 'AWC-03 Karamsad (Taluka Anand)', distance: '2.0 km', worker: 'Dakshaben Patel' },
    { id: 'AWVAD05', name: 'AWC-05 Samarkha (Taluka Anand)', distance: '2.8 km', worker: 'Jyotiben Solanki' }
  ];

  const [selectedAwc, setSelectedAwc] = useState<string>('AWVAD02');
  const [transferType, setTransferType] = useState<'borrow' | 'lend'>('borrow');
  const [selectedItem, setSelectedItem] = useState<string>('Bal Shakti (1 Pack)');
  const [transferQty, setTransferQty] = useState<number>(5);
  const [inputCode, setInputCode] = useState<string>('8491');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleVerify = () => {
    if (inputCode.trim() === '8491') {
      setIsVerified(true);
      playTransactionSuccessSound();
    } else {
      playTransactionErrorSound();
      alert(lang === 'en' ? 'Invalid code! The authorized transfer OTP is #8491' : 'અમાન્ય કોડ! સત્તાવાર ટ્રાન્સફર OTP #8491 છે');
    }
  };

  const handleCompleteTransfer = async () => {
    setSubmitting(true);
    try {
      await onConfirmTransfer({
        peerAwc: selectedAwc,
        item: selectedItem,
        quantity: transferQty,
        unit: selectedItem.includes('Pack') ? 'Pack' : 'kg',
        verificationCode: '#8491',
        action: transferType
      });
      playTransactionSuccessSound();
      setCompleted(true);
    } catch (err) {
      console.error(err);
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
          {t.setuShareExchangeSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'P2P Inter-AWC Emergency Stock Transfer'
            : 'આંગણવાડીઓ વચ્ચે કટોકટી સ્ટોક વિનિમય'}
        </p>
      </div>

      {completed ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Transfer Voucher Verified & Issued!' : 'ટ્રાન્સફર વાઉચર ચકાસાયેલ છે!'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Authorized via Security Code <strong>#8491</strong>
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-mono font-bold text-slate-900">TX-AWC-8491</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Peer Centre:</span>
              <span className="font-bold text-slate-900">{selectedAwc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Item:</span>
              <span className="font-bold text-slate-900">{transferQty} × {selectedItem}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Supervisor Portal Sync:</span>
              <span className="font-semibold text-emerald-700">✓ Recorded</span>
            </div>
          </div>

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
          {/* Transfer Mode Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setTransferType('borrow')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                transferType === 'borrow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Borrow from Peer' : 'અન્ય કેન્દ્ર પાસેથી ઉછીનું મેળવો'}
            </button>
            <button
              onClick={() => setTransferType('lend')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                transferType === 'lend'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              {lang === 'en' ? 'Lend to Peer' : 'અન્ય કેન્દ્રને સહાય આપો'}
            </button>
          </div>

          {/* Peer AWC Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              {lang === 'en' ? 'Select Nearby Anganwadi' : 'નજીકનું આંગણવાડી કેન્દ્ર પસંદ કરો'}
            </label>
            <select
              value={selectedAwc}
              onChange={(e) => setSelectedAwc(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 font-semibold text-xs rounded-xl px-3 py-2.5 shadow-2xs"
            >
              {peerAwcList.map((peer) => (
                <option key={peer.id} value={peer.id}>
                  {peer.name} ({peer.distance}) • {peer.worker}
                </option>
              ))}
            </select>
          </div>

          {/* Item Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              {lang === 'en' ? 'Emergency Ration Item' : 'કટોકટી રેશન વસ્તુ'}
            </label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 font-semibold text-xs rounded-xl px-3 py-2.5 shadow-2xs"
            >
              <option value="Bal Shakti (1 Pack)">Bal Shakti (1 Pack / 500g)</option>
              <option value="Matru Shakti (1 Pack)">Matru Shakti (1 Pack / 1kg)</option>
              <option value="Purna Shakti (1 Pack)">Purna Shakti (1 Pack / 1kg)</option>
              <option value="Rice (1 kg)">Fortified Rice (1 kg)</option>
              <option value="Oil (1 litre)">Fortified Oil (1 litre)</option>
              <option value="Atta (1 kg)">Whole Wheat Atta (1 kg)</option>
            </select>
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between py-1">
            <label className="text-xs font-bold text-slate-800">
              {lang === 'en' ? 'Transfer Quantity' : 'ટ્રાન્સફર જથ્થો'}
            </label>
            <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 border border-slate-200">
              <button
                onClick={() => setTransferQty((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-slate-900 text-xs tabular-nums">
                {transferQty}
              </span>
              <button
                onClick={() => setTransferQty((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Security Verification Code #8491 Section */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-950">
                {lang === 'en' ? 'Official Security Code Verification' : 'સત્તાવાર સુરક્ષા કોડ ચકાસણી'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800">
              {lang === 'en'
                ? 'Supervisor Shardaben Shah\'s authorization PIN for 04 Vadtal Centre (AWVAD04) is #8491.'
                : '૦૪ વડતાલ કેન્દ્ર (AWVAD04) માટે સુપરવાઈઝર શારદાબેન શાહ દ્વારા માન્ય ઓથોરાઇઝેશન પિન #8491 છે.'}
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">#</span>
                <input
                  type="text"
                  maxLength={4}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-amber-300 rounded-xl pl-6 pr-3 py-2 text-sm font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 tabular-nums"
                  placeholder="8491"
                />
              </div>
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                {isVerified ? '✓ Verified' : 'Verify #8491'}
              </button>
            </div>
          </div>

          {/* Complete Transfer Button */}
          <button
            onClick={handleCompleteTransfer}
            disabled={!isVerified || submitting}
            className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>
              {submitting
                ? t.syncing
                : lang === 'en'
                ? `Confirm Transfer (#8491 Verified)`
                : `ટ્રાન્સફર પુષ્ટિ કરો (#8491 માન્ય)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

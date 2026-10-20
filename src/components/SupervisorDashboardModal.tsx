import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  Calendar,
  Utensils,
  Clock,
  FileText,
  CheckCircle2,
  Package,
  Scale,
  Sparkles,
  MessageSquare,
  Search,
  Building2,
  ChevronDown,
  Award
} from 'lucide-react';
import { PoshanSetuLogo } from './PoshanSetuLogo';
import { MealDeductionRecord, Language } from '../types';

interface SupervisorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  mealRecords: MealDeductionRecord[];
  onAcknowledgeRecord?: (recordId: string, supervisorComment?: string) => void;
}

export const SupervisorDashboardModal: React.FC<SupervisorDashboardModalProps> = ({
  isOpen,
  onClose,
  lang,
  mealRecords,
  onAcknowledgeRecord
}) => {
  const [filterMeal, setFilterMeal] = useState<'all' | 'breakfast' | 'lunch'>('all');
  const [supervisorNotes, setSupervisorNotes] = useState<Record<string, string>>({});
  const [acknowledgedMap, setAcknowledgedMap] = useState<Record<string, boolean>>({
    'init-1': true,
    'init-2': true
  });

  if (!isOpen) return null;

  const filteredRecords = mealRecords.filter((rec) => {
    if (filterMeal === 'all') return true;
    return rec.mealType === filterMeal;
  });

  const formatDecimalKg = (val: number): string => {
    if (val === null || val === undefined || isNaN(val)) return '0';
    if (Number.isInteger(val)) return val.toString();
    return val.toFixed(3);
  };

  const totalNotesCount = mealRecords.filter((r) => r.workerNote && r.workerNote.trim().length > 0).length;
  const rawRationMonitoredKg = mealRecords.reduce((sum, r) => sum + (r.totalQuantityGm || 0), 0) / 1000;
  const totalRationMonitoredKg = formatDecimalKg(rawRationMonitoredKg);

  const handleAcknowledge = (id: string) => {
    setAcknowledgedMap((prev) => ({ ...prev, [id]: true }));
    if (onAcknowledgeRecord) {
      onAcknowledgeRecord(id, supervisorNotes[id] || 'Verified and approved by Supervisor Shardaben Shah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-[#F8FAFC] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200 border border-slate-200">
        {/* Superior Header Banner */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-300 stroke-[2.3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-200 block">
                {lang === 'gu' ? 'ગુજરાત સરકાર • મહિલા અને બાળ વિકાસ' : 'GOVT OF GUJARAT • WCD DEPT'}
              </span>
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                {lang === 'gu' ? 'સુપરવાઈઝર મોનિટરિંગ ડેશબોર્ડ' : 'Superior Monitoring Dashboard'}
              </h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-0.5">
                <span>Shardaben Shah</span> • <span>Sector Supervisor (Taluka Anand)</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Supervisor Profile & Overview Strip */}
        <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              SS
            </div>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">
                {lang === 'gu' ? '૦૪ વડતાલ આંગણવાડી કેન્દ્ર (AWVAD04)' : '04 Vadtal Centre (AWVAD04)'}
              </span>
              <span className="text-[10px] text-slate-500">
                {lang === 'gu' ? 'કાર્યકર: શ્રીમતી ભાવનાબેન પટેલ' : 'Worker: Smt. BhavnaBen Patel'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {lang === 'gu' ? 'સક્રિય ઓડિટ' : 'Live Audit'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">PIN #8491</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-100/80 shrink-0 text-center">
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">
              {lang === 'gu' ? 'નોંધાયેલ ભોજન' : 'Meal Logs'}
            </span>
            <span className="text-base font-black text-slate-900">{mealRecords.length}</span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-emerald-700 font-semibold block">
              {lang === 'gu' ? 'કાર્યકર નોંધો' : 'Worker Notes'}
            </span>
            <span className="text-base font-black text-emerald-800">{totalNotesCount}</span>
          </div>

          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block">
              {lang === 'gu' ? 'મોનિટર થયેલ રેશન' : 'Monitored'}
            </span>
            <span className="text-base font-black text-slate-900">{totalRationMonitoredKg} kg</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-700">
            {lang === 'gu' ? 'કાર્યકર ભોજન અને સામગ્રી નોંધો:' : 'Worker Meal & Material Notes:'}
          </span>
          <div className="flex gap-1">
            {(['all', 'breakfast', 'lunch'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMeal(mode)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  filterMeal === mode
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mode === 'all'
                  ? lang === 'gu' ? 'બધા' : 'All'
                  : mode === 'breakfast'
                  ? lang === 'gu' ? 'નાસ્તો' : 'Breakfast'
                  : lang === 'gu' ? 'બપોર' : 'Lunch'}
              </button>
            ))}
          </div>
        </div>

        {/* Feed of Worker Meal Entries & Notes */}
        <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Utensils className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">
                {lang === 'gu' ? 'હજુ સુધી કોઈ ભોજન નોંધ ઉપલબ્ધ નથી.' : 'No meal usage entries found for this filter.'}
              </p>
            </div>
          ) : (
            filteredRecords.map((record, idx) => {
              const isAcknowledged = acknowledgedMap[record.id] || record.supervisorReviewed;

              return (
                <div
                  key={record.id || idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3 hover:border-emerald-300 transition-colors"
                >
                  {/* Card Header: Meal Type, Menu & Timestamp */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                        <Utensils className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              record.mealType === 'breakfast'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {record.mealType === 'breakfast'
                              ? lang === 'gu' ? 'સવારનો નાસ્તો' : 'Breakfast'
                              : lang === 'gu' ? 'બપોરનું ભોજન' : 'Lunch'}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {record.date || record.timestamp || '19-Oct-2026'}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                          {record.menuName}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block tabular-nums">
                        {record.studentsPresent} Children
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {record.totalQuantityGm} gm ({formatDecimalKg((record.totalQuantityGm || 0) / 1000)} kg)
                      </span>
                    </div>
                  </div>

                  {/* Multi-Material Usage Breakdown */}
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-700" />
                      {lang === 'gu' ? 'વપરાયેલ સામગ્રી અને ગ્રામ હિસાબ:' : 'Materials Used & Grams Breakdown:'}
                    </span>

                    {record.materialsUsed && record.materialsUsed.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                        {record.materialsUsed.map((mat, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                          >
                            <span className="font-bold text-slate-800">
                              {lang === 'gu' ? mat.nameGu || mat.nameEn : mat.nameEn}
                            </span>
                            <div className="text-right">
                              <span className="font-semibold text-slate-600 text-[11px]">
                                {mat.gmPerStudent} gm × {record.studentsPresent} ={' '}
                              </span>
                              <span className="font-black text-emerald-800">
                                {mat.totalGm} gm ({mat.totalKg} kg)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">
                        {record.ratioPerStudentGm || 30} gm/student × {record.studentsPresent} students = {record.totalQuantityGm} gm
                      </p>
                    )}
                  </div>

                  {/* Worker's Logged Note / Remark (Highlighted for Superior) */}
                  <div className="bg-[#FFFBEB] p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                        {lang === 'gu' ? 'કાર્યકર ભાવનાબેનની નોંધ / રિમાર્ક:' : 'Worker Bhavnaben Patel\'s Note:'}
                      </span>
                      <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {lang === 'gu' ? 'સુપરવાઈઝર સમક્ષ રજૂ' : 'Visible to Superior'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                      "{record.workerNote && record.workerNote.trim().length > 0
                        ? record.workerNote
                        : lang === 'gu'
                        ? 'કોઈ વધારાની ટિપ્પણી નથી. નિયત મેનૂ અને સામગ્રી મુજબ ભોજન તૈયાર કરી તમામ હાજર બાળકોને વિતરણ કરાયું.'
                        : 'No extra note entered. Cooked and distributed as per standard recipe guidelines.'}"
                    </p>
                  </div>

                  {/* Supervisor Audit & Sign-off Section */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-semibold text-slate-600">
                        {lang === 'gu' ? 'ઓડિટર:' : 'Auditor:'}{' '}
                        <strong className="text-slate-900">Shardaben Shah</strong>
                      </span>
                    </div>

                    {isAcknowledged ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {lang === 'gu' ? 'સુપરવાઈઝર દ્વારા માન્ય' : 'Supervisor Verified'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(record.id)}
                        className="px-3 py-1 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-[11px] rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'gu' ? 'માન્ય કરો' : 'Acknowledge Note'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {lang === 'gu' ? 'ડેશબોર્ડ પર પાછા જાઓ' : 'Close & Return to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Users, ArrowRight, ShieldCheck, Home, Calendar } from 'lucide-react';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { Student, Language } from '../types';
import { translations } from '../data/translations';

interface AttendanceScreenProps {
  onBack: () => void;
  lang: Language;
  students: Student[];
  onToggleStudent: (id: number) => void;
  onSetAll: (present: boolean) => void;
  onProceedToMeal: () => void;
}

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({
  onBack,
  lang,
  students,
  onToggleStudent,
  onSetAll,
  onProceedToMeal
}) => {
  const t = translations[lang];
  const [submitted, setSubmitted] = useState<boolean>(false);
  const presentCount = students.filter((s) => s.present).length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  const handleSubmitAttendance = () => {
    setSubmitted(true);
  };

  return (
    <div className="px-4 pt-1 pb-10 space-y-4">
      {/* Header */}
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
          {t.studentAttendanceSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en' ? 'Daily Attendance Roster • 3 to 6 Years' : 'દૈનિક હાજરી પત્રક • ૩ થી ૬ વર્ષ'}
        </p>
      </div>

      {/* Completion View asking for return to home page */}
      {submitted ? (
        <div className="bg-white rounded-[26px] p-6 border border-emerald-200 text-center space-y-4 animate-in zoom-in-95 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Today\'s Attendance Recorded Successfully!' : 'આજની હાજરી સફળતાપૂર્વક નોંધાઈ ગઈ છે!'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'en'
                ? `19-Oct-2026: ${presentCount} of ${students.length} children marked present`
                : `૧૯-ઓક્ટોબર-૨૦૨૬: કુલ ${students.length} માંથી ${presentCount} બાળકો હાજર નોંધાયા.`}
            </p>
          </div>

          {/* Details summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                {lang === 'en' ? 'Attendance Date:' : 'હાજરી તારીખ:'}
              </span>
              <span className="font-bold text-slate-900">19-Oct-2026</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Present Students:' : 'હાજર બાળકો:'}</span>
              <span className="font-black text-emerald-800 text-sm">
                {presentCount} ({attendanceRate}%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">{lang === 'en' ? 'Absent Students:' : 'ગેરહાજર બાળકો:'}</span>
              <span className="font-bold text-red-600 text-sm">
                {students.length - presentCount}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold">{lang === 'en' ? 'MPR-3 Register Sync:' : 'રજીસ્ટર સિંક:'}</span>
              <span className="font-semibold text-emerald-700">✓ Logged & Synced</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {lang === 'en'
              ? 'Attendance record has been finalized. You can return to the home page or proceed to food preparation.'
              : 'હાજરી રેકોર્ડ સફળતાપૂર્વક સંગ્રહિત થયો છે. તમે મુખ્ય પેજ પર પાછા જઈ શકો છો અથવા ભોજન નોંધણી પર આગળ વધી શકો છો.'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onBack}
              className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Home className="w-4 h-4 stroke-[2.2]" />
              <span>{lang === 'en' ? 'Return to Home Page' : 'મુખ્ય પેજ પર પાછા જાઓ'}</span>
            </button>

            <button
              onClick={onProceedToMeal}
              className="w-full py-3 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-[0.98] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <span>{lang === 'en' ? 'Proceed to Daily Meal Entry' : 'દૈનિક ભોજન નોંધણી પર આગળ વધો'}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Banner */}
          <div className="bg-[#EAF7EE] border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-emerald-800 flex items-center justify-center shadow-2xs">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-900 block">
                  {lang === 'en' ? 'Today\'s Attendance' : 'આજની હાજરી'}
                </span>
                <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                  {presentCount} / {students.length}{' '}
                  <span className="text-xs font-bold text-emerald-700">({attendanceRate}%)</span>
                </span>
              </div>
            </div>

            {/* Quick Batch Actions */}
            <div className="flex flex-col gap-1 text-[11px]">
              <button
                onClick={() => onSetAll(true)}
                className="px-2.5 py-1 bg-white text-emerald-800 font-bold rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
              >
                {lang === 'en' ? 'All Present' : 'બધા હાજર'}
              </button>
              <button
                onClick={() => onSetAll(false)}
                className="px-2.5 py-1 bg-white text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                {lang === 'en' ? 'All Absent' : 'બધા ગેરહાજર'}
              </button>
            </div>
          </div>

          {/* Linkage Note */}
          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="leading-tight">
              {lang === 'en'
                ? `Sync Note: ${presentCount} present children will auto-fill your Daily Meal Usage calculation multiplier.`
                : `નોંધ: ${presentCount} હાજર બાળકો મુજબ દૈનિક ભોજનના રેશનનું ગણતરી આપોઆપ સેટ થશે.`}
            </p>
          </div>

          {/* 10-Student Roster List */}
          <div className="bg-white rounded-[26px] p-3.5 border border-slate-200/80 shadow-xs divide-y divide-slate-100">
            {students.map((student) => {
              return (
                <div
                  key={student.id}
                  className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {/* Roll badge */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        student.present
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {student.rollNo}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {lang === 'en' ? student.name : student.nameGu}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Age: {student.age} • {student.gender === 'M' ? 'Boy' : 'Girl'} • Parent: {student.parentName}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Presence Toggle */}
                  <button
                    onClick={() => onToggleStudent(student.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                      student.present
                        ? 'bg-[#15803D] text-white hover:bg-[#166534]'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {student.present ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{t.present}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{t.absent}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Primary Action: Confirm & Save Attendance */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSubmitAttendance}
              className="w-full h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                {lang === 'en'
                  ? `Confirm & Save Attendance (${presentCount} Present)`
                  : `હાજરી કન્ફર્મ અને સાચવો (${presentCount} હાજર)`}
              </span>
            </button>

            {/* Quick Proceed to Meal Usage Button */}
            <button
              onClick={onProceedToMeal}
              className="w-full h-11 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all text-slate-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <span>
                {lang === 'en'
                  ? `Proceed Directly to Meal Entry`
                  : `દૈનિક ભોજન નોંધણી પર સીધા આગળ વધો`}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-emerald-700" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

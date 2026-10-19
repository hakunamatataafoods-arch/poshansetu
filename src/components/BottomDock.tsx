import React from 'react';
import { Home, HelpCircle, User } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

export type DockTab = 'home' | 'help' | 'centre' | 'profile';

interface BottomDockProps {
  activeTab: DockTab;
  onTabChange: (tab: DockTab) => void;
  lang: Language;
}

// Custom Anganwadi Centre Building Icon with Flag on top matching screenshot
const CentreBuildingIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Triangular Flag on Roof Mast */}
    <path d="M12 2v4" />
    <path d="M12 2l4 2-4 2" fill="currentColor" fillOpacity="0.4" />
    {/* Centre Building Roof */}
    <path d="M4 10l8-4 8 4" />
    {/* Building Body Pillars */}
    <path d="M5 10v10" />
    <path d="M19 10v10" />
    <path d="M9 10v10" />
    <path d="M15 10v10" />
    {/* Base Steps */}
    <path d="M3 20h18" />
  </svg>
);

export const BottomDock: React.FC<BottomDockProps> = ({
  activeTab,
  onTabChange,
  lang
}) => {
  const t = translations[lang];

  const items: { id: DockTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'help', label: t.help, icon: HelpCircle },
    { id: 'centre', label: t.centreDetails, icon: CentreBuildingIcon },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[420px] mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 shadow-lg">
      <div className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-0.5 transition-all rounded-xl cursor-pointer ${
                isActive
                  ? 'text-[#166534]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-12 h-7 flex items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-[#EAF7EE]' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-[#166534]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#166534]' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

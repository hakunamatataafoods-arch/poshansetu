import React from 'react';

export const StockReceivedIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ground Shadow */}
    <ellipse cx="78" cy="116" rx="64" ry="7" fill="#E2E8F0" />
    
    {/* Delivery Truck */}
    <g id="truck">
      {/* Truck Cab */}
      <path d="M16 88H32V62H24C19 62 16 66 16 71V88Z" fill="#3B82F6" opacity="0" />
      {/* Main Truck Box Body */}
      <rect x="20" y="32" width="68" height="66" rx="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
      <rect x="24" y="36" width="60" height="58" rx="4" fill="#E2E8F0" />
      
      {/* Inside Truck Shelves / Sacks */}
      <g id="truck-sacks">
        {/* Layer 1 sacks */}
        <path d="M30 52C30 48 37 46 45 46C53 46 60 48 60 52C60 56 53 58 45 58C37 58 30 56 30 52Z" fill="#D97706" />
        <ellipse cx="45" cy="52" rx="14" ry="5" fill="#F59E0B" />
        <path d="M30 64C30 60 37 58 45 58C53 58 60 60 60 64C60 68 53 70 45 70C37 70 30 68 30 64Z" fill="#B45309" />
        <ellipse cx="45" cy="64" rx="14" ry="5" fill="#D97706" />
        <path d="M30 76C30 72 37 70 45 70C53 70 60 72 60 76C60 80 53 82 45 82C37 82 30 80 30 76Z" fill="#92400E" />
        <ellipse cx="45" cy="76" rx="14" ry="5" fill="#B45309" />
        {/* Sack ties */}
        <line x1="45" y1="50" x2="45" y2="54" stroke="#78350F" strokeWidth="1.5" />
        <line x1="45" y1="62" x2="45" y2="66" stroke="#78350F" strokeWidth="1.5" />
        <line x1="45" y1="74" x2="45" y2="78" stroke="#78350F" strokeWidth="1.5" />
      </g>
      
      {/* Truck Door Open Flaps */}
      <path d="M20 32L8 40V98L20 96V32Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M88 32L94 38V98L88 96V32Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
      
      {/* Truck Chassis & Wheels */}
      <rect x="22" y="96" width="64" height="6" fill="#334155" />
      <rect x="30" y="98" width="16" height="16" rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <circle cx="38" cy="106" r="4" fill="#94A3B8" />
      <rect x="66" y="98" width="16" height="16" rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <circle cx="74" cy="106" r="4" fill="#94A3B8" />
    </g>

    {/* Delivery Worker Carrying Sack */}
    <g id="worker">
      {/* Legs & Green Trousers */}
      <path d="M106 88L104 114H110L112 94L116 114H122L116 88Z" fill="#15803D" />
      {/* Shoes */}
      <ellipse cx="107" cy="114" rx="4" ry="2.5" fill="#0F172A" />
      <ellipse cx="119" cy="114" rx="4" ry="2.5" fill="#0F172A" />
      {/* Yellow / Ochre Shirt */}
      <path d="M102 64C102 60 106 58 112 58C118 58 122 60 122 64L120 90H104L102 64Z" fill="#EAB308" />
      {/* Head & Cap */}
      <circle cx="112" cy="46" r="7" fill="#FCD34D" />
      <path d="M104 44C104 40 108 38 114 38C120 38 123 41 123 44H104Z" fill="#166534" />
      <path d="M103 44H97C96 44 96 46 98 46H104V44Z" fill="#166534" />
      
      {/* Sack On Worker's Shoulder */}
      <path d="M88 44C88 38 98 34 110 36C122 38 126 46 122 52C118 58 102 58 92 54C88 52 88 48 88 44Z" fill="#D97706" />
      <path d="M92 42C96 39 106 37 114 39C120 41 122 46 118 49C114 52 102 52 94 49C92 47 91 44 92 42Z" fill="#F59E0B" />
      <path d="M88 42L84 40M88 45L83 44M88 47L84 48" stroke="#78350F" strokeWidth="1.5" />
      
      {/* Worker Arms Holding Sack */}
      <path d="M104 62L96 52L99 50L108 58Z" fill="#FBBF24" />
    </g>
  </svg>
);

export const StockUsageIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ground Shadow */}
    <ellipse cx="80" cy="116" rx="60" ry="7" fill="#FDE68A" opacity="0.4" />
    
    {/* Wheat Stalks in Background */}
    <g id="wheat" opacity="0.85">
      <path d="M118 100C122 80 128 55 136 34" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="128" cy="40" rx="3.5" ry="6" transform="rotate(30 128 40)" fill="#F59E0B" />
      <ellipse cx="138" cy="48" rx="3.5" ry="6" transform="rotate(-30 138 48)" fill="#F59E0B" />
      <ellipse cx="125" cy="52" rx="3.5" ry="6" transform="rotate(30 125 52)" fill="#F59E0B" />
      <ellipse cx="134" cy="62" rx="3.5" ry="6" transform="rotate(-30 134 62)" fill="#F59E0B" />
      <ellipse cx="122" cy="66" rx="3.5" ry="6" transform="rotate(30 122 66)" fill="#F59E0B" />
    </g>

    {/* Large Jute / Burlap Sack of Grain */}
    <g id="sack">
      {/* Sack Body */}
      <path
        d="M36 104C32 82 34 58 44 46C48 42 54 40 64 40C74 40 82 43 86 48C94 58 98 84 94 104C92 110 38 110 36 104Z"
        fill="#D97706"
      />
      <path
        d="M40 102C38 84 39 62 48 50C51 46 56 44 64 44C72 44 79 47 82 52C89 62 92 84 89 102C86 106 42 106 40 102Z"
        fill="#F59E0B"
      />
      {/* Sack Neck & Fold */}
      <path d="M48 44C54 41 74 41 80 44C82 46 80 50 78 51C72 49 56 49 50 51C47 50 46 46 48 44Z" fill="#B45309" />
      {/* Poured Grain Top */}
      <ellipse cx="64" cy="41" rx="16" ry="6" fill="#FEF3C7" />
      <circle cx="60" cy="40" r="1" fill="#D97706" />
      <circle cx="65" cy="42" r="1.2" fill="#D97706" />
      <circle cx="70" cy="39" r="1" fill="#D97706" />
      
      {/* Sack Texture Lines */}
      <path d="M46 70C54 74 74 74 82 70" stroke="#B45309" strokeWidth="1.2" strokeDasharray="2 3" />
      <path d="M44 85C54 90 76 90 84 85" stroke="#B45309" strokeWidth="1.2" strokeDasharray="2 3" />
    </g>

    {/* Blue Bowl of Rice */}
    <g id="bowl">
      <ellipse cx="88" cy="98" rx="24" ry="10" fill="#0284C7" />
      <ellipse cx="88" cy="95" rx="22" ry="7" fill="#38BDF8" />
      {/* Rice Grains Heap */}
      <ellipse cx="88" cy="92" rx="20" ry="8" fill="#F8FAFC" />
      <ellipse cx="88" cy="90" rx="16" ry="5" fill="#FFFFFF" />
      <circle cx="84" cy="90" r="1" fill="#CBD5E1" />
      <circle cx="91" cy="91" r="1" fill="#CBD5E1" />
    </g>

    {/* Wooden Scoop with Rice Spilling */}
    <g id="scoop">
      <ellipse cx="108" cy="104" rx="12" ry="6" transform="rotate(-15 108 104)" fill="#B45309" />
      <ellipse cx="108" cy="103" rx="10" ry="4" transform="rotate(-15 108 103)" fill="#FEF3C7" />
      {/* Scoop Handle */}
      <rect x="114" y="103" width="14" height="4" rx="2" transform="rotate(15 114 103)" fill="#78350F" />
      {/* Spilled grains */}
      <circle cx="98" cy="108" r="1.5" fill="#FEF3C7" />
      <circle cx="102" cy="111" r="1.5" fill="#FEF3C7" />
      <circle cx="106" cy="112" r="1.5" fill="#FEF3C7" />
      <circle cx="92" cy="110" r="1.5" fill="#FEF3C7" />
    </g>
  </svg>
);

export const BalanceRemainingIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shelving Unit Frame */}
    <rect x="28" y="24" width="6" height="92" rx="2" fill="#475569" />
    <rect x="126" y="24" width="6" height="92" rx="2" fill="#475569" />
    {/* Shelf 1 (Top) */}
    <rect x="26" y="52" width="108" height="6" rx="2" fill="#64748B" />
    {/* Shelf 2 (Bottom) */}
    <rect x="26" y="94" width="108" height="6" rx="2" fill="#64748B" />

    {/* Top Shelf Items */}
    {/* 3 Grain Sacks */}
    <g id="top-sacks">
      {/* Sack 1 */}
      <rect x="38" y="32" width="18" height="20" rx="4" fill="#D97706" />
      <ellipse cx="47" cy="32" rx="9" ry="3" fill="#F59E0B" />
      <line x1="47" y1="30" x2="47" y2="34" stroke="#78350F" strokeWidth="1.5" />
      {/* Sack 2 */}
      <rect x="60" y="32" width="18" height="20" rx="4" fill="#D97706" />
      <ellipse cx="69" cy="32" rx="9" ry="3" fill="#F59E0B" />
      <line x1="69" y1="30" x2="69" y2="34" stroke="#78350F" strokeWidth="1.5" />
      {/* Sack 3 */}
      <rect x="82" y="32" width="18" height="20" rx="4" fill="#D97706" />
      <ellipse cx="91" cy="32" rx="9" ry="3" fill="#F59E0B" />
      <line x1="91" y1="30" x2="91" y2="34" stroke="#78350F" strokeWidth="1.5" />
      
      {/* Glass Jar with White Nutrition Powder */}
      <rect x="106" y="34" width="15" height="18" rx="3" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="108" y="32" width="11" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="109" y="40" width="9" height="10" rx="1" fill="#FDE68A" />
    </g>

    {/* Bottom Shelf Items */}
    <g id="bottom-sacks">
      {/* Sack 4 */}
      <rect x="38" y="74" width="18" height="20" rx="4" fill="#B45309" />
      <ellipse cx="47" cy="74" rx="9" ry="3" fill="#D97706" />
      <line x1="47" y1="72" x2="47" y2="76" stroke="#78350F" strokeWidth="1.5" />
      {/* Sack 5 */}
      <rect x="60" y="74" width="18" height="20" rx="4" fill="#B45309" />
      <ellipse cx="69" cy="74" rx="9" ry="3" fill="#D97706" />
      <line x1="69" y1="72" x2="69" y2="76" stroke="#78350F" strokeWidth="1.5" />
      {/* Sack 6 */}
      <rect x="82" y="74" width="18" height="20" rx="4" fill="#B45309" />
      <ellipse cx="91" cy="74" rx="9" ry="3" fill="#D97706" />
      <line x1="91" y1="72" x2="91" y2="76" stroke="#78350F" strokeWidth="1.5" />

      {/* Fortified Oil / Ghee Canister */}
      <rect x="105" y="76" width="17" height="18" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      <rect x="108" y="73" width="6" height="3" rx="1" fill="#B45309" />
      <circle cx="113.5" cy="85" r="4" fill="#FEF3C7" />
    </g>
  </svg>
);

export const SetuShareIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Woman 1 (Left - Pink Saree) */}
    <g id="worker1">
      {/* Hair */}
      <ellipse cx="46" cy="46" rx="14" ry="16" fill="#1E293B" />
      <circle cx="46" cy="38" r="6" fill="#1E293B" />
      {/* Face */}
      <circle cx="48" cy="48" r="10" fill="#FCD34D" />
      <circle cx="51" cy="48" r="1.5" fill="#1E293B" />
      <path d="M49 53C51 55 54 54 54 53" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      {/* Saree & Blouse */}
      <path d="M30 114C30 90 38 72 48 70C58 72 66 90 66 114H30Z" fill="#DB2777" />
      {/* Saree Pallu Accent */}
      <path d="M42 70L32 114H40L50 71Z" fill="#F472B6" />
      {/* Hands holding phone */}
      <ellipse cx="62" cy="86" rx="5" ry="4" fill="#FCD34D" />
    </g>

    {/* Shared Smartphone */}
    <g id="phone">
      <rect x="62" y="70" width="22" height="34" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <rect x="65" y="74" width="16" height="24" rx="2" fill="#0284C7" />
      <circle cx="73" cy="86" r="3" fill="#FFFFFF" />
    </g>

    {/* Digital Share Nodes (Teal / Cyan) */}
    <g id="share-icon">
      <circle cx="64" cy="56" r="4" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="86" cy="46" r="4" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="88" cy="66" r="4" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="64" y1="56" x2="86" y2="46" stroke="#0D9488" strokeWidth="2" strokeDasharray="2 2" />
      <line x1="64" y1="56" x2="88" y2="66" stroke="#0D9488" strokeWidth="2" strokeDasharray="2 2" />
    </g>

    {/* Woman 2 (Right - Green/Yellow Saree) */}
    <g id="worker2">
      {/* Hair */}
      <ellipse cx="114" cy="46" rx="14" ry="16" fill="#1E293B" />
      <circle cx="116" cy="38" r="6" fill="#1E293B" />
      {/* Face */}
      <circle cx="112" cy="48" r="10" fill="#FDE047" />
      <circle cx="109" cy="48" r="1.5" fill="#1E293B" />
      <path d="M106 53C108 55 111 54 111 53" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" />
      {/* Saree & Blouse */}
      <path d="M94 114C94 90 102 72 112 70C122 72 130 90 130 114H94Z" fill="#16A34A" />
      {/* Saree Pallu Yellow Stripe */}
      <path d="M104 70L96 114H104L112 71Z" fill="#FACC15" />
      {/* Hand reaching to phone */}
      <ellipse cx="86" cy="88" rx="5" ry="4" fill="#FDE047" />
    </g>
  </svg>
);

export const DailyFoodMenuIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Thali Plate Shadow */}
    <ellipse cx="80" cy="80" rx="58" ry="34" fill="#E2E8F0" />
    {/* Steel Thali Outer Rim */}
    <ellipse cx="80" cy="74" rx="56" ry="32" fill="#CBD5E1" />
    {/* Steel Thali Rim Highlight */}
    <ellipse cx="80" cy="73" rx="53" ry="29" fill="#E2E8F0" />
    <ellipse cx="80" cy="73" rx="50" ry="26" fill="#F1F5F9" />

    {/* Central Mound of Basmati Rice */}
    <ellipse cx="76" cy="74" rx="22" ry="13" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
    <circle cx="72" cy="72" r="1" fill="#CBD5E1" />
    <circle cx="78" cy="75" r="1" fill="#CBD5E1" />
    <circle cx="82" cy="71" r="1" fill="#CBD5E1" />

    {/* Left Bowl: Vegetable Sabzi (Carrots, Peas, Potatoes) */}
    <ellipse cx="48" cy="62" rx="14" ry="9" fill="#CBD5E1" />
    <ellipse cx="48" cy="61" rx="12" ry="7" fill="#15803D" />
    {/* Veggies */}
    <circle cx="44" cy="60" r="2.5" fill="#EA580C" />
    <circle cx="51" cy="60" r="2.5" fill="#22C55E" />
    <circle cx="47" cy="63" r="2" fill="#FBBF24" />

    {/* Right Bowl: Rich Yellow Dal Tadka */}
    <ellipse cx="110" cy="62" rx="15" ry="10" fill="#CBD5E1" />
    <ellipse cx="110" cy="61" rx="13" ry="8" fill="#F59E0B" />
    {/* Tadka Spices */}
    <circle cx="108" cy="60" r="1" fill="#B45309" />
    <circle cx="113" cy="62" r="1.2" fill="#15803D" />

    {/* Bottom Salad / Sukdi Piece */}
    <ellipse cx="78" cy="88" rx="8" ry="4" fill="#D97706" />
  </svg>
);

export const StudentAttendanceIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Cheerful Schoolgirl Character */}
    <g id="student">
      {/* Hair (Black with pigtails) */}
      <circle cx="68" cy="42" r="18" fill="#1E293B" />
      {/* Pigtails */}
      <ellipse cx="46" cy="46" rx="8" ry="12" fill="#1E293B" />
      <ellipse cx="90" cy="46" rx="8" ry="12" fill="#1E293B" />
      {/* Hair ties */}
      <circle cx="51" cy="42" r="3" fill="#EF4444" />
      <circle cx="85" cy="42" r="3" fill="#EF4444" />

      {/* Face */}
      <circle cx="68" cy="46" r="14" fill="#FDE047" />
      {/* Happy Eyes */}
      <circle cx="63" cy="44" r="2" fill="#0F172A" />
      <circle cx="73" cy="44" r="2" fill="#0F172A" />
      {/* Smiling Mouth */}
      <path d="M63 51C65 55 71 55 73 51" stroke="#B45309" strokeWidth="1.8" strokeLinecap="round" />
      {/* Rosy Cheeks */}
      <circle cx="59" cy="48" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="77" cy="48" r="2.5" fill="#FCA5A5" opacity="0.6" />

      {/* School Uniform (Blue Pinafore & White Collar) */}
      <path d="M48 114L54 74H82L88 114H48Z" fill="#1D4ED8" />
      {/* White Shirt Collar */}
      <path d="M60 74L68 84L76 74Z" fill="#FFFFFF" />

      {/* Raised Right Hand (Present!) */}
      <path d="M48 76L36 50C35 48 37 46 39 47L45 54L54 74Z" fill="#FDE047" />
      <ellipse cx="36" cy="47" rx="4" ry="5" fill="#FDE047" />
      {/* Small fingers waving */}
      <circle cx="34" cy="44" r="1.5" fill="#FDE047" />
      <circle cx="37" cy="43" r="1.5" fill="#FDE047" />
      <circle cx="40" cy="44" r="1.5" fill="#FDE047" />
    </g>

    {/* Green Attendance Checkmark Badge */}
    <g id="check-badge">
      <circle cx="120" cy="50" r="16" fill="#16A34A" />
      <circle cx="120" cy="50" r="14" fill="#22C55E" />
      <path d="M113 50L118 55L128 44" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const MealPhotoIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Camera Body */}
    <rect x="22" y="44" width="76" height="52" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="2" />
    <rect x="26" y="48" width="68" height="44" rx="7" fill="#475569" />
    {/* Camera Top Shutter Bump */}
    <rect x="42" y="38" width="22" height="7" rx="3" fill="#334155" />
    <rect x="70" y="39" width="10" height="5" rx="2" fill="#EA580C" />
    {/* Lens */}
    <circle cx="58" cy="70" r="18" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
    <circle cx="58" cy="70" r="12" fill="#0284C7" />
    <circle cx="54" cy="66" r="4" fill="#BAE6FD" />

    {/* Flash burst sparkles */}
    <path d="M96 34L104 38M102 26L104 34M108 30L116 34" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

    {/* Ejected Photo Card of the Meal Plate */}
    <g id="polaroid" transform="rotate(-6 110 82)">
      <rect x="80" y="52" width="58" height="64" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" className="drop-shadow-sm" />
      {/* Photo viewport */}
      <rect x="84" y="56" width="50" height="42" rx="2" fill="#FEF3C7" />
      {/* Meal Plate inside photo */}
      <ellipse cx="109" cy="77" rx="18" ry="11" fill="#E2E8F0" />
      <ellipse cx="109" cy="76" rx="12" ry="7" fill="#FFFFFF" />
      <circle cx="102" cy="74" r="3" fill="#16A34A" />
      <circle cx="115" cy="74" r="3.5" fill="#F59E0B" />
    </g>
  </svg>
);

export const SmartRationIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Brown Ration Sack */}
    <g id="ration-sack">
      <path
        d="M26 104C22 76 26 56 38 46C46 38 66 38 74 46C86 56 90 76 86 104H26Z"
        fill="#D97706"
      />
      <path
        d="M30 102C26 78 30 60 40 50C48 42 64 42 72 50C82 60 86 78 82 102H30Z"
        fill="#F59E0B"
      />
      {/* Sack Text: RATION */}
      <text x="56" y="74" fill="#78350F" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="1">
        RATION
      </text>
      {/* Green Leaf on Sack */}
      <path d="M56 80C50 82 48 88 52 92C56 92 60 88 58 82Z" fill="#16A34A" />
    </g>

    {/* Recipe Checklist Clipboard */}
    <g id="clipboard">
      <rect x="76" y="34" width="56" height="78" rx="6" fill="#3B82F6" opacity="0.1" />
      <rect x="78" y="32" width="56" height="78" rx="6" fill="#0D9488" stroke="#115E59" strokeWidth="2" />
      <rect x="82" y="38" width="48" height="66" rx="4" fill="#FFFFFF" />
      {/* Clip at top */}
      <rect x="94" y="27" width="24" height="9" rx="3" fill="#64748B" stroke="#334155" strokeWidth="1.5" />

      {/* Checklist Rows with Green Checks */}
      <circle cx="92" cy="50" r="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M90 50L91.5 52L94 48" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="100" y1="50" x2="122" y2="50" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      <circle cx="92" cy="64" r="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M90 64L91.5 66L94 62" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="100" y1="64" x2="122" y2="64" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      <circle cx="92" cy="78" r="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.2" />
      <path d="M90 78L91.5 80L94 76" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="100" y1="78" x2="122" y2="78" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      <line x1="88" y1="92" x2="124" y2="92" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

export const DownloadReportIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shadow */}
    <rect x="42" y="24" width="76" height="88" rx="6" fill="#E2E8F0" />
    {/* Document Paper */}
    <rect x="40" y="22" width="76" height="88" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
    {/* Folded Corner */}
    <path d="M96 22L116 42H100C98 42 96 40 96 38V22Z" fill="#E2E8F0" />

    {/* Report Header Text Bars */}
    <line x1="50" y1="36" x2="88" y2="36" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="44" x2="78" y2="44" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

    {/* Metric Bar Chart (Orange, Yellow, Green) */}
    <g id="bars">
      {/* Bar 1 - Yellow */}
      <rect x="52" y="70" width="8" height="24" rx="2" fill="#FACC15" />
      {/* Bar 2 - Orange */}
      <rect x="66" y="58" width="8" height="36" rx="2" fill="#FB923C" />
      {/* Bar 3 - Emerald Green */}
      <rect x="80" y="48" width="8" height="46" rx="2" fill="#16A34A" />
      {/* Chart Base Line */}
      <line x1="48" y1="96" x2="108" y2="96" stroke="#94A3B8" strokeWidth="1.5" />
    </g>

    {/* Prominent Green Download Circle Button */}
    <g id="download-btn">
      <circle cx="116" cy="88" r="16" fill="#15803D" stroke="#FFFFFF" strokeWidth="2" className="drop-shadow-md" />
      <path d="M116 80V94M110 88L116 94L122 88" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const BillUploadIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ground Shadow */}
    <ellipse cx="80" cy="116" rx="58" ry="7" fill="#E2E8F0" />

    {/* Receipt / Invoice Slip */}
    <g id="bill-receipt">
      {/* Bill Paper with Jagged / Perforated Bottom */}
      <path
        d="M44 24H106C109.3 24 112 26.7 112 30V98L104 93L96 98L88 93L80 98L72 93L64 98L56 93L48 98L40 93V30C40 26.7 42.7 24 44 24Z"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      {/* Header Band on Receipt */}
      <rect x="44" y="28" width="64" height="12" rx="2" fill="#EAF7EE" />
      <line x1="52" y1="34" x2="84" y2="34" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="98" cy="34" r="2.5" fill="#15803D" />

      {/* Bill Items Rows */}
      <line x1="48" y1="48" x2="78" y2="48" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="48" x2="104" y2="48" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

      <line x1="48" y1="56" x2="72" y2="56" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="88" y1="56" x2="104" y2="56" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

      <line x1="48" y1="64" x2="68" y2="64" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="88" y1="64" x2="104" y2="64" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />

      {/* Dashed Separator */}
      <line x1="46" y1="72" x2="106" y2="72" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 2" />

      {/* Rupee Symbol & Total Row */}
      <text x="50" y="84" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="sans-serif">₹ 450</text>
      <rect x="84" y="76" width="22" height="10" rx="3" fill="#DCFCE7" />
      <path d="M88 81L91 84L97 78" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Camera Snap Badge for Photo Attachment */}
    <g id="camera-badge">
      <circle cx="118" cy="46" r="17" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Camera Body */}
      <rect x="108" y="40" width="20" height="14" rx="2.5" fill="#FFFFFF" />
      {/* Camera Flash Top Bump */}
      <path d="M114 40L115 38H121L122 40H114Z" fill="#FFFFFF" />
      {/* Camera Lens */}
      <circle cx="118" cy="47" r="4.2" fill="#EA580C" />
      <circle cx="119" cy="46" r="1.3" fill="#FFFFFF" />
    </g>

    {/* Verified Reimbursed Stamp */}
    <g id="stamp" transform="rotate(-12 60 78)">
      <rect x="42" y="70" width="34" height="15" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" opacity="0.9" />
      <text x="45" y="81" fill="#B45309" fontSize="7" fontWeight="bold" fontFamily="sans-serif">PAID / ભરપાઈ</text>
    </g>
  </svg>
);

export const StudentActivitiesIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ground Shadow */}
    <ellipse cx="80" cy="116" rx="60" ry="7" fill="#E2E8F0" />

    {/* Sun / Active Halo in background */}
    <circle cx="80" cy="46" r="28" fill="#FEF3C7" opacity="0.6" />
    <path d="M80 12V6M80 86V80M46 46H40M120 46H114M56 22L52 18M108 74L104 70M108 22L112 18M56 74L52 70" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

    {/* Educational Blackboard / Alphabet Book on the left */}
    <g id="learning-board">
      <rect x="20" y="46" width="36" height="48" rx="4" fill="#047857" stroke="#065F46" strokeWidth="2" />
      <rect x="23" y="49" width="30" height="42" rx="2" fill="#064E3B" />
      {/* Gujarati Letters & Numbers: ક, ખ, ૧, ૨ */}
      <text x="27" y="64" fill="#FDE047" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ક</text>
      <text x="39" y="64" fill="#6EE7B7" fontSize="11" fontWeight="bold" fontFamily="sans-serif">ખ</text>
      <text x="27" y="80" fill="#93C5FD" fontSize="10" fontWeight="bold" fontFamily="sans-serif">૧</text>
      <text x="39" y="80" fill="#FCA5A5" fontSize="10" fontWeight="bold" fontFamily="sans-serif">૨</text>
      {/* Small Star */}
      <circle cx="46" cy="85" r="1.5" fill="#FDE047" />
    </g>

    {/* Active Child Jumping / Doing Movement Exercise in Center */}
    <g id="active-child">
      {/* Child Head & Smile */}
      <circle cx="82" cy="38" r="9.5" fill="#FCD34D" />
      {/* Hair */}
      <path d="M74 36C74 30 78 28 82 28C86 28 90 30 90 36H74Z" fill="#1E293B" />
      {/* Eyes and Smile */}
      <circle cx="79.5" cy="37" r="1.2" fill="#1E293B" />
      <circle cx="84.5" cy="37" r="1.2" fill="#1E293B" />
      <path d="M79 41C80.5 43 83.5 43 85 41" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

      {/* Raised Arms - Celebratory / Stretching Pose */}
      <path d="M72 58L64 42L68 40L75 52Z" fill="#EA580C" />
      <circle cx="64" cy="40" r="3" fill="#FCD34D" />
      <path d="M92 58L100 42L96 40L89 52Z" fill="#EA580C" />
      <circle cx="100" cy="40" r="3" fill="#FCD34D" />

      {/* Vibrant Orange Sports T-Shirt */}
      <path d="M73 52C73 49 76 47 82 47C88 47 91 49 91 52L89 74H75L73 52Z" fill="#F97316" />

      {/* Active Movement Shorts / Pants */}
      <path d="M75 74L71 94H78L81 80L84 94H91L89 74Z" fill="#2563EB" />
      {/* Running Shoes */}
      <ellipse cx="74" cy="95" rx="5" ry="2.5" fill="#15803D" />
      <ellipse cx="88" cy="95" rx="5" ry="2.5" fill="#15803D" />
    </g>

    {/* Activity Ball / Sports Equipment on the right */}
    <g id="play-ball">
      <circle cx="120" cy="78" r="14" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
      <path d="M120 64C124 70 124 86 120 92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <path d="M110 74C118 76 122 76 130 74" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
      <path d="M110 82C118 80 122 80 130 82" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Camera Snapshot Badge for Activity Photos */}
    <g id="camera-photo-badge">
      <circle cx="128" cy="34" r="13" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="120" y="29" width="16" height="11" rx="2" fill="#FFFFFF" />
      <path d="M125 29L126 27H130L131 29H125Z" fill="#FFFFFF" />
      <circle cx="128" cy="34.5" r="3" fill="#10B981" />
      <circle cx="129" cy="33.5" r="1" fill="#FFFFFF" />
    </g>
  </svg>
);

export const BeneficiaryRegistryIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Ground Shadow */}
    <ellipse cx="80" cy="116" rx="60" ry="7" fill="#E2E8F0" />

    {/* Soft Aura / Protection Sun in background */}
    <circle cx="80" cy="52" r="34" fill="#FEF3C7" opacity="0.6" />

    {/* Mother Holding Child (Anganwadi Beneficiary Motif) */}
    <g id="mother-and-child">
      {/* Mother Body & Sari */}
      <path
        d="M48 114C46 95 50 68 62 58C68 53 78 52 86 58C98 68 102 95 100 114H48Z"
        fill="#047857"
      />
      {/* Mother Pallu / Sari drape */}
      <path
        d="M54 74C62 66 74 62 88 68L84 114H70L62 86L54 114H48L54 74Z"
        fill="#059669"
      />

      {/* Mother Head */}
      <circle cx="74" cy="38" r="10" fill="#FCD34D" />
      {/* Mother Hair / Bun */}
      <path d="M64 36C64 28 72 26 78 26C84 26 86 30 86 36H64Z" fill="#1E293B" />
      <circle cx="86" cy="34" r="4.5" fill="#1E293B" />
      {/* Bindi */}
      <circle cx="72" cy="36" r="1" fill="#DC2626" />
      {/* Gentle Smile */}
      <path d="M72 42C74 43.5 76 43.5 78 42" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

      {/* Child in Arms */}
      <circle cx="92" cy="62" r="7.5" fill="#FCD34D" />
      <path d="M86 60C86 54 92 52 96 52C99 52 100 55 100 60H86Z" fill="#1E293B" />
      <circle cx="90.5" cy="62" r="1" fill="#1E293B" />
      <circle cx="94.5" cy="62" r="1" fill="#1E293B" />
      <path d="M91.5 65C92.5 66 94 66 95 65" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
      {/* Child Swaddle / Clothes */}
      <path d="M84 70C84 66 90 64 96 66L102 88C96 90 88 88 84 84L84 70Z" fill="#F97316" />
    </g>

    {/* Mamata Health Card / Digital Beneficiary Card on the left */}
    <g id="id-card" transform="rotate(-6 32 60)">
      <rect x="18" y="44" width="36" height="48" rx="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
      <rect x="22" y="48" width="28" height="8" rx="2" fill="#DCFCE7" />
      <line x1="25" y1="52" x2="43" y2="52" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
      {/* Photo cutout */}
      <rect x="23" y="60" width="10" height="12" rx="1.5" fill="#E2E8F0" />
      <circle cx="28" cy="64" r="2.5" fill="#94A3B8" />
      {/* Text lines */}
      <line x1="36" y1="62" x2="48" y2="62" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="36" y1="67" x2="46" y2="67" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="23" y1="78" x2="48" y2="78" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="23" y1="83" x2="42" y2="83" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
      {/* Verified Tick */}
      <circle cx="44" cy="84" r="4.5" fill="#10B981" />
      <path d="M42 84L43.5 85.5L46.5 82.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Green Health Plus / Protection Symbol badge on right */}
    <g id="health-badge">
      <circle cx="126" cy="46" r="16" fill="#F0FDF4" stroke="#16A34A" strokeWidth="2" />
      {/* Plus Symbol */}
      <rect x="123" y="38" width="6" height="16" rx="2" fill="#16A34A" />
      <rect x="118" y="43" width="16" height="6" rx="2" fill="#16A34A" />
      {/* Star sparkles */}
      <circle cx="138" cy="34" r="2" fill="#F59E0B" />
      <circle cx="112" cy="34" r="1.5" fill="#F59E0B" />
    </g>
  </svg>
);



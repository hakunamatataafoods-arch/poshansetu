import jsPDF from 'jspdf';
import { getPoshanSetuLogoDataUrl } from './pdfLogo';

export type ManualLanguage = 'gu' | 'en' | 'both';

interface ManualSection {
  step: string;
  stepGu: string;
  titleEn: string;
  titleGu: string;
  summaryEn: string;
  summaryGu: string;
  instructionsEn: string[];
  instructionsGu: string[];
  tipsEn?: string;
  tipsGu?: string;
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    step: 'STEP 1',
    stepGu: 'પગલું ૧',
    titleEn: 'Signing In & Centre Profile',
    titleGu: 'એપ્લિકેશનમાં લોગિન અને કેન્દ્ર પ્રોફાઇલ',
    summaryEn: 'Secure login for authorized Anganwadi Workers (AWW). Works 100% offline.',
    summaryGu: 'અધિકૃત આંગણવાડી કાર્યકર (AWW) માટે સુરક્ષિત પ્રવેશ. ઇન્ટરનેટ વિના પણ સંપૂર્ણ કાર્યરત.',
    instructionsEn: [
      'Open Poshan Setu app on your smartphone or tablet.',
      'Enter your User ID (Default demo: worker) and 4-digit PIN (1234).',
      'Select your preferred language: Gujarati (ગુજરાતી) or English.',
      'Verify your assigned AWC code (04 Vadtal • Taluka Anand) and tap "Sign In".'
    ],
    instructionsGu: [
      'તમારા સ્માર્ટફોન પર પોષણ સેતુ એપ ખોલો.',
      'તમારો વપરાશકર્તા આઈડી (ડેમો: worker) અને ૪-અંકનો પાસવર્ડ (1234) દાખલ કરો.',
      'તમારી પસંદગીની ભાષા (ગુજરાતી અથવા English) પસંદ કરો.',
      'તમારું કેન્દ્ર ૦૪-વડતાલ (તાલુકો આણંદ) ચકાસીને "પોષણસેતુમાં લોગિન કરો" બટન દબાવો.'
    ],
    tipsEn: 'Once logged in, data remains stored offline on your phone even during network cutoffs.',
    tipsGu: 'એકવાર લોગિન કર્યા પછી નેટવર્ક ન હોય તો પણ બધો ડેટા તમારા ફોનમાં સુરક્ષિત રહે છે.'
  },
  {
    step: 'STEP 2',
    stepGu: 'પગલું ૨',
    titleEn: 'Daily Student Attendance',
    titleGu: 'બાળકોની દૈનિક હાજરી નોંધણી',
    summaryEn: 'Record student attendance before meal preparation for exact ration calculation.',
    summaryGu: 'ભોજન રાંધતા પહેલા હાજર બાળકોની ચોક્કસ સંખ્યા નોંધો જેથી રાશનનો સચોટ હિસાબ થાય.',
    instructionsEn: [
      'Tap on "Student Attendance" (બાળકોની હાજરી) on the dashboard.',
      'Tap individual student names to toggle Present (હાજર) or Absent (ગેરહાજર).',
      'Use "Mark All Present" (બધા હાજર) for quick 1-tap full attendance.',
      'Tap "Proceed to Meal Usage" to carry the count automatically into recipe deduction.'
    ],
    instructionsGu: [
      'મુખ્ય ડેશબોર્ડ પરથી "બાળકોની હાજરી" કાર્ડ પર ક્લિક કરો.',
      'દરેક બાળકના નામ પર ટચ કરીને હાજર (લીલો) અથવા ગેરહાજર (લાલ) કરો.',
      'ઝડપી નોંધણી માટે "બધા હાજર" (Mark All Present) બટન વાપરી શકો છો.',
      'હાજરી પુષ્ટિ કર્યા પછી "ભોજન વપરાશ તરફ આગળ વધો" બટન દબાવો.'
    ],
    tipsEn: 'Attendance numbers directly drive the daily grain ration calculation (30g breakfast / 50g lunch).',
    tipsGu: 'હાજર બાળકોની સંખ્યા પરથી જ સવારના નાસ્તા (૩૦ ગ્રામ) અને બપોરના ભોજન (૫૦ ગ્રામ)નું રાશન ગણાય છે.'
  },
  {
    step: 'STEP 3',
    stepGu: 'પગલું ૩',
    titleEn: 'Daily Meal Menu & Ration Deduction',
    titleGu: 'દૈનિક ભોજન મેનૂ અને રાશન વપરાશ',
    summaryEn: 'Select Gujarat Govt approved weekly menu and confirm ingredient stock deductions.',
    summaryGu: 'ગુજરાત સરકાર માન્ય સાપ્તાહિક મેનૂ પસંદ કરો અને સામગ્રીનો જથ્થો ઓટો-બાદ કરો.',
    instructionsEn: [
      'Tap "Daily Food Menu" (દૈનિક ભોજન મેનૂ) on the home screen.',
      'Select Meal Type: Meal 1 (Breakfast - 30g/child) or Meal 2 (Lunch - 50g/child).',
      'Choose the scheduled recipe: e.g. Vegetable Pulao, Balbhog Sheera, or Khichdi-Kadhi.',
      'Review automatically calculated quantities for Rice, Oil, Wheat Atta, and Premix.',
      'Adjust batch weight (+/- 100g) if required, then tap "Confirm Deduction".'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પરથી "દૈનિક ભોજન મેનૂ" બટન પર ક્લિક કરો.',
      'આહાર પ્રકાર પસંદ કરો: આહાર ૧ (નાસ્તો - ૩૦ ગ્રામ) અથવા આહાર ૨ (બપોરનું ભોજન - ૫૦ ગ્રામ).',
      'દિવસ મુજબની વાનગી પસંદ કરો (દા.ત. વેજ પુલાવ, બાલભોગ શીરો, પૌષ્ટિક ખીચડી).',
      'સિસ્ટમ આપમેળે ચોખા, તેલ, લોટ કે પ્રિમિક્સનો વપરાશ ગણી આપશે.',
      'જરૂર મુજબ ૧૦૦ ગ્રામ સુધી વધ-ઘટ કરીને "જથ્થો બાદ કરવાની પુષ્ટિ કરો" પર ક્લિક કરો.'
    ],
    tipsEn: 'A joyful pop sound confirms your deduction, and current warehouse stock updates instantly.',
    tipsGu: 'સફળ પુષ્ટિ પર ખુશીનો પૉપ અવાજ આવશે અને ગોડાઉન સ્ટોક આપમેળે ઓછો થઈ જશે.'
  },
  {
    step: 'STEP 4',
    stepGu: 'પગલું ૪',
    titleEn: 'Local Purchase & Bill Reimbursement',
    titleGu: 'સ્થાનિક ખરીદી અને બિલ અપલોડ ભરપાઈ',
    summaryEn: 'Upload bills for items bought out-of-pocket (Vegetables, Gas, Spices) for DBT bank refund.',
    summaryGu: 'સરકાર સિવાય સ્થાનિક ખરીદેલ ચીજો (શાકભાજી, મસાલા, ગેસ)ના બિલ અપલોડ કરો અને સીધા ખાતામાં નાણાં મેળવો.',
    instructionsEn: [
      'Tap "Bill Upload & Reimbursement" (બિલ અપલોડ અને ભરપાઈ) on the dashboard.',
      'Select Expense Category: Fresh Vegetables, LPG Gas Cylinder, Spices, Fruits, or Cleaning.',
      'Enter Invoice Number, Bill Date, Vendor/Shop Name, and Bill Amount (₹).',
      'Add Remarks explaining the reason (e.g. fresh green vegetables purchased for daily nutrition).',
      'Click "Upload Photo of Bill" using camera or gallery to attach the physical receipt.',
      'Tap "Confirm & Submit Claim". Reimbursed funds will be credited directly to your registered bank account.'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પર "બિલ અપલોડ અને ભરપાઈ" કાર્ડ પર ક્લિક કરો.',
      'ખર્ચનો પ્રકાર પસંદ કરો: તાજા શાકભાજી, ગેસ સિલિન્ડર, મસાલા, સ્થાનિક ફળ કે સફાઈ સામગ્રી.',
      'બિલ/પહોંચ નંબર, તારીખ, દુકાનદારનું નામ અને બિલની રકમ (₹) દાખલ કરો.',
      'શેરો/નોંધ લખો (દા.ત. બાળકોના પોષણ માટે સ્થાનિક બજારમાંથી લીલા શાકભાજી ખરીદ્યા).',
      'કેમેરા અથવા ગેલેરીમાંથી બિલનો ફોટો સ્પષ્ટ રીતે અપલોડ કરો.',
      '"પુષ્ટિ કરો અને બિલ સબમિટ કરો" બટન દબાવો. મંજૂરી બાદ નાણાં સીધા તમારા બેંક ખાતામાં જમા થશે.'
    ],
    tipsEn: 'Keep the original physical paper receipt filed in your Anganwadi center file for audit.',
    tipsGu: 'મૂળ કાગળનું બિલ ઓડિટ માટે આંગણવાડી કેન્દ્રની વાઉચર ફાઇલમાં સાચવીને રાખો.'
  },
  {
    step: 'STEP 5',
    stepGu: 'પગલું ૫',
    titleEn: 'Stock Received from Warehouse',
    titleGu: 'ગોડાઉન સ્ટોક આવક નોંધણી (ચલણ)',
    summaryEn: 'Record bulk deliveries of Fortified Rice, Bal Shakti, Matru Shakti, and Oil.',
    summaryGu: 'કેન્દ્ર પર આવતા ફોર્ટિફાઇડ ચોખા, બાલ શક્તિ, માતૃ શક્તિ અને તેલની ચલણ મુજબ આવક નોંધો.',
    instructionsEn: [
      'Tap "Stock Received" (સ્ટોક આવક) on the home screen.',
      'Enter the official Delivery Challan Number and Supplier Name.',
      'Input the quantities received, Batch Numbers, and Expiry Dates.',
      'Tap "Confirm Stock Inward" to add items to your live inventory.'
    ],
    instructionsGu: [
      'મુખ્ય પેજ પર "સ્ટોક આવક" કાર્ડ પર ક્લિક કરો.',
      'સત્તાવાર ડિલિવરી ચલણ નંબર અને સપ્લાયરનું નામ દાખલ કરો.',
      'આવેલ જથ્થો, બેચ નંબર અને એક્સપાયરી તારીખ દાખલ કરો.',
      '"સ્ટોક આવકની પુષ્ટિ કરો" દબાવો જેથી ગોડાઉનમાં નવો જથ્થો ઉમેરાઈ જશે.'
    ]
  },
  {
    step: 'STEP 6',
    stepGu: 'પગલું ૬',
    titleEn: 'Inter-Centre Stock Sharing (Setu Share)',
    titleGu: 'સેતુ શેર વિનિમય (આપસી સ્ટોક આપ-લે)',
    summaryEn: 'Safely transfer excess stock to or receive emergency stock from a neighboring AWC.',
    summaryGu: 'નજીકના અન્ય આંગણવાડી કેન્દ્ર સાથે ૪-અંકના સુરક્ષિત કોડ વડે સ્ટોકની આપ-લે કરો.',
    instructionsEn: [
      'Tap "Setu Share Exchange" (સેતુ શેર વિનિમય) on the dashboard.',
      'Select whether you are Giving Stock (આપેલ) or Receiving Stock (મેળવેલ).',
      'Select the peer AWC centre name, item, and quantity.',
      'Verify the 4-digit security code (e.g. #8491) to complete the dual-authorized exchange.'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પર "સેતુ શેર વિનિમય" કાર્ડ ખોલો.',
      'તમે સ્ટોક અન્ય કેન્દ્રને આપી રહ્યા છો કે મેળવી રહ્યા છો તે પસંદ કરો.',
      'સામેના કેન્દ્રનું નામ, સામગ્રી અને જથ્થો પસંદ કરો.',
      '૪-અંકનો વેરિફિકેશન કોડ (દા.ત. #8491) ચકાસીને વિનિમય પૂર્ણ કરો.'
    ]
  },
  {
    step: 'STEP 7',
    stepGu: 'પગલું ૭',
    titleEn: 'Monthly Progress Report (MPR-6) Download',
    titleGu: 'માસિક પ્રગતિ રિપોર્ટ (MPR-6) ડાઉનલોડ',
    summaryEn: 'Generate official Gujarat Govt Form MPR-6 for supervisor submission in PDF or Excel.',
    summaryGu: 'સુપરવાઇઝર અને સીડીપીઓ માટે સત્તાવાર ફોર્મ MPR-6 પીડીએફ અથવા એક્સેલમાં ડાઉનલોડ કરો.',
    instructionsEn: [
      'Tap "Download Report" (રિપોર્ટ ડાઉનલોડ) on the home screen.',
      'Select Report Scope: Full Ledger, Inventory Only, or Attendance Only.',
      'Review the live preview sheet with Gujarat Govt emblem and official ledger.',
      'Tap "Download PDF" to save or print, or "Export CSV" for digital spreadsheet filing.'
    ],
    instructionsGu: [
      'મુખ્ય પેજ પર "રિપોર્ટ ડાઉનલોડ" પર ક્લિક કરો.',
      'રિપોર્ટ પ્રકાર પસંદ કરો: સંપૂર્ણ લેજર, માત્ર સ્ટોક અથવા માત્ર હાજરી.',
      'ગુજરાત સરકાર માન્ય ફોર્મ MPR-6 નો પ્રિવ્યુ તપાસો.',
      '"PDF ડાઉનલોડ કરો" પર ક્લિક કરીને કાગળ પર પ્રિન્ટ કાઢો અથવા "CSV એક્સપોર્ટ" કરો.'
    ]
  },
  {
    step: 'STEP 8',
    stepGu: 'પગલું ૮',
    titleEn: 'Poshan Vani Voice Assistant & Offline Mode',
    titleGu: 'પોષણ વાણી અવાજ સહાયક અને ઑફલાઇન ઉપયોગ',
    summaryEn: 'Speak in Gujarati or English to check stock, record attendance, and use 100% offline.',
    summaryGu: 'ગુજરાતીમાં બોલીને સ્ટોક જાણો, હાજરી પૂરો અને ઇન્ટરનેટ વિના પણ શાંતિથી કામ કરો.',
    instructionsEn: [
      'Tap the floating "🎙️ પોષણ વાણી" button at the bottom right.',
      'Speak your question, e.g.: "ચોખાનો કેટલો સ્ટોક બાકી છે?" or "બધા બાળકો હાજર કરો".',
      'The assistant will understand and execute the action with instant audio confirmation.',
      'Even when offline, all entries are saved locally and sync automatically when internet returns.'
    ],
    instructionsGu: [
      'નીચે જમણી બાજુ આવેલ "🎙️ પોષણ વાણી" માઈક બટન પર ટચ કરો.',
      'તમારો સવાલ બોલો, જેમ કે: "ચોખાનો કેટલો સ્ટોક છે?" અથવા "બધા બાળકો હાજર કરો".',
      'અવાજ સહાયક તમારી વાત સમજીને તુરંત જવાબ આપશે અને કામ કરશે.',
      'ઇન્ટરનેટ ન હોય તો પણ બધી નોંધ તમારા ફોનમાં સાચવાઈ રહે છે અને નેટ મળતાં આપમેળે સિંક થાય છે.'
    ]
  }
];

/**
 * Draws a multi-page high-resolution PDF user manual.
 * Uses high-DPI HTML5 Canvas for flawless Gujarati Unicode typography rendering,
 * then embeds into standard jsPDF A4 pages.
 */
export async function generateWorkerManualPdf(manualLang: ManualLanguage = 'both'): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;

  // Render Page via Canvas for pristine Gujarati fonts
  const renderCanvasPage = async (pageNumber: number, totalPages: number, contentDrawer: (ctx: CanvasRenderingContext2D, width: number, height: number) => void): Promise<string> => {
    const scale = 2.5; // High resolution
    const canvas = document.createElement('canvas');
    canvas.width = 794 * scale;
    canvas.height = 1123 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.scale(scale, scale);
    const w = 794;
    const h = 1123;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Decorative top header bar
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#15803D');
    grad.addColorStop(0.5, '#166534');
    grad.addColorStop(1, '#0F766E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 110);

    // Orange sub-band
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(0, 110, w, 6);

    // Header Content
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillText('POSHAN SETU • પોષણ સેતુ', 32, 42);

    ctx.font = '13px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.fillStyle = '#DCFCE7';
    ctx.fillText('GOVERNMENT OF GUJARAT • ICDS & POSHAN ABHIYAAN', 32, 64);
    ctx.fillText('આંગણવાડી કાર્યકર તાલીમ અને સત્તાવાર ઉપયોગ માર્ગદર્શિકા', 32, 84);

    // Right Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.roundRect(w - 200, 24, 168, 64, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('AWC: 04 VADTAL', w - 188, 45);
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('TALUKA ANAND • GUJARAT', w - 188, 61);
    ctx.fillText('OFFICIAL WORKER MANUAL', w - 188, 77);

    // Run custom drawer
    contentDrawer(ctx, w, h);

    // Bottom Footer
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, h - 45, w, 45);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, h - 45, w, 1);

    ctx.fillStyle = '#64748B';
    ctx.font = '10.5px system-ui, sans-serif';
    ctx.fillText('Poshan Setu User Guide • Helpline: 14408 • Childline: 1098', 32, h - 22);

    ctx.textAlign = 'right';
    ctx.fillText(`Page ${pageNumber} of ${totalPages}`, w - 32, h - 22);
    ctx.textAlign = 'left';

    return canvas.toDataURL('image/jpeg', 0.95);
  };

  // Divide sections into 3 pages for clean, legible reading
  // Page 1: Overview + Step 1 + Step 2 + Step 3
  // Page 2: Step 4 (Bill Upload) + Step 5 (Stock Inward) + Step 6 (Inter-Centre Share)
  // Page 3: Step 7 (Report MPR-6) + Step 8 (Voice Assistant & Offline) + Emergency Contacts

  // Page 1
  const page1Img = await renderCanvasPage(1, 3, (ctx, w) => {
    // Title Box
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(32, 132, w - 64, 76, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('આંગણવાડી કાર્યકર વપરાશ માર્ગદર્શિકા (Anganwadi Worker User Guide)', 48, 162);
    ctx.font = '12.5px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('આ માર્ગદર્શિકા પોષણસેતુ એપ્લિકેશનના દરેક મોડ્યુલનો ઉપયોગ સરળ રીતે સમજાવે છે.', 48, 186);

    // Steps 1, 2, 3
    let y = 224;
    const p1Steps = [MANUAL_SECTIONS[0], MANUAL_SECTIONS[1], MANUAL_SECTIONS[2]];

    p1Steps.forEach((sec) => {
      // Step Card
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, 260, 10);
      ctx.fill();
      ctx.stroke();

      // Step Header
      ctx.fillStyle = '#DCFCE7';
      ctx.beginPath();
      ctx.roundRect(44, y + 14, 80, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 52, y + 30);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 136, y + 31);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 58);

      // Dual Instructions
      let iy = y + 80;
      sec.instructionsGu.forEach((inst, idx) => {
        // Bullet
        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.arc(52, iy - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(inst, 64, iy);

        if (manualLang !== 'gu' && sec.instructionsEn[idx]) {
          ctx.fillStyle = '#64748B';
          ctx.font = '10.5px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 14);
          iy += 32;
        } else {
          iy += 22;
        }
      });

      if (sec.tipsGu) {
        ctx.fillStyle = '#FEF3C7';
        ctx.strokeStyle = '#FDE68A';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(44, y + 215, w - 88, 32, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#92400E';
        ctx.font = '11px system-ui, sans-serif';
        ctx.fillText('💡 વિશેષ નોંધ / Tip: ' + sec.tipsGu, 54, y + 235);
      }

      y += 278;
    });
  });

  // Page 2: Step 4 (Local Bill Upload & Reimbursement), Step 5 (Stock Inward), Step 6 (Setu Share)
  const page2Img = await renderCanvasPage(2, 3, (ctx, w) => {
    // Header for Page 2
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(32, 130, w - 64, 48, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('સ્થાનિક ખરીદી, ગોડાઉન આવક અને આપસી સ્ટોક શેરિંગ (Local Purchases & Inventory)', 48, 159);

    let y = 194;
    const p2Steps = [MANUAL_SECTIONS[3], MANUAL_SECTIONS[4], MANUAL_SECTIONS[5]];

    p2Steps.forEach((sec, sIdx) => {
      const cardHeight = sIdx === 0 ? 300 : 255;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = sIdx === 0 ? '#86EFAC' : '#E2E8F0';
      ctx.lineWidth = sIdx === 0 ? 1.8 : 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, cardHeight, 10);
      ctx.fill();
      ctx.stroke();

      // Step Header
      ctx.fillStyle = sIdx === 0 ? '#DCFCE7' : '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect(44, y + 14, 80, 24, 6);
      ctx.fill();

      ctx.fillStyle = sIdx === 0 ? '#15803D' : '#334155';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 52, y + 30);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 136, y + 31);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 58);

      let iy = y + 80;
      sec.instructionsGu.forEach((inst, idx) => {
        ctx.fillStyle = sIdx === 0 ? '#EA580C' : '#16A34A';
        ctx.beginPath();
        ctx.arc(52, iy - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(inst, 64, iy);

        if (manualLang !== 'gu' && sec.instructionsEn[idx]) {
          ctx.fillStyle = '#64748B';
          ctx.font = '10.5px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 13);
          iy += 31;
        } else {
          iy += 21;
        }
      });

      if (sec.tipsGu) {
        ctx.fillStyle = '#FFF7ED';
        ctx.strokeStyle = '#FED7AA';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(44, y + cardHeight - 44, w - 88, 30, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#C2410C';
        ctx.font = '11px system-ui, sans-serif';
        ctx.fillText('💡 વિશેષ નિયમ: ' + sec.tipsGu, 54, y + cardHeight - 25);
      }

      y += cardHeight + 18;
    });
  });

  // Page 3: Step 7 (Report MPR-6), Step 8 (Voice & Offline), and Official Helplines Box
  const page3Img = await renderCanvasPage(3, 3, (ctx, w) => {
    let y = 130;
    const p3Steps = [MANUAL_SECTIONS[6], MANUAL_SECTIONS[7]];

    p3Steps.forEach((sec) => {
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, 255, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#DCFCE7';
      ctx.beginPath();
      ctx.roundRect(44, y + 14, 80, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 52, y + 30);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 136, y + 31);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 58);

      let iy = y + 80;
      sec.instructionsGu.forEach((inst, idx) => {
        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.arc(52, iy - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(inst, 64, iy);

        if (manualLang !== 'gu' && sec.instructionsEn[idx]) {
          ctx.fillStyle = '#64748B';
          ctx.font = '10.5px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 14);
          iy += 32;
        } else {
          iy += 22;
        }
      });

      y += 272;
    });

    // Official Helplines & Supervisor Support Box
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(32, y + 10, w - 64, 230, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('સત્તાવાર સંપર્ક અને તાત્કાલિક સહાય (Official Support & Helplines)', 48, y + 42);

    // Helpline Cards
    const hColW = (w - 110) / 2;

    // Toll Free 14408
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(48, y + 60, hColW, 70, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803D';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('📞 14408', 64, y + 90);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('પોષણ ટ્રેકર ટોલ-ફ્રી હેલ્પલાઇન', 64, y + 108);
    ctx.fillText('સોમવાર થી શનિવાર (૯:૦૦ થી ૬:૦૦)', 64, y + 122);

    // Childline 1098
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FED7AA';
    ctx.beginPath();
    ctx.roundRect(48 + hColW + 14, y + 60, hColW, 70, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText('🚨 1098', 64 + hColW + 14, y + 90);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('ચાઇલ્ડલાઇન ઇમરજન્સી હેલ્પલાઇન', 64 + hColW + 14, y + 108);
    ctx.fillText('૨૪ કલાક મફત સેવા', 64 + hColW + 14, y + 122);

    // Supervisor Details
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(48, y + 142, w - 96, 76, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText('કેન્દ્ર સુપરવાઇઝર: શ્રીમતી શારદાબેન શાહ • સેક્ટર વડતાલ (તાલુકો આણંદ)', 64, y + 168);
    ctx.font = '11.5px system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('CDPO કચેરી સંપર્ક: +91 2692 245901 • ઇમેઇલ: cdpo-anand-wcd@gujarat.gov.in', 64, y + 188);
    ctx.fillText('કોઈપણ ટેકનિકલ પ્રશ્ન કે સ્ટોક તફાવત માટે આપના સેક્ટર સુપરવાઇઝરનો તાત્કાલિક સંપર્ક કરો.', 64, y + 204);
  });

  // Assemble into PDF
  doc.addImage(page1Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  doc.addPage();
  doc.addImage(page2Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  doc.addPage();
  doc.addImage(page3Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);

  const filename = manualLang === 'gu'
    ? 'Poshan_Setu_Worker_Manual_Gujarati.pdf'
    : manualLang === 'en'
    ? 'Poshan_Setu_Worker_Manual_English.pdf'
    : 'Poshan_Setu_Worker_Manual_Bilingual.pdf';

  doc.save(filename);
}

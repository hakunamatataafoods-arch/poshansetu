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
  mockTag?: string;
}

const MANUAL_SECTIONS: ManualSection[] = [
  {
    step: 'STEP 1',
    stepGu: 'પગલું ૧',
    titleEn: 'Signing In & Centre Profile',
    titleGu: 'એપ્લિકેશનમાં લોગિન અને કેન્દ્ર ચકાસણી',
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
    tipsEn: 'Data remains stored offline on your phone even during network cutoffs and syncs automatically.',
    tipsGu: 'નેટવર્ક ન હોય તો પણ બધો ડેટા તમારા ફોનમાં સુરક્ષિત રહે છે અને નેટ મળતાં આપમેળે સિંક થાય છે.',
    mockTag: 'LOGIN'
  },
  {
    step: 'STEP 2',
    stepGu: 'પગલું ૨',
    titleEn: 'Stock Received (Challan, 0-Item & Tuver Dal)',
    titleGu: 'ગોડાઉન સ્ટોક આવક (ચલણ, ઝીરો આઇટમ વિકલ્પ અને તુવેર દાળ)',
    summaryEn: 'Record delivery challan arrivals. If an item was not received, delete or set to 0 kg. Tuver Dal supported.',
    summaryGu: 'સરકારી ચલણ મુજબ આવક નોંધો. જો કોઈ વસ્તુ (ચોખા) ન આવી હોય તો ડિલીટ કરો અથવા ૦ કિલો સેટ કરો. તુવેર દાળ ઉપલબ્ધ.',
    instructionsEn: [
      'Enter official Delivery Challan Number and Supplier Name (e.g. Civil Supplies).',
      'Input received quantities for Rice, Whole Wheat Atta, Edible Oil, Premixes, and Tuver Dal.',
      'If an item was not supplied, tap the red trash can icon to delete or set quantity to 0 kg.',
      'Verify individual batch numbers and expiry dates, then tap "Confirm Stock Inward".'
    ],
    instructionsGu: [
      'સત્તાવાર ડિલિવરી ચલણ નંબર અને સપ્લાયરનું નામ (દા.ત. નાગરિક પુરવઠા નિગમ) દાખલ કરો.',
      'ચોખા, ઘઉંનો લોટ, તેલ, બાલ/માતૃ/પૂર્ણા શક્તિ અને તુવેર દાળનો આવેલ જથ્થો દાખલ કરો.',
      'જો કોઈ વસ્તુ ન આવી હોય તો લાલ કચરાપેટી દબાવી ડિલીટ કરો અથવા જથ્થો શૂન્ય (૦) કિલો કરો.',
      'બેચ નંબર અને એક્સપાયરી તારીખ ચકાસી "સ્ટોક આવકની પુષ્ટિ કરો" બટન દબાવો.'
    ],
    tipsEn: 'Setting non-received items to 0 prevents false inflated stock from being added to your warehouse.',
    tipsGu: 'ઝીરો આઇટમ વિકલ્પથી તમારા કેન્દ્રના ગોડાઉનમાં કોઈ ખોટો બિન-આવેલ જથ્થો નોંધાશે નહીં.',
    mockTag: 'INWARD'
  },
  {
    step: 'STEP 3',
    stepGu: 'પગલું ૩',
    titleEn: 'Daily Student Attendance',
    titleGu: 'બાળકોની દૈનિક હાજરી નોંધણી',
    summaryEn: 'Record student attendance before meal preparation. Count carries directly into recipe calculation.',
    summaryGu: 'ભોજન રાંધતા પહેલા હાજર બાળકોની સંખ્યા નોંધો. આ સંખ્યા સીધી રાશન ગણતરીમાં આગળ વધે છે.',
    instructionsEn: [
      'Tap on "Student Attendance" (બાળકોની હાજરી) on the dashboard.',
      'Tap individual student names to toggle Present (green) or Absent (red).',
      'Use "Mark All Present" (બધા હાજર) for quick 1-tap full attendance of all 10 students.',
      'Tap "Proceed to Meal Usage" to carry the count automatically into recipe deduction.'
    ],
    instructionsGu: [
      'મુખ્ય ડેશબોર્ડ પરથી "બાળકોની હાજરી" કાર્ડ પર ક્લિક કરો.',
      'દરેક બાળકના નામ પર ટચ કરીને હાજર (લીલો) અથવા ગેરહાજર (લાલ) કરો.',
      'ઝડપી નોંધણી માટે "બધા હાજર" (Mark All Present) બટન દબાવી તમામ ૧૦ બાળકો હાજર કરો.',
      'હાજરી પુષ્ટિ કર્યા પછી "ભોજન વપરાશ તરફ આગળ વધો" બટન દબાવો.'
    ],
    tipsEn: 'Attendance headcount directly determines the exact 30g Breakfast and 50g Lunch recipe portions.',
    tipsGu: 'હાજર બાળકોની સંખ્યા પરથી જ સવારના નાસ્તા (૩૦ ગ્રામ) અને બપોરના ભોજન (૫૦ ગ્રામ)નું રાશન ગણાય છે.',
    mockTag: 'ATTENDANCE'
  },
  {
    step: 'STEP 4',
    stepGu: 'પગલું ૪',
    titleEn: 'Daily Meal Menu & Ration Auto-Deduction',
    titleGu: 'દૈનિક ભોજન મેનૂ અને રાશન ઓટો-કપાત',
    summaryEn: 'Select Gujarat Govt weekly recipe. Automatically calculates and deducts ingredients from pantry.',
    summaryGu: 'ગુજરાત સરકાર માન્ય સાપ્તાહિક મેનૂ પસંદ કરો. સામગ્રી આપમેળે ગણાઈને ગોડાઉનમાંથી બાદ થાય છે.',
    instructionsEn: [
      'Tap "Daily Food Menu" (દૈનિક ભોજન મેનૂ) on the home screen.',
      'Select Meal Type: Meal 1 (Breakfast - 30g/child) or Meal 2 (Lunch - 50g/child).',
      'Choose scheduled recipe: e.g. Vegetable Pulao, Balbhog Sheera, or Pushtik Khichdi-Kadhi.',
      'Review automatically calculated quantities for Rice, Oil, Wheat Atta, and Tuver Dal.',
      'Adjust batch weight (+/- 100g) if required, then tap "Confirm Deduction".'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પરથી "દૈનિક ભોજન મેનૂ" બટન પર ક્લિક કરો.',
      'આહાર પ્રકાર પસંદ કરો: આહાર ૧ (નાસ્તો - ૩૦ ગ્રામ) અથવા આહાર ૨ (બપોરનું ભોજન - ૫૦ ગ્રામ).',
      'વાર મુજબની વાનગી પસંદ કરો (દા.ત. વેજ પુલાવ, બાલભોગ શીરો, પૌષ્ટિક ખીચડી-કઢી).',
      'સિસ્ટમ આપમેળે ચોખા, તેલ, લોટ અને દાળનો વપરાશ ગણી આપશે (+/- ૧૦૦ ગ્રામ વધ-ઘટ શક્ય).',
      '"જથ્થો બાદ કરવાની પુષ્ટિ કરો" બટન દબાવો જેથી ગોડાઉન સ્ટોક ઓછો થઈ જાય.'
    ],
    tipsEn: 'A cheerful audio chime confirms deduction and live warehouse inventory updates instantly.',
    tipsGu: 'પુષ્ટિ થતાં જ ખુશીનો પૉપ અવાજ આવશે અને ગોડાઉન સ્ટોક આપમેળે ઓછો થઈ જશે.',
    mockTag: 'MEAL'
  },
  {
    step: 'STEP 5',
    stepGu: 'પગલું ૫',
    titleEn: 'Geotagged Hot Meal Photo Upload',
    titleGu: 'ગરમ ભોજન ફોટો અપલોડ અને જીપીએસ લોકેશન',
    summaryEn: 'Capture fresh hot cooked meal with camera. Automatically stamped with GPS coords and cloud uploaded.',
    summaryGu: 'તાજા રાંધેલ ગરમ ભોજનનો ફોટો કેમેરાથી પાડો. જીપીએસ લોકેશન અને સમયના વોટરમાર્ક સાથે ડેટાબેઝમાં સાચવો.',
    instructionsEn: [
      'Tap "Meal Photo Upload" (ભોજન ફોટો અપલોડ) on the dashboard.',
      'Tap "Take Photo with Camera" or pick from your device gallery.',
      'Check the automatic live GPS watermark: Latitude, Longitude, Date, and Time.',
      'Tap "Save & Upload to Database" to log proof for supervisor inspection.'
    ],
    instructionsGu: [
      'મુખ્ય પેજ પર "ભોજન ફોટો અપલોડ" કાર્ડ પર ક્લિક કરો.',
      '"કેમેરા વડે ફોટો લો" બટન દબાવી રસોઈનો સ્પષ્ટ ફોટો પાડો અથવા ગેલેરીમાંથી પસંદ કરો.',
      'ફોટા પર આપમેળે લાગેલ જીપીએસ લોકેશન (અક્ષાંશ/રેખાંશ) અને સમય તપાસો.',
      '"ડેટાબેઝમાં સાચવો" બટન દબાવો જેથી સુપરવાઇઝર ઇન્સ્પેક્શનમાં પુરાવો જમા થાય.'
    ],
    tipsEn: 'Upload before 12:30 PM daily to ensure your centre shows green on the CDPO inspection monitor.',
    tipsGu: 'દરરોજ બપોરે ૧૨:૩૦ પહેલાં ફોટો અપલોડ કરવાથી સુપરવાઇઝર મોનિટર પર તમારું કેન્દ્ર ગ્રીન દેખાશે.',
    mockTag: 'PHOTO'
  },
  {
    step: 'STEP 6',
    stepGu: 'પગલું ૬',
    titleEn: 'Local Purchase & Bill Reimbursement',
    titleGu: 'સ્થાનિક ખરીદી બિલ અપલોડ અને બેંક ભરપાઈ',
    summaryEn: 'Upload bills for local out-of-pocket purchases (Vegetables, Gas, Spices). Funds credited via DBT.',
    summaryGu: 'સ્થાનિક ખરીદેલ શાકભાજી, મસાલા અને ગેસ સિલિન્ડરના બિલ અપલોડ કરો. નાણાં સીધા બેંક ખાતામાં DBT દ્વારા જમા થશે.',
    instructionsEn: [
      'Tap "Bill Upload & Reimbursement" (બિલ અપલોડ અને ભરપાઈ) on the dashboard.',
      'Select Category: Fresh Vegetables, LPG Gas Cylinder, Spices, Fruits, or Cleaning.',
      'Enter Invoice Number, Bill Date, Vendor/Shop Name, and Bill Amount (₹).',
      'Add Remarks and click "Upload Photo of Bill" using camera or gallery.',
      'Tap "Confirm & Submit Claim". Reimbursed funds will be credited directly to your bank account.'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પર "બિલ અપલોડ અને ભરપાઈ" કાર્ડ પર ક્લિક કરો.',
      'ખર્ચનો પ્રકાર પસંદ કરો: તાજા શાકભાજી, ગેસ સિલિન્ડર, મસાલા, સ્થાનિક ફળ કે સફાઈ સામગ્રી.',
      'બિલ/પહોંચ નંબર, તારીખ, દુકાનદારનું નામ અને બિલની રકમ (₹) દાખલ કરો.',
      'શેરો/નોંધ લખો અને કેમેરા અથવા ગેલેરીમાંથી અસલ બિલનો ફોટો અપલોડ કરો.',
      '"પુષ્ટિ કરો અને બિલ સબમિટ કરો" દબાવો. મંજૂરી બાદ નાણાં સીધા તમારા બેંક ખાતામાં જમા થશે.'
    ],
    tipsEn: 'Keep the original physical paper receipt safely filed in your centre voucher folder for audit.',
    tipsGu: 'મૂળ કાગળનું બિલ ઓડિટ માટે આંગણવાડી કેન્દ્રની વાઉચર ફાઇલમાં સાચવીને રાખો.',
    mockTag: 'BILL'
  },
  {
    step: 'STEP 7',
    stepGu: 'પગલું ૭',
    titleEn: 'Stock Usage & Take-Home Ration (THR) Distribution',
    titleGu: 'સ્ટોક વપરાશ અને પૂરક આહાર (THR) વિતરણ',
    summaryEn: 'Distribute Bal Shakti, Matru Shakti, Purna Shakti packets and Tuver Dal to mothers and infants.',
    summaryGu: 'ધાત્રી માતાઓ, સગર્ભા બહેનો અને બાળકોને પૂરક આહાર પેકેટ્સ તેમજ તુવેર દાળનું વિતરણ કરો.',
    instructionsEn: [
      'Tap "Stock Usage" and select beneficiary category (Pregnant, Lactating, Infant).',
      'Select beneficiary name and enter quantities for THR packets and Tuver Dal.',
      'Attach beneficiary receipt or distribution photo (optional).',
      'Tap "Confirm Distribution" to automatically deduct from your warehouse stock.'
    ],
    instructionsGu: [
      'મુખ્ય પેજ પર "સ્ટોક વપરાશ" કાર્ડ ખોલી લાભાર્થીની શ્રેણી પસંદ કરો.',
      'લાભાર્થીનું નામ પસંદ કરી આપેલ પેકેટ્સ અને તુવેર દાળનો જથ્થો દાખલ કરો.',
      'લાભાર્થીની રસીદ કે વિતરણનો ફોટો જોડો (મરજિયાત).',
      '"વિતરણ પુષ્ટિ કરો" બટન દબાવો જેથી ગોડાઉન સ્ટોકમાંથી જથ્થો બાદ થાય.'
    ],
    tipsEn: 'Aim for 100% THR packet distribution before the 25th of every month.',
    tipsGu: 'દર મહિનાની ૨૫ તારીખ પહેલાં ૧૦૦% વિતરણ પૂર્ણ કરવાનું લક્ષ્યાંક રાખો.',
    mockTag: 'DISTRIBUTION'
  },
  {
    step: 'STEP 8',
    stepGu: 'પગલું ૮',
    titleEn: 'Inter-Centre Stock Sharing (Setu Share)',
    titleGu: 'સેતુ શેર વિનિમય (આપસી સ્ટોક આપ-લે)',
    summaryEn: 'Safely transfer excess stock to or receive emergency stock from a neighboring AWC with OTP #8491.',
    summaryGu: 'નજીકના અન્ય આંગણવાડી કેન્દ્ર સાથે ૪-અંકના સુરક્ષિત કોડ (#8491) વડે સ્ટોકની આપ-લે કરો.',
    instructionsEn: [
      'Tap "Setu Share Exchange" (સેતુ શેર વિનિમય) on the dashboard.',
      'Select whether you are Giving Stock (Lend) or Receiving Stock (Borrow).',
      'Select the peer AWC centre name, item (Rice, Oil, Atta, Dal), and quantity.',
      'Verify the 4-digit security code (e.g. #8491) to complete the dual-authorized exchange.'
    ],
    instructionsGu: [
      'ડેશબોર્ડ પરથી "સેતુ શેર વિનિમય" કાર્ડ ખોલો.',
      'તમે સ્ટોક અન્ય કેન્દ્રને આપી રહ્યા છો કે મેળવી રહ્યા છો તે પસંદ કરો.',
      'સામેના કેન્દ્રનું નામ, સામગ્રી (ચોખા, તેલ, લોટ, દાળ) અને જથ્થો પસંદ કરો.',
      '૪-અંકનો વેરિફિકેશન કોડ (દા.ત. #8491) ચકાસીને વિનિમય પૂર્ણ કરો.'
    ],
    tipsEn: 'Transfers automatically reflect in both centres’ monthly MPR-6 ledgers.',
    tipsGu: 'આપ-લે થયેલ જથ્થો બંને કેન્દ્રોના માસિક MPR-6 રિપોર્ટમાં આપમેળે નોંધાઈ જાય છે.',
    mockTag: 'SHARE'
  },
  {
    step: 'STEP 9',
    stepGu: 'પગલું ૯',
    titleEn: 'Monthly Progress Report (MPR-6) & Poshan Vani',
    titleGu: 'માસિક પ્રગતિ રિપોર્ટ (MPR-6) અને પોષણ વાણી અવાજ સહાયક',
    summaryEn: 'Download official Gujarat Govt Form MPR-6 in PDF/Excel and use Gujarati/English voice assistant.',
    summaryGu: 'ગુજરાત સરકાર માન્ય ફોર્મ MPR-6 પીડીએફ/એક્સેલમાં ડાઉનલોડ કરો અને ગુજરાતી અવાજ સહાયકથી કામ કરો.',
    instructionsEn: [
      'Tap "Download Report" to preview official Gujarat Govt Form MPR-6 ledger.',
      'Tap "Download PDF" for physical printout or "Export CSV" for Excel spreadsheet.',
      'Tap floating "🎙️ પોષણ વાણી" mic button at bottom right to speak questions.',
      'Ask: "ચોખાનો સ્ટોક કેટલો છે?" or "બધા બાળકો હાજર કરો" for hands-free voice operations.'
    ],
    instructionsGu: [
      '"રિપોર્ટ ડાઉનલોડ" પર ક્લિક કરી ગુજરાત સરકાર માન્ય ફોર્મ MPR-6 નો પ્રિવ્યુ જુઓ.',
      '"PDF ડાઉનલોડ" દબાવી કાગળ પર પ્રિન્ટ કાઢો અથવા "CSV એક્સપોર્ટ" કરો.',
      'નીચે જમણી બાજુ આવેલ લીલા "🎙️ પોષણ વાણી" માઇક બટન પર ટચ કરો.',
      '"ચોખાનો કેટલો સ્ટોક છે?" અથવા "બધા બાળકો હાજર કરો" બોલીને કામ કરો.'
    ],
    tipsEn: 'Form MPR-6 includes opening stock, inward challans, meal consumption, and closing balances.',
    tipsGu: 'ફોર્મ MPR-6 માં શરૂઆતનો સ્ટોક, નવી આવક, દૈનિક વપરાશ અને બાકી જથ્થો સત્તાવાર કોષ્ટકમાં તૈયાર થાય છે.',
    mockTag: 'REPORT'
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
  const renderCanvasPage = async (
    pageNumber: number,
    totalPages: number,
    contentDrawer: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
  ): Promise<string> => {
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
    ctx.fillText('આંગણવાડી કાર્યકર તાલીમ અને સત્તાવાર સચિત્ર માર્ગદર્શિકા (Illustrated Manual)', 32, 84);

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

  // Divide sections into 3 pages:
  // Page 1: Step 1 (Login), Step 2 (Stock Inward with Zero-Item Option & Tuver Dal), Step 3 (Attendance)
  // Page 2: Step 4 (Meal Menu 30g/50g), Step 5 (Geotagged Photo), Step 6 (Local Bill Reimbursement)
  // Page 3: Step 7 (THR Distribution), Step 8 (Setu Share), Step 9 (Report MPR-6 & Voice), Official Helplines

  // PAGE 1
  const page1Img = await renderCanvasPage(1, 3, (ctx, w) => {
    // Title Box
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(32, 130, w - 64, 68, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('આંગણવાડી કાર્યકર વપરાશ માર્ગદર્શિકા (Illustrated Worker User Guide)', 48, 158);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('એપ્લિકેશનના નવા ફીચર્સ (ઝીરો-આઇટમ સ્ટોક, તુવેર દાળ, ગરમ ભોજન જીપીએસ ફોટો, બિલ ભરપાઈ) નું સંપૂર્ણ માર્ગદર્શન.', 48, 180);

    let y = 210;
    const p1Steps = [MANUAL_SECTIONS[0], MANUAL_SECTIONS[1], MANUAL_SECTIONS[2]];

    p1Steps.forEach((sec, sIdx) => {
      const cardHeight = sIdx === 1 ? 275 : 250;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = sIdx === 1 ? '#86EFAC' : '#E2E8F0';
      ctx.lineWidth = sIdx === 1 ? 1.8 : 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, cardHeight, 10);
      ctx.fill();
      ctx.stroke();

      // Step Header Pill
      ctx.fillStyle = sIdx === 1 ? '#DCFCE7' : '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect(44, y + 14, 84, 24, 6);
      ctx.fill();

      ctx.fillStyle = sIdx === 1 ? '#15803D' : '#334155';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 50, y + 30);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14.5px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 140, y + 31);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 56);

      // Visual UI Mock Box on Canvas
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(44, y + 66, w - 88, 38, 6);
      ctx.fill();
      ctx.stroke();

      if (sec.mockTag === 'LOGIN') {
        ctx.fillStyle = '#065F46';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('💻 Screen UI: User ID: worker • Password: 1234 • AWC: 04 Vadtal (AWVAD04) • 100% Offline Ready', 56, y + 90);
      } else if (sec.mockTag === 'INWARD') {
        ctx.fillStyle = '#B91C1C';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('🚚 Screen UI: Challan #CH-2026-904 | Rice: 0 kg [Deleted/Not Received] | Tuver Dal: +25 kg | Atta: +50 kg', 56, y + 90);
      } else if (sec.mockTag === 'ATTENDANCE') {
        ctx.fillStyle = '#15803D';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('👶 Screen UI: [ ✓ Mark All (10/10) ] • Aarav (✓) • Diya (✓) • Vihaan (✓) ➔ Proceed to Meal Usage', 56, y + 90);
      }

      // Instructions
      let iy = y + 120;
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
          ctx.font = '10px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 13);
          iy += 28;
        } else {
          iy += 20;
        }
      });

      y += cardHeight + 14;
    });
  });

  // PAGE 2: Step 4 (Daily Meal), Step 5 (Geotagged Photo), Step 6 (Bill Reimbursement)
  const page2Img = await renderCanvasPage(2, 3, (ctx, w) => {
    // Top banner for Page 2
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(32, 130, w - 64, 46, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('દૈનિક ભોજન, જીપીએસ ફોટો અપલોડ અને સ્થાનિક ખરીદી બિલ ભરપાઈ', 48, 158);

    let y = 188;
    const p2Steps = [MANUAL_SECTIONS[3], MANUAL_SECTIONS[4], MANUAL_SECTIONS[5]];

    p2Steps.forEach((sec, sIdx) => {
      const cardHeight = sIdx === 2 ? 275 : 260;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = sIdx === 2 ? '#86EFAC' : '#E2E8F0';
      ctx.lineWidth = sIdx === 2 ? 1.8 : 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, cardHeight, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = sIdx === 2 ? '#DCFCE7' : '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect(44, y + 14, 84, 24, 6);
      ctx.fill();

      ctx.fillStyle = sIdx === 2 ? '#15803D' : '#334155';
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 50, y + 30);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14.5px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 140, y + 31);

      ctx.fillStyle = '#475569';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 56);

      // Visual UI Mock Box
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(44, y + 66, w - 88, 38, 6);
      ctx.fill();
      ctx.stroke();

      if (sec.mockTag === 'MEAL') {
        ctx.fillStyle = '#D97706';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('🍲 Screen UI: Pushtik Khichdi & Kadhi | Meal 2 (50g) | Rice: 500g, Dal: 250g ➔ Warehouse Auto-Deducted', 56, y + 90);
      } else if (sec.mockTag === 'PHOTO') {
        ctx.fillStyle = '#0284C7';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('📸 Screen UI: Live Camera Snap | Watermark: 📍 22.5645°N, 72.9512°E • 11:45 AM • 04-Vadtal Centre', 56, y + 90);
      } else if (sec.mockTag === 'BILL') {
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillText('🧾 Screen UI: Invoice #INV-8821 | Vegetables & Gas | ₹ 450 Verified | PAID / ભરપાઈ (DBT Direct Bank Refund)', 56, y + 90);
      }

      let iy = y + 120;
      sec.instructionsGu.forEach((inst, idx) => {
        ctx.fillStyle = sIdx === 2 ? '#EA580C' : '#16A34A';
        ctx.beginPath();
        ctx.arc(52, iy - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText(inst, 64, iy);

        if (manualLang !== 'gu' && sec.instructionsEn[idx]) {
          ctx.fillStyle = '#64748B';
          ctx.font = '10px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 13);
          iy += 28;
        } else {
          iy += 20;
        }
      });

      y += cardHeight + 14;
    });
  });

  // PAGE 3: Step 7 (THR & Dal Distribution), Step 8 (Setu Share), Step 9 (Report MPR-6 & Voice), Official Helplines
  const page3Img = await renderCanvasPage(3, 3, (ctx, w) => {
    let y = 130;
    const p3Steps = [MANUAL_SECTIONS[6], MANUAL_SECTIONS[7], MANUAL_SECTIONS[8]];

    p3Steps.forEach((sec) => {
      const cardHeight = 220;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(32, y, w - 64, cardHeight, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#DCFCE7';
      ctx.beginPath();
      ctx.roundRect(44, y + 12, 84, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#15803D';
      ctx.font = 'bold 11.5px system-ui, sans-serif';
      ctx.fillText(sec.stepGu + ' • ' + sec.step, 50, y + 27);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px system-ui, sans-serif';
      ctx.fillText(`${sec.titleGu} (${sec.titleEn})`, 140, y + 28);

      ctx.fillStyle = '#475569';
      ctx.font = '11.5px system-ui, sans-serif';
      ctx.fillText(sec.summaryGu, 44, y + 50);

      // Instructions
      let iy = y + 74;
      sec.instructionsGu.forEach((inst, idx) => {
        ctx.fillStyle = '#16A34A';
        ctx.beginPath();
        ctx.arc(52, iy - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1E293B';
        ctx.font = '11.5px system-ui, sans-serif';
        ctx.fillText(inst, 64, iy);

        if (manualLang !== 'gu' && sec.instructionsEn[idx]) {
          ctx.fillStyle = '#64748B';
          ctx.font = '10px system-ui, sans-serif';
          ctx.fillText('  → ' + sec.instructionsEn[idx], 64, iy + 12);
          iy += 26;
        } else {
          iy += 19;
        }
      });

      y += cardHeight + 12;
    });

    // Official Helplines & Supervisor Support Box
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(32, y + 6, w - 64, 205, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#166534';
    ctx.font = 'bold 15px system-ui, sans-serif';
    ctx.fillText('સત્તાવાર સંપર્ક અને તાત્કાલિક સહાય (Official Support & Helplines)', 48, y + 32);

    const hColW = (w - 110) / 2;

    // Toll Free 14408
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(48, y + 46, hColW, 64, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803D';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('📞 14408', 64, y + 74);
    ctx.font = '10.5px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('પોષણ ટ્રેકર ટોલ-ફ્રી હેલ્પલાઇન', 64, y + 92);
    ctx.fillText('સોમવાર થી શનિવાર (૯:૦૦ થી ૬:૦૦)', 64, y + 104);

    // Childline 1098
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FED7AA';
    ctx.beginPath();
    ctx.roundRect(48 + hColW + 14, y + 46, hColW, 64, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#EA580C';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.fillText('🚨 1098', 64 + hColW + 14, y + 74);
    ctx.font = '10.5px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('ચાઇલ્ડલાઇન ઇમરજન્સી હેલ્પલાઇન', 64 + hColW + 14, y + 92);
    ctx.fillText('૨૪ કલાક મફત સેવા', 64 + hColW + 14, y + 104);

    // Supervisor Details
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(48, y + 120, w - 96, 76, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12.5px system-ui, sans-serif';
    ctx.fillText('કેન્દ્ર સુપરવાઇઝર: શ્રીમતી શારદાબેન શાહ • સેક્ટર વડતાલ (તાલુકો આણંદ)', 64, y + 144);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('CDPO કચેરી સંપર્ક: +91 2692 245901 • ઇમેઇલ: cdpo-anand-wcd@gujarat.gov.in', 64, y + 162);
    ctx.fillText('કોઈપણ ટેકનિકલ પ્રશ્ન કે સ્ટોક તફાવત માટે આપના સેક્ટર સુપરવાઇઝરનો તાત્કાલિક સંપર્ક કરો.', 64, y + 178);
  });

  // Assemble into PDF
  doc.addImage(page1Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  doc.addPage();
  doc.addImage(page2Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);
  doc.addPage();
  doc.addImage(page3Img, 'JPEG', 0, 0, pageWidthMm, pageHeightMm);

  const filename =
    manualLang === 'gu'
      ? 'Poshan_Setu_Worker_Manual_Gujarati.pdf'
      : manualLang === 'en'
      ? 'Poshan_Setu_Worker_Manual_English.pdf'
      : 'Poshan_Setu_Worker_Manual_Bilingual.pdf';

  doc.save(filename);
}

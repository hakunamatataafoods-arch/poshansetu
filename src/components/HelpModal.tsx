import React, { useState } from 'react';
import {
  X,
  Phone,
  HelpCircle,
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Building2,
  Globe,
  Camera,
  MapPin,
  Truck,
  Trash2,
  Plus,
  Minus,
  Receipt,
  Users,
  Mic,
  ArrowRight,
  Mail
} from 'lucide-react';
import { Language } from '../types';
import { generateWorkerManualPdf, ManualLanguage } from '../utils/workerManualPdf';
import { playPopClickSound, playTransactionSuccessSound } from '../utils/audioEffects';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'helpline' | 'faqs'>('manual');
  const [downloadingLang, setDownloadingLang] = useState<ManualLanguage | null>(null);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleDownloadManual = async (manualLang: ManualLanguage) => {
    try {
      playPopClickSound();
      setDownloadingLang(manualLang);
      await generateWorkerManualPdf(manualLang);
      playTransactionSuccessSound();

      const label =
        manualLang === 'gu'
          ? 'ગુજરાતી માર્ગદર્શિકા PDF સફળતાપૂર્વક ડાઉનલોડ થઈ!'
          : manualLang === 'en'
          ? 'English Worker Manual PDF Downloaded Successfully!'
          : 'Bilingual Complete Guide PDF Downloaded Successfully!';
      setDownloadSuccessNotice(label);
      setTimeout(() => setDownloadSuccessNotice(null), 4500);
    } catch (err) {
      console.error('Failed to generate manual PDF:', err);
    } finally {
      setDownloadingLang(null);
    }
  };

  const manualSteps = [
    {
      num: '1',
      titleEn: 'Signing In & Centre Profile',
      titleGu: 'એપ્લિકેશનમાં લોગિન અને કેન્દ્ર ચકાસણી',
      icon: '🔐',
      badgeEn: 'Offline Ready',
      badgeGu: 'ઑફલાઇન કાર્યરત',
      contentGu:
        'યુઝર આઈડી: worker અને પાસવર્ડ: 1234 દાખલ કરી લોગિન કરો. ઇન્ટરનેટ ન હોય તો પણ બધી નોંધણી તમારા ફોનમાં ૧૦૦% સુરક્ષિત રહે છે.',
      contentEn:
        'Sign in using User ID: worker and Password: 1234. Works 100% offline without network connectivity.',
      bulletsGu: [
        '૧. યુઝર આઈડીમાં worker અને પાસવર્ડમાં 1234 લખો અથવા "ડેમો પાસવર્ડ ભરો" બટન દબાવો.',
        '૨. ગુજરાતી અથવા English ભાષા પસંદ કરો.',
        '૩. કેન્દ્ર કોડ AWVAD04 (૦૪ વડતાલ • તાલુકો આણંદ) ચકાસીને લોગિન કરો.'
      ],
      bulletsEn: [
        '1. Enter worker / 1234 or tap the "Quick Autofill" button.',
        '2. Choose your preferred language: Gujarati or English.',
        '3. Verify your assigned centre AWVAD04 (04 Vadtal) and sign in.'
      ],
      tipsGu: 'નેટવર્ક બંધ હોય ત્યારે પણ એપ સામાન્ય રીતે કામ કરે છે અને નેટવર્ક આવતાં આપમેળે સિંક થાય છે.',
      tipsEn: 'Data saves locally on your phone when offline and syncs automatically when network returns.',
      visualType: 'login'
    },
    {
      num: '2',
      titleEn: 'Stock Received (Challan, 0-Item & Tuver Dal)',
      titleGu: 'ગોડાઉન સ્ટોક આવક (ચલણ, ઝીરો આઇટમ વિકલ્પ અને તુવેર દાળ)',
      icon: '🚚',
      badgeEn: 'New: Zero Item Option & Tuver Dal',
      badgeGu: 'નવું: ઝીરો આઇટમ વિકલ્પ અને તુવેર દાળ',
      contentGu:
        'સરકારી ગોડાઉનમાંથી આવેલ પુરવઠાની ચલણ નંબર મુજબ આવક નોંધો. જો કોઈ સામગ્રી ન આવી હોય (દા.ત. ચોખા ન આવ્યા હોય) તો તેને ડિલીટ કરી શકો છો અથવા જથ્થો શૂન્ય (૦) કરી શકો છો. તુવેર દાળ પણ ઉમેરી શકાય છે.',
      contentEn:
        'Record delivery challan arrivals. If an item was not received (e.g. rice did not arrive), delete it or set quantity to zero (0). Tuver Dal can also be added with custom batches and expiry dates.',
      bulletsGu: [
        '૧. ડિલિવરી ચલણ નંબર અને સપ્લાયરનું નામ દાખલ કરો.',
        '૨. આવેલી સામગ્રી (ચોખા, ઘઉંનો લોટ, તેલ, બાલ/માતૃ/પૂર્ણા શક્તિ, તુવેર દાળ) ની સામે જથ્થો દાખલ કરો.',
        '૩. જે વસ્તુ ન આવી હોય તેની સામે લાલ કચરાપેટી બટન દબાવી ડિલીટ કરો અથવા ૦ કિલો સેટ કરો.',
        '૪. બેચ નંબર અને એક્સપાયરી તારીખ ચકાસી "સ્ટોક આવકની પુષ્ટિ કરો" પર ક્લિક કરો.'
      ],
      bulletsEn: [
        '1. Enter official Delivery Challan number and supplier name.',
        '2. Enter received quantities for Rice, Atta, Oil, Premixes, and Tuver Dal.',
        '3. If an item was not supplied, tap the red trash icon to delete or set quantity to 0.',
        '4. Verify batch numbers and expiry dates, then tap "Confirm Stock Inward".'
      ],
      tipsGu: 'ઝીરો આઇટમ પસંદગીથી આપના ગોડાઉન સ્ટોકમાં કોઈ ખોટો જથ્થો ઉમેરાશે નહીં.',
      tipsEn: 'Setting an item to zero ensures no false stock is recorded into your warehouse.',
      visualType: 'stock-inward'
    },
    {
      num: '3',
      titleEn: 'Daily Student Attendance',
      titleGu: 'બાળકોની દૈનિક હાજરી નોંધણી',
      icon: '👶',
      badgeEn: '1-Tap Mark All',
      badgeGu: '૧-ક્લિકમાં બધા હાજર',
      contentGu:
        'ભોજન રાંધતા પહેલા હાજર બાળકોની સંખ્યા નોંધો. "બધા હાજર" બટનથી ૧-સેકન્ડમાં હાજરી પૂરી શકાય છે. હાજરીની સંખ્યા સીધી રાશન ગણતરીમાં આગળ વધે છે.',
      contentEn:
        'Mark student attendance before meal preparation. Use "Mark All Present" for 1-tap rapid roll call. Count automatically carries into grain ration calculations.',
      bulletsGu: [
        '૧. "બાળકોની હાજરી" કાર્ડ પર ક્લિક કરો.',
        '૨. દરેક બાળકના નામ પર ટચ કરીને હાજર (લીલો) અથવા ગેરહાજર (લાલ) કરો.',
        '૩. "બધા હાજર" બટન દબાવવાથી તમામ ૧૦ બાળકો એકસાથે હાજર થશે.',
        '૪. "ભોજન વપરાશ તરફ આગળ વધો" બટન દબાવો.'
      ],
      bulletsEn: [
        '1. Tap "Student Attendance" on the home dashboard.',
        '2. Tap child names to toggle Present (green) or Absent (red).',
        '3. Use "Mark All Present" to check in all 10 students at once.',
        '4. Tap "Proceed to Meal Usage" to carry the headcount to meal recipe.'
      ],
      tipsGu: 'હાજરી સીધી સવારના નાસ્તા (૩૦ ગ્રામ) અને બપોરના ભોજન (૫૦ ગ્રામ)ના રાશન સાથે જોડાયેલી છે.',
      tipsEn: 'Attendance headcount directly determines the exact 30g Breakfast and 50g Lunch recipe portions.',
      visualType: 'attendance'
    },
    {
      num: '4',
      titleEn: 'Daily Meal Menu & Ration Auto-Deduction',
      titleGu: 'દૈનિક ભોજન મેનૂ અને રાશન ઓટો-કપાત',
      icon: '🍲',
      badgeEn: 'Government Ration Norms',
      badgeGu: 'સરકારી પોષણ માપદંડ',
      contentGu:
        'આહાર ૧ (નાસ્તો - ૩૦ ગ્રામ) અને આહાર ૨ (બપોરનું ભોજન - ૫૦ ગ્રામ) નિયમ મુજબ વાનગી પસંદ કરતાં જ ચોખા, તેલ, લોટ અને દાળનો જથ્થો આપમેળે ગણાઈને ગોડાઉનમાંથી બાદ થાય છે.',
      contentEn:
        'Select Meal 1 (Breakfast - 30g/child) or Meal 2 (Lunch - 50g/child). Ingredients (Rice, Oil, Atta, Dal) are calculated automatically and deducted from warehouse inventory.',
      bulletsGu: [
        '૧. "દૈનિક ભોજન મેનૂ" ખોલો અને સવારનો નાસ્તો કે બપોરનું ભોજન પસંદ કરો.',
        '૨. સરકાર માન્ય વાનગી (દા.ત. વેજ પુલાવ, બાલભોગ શીરો, પૌષ્ટિક ખીચડી) પસંદ કરો.',
        '૩. હાજર બાળકો મુજબ સામગ્રીનો જથ્થો આપમેળે ગણાશે (+/- ૧૦૦ ગ્રામ વધ-ઘટ કરી શકાય છે).',
        '૪. "જથ્થો બાદ કરવાની પુષ્ટિ કરો" બટન દબાવો.'
      ],
      bulletsEn: [
        '1. Open "Daily Food Menu" and choose Breakfast or Lunch.',
        '2. Select scheduled recipe (e.g. Veg Pulao, Balbhog Sheera, Pushtik Khichdi).',
        '3. System auto-calculates total grains based on headcount (+/- 100g adjustable).',
        '4. Tap "Confirm Deduction" to subtract stock from warehouse inventory.'
      ],
      tipsGu: 'જથ્થો બાદ થતાં જ ખુશીનો પૉપ સાઉન્ડ વાગશે અને બાકી સ્ટોક આપમેળે અપડેટ થઈ જશે.',
      tipsEn: 'Confirmation plays an audio chime and updates real-time stock balances immediately.',
      visualType: 'meal-menu'
    },
    {
      num: '5',
      titleEn: 'Geotagged Hot Meal Photo Upload',
      titleGu: 'ગરમ ભોજન ફોટો અપલોડ અને જીપીએસ લોકેશન',
      icon: '📸',
      badgeEn: 'Live GPS Watermark & Cloud Sync',
      badgeGu: 'જીપીએસ વોટરમાર્ક અને ક્લાઉડ સિંક',
      contentGu:
        'આંગણવાડીમાં રાંધેલ ગરમ તાજા ભોજનનો ફોટો કેમેરા વડે પાડીને અપલોડ કરો. ફોટા પર જીપીએસ લોકેશન (અક્ષાંશ/રેખાંશ) અને સમયનો વોટરમાર્ક આપમેળે લાગીને ડેટાબેઝમાં સુરક્ષિત જમા થાય છે.',
      contentEn:
        'Capture a photo of the hot cooked meal using your camera. Photos are automatically stamped with live GPS coordinates, time, and centre ID, then synced to the cloud database.',
      bulletsGu: [
        '૧. ડેશબોર્ડ પરથી "ભોજન ફોટો અપલોડ" કાર્ડ પર ક્લિક કરો.',
        '૨. "કેમેરા ખોલો / ફોટો પાડો" બટન દબાવી ગરમ ભોજનનો સ્પષ્ટ ફોટો લો અથવા ગેલેરીમાંથી પસંદ કરો.',
        '૩. જીપીએસ લોકેશન (દા.ત. ૨૨.૫૬°N, ૭૨.૯૫°E) અને તારીખ-સમય વોટરમાર્ક તપાસો.',
        '૪. "ડેટાબેઝમાં સાચવો" બટન દબાવો. સુપરવાઇઝર આ ફોટો તેમના ડેશબોર્ડ પર લાઈવ જોઈ શકશે.'
      ],
      bulletsEn: [
        '1. Tap "Meal Photo Upload" on the home screen.',
        '2. Tap "Take Photo with Camera" or select from your gallery.',
        '3. Review the automatic GPS geotag watermark (coordinates & timestamp).',
        '4. Tap "Upload to Database" to log proof for inspection supervision.'
      ],
      tipsGu: 'દરરોજ બપોરે ૧૨:૩૦ પહેલાં ફોટો અપલોડ કરવાથી સુપરવાઇઝર ઇન્સ્પેક્શનમાં ગ્રીન વેરીફિકેશન મળશે.',
      tipsEn: 'Uploading daily before 12:30 PM marks your centre green on the CDPO inspection dashboard.',
      visualType: 'meal-photo'
    },
    {
      num: '6',
      titleEn: 'Local Purchase & Bill Reimbursement',
      titleGu: 'સ્થાનિક ખરીદી બિલ અપલોડ અને બેંક ભરપાઈ',
      icon: '🧾',
      badgeEn: 'Direct DBT Bank Refund',
      badgeGu: 'સીધા ખાતામાં DBT ભરપાઈ',
      contentGu:
        'સરકારી ગોડાઉન સિવાય સ્થાનિક બજારમાંથી ખરીદેલ શાકભાજી, મસાલા, ગેસ સિલિન્ડર કે ફળોના બિલનો ફોટો પાડીને અપલોડ કરો. બિલ મંજૂર થતાં જ નાણાં સીધા તમારા બેંક ખાતામાં જમા થાય છે.',
      contentEn:
        'Upload bills for items purchased locally (Fresh Vegetables, Spices, LPG Cylinder, Cleaning). Approved claims are credited directly to your registered bank account via DBT.',
      bulletsGu: [
        '૧. મુખ્ય ડેશબોર્ડ પર "બિલ અપલોડ અને ભરપાઈ" કાર્ડ ખોલો.',
        '૨. ખર્ચનો પ્રકાર પસંદ કરો (શાકભાજી, ગેસ સિલિન્ડર, મસાલા, ફળ કે અન્ય).',
        '૩. બિલ/ઇન્વૉઇસ નંબર, તારીખ, દુકાનદારનું નામ અને રકમ (₹) દાખલ કરો.',
        '૪. શેરો/નોંધ લખો અને કેમેરા વડે અસલ બિલનો સ્પષ્ટ ફોટો જોડો.',
        '૫. "બિલ સબમિટ કરો" બટન દબાવો.'
      ],
      bulletsEn: [
        '1. Tap "Bill Upload & Reimbursement" on the dashboard.',
        '2. Select category: Fresh Vegetables, LPG Gas Cylinder, Spices, Fruits, etc.',
        '3. Enter Invoice Number, Bill Date, Vendor Name, and Amount (₹).',
        '4. Add remarks and snap a clear photo of the physical cash receipt.',
        '5. Tap "Submit Claim" for CDPO direct bank transfer approval.'
      ],
      tipsGu: 'મૂળ કાગળનું બિલ ઓડિટ માટે આંગણવાડી કેન્દ્રની વાઉચર ફાઇલમાં સાચવીને રાખો.',
      tipsEn: 'Keep the original physical paper receipt safely filed in your centre voucher binder.',
      visualType: 'bill-upload'
    },
    {
      num: '7',
      titleEn: 'Stock Usage & Take-Home Ration (THR) Distribution',
      titleGu: 'સ્ટોક વપરાશ અને પૂરક આહાર (THR) વિતરણ',
      icon: '📦',
      badgeEn: 'Tuver Dal & Premix Distribution',
      badgeGu: 'તુવેર દાળ અને પૂરક આહાર વિતરણ',
      contentGu:
        'ધાત્રી માતાઓ, સગર્ભા બહેનો અને બાળકોને બાલ શક્તિ, માતૃ શક્તિ, પૂર્ણા શક્તિ પેકેટ્સ તેમજ તુવેર દાળનું વિતરણ કરો. લાભાર્થી મુજબ વિતરણ નોંધતા જ સ્ટોક આપમેળે ઓછો થાય છે.',
      contentEn:
        'Distribute Take-Home Ration (THR) packets (Bal Shakti, Matru Shakti, Purna Shakti) and Tuver Dal to registered mothers and children. Warehouse stock updates automatically.',
      bulletsGu: [
        '૧. "સ્ટોક વપરાશ" કાર્ડ પર ક્લિક કરી લાભાર્થીની શ્રેણી પસંદ કરો.',
        '૨. લાભાર્થીનું નામ પસંદ કરી આપેલ પેકેટ્સ અને તુવેર દાળનો જથ્થો દાખલ કરો.',
        '૩. લાભાર્થીની રસીદ કે વિતરણનો ફોટો જોડો (મરજિયાત).',
        '૪. "વિતરણ પુષ્ટિ કરો" બટન દબાવો.'
      ],
      bulletsEn: [
        '1. Open "Stock Usage" and select beneficiary category (Pregnant, Lactating, Infant).',
        '2. Select beneficiary name and input distributed packets and Tuver Dal.',
        '3. Attach distribution receipt photo (optional).',
        '4. Tap "Confirm Distribution" to deduct from your live balance.'
      ],
      tipsGu: 'દર મહિનાની ૨૫ તારીખ પહેલાં ૧૦૦% વિતરણ પૂર્ણ કરવાનું લક્ષ્યાંક રાખો.',
      tipsEn: 'Aim for 100% THR packet and pulse distribution before the 25th of every month.',
      visualType: 'stock-usage'
    },
    {
      num: '8',
      titleEn: 'Inter-Centre Stock Sharing (Setu Share)',
      titleGu: 'સેતુ શેર વિનિમય (આપસી સ્ટોક આપ-લે)',
      icon: '🤝',
      badgeEn: 'Dual-Verified OTP #8491',
      badgeGu: 'સુરક્ષિત ઓટીપી #8491',
      contentGu:
        'નજીકના અન્ય આંગણવાડી કેન્દ્ર (દા.ત. મોગરી, કરમસદ, સામરખા) સાથે તાત્કાલિક જરૂરિયાત માટે સામગ્રી ઉછીની આપો કે મેળવો. ૪-અંકના વેરિફિકેશન કોડ વડે સુરક્ષિત વિનિમય થાય છે.',
      contentEn:
        'Safely borrow or lend emergency food supplies with neighboring Anganwadi Centres using a 4-digit verification code (#8491).',
      bulletsGu: [
        '૧. ડેશબોર્ડ પરથી "સેતુ શેર વિનિમય" કાર્ડ ખોલો.',
        '૨. તમે સ્ટોક અન્ય કેન્દ્રને આપી રહ્યા છો (Lend) કે મેળવી રહ્યા છો (Borrow) તે પસંદ કરો.',
        '૩. સામેના કેન્દ્રનું નામ, સામગ્રી (ચોખા, તેલ, લોટ, દાળ) અને જથ્થો પસંદ કરો.',
        '૪. ૪-અંકનો સુરક્ષિત કોડ દાખલ કરી વિનિમય પૂર્ણ કરો.'
      ],
      bulletsEn: [
        '1. Tap "Setu Share Exchange" on the dashboard.',
        '2. Choose action: Giving Stock (Lend) or Receiving Stock (Borrow).',
        '3. Select the peer centre name, commodity, and quantity.',
        '4. Verify the 4-digit code (#8491) to complete the dual-authorized transfer.'
      ],
      tipsGu: 'આપ-લે થયેલ જથ્થો માસિક MPR-6 રિપોર્ટમાં આપમેળે હિસાબમાં જોડાઈ જાય છે.',
      tipsEn: 'Transfers automatically reflect in both centres’ monthly MPR-6 ledgers.',
      visualType: 'setu-share'
    },
    {
      num: '9',
      titleEn: 'Monthly Progress Report (MPR-6) Download',
      titleGu: 'માસિક પ્રગતિ રિપોર્ટ (MPR-6) ડાઉનલોડ',
      icon: '📊',
      badgeEn: 'Official PDF & Excel CSV',
      badgeGu: 'સત્તાવાર પીડીએફ અને એક્સેલ',
      contentGu:
        'ગુજરાત સરકાર માન્ય સત્તાવાર ફોર્મ MPR-6 નો પ્રિવ્યુ જુઓ અને ૧-ક્લિકમાં પ્રિન્ટ કાઢવા માટે પીડીએફ અથવા એક્સેલ/CSV ડાઉનલોડ કરો.',
      contentEn:
        'Review official Gujarat Govt Form MPR-6 ledger sheet and download in 1-click as PDF for print submission or Excel/CSV for digital records.',
      bulletsGu: [
        '૧. "રિપોર્ટ ડાઉનલોડ" કાર્ડ પર ક્લિક કરો.',
        '૨. રિપોર્ટ સ્કોપ પસંદ કરો: સંપૂર્ણ લેજર, માત્ર સ્ટોક અથવા માત્ર હાજરી.',
        '૩. ગુજરાત સરકારના પ્રતીક સાથેનો સત્તાવાર લેજર પ્રિવ્યુ ચકાસો.',
        '૪. "PDF ડાઉનલોડ કરો" બટન દબાવી કાગળ પર પ્રિન્ટ કાઢો અથવા "CSV એક્સપોર્ટ" કરો.'
      ],
      bulletsEn: [
        '1. Tap "Download Report" on the home screen.',
        '2. Select scope: Full Ledger, Stock Only, or Attendance Only.',
        '3. Inspect the live preview with official Government emblem.',
        '4. Tap "Download PDF" to save/print or "Export CSV" for spreadsheets.'
      ],
      tipsGu: 'રિપોર્ટ પીડીએફ સહી-સિક્કા માટે સંપૂર્ણ તૈયાર સરકારી ફોર્મેટમાં બને છે.',
      tipsEn: 'The generated PDF is ready for official supervisor stamp and signature.',
      visualType: 'download-report'
    },
    {
      num: '10',
      titleEn: 'Poshan Vani Voice Assistant',
      titleGu: 'પોષણ વાણી અવાજ સહાયક',
      icon: '🎙️',
      badgeEn: 'Gujarati & English Voice AI',
      badgeGu: 'ગુજરાતી અને અંગ્રેજી અવાજ સહાયક',
      contentGu:
        'ગુજરાતી અથવા અંગ્રેજીમાં બોલીને સ્ટોક જાણો, હાજરી પૂરો અથવા રિપોર્ટ ખોલો. નીચે જમણી બાજુ આવેલ માઇક બટન દબાવીને વાત કરો.',
      contentEn:
        'Speak in Gujarati or English to check warehouse balance, mark student attendance, or navigate screens hands-free.',
      bulletsGu: [
        '૧. નીચે જમણી બાજુ આવેલ લીલા "🎙️ પોષણ વાણી" માઇક બટન પર ટચ કરો.',
        '૨. તમારો પ્રશ્ન બોલો, દા.ત.: "ચોખાનો કેટલો સ્ટોક છે?" અથવા "બધા બાળકો હાજર કરો".',
        '૩. સહાયક તમારી વાત સમજીને તુરંત સ્ક્રીન પર પરિણામ બતાવશે અને અવાજમાં જવાબ આપશે.'
      ],
      bulletsEn: [
        '1. Tap the floating "🎙️ Poshan Vani" mic button at bottom right.',
        '2. Speak naturally, e.g. "What is the stock of rice?" or "Mark all students present".',
        '3. The assistant answers with spoken voice and instant screen action.'
      ],
      tipsGu: 'રસોઈ બનાવતી વખતે હાથ ભીના હોય ત્યારે માઈક બટનથી હાથ અડ્યા વિના પણ કામ થઈ શકે છે.',
      tipsEn: 'Ideal for hands-free operation in the kitchen while preparing daily meals.',
      visualType: 'voice-assistant'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-2xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {lang === 'en' ? 'Poshan Setu Worker Guide' : 'આંગણવાડી કાર્યકર માર્ગદર્શિકા'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'en' ? 'Illustrated User Manual & Support Desk' : 'સચિત્ર વપરાશ પુસ્તિકા અને સહાય ડેસ્ક'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Download Notice Banner */}
        {downloadSuccessNotice && (
          <div className="px-4 py-2.5 bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>{downloadSuccessNotice}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-4 pt-3 pb-1 bg-white border-b border-slate-100 flex items-center gap-1.5">
          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('manual');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Manual Guide (PDF)' : 'માર્ગદર્શિકા (PDF)'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('helpline');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'helpline'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Helpline' : 'હેલ્પલાઇન'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('faqs');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'FAQs' : 'પ્રશ્નો'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* ================= TAB 1: USER MANUAL & PDF DOWNLOADS ================= */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              {/* Highlighted PDF Download Card */}
              <div className="bg-gradient-to-br from-[#EAF7EE] via-[#E2F4E7] to-white p-4 rounded-3xl border border-emerald-300 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {lang === 'en'
                        ? 'Download Official Worker Manual (PDF)'
                        : 'સત્તાવાર કાર્યકર માર્ગદર્શિકા PDF ડાઉનલોડ કરો'}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {lang === 'en'
                        ? 'Complete step-by-step guidebook with illustrated instructions for all features.'
                        : 'એપ્લિકેશન કેવી રીતે વાપરવી તેની સંપૂર્ણ ગુજરાતી સચિત્ર માર્ગદર્શિકા.'}
                    </p>
                  </div>
                </div>

                {/* 3 Download Action Buttons (Gujarati, English, Bilingual) */}
                <div className="space-y-2 pt-1">
                  {/* 1. Gujarati Manual (Primary) */}
                  <button
                    onClick={() => handleDownloadManual('gu')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2.5 px-3 rounded-2xl bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs shadow-xs flex items-center justify-between transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇮🇳</span>
                      <span>
                        {downloadingLang === 'gu'
                          ? 'PDF તૈયાર થઈ રહ્યું છે...'
                          : 'ડાઉનલોડ ગુજરાતી માર્ગદર્શિકા (Gujarati PDF)'}
                      </span>
                    </div>
                    <Download className="w-4 h-4 shrink-0" />
                  </button>

                  {/* 2. English Manual */}
                  <button
                    onClick={() => handleDownloadManual('en')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🇬🇧</span>
                      <span>
                        {downloadingLang === 'en'
                          ? 'Generating PDF...'
                          : 'Download English Worker Manual (PDF)'}
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                  </button>

                  {/* 3. Bilingual Complete Guide */}
                  <button
                    onClick={() => handleDownloadManual('both')}
                    disabled={downloadingLang !== null}
                    className="w-full py-2 px-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📑</span>
                      <span>
                        {downloadingLang === 'both'
                          ? 'Generating Dual Edition...'
                          : 'Complete Bilingual Edition (દ્વિભાષી સંપૂર્ણ)'}
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* In-Modal Step-by-Step Reader with Live Visuals */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {lang === 'en'
                      ? 'Illustrated In-App Steps (Read on Phone)'
                      : 'મોબાઇલમાં સચિત્ર પગલાંવાર માર્ગદર્શન'}
                  </h4>
                  <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    10 Modules
                  </span>
                </div>

                <div className="space-y-2.5">
                  {manualSteps.map((step, idx) => {
                    const isExpanded = expandedStep === idx;
                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border transition-all ${
                          isExpanded
                            ? 'bg-white border-emerald-300 shadow-sm'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <button
                          onClick={() => {
                            playPopClickSound();
                            setExpandedStep(isExpanded ? null : idx);
                          }}
                          className="w-full p-3 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{step.icon}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-extrabold text-emerald-800 block">
                                  STEP {step.num}
                                </span>
                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 truncate">
                                  {lang === 'en' ? step.badgeEn : step.badgeGu}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-slate-900 leading-tight truncate mt-0.5">
                                {lang === 'en' ? step.titleEn : step.titleGu}
                              </h5>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
                              isExpanded ? 'rotate-90 text-emerald-700' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 pt-1 text-xs text-slate-700 border-t border-slate-100 space-y-3 animate-in fade-in">
                            {/* Summary description */}
                            <p className="leading-relaxed font-semibold text-slate-800">
                              {lang === 'en' ? step.contentEn : step.contentGu}
                            </p>

                            {/* Application Screen Visual Mockup */}
                            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-2.5 space-y-2">
                              <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>{lang === 'en' ? 'Screen Visual Preview' : 'સ્ક્રીન દેખાવ (Visual Mock)'}</span>
                                <span className="text-emerald-700">● Live UI</span>
                              </div>

                              <StepVisualPreview type={step.visualType} lang={lang} />
                            </div>

                            {/* Detailed Step-by-Step Instructions */}
                            <div className="space-y-1 pt-0.5">
                              <span className="text-[11px] font-bold text-slate-900 block">
                                {lang === 'en' ? 'Step-by-Step Instructions:' : 'પગલાંવાર ઉપયોગ વિગત:'}
                              </span>
                              {(lang === 'gu' ? step.bulletsGu : step.bulletsEn).map((bullet, bIdx) => (
                                <p key={bIdx} className="text-[11.5px] text-slate-700 pl-1 leading-snug">
                                  {bullet}
                                </p>
                              ))}
                            </div>

                            {/* Pro Tip Box */}
                            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                              <span className="shrink-0">💡</span>
                              <span>
                                <strong>{lang === 'en' ? 'Helpful Tip: ' : 'મદદરૂપ ટીપ: '}</strong>
                                {lang === 'en' ? step.tipsEn : step.tipsGu}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: OFFICIAL HELPLINES ================= */}
          {activeTab === 'helpline' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {lang === 'en' ? 'Official Helplines' : 'સત્તાવાર હેલ્પલાઇન નંબર'}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 font-semibold block">
                        Poshan Tracker Toll-Free
                      </span>
                      <span className="text-base font-black text-emerald-900 mt-1 block">
                        14408
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-medium mt-1">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-orange-800 font-semibold block">
                        Childline India
                      </span>
                      <span className="text-base font-black text-orange-900 mt-1 block">
                        1098
                      </span>
                    </div>
                    <span className="text-[10px] text-orange-700 font-medium mt-1">
                      24x7 Emergency
                    </span>
                  </div>
                </div>
              </div>

              {/* Supervisor Direct Contact */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block">
                      {lang === 'en' ? 'Centre Supervisor' : 'કેન્દ્ર સુપરવાઈઝર'}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900">Shardaben Shah</h5>
                    <p className="text-xs text-slate-600">04 Vadtal Centre • Taluka Anand</p>
                  </div>
                  <a
                    href="tel:9876543210"
                    className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs hover:bg-emerald-800 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* CDPO Office Contact */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">CDPO Office • Anand Rural</p>
                <p className="text-[11px] text-slate-600">
                  Taluka Panchayat Bhavan, Anand • Phone: 02692-245901
                </p>
                <p className="text-[10.5px] text-slate-500">
                  Monday to Saturday: 10:30 AM to 6:10 PM
                </p>
              </div>

              {/* Official PoshanSetu Mail System & Grievance Desk */}
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                        {lang === 'en' ? 'Official Support Mail System' : 'સત્તાવાર પોષણ સેતુ ઈમેલ સિસ્ટમ'}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs font-mono">poshansetu-help@gujarat.gov.in</h5>
                    </div>
                  </div>
                  <a
                    href="mailto:poshansetu-help@gujarat.gov.in?subject=PoshanSetu%20Support%20Request%20-%20AWC%2004%20Vadtal"
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[10.5px] font-bold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                  >
                    <span>{lang === 'en' ? 'Send Mail' : 'મેઇલ મોકલો'}</span>
                    <ExternalLink className="w-3 h-3 text-emerald-700" />
                  </a>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  {lang === 'en'
                    ? 'State ICDS Directorate email desk for technical support, stock queries, and AWW assistance. Response within 24 working hours.'
                    : 'રાજ્ય ICDS કચેરી ટેકનિકલ હેલ્પડેસ્ક. કોઈપણ મુશ્કેલી અથવા પ્રશ્ન માટે ૨૪ કલાકમાં ઈમેલ દ્વારા માર્ગદર્શન.'}
                </p>
              </div>
            </div>
          )}

          {/* ================= TAB 3: FAQS ================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {lang === 'en' ? 'Frequently Asked Questions' : 'સામાન્ય પ્રશ્નો અને માર્ગદર્શન'}
              </h4>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'en'
                      ? 'What if an inward item (like Rice) was not delivered?'
                      : 'જો ગોડાઉનમાંથી કોઈ વસ્તુ (દા.ત. ચોખા) ન આવી હોય તો શું કરવું?'}
                  </h5>
                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    {lang === 'en'
                      ? 'On the Stock Received screen, tap the red trash can icon next to that item to delete it, or decrease quantity to 0 kg. Only items marked with quantities will be added.'
                      : 'સ્ટોક આવક સ્ક્રીન પર તે વસ્તુની બાજુમાં આવેલ લાલ કચરાપેટી બટન દબાવી તેને ડિલીટ કરી દો અથવા જથ્થો ૦ કિલો કરી દો. ફક્ત આવેલા જથ્થાની જ નોંધણી થશે.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'en'
                      ? 'How does Local Bill Reimbursement work?'
                      : 'સ્થાનિક ખરીદીના બિલની ભરપાઈ કેવી રીતે મળે છે?'}
                  </h5>
                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    {lang === 'en'
                      ? 'Snap a photo of the receipt for vegetables, spices, or LPG cylinder. Enter the amount and remarks. Once CDPO approves, funds are directly transferred to your bank account via DBT.'
                      : 'શાકભાજી, મસાલા કે ગેસના બિલનો ફોટો પાડી રકમ અને નોંધ સાથે સબમિટ કરો. સીડીપીઓ મંજૂરી બાદ નાણાં સીધા બેંક ખાતામાં ડીબીટી દ્વારા જમા થાય છે.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'en'
                      ? 'Does the app work without internet?'
                      : 'શું ઇન્ટરનેટ વિના પણ એપ્લિકેશન કામ કરે છે?'}
                  </h5>
                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    {lang === 'en'
                      ? 'Yes! All features work offline. Attendance, meal usage, and receipts are stored safely on your phone and automatically push to the cloud database as soon as internet is detected.'
                      : 'હા! ઇન્ટરનેટ ન હોય તો પણ બધી નોંધ તમારા ફોનમાં સાચવાઈ રહે છે અને નેટ મળતાં જ આપમેળે સર્વર સાથે સમન્વયિત (સિંક) થઈ જાય છે.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <h5 className="text-xs font-bold text-slate-900">
                    {lang === 'en'
                      ? 'What are the demo login credentials?'
                      : 'ડેમો લોગિન માટેના યુઝર આઈડી અને પાસવર્ડ શું છે?'}
                  </h5>
                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    {lang === 'en'
                      ? 'User ID: worker • Password: 1234. You can also tap the "Auto Fill" button on the login screen for 1-click access.'
                      : 'યુઝર આઈડી: worker • પાસવર્ડ: 1234. લોગિન સ્ક્રીન પર આપેલ "ડેમો પાસવર્ડ ભરો" બટનથી ૧-ક્લિકમાં લોગિન કરી શકો છો.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders an illustrated visual mock preview of the app's real screens
 */
const StepVisualPreview: React.FC<{ type: string; lang: Language }> = ({ type, lang }) => {
  if (type === 'login') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="font-bold text-emerald-800">Poshan Setu Sign-in</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
            04-Vadtal (AWVAD04)
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <span className="text-slate-500">User ID:</span>
            <span className="font-bold text-slate-900 font-mono">worker</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <span className="text-slate-500">Password:</span>
            <span className="font-bold text-slate-900 font-mono">•••• (1234)</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[9.5px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            ⚡ Quick Autofill Available
          </span>
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2.5 py-1 rounded-md">
            Sign In →
          </span>
        </div>
      </div>
    );
  }

  if (type === 'stock-inward') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between bg-slate-100/80 px-2 py-1 rounded text-[10px] font-bold text-slate-700">
          <span>Challan: #CH-2026-904</span>
          <span className="text-emerald-700">Gujarat Civil Supplies</span>
        </div>

        {/* Item 1: Deleted/Zero Rice */}
        <div className="flex items-center justify-between bg-red-50/70 p-1.5 rounded-lg border border-red-200">
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Fortified Rice (ચોખા)</span>
            <span className="text-[9.5px] text-red-700 font-semibold">❌ Not Received • Set to 0 kg</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-red-100 text-red-800 font-black rounded text-[10.5px]">0 kg</span>
            <span className="p-1 bg-red-200 text-red-900 rounded text-[9px] font-bold">🗑️ Delete</span>
          </div>
        </div>

        {/* Item 2: Tuver Dal */}
        <div className="flex items-center justify-between bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200">
          <div>
            <span className="font-bold text-emerald-950 block text-[11px]">Tuver Dal (તુવેર દાળ)</span>
            <span className="text-[9.5px] text-emerald-700 font-mono">Batch: DAL-26-88 • Exp: 10/2027</span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-700 text-white font-black rounded text-[10.5px] shadow-2xs">
            +25 kg
          </span>
        </div>

        {/* Item 3: Wheat Atta */}
        <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200">
          <div>
            <span className="font-bold text-slate-800 block text-[11px]">Whole Wheat Atta (ઘઉંનો લોટ)</span>
            <span className="text-[9.5px] text-slate-500 font-mono">Batch: ATT-2026-K4</span>
          </div>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-900 font-bold rounded text-[10.5px]">
            +50 kg
          </span>
        </div>

        <div className="pt-1 flex justify-end">
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2.5 py-1 rounded-md shadow-2xs">
            ✓ Confirm Stock Inward (75 kg)
          </span>
        </div>
      </div>
    );
  }

  if (type === 'attendance') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
          <span className="font-bold text-emerald-900">Attendance: 10/10 Children Present</span>
          <span className="bg-[#15803D] text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
            ✓ Mark All (૧૦/૧૦)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
          <div className="p-1.5 rounded border border-emerald-300 bg-[#EAF7EE] flex items-center justify-between">
            <span className="font-semibold text-slate-900">01. Aarav Patel</span>
            <span className="text-emerald-700 font-bold">✓ Present</span>
          </div>
          <div className="p-1.5 rounded border border-emerald-300 bg-[#EAF7EE] flex items-center justify-between">
            <span className="font-semibold text-slate-900">02. Diya Shah</span>
            <span className="text-emerald-700 font-bold">✓ Present</span>
          </div>
        </div>
        <div className="pt-1 flex justify-end">
          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
            Proceed to Meal Usage (10 Present) →
          </span>
        </div>
      </div>
    );
  }

  if (type === 'meal-menu') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between bg-amber-50 px-2 py-1 rounded border border-amber-200">
          <span className="font-bold text-amber-950">Meal 2 – Lunch (બપોરનું ભોજન)</span>
          <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
            50g Norm / Child
          </span>
        </div>
        <div className="p-1.5 rounded bg-slate-50 border border-slate-200 space-y-1">
          <div className="flex justify-between font-bold text-slate-900">
            <span>Recipe: Pushtik Khichdi & Kadhi</span>
            <span className="text-emerald-700">10 Children</span>
          </div>
          <div className="flex gap-2 text-[10px] text-slate-600">
            <span>🌾 Rice: <strong>500g</strong></span>
            <span>🥣 Tuver Dal: <strong>250g</strong></span>
            <span>🛢️ Oil: <strong>50ml</strong></span>
          </div>
        </div>
        <div className="pt-1 flex justify-end">
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2.5 py-1 rounded-md shadow-2xs">
            Confirm Warehouse Deduction (800g)
          </span>
        </div>
      </div>
    );
  }

  if (type === 'meal-photo') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-2 shadow-2xs text-[11px]">
        <div className="relative h-24 bg-gradient-to-tr from-amber-200 via-orange-100 to-amber-50 rounded-lg overflow-hidden border border-amber-300 flex items-center justify-center">
          <div className="text-center space-y-0.5">
            <span className="text-2xl">🍲</span>
            <span className="block text-[10px] font-bold text-amber-900">Hot Cooked Khichdi & Vegetables</span>
          </div>
          {/* Watermark badge on photo */}
          <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-xs text-white p-1 rounded text-[9px] flex items-center justify-between font-mono">
            <span>📍 22.5645°N, 72.9512°E</span>
            <span>11:45 AM • 04-Vadtal</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✓ Live Geotag Watermarked
          </span>
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2 py-1 rounded shadow-2xs">
            Upload to Database
          </span>
        </div>
      </div>
    );
  }

  if (type === 'bill-upload') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🧾</span>
            <span className="font-bold text-slate-900">Local Bill #INV-8821</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ₹ 450 • Verified
          </span>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200 space-y-0.5 text-[10.5px]">
          <div className="flex justify-between">
            <span className="text-slate-500">Category:</span>
            <span className="font-bold text-slate-800">Fresh Green Vegetables</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Shop / Vendor:</span>
            <span className="font-medium text-slate-800">Vadtal Mandi Farmer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Receipt Photo:</span>
            <span className="text-emerald-700 font-semibold">Attached via Camera 📎</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[9.5px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            DBT Bank Reimbursement
          </span>
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2.5 py-1 rounded shadow-2xs">
            Submit Claim
          </span>
        </div>
      </div>
    );
  }

  if (type === 'stock-usage') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
          <span className="font-bold text-emerald-950">Beneficiary: Smt. Pooja Patel</span>
          <span className="text-[9.5px] font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
            Lactating Mother
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between font-semibold">
            <span>Bal Shakti Premix:</span>
            <span className="text-emerald-700 font-bold">4 Packs</span>
          </div>
          <div className="p-1.5 bg-slate-50 rounded border border-slate-200 flex justify-between font-semibold">
            <span>Tuver Dal:</span>
            <span className="text-emerald-700 font-bold">2 kg</span>
          </div>
        </div>
        <div className="pt-0.5 flex justify-end">
          <span className="text-[10px] font-bold text-white bg-[#15803D] px-2.5 py-1 rounded shadow-2xs">
            Confirm THR Distribution
          </span>
        </div>
      </div>
    );
  }

  if (type === 'setu-share') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="font-bold text-slate-800">Inter-AWC Transfer</span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            OTP Verified
          </span>
        </div>
        <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
          <div>
            <span className="font-bold text-slate-900 block text-[11px]">04 Vadtal ➔ 02 Mogri</span>
            <span className="text-[10px] text-slate-600">5 kg Fortified Rice</span>
          </div>
          <span className="font-mono font-extrabold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-300">
            #8491
          </span>
        </div>
      </div>
    );
  }

  if (type === 'download-report') {
    return (
      <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-1.5 shadow-2xs text-[11px]">
        <div className="flex items-center justify-between bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-700">
          <span>Gujarat Govt • ICDS MPR-6</span>
          <span className="text-emerald-700">Monthly Ledger</span>
        </div>
        <div className="p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] space-y-0.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Opening Balance:</span>
            <span className="font-bold text-slate-900">174 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Stock Received:</span>
            <span className="font-bold text-emerald-700">+75 kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Meal Consumption:</span>
            <span className="font-bold text-orange-700">-48 kg</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-0.5">
            <span className="font-bold text-slate-800">Closing Balance:</span>
            <span className="font-black text-emerald-800">201 kg</span>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-0.5">
          <span className="text-[9.5px] font-bold text-slate-700 bg-white px-2 py-1 rounded border border-slate-300">
            Export CSV
          </span>
          <span className="text-[9.5px] font-bold text-white bg-[#15803D] px-2 py-1 rounded shadow-2xs">
            Download PDF
          </span>
        </div>
      </div>
    );
  }

  // Voice Assistant
  return (
    <div className="bg-white rounded-xl p-2.5 border border-slate-200 space-y-2 shadow-2xs text-[11px]">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
          <Mic className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-900 block leading-tight">Poshan Vani Voice AI</span>
          <span className="text-[9.5px] text-slate-500">Speak in Gujarati or English</span>
        </div>
      </div>
      <div className="space-y-1 text-[10.5px]">
        <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 text-emerald-950">
          🗣️ <strong>Worker:</strong> "ચોખાનો કેટલો સ્ટોક છે?"
        </div>
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-slate-800">
          🔊 <strong>Poshan Vani:</strong> "ચોખાનો વર્તમાન બાકી સ્ટોક ૨૫ કિલો છે."
        </div>
      </div>
    </div>
  );
};

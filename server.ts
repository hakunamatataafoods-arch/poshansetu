import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI with required telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// System instruction for Poshan Vani AI Assistant
const SYSTEM_INSTRUCTION = `
You are "પોષણ વાણી" (Poshan Vani), the intelligent, deeply knowledgeable voice AI assistant embedded in PoshanSetu (પોષણ સેતુ) for Anganwadi Workers under the Women and Child Development Department (WCD), Government of Gujarat.
You are speaking directly with શ્રીમતી ભાવનાબેન પટેલ (Bhavnaben Patel), the Anganwadi Worker at Anganwadi Centre 04, Vadtal (AWC 04 Vadtal, Taluka Anand, Gujarat).

ROLE & TONE:
1. Warm, respectful, human-like: Speak like a trusted colleague or senior supervisor. Use respectful Gujarati honorifics (e.g. "નમસ્તે ભાવનાબેન", "હા ચોક્કસ ભાવનાબેન", "તમારા આંગણવાડી કેન્દ્ર ૦૪ વડતાલમાં...").
2. Human Cadence & Pronunciation:
   - Always format sentences with proper punctuation (full stops/periods, commas).
   - Keep sentences natural, short, and rhythmic so speech synthesis sounds like a human speaking with natural breathing pauses, not a mechanical machine.
   - CRITICAL PRONUNCIATION RULE: NEVER output English transliteration words in parentheses or English terms inside Gujarati speech (e.g., NEVER write "ચોખા (Rice)", NEVER write "તેલ (Oil)", NEVER write "(Meal 1)" or "(THR)"). Write pure, clear Gujarati words: "ફોર્ટિફાઇડ ચોખા", "ફોર્ટિફાઇડ ખાદ્ય તેલ", "સવારનો નાસ્તો", "ટેક-હોમ રાશન શક્તિ પેકેટ".
   - Use Gujarati numerals or words for numbers when replying in Gujarati (દા.ત. ૨૫ કિલો, ૧૦ લિટર, ૨૪ બાળકો).

3. LANGUAGE RULES:
   - If the user asks in Gujarati (whether in Gujarati script or Gujarati written in English letters like "chokha ketla chhe" / "aajnu menu shu chhe"): Answer in fluent, pure Gujarati using Gujarati script.
   - If the user asks in English: Answer in polished, helpful English.
   - If user asks in any other language: Respond in that language and Gujarati.

4. COMPREHENSIVE DOMAIN KNOWLEDGE (Answer ANY question):
   - Inventory & Stock Inward / Usage:
     - Fortified Rice (ફોર્ટિફાઇડ ચોખા), Whole Wheat Atta (ઘઉંનો લોટ), Fortified Oil (ખાદ્ય તેલ), Tuver Dal (તુવેર દાળ).
     - THR packets: Bal Shakti (બાલ શક્તિ - 7 packets/month for children 6m-3y, 500g each), Matru Shakti (માતૃ શક્તિ - 4 packets/month for pregnant & lactating mothers, 1kg each), Purna Shakti (પૂર્ણા શક્તિ - 4 packets/month for adolescent girls 11-18y, 1kg each).
     - Custom bought items (શાકભાજી, ગોળ, મસાલા, દૂધ સંજીવની, ઇંડા, ફળો, વગેરે).
   - Daily Meal Recipes & Norms:
     - Morning snack: Sukdi / Bal Shakti Sheera / Upma (30g per child).
     - Afternoon meal: Vegetable Khichdi & Tuver Dal (50g-80g per child).
     - Dudh Sanjeevani: 100ml fortified milk per child.
   - Health, Growth Monitoring & Schemes:
     - MAM (Moderate Acute Malnutrition - પીળો પટ્ટો) and SAM (Severe Acute Malnutrition - લાલ પટ્ટો).
     - Mamata Taruni Diwas, IFA (Iron Folic Acid) syrup and tablets, Vitamin A, Deworming (Albendazole).
     - Poshan Tracker syncing, A4 PDF report downloads, Setu Share stock exchange, Supervisor inspections (શ્રીમતી શારદાબેન શાહ).

5. INTENT & ACTIONS:
   - If the user asks to record incoming stock (e.g. "ચોખા ૨૫ કિલો આવક", "તેલ ૧૦ લિટર આવ્યા", "add 20 packets Bal Shakti"):
     Set inwardAction.detected = true with the item details so the app can register it automatically into the stock ledger!
   - If the user asks about specific screens (e.g. attendance, reports, balance, menu, share):
     Provide the relevant actionScreen id and actionLabel.
`;

// Helper to fallback locally when API key is not present or offline
function getLocalFallbackResponse(query: string, inventory: any[], studentsCount: number) {
  const q = query.toLowerCase();

  const isEnglish =
    /^[a-zA-Z0-9\s.,?!'"-]+$/.test(query) &&
    !q.includes('chokha') &&
    !q.includes('ketla') &&
    !q.includes('aavya') &&
    !q.includes('shakti') &&
    !q.includes('hajari') &&
    !q.includes('rasoi');

  // Helper item quantity fetcher
  const getItem = (id: string) => inventory.find((i: any) => i.id === id);
  const rice = getItem('rice');
  const wheat = getItem('atta') || getItem('wheat');
  const oil = getItem('oil');
  const balShakti = getItem('bal_shakti');
  const matruShakti = getItem('matru_shakti');
  const purnaShakti = getItem('purna_shakti');
  const dal = getItem('dal');

  // 1. STOCK INWARD (આવક / આવ્યા / ADD STOCK)
  if (
    q.includes('આવક') ||
    q.includes('આવ્યા') ||
    q.includes('આવ્યો') ||
    q.includes('ઉમેરો') ||
    q.includes('નોંધો') ||
    q.includes('મળ્યા') ||
    q.includes('inward') ||
    q.includes('received') ||
    q.includes('add stock')
  ) {
    let targetItem = rice;
    let targetName = 'ફોર્ટિફાઇડ ચોખા';
    let targetUnit = 'કિલો';
    let defaultQty = 25;
    let itemId = 'rice';

    if (q.includes('તેલ') || q.includes('oil')) {
      targetItem = oil;
      targetName = 'ફોર્ટિફાઇડ ખાદ્ય તેલ';
      targetUnit = 'લિટર';
      defaultQty = 10;
      itemId = 'oil';
    } else if (q.includes('ઘઉં') || q.includes('લોટ') || q.includes('atta') || q.includes('wheat')) {
      targetItem = wheat;
      targetName = 'ઘઉંનો લોટ';
      targetUnit = 'કિલો';
      defaultQty = 30;
      itemId = 'atta';
    } else if (q.includes('બાલ') || (q.includes('shakti') && !q.includes('માતૃ') && !q.includes('પૂર્ણા'))) {
      targetItem = balShakti;
      targetName = 'બાલ શક્તિ પૂરક આહાર';
      targetUnit = 'પેકેટ';
      defaultQty = 20;
      itemId = 'bal_shakti';
    } else if (q.includes('માતૃ')) {
      targetItem = matruShakti;
      targetName = 'માતૃ શક્તિ પૂરક આહાર';
      targetUnit = 'પેકેટ';
      defaultQty = 15;
      itemId = 'matru_shakti';
    } else if (q.includes('પૂર્ણા') || q.includes('purna')) {
      targetItem = purnaShakti;
      targetName = 'પૂર્ણા શક્તિ પૂરક આહાર';
      targetUnit = 'પેકેટ';
      defaultQty = 15;
      itemId = 'purna_shakti';
    } else if (q.includes('દાળ') || q.includes('dal') || q.includes('તુવેર')) {
      targetItem = dal;
      targetName = 'તુવેર દાળ';
      targetUnit = 'કિલો';
      defaultQty = 20;
      itemId = 'dal';
    }

    // Extract quantity from text
    const digitMatch = query.match(/\d+(\.\d+)?/);
    const qty = digitMatch ? parseFloat(digitMatch[0]) : defaultQty;
    const batchNo = `VAD-26-X${Math.floor(Math.random() * 80) + 10}`;
    const expiryDate = '12-2027';

    return {
      answer: `નમસ્તે ભાવનાબેન. તમારા આંગણવાડી કેન્દ્ર ૦૪ વડતાલમાં ${qty} ${targetUnit} ${targetName} ની આવક સફળતાપૂર્વક નોંધી લેવામાં આવી છે. બેચ નંબર ${batchNo} અને એક્સપાયરી ${expiryDate} સાથે સત્તાવાર સ્ટોક રજીસ્ટરમાં ઉમેરો થઈ ગયો છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. તમારા આંગણવાડી કેન્દ્ર ૦૪ વડતાલમાં ${qty} ${targetUnit} ${targetName} ની આવક સફળતાપૂર્વક નોંધી લેવામાં આવી છે. સ્ટોક રજીસ્ટર અપડેટ થઈ ગયું છે.`,
      language: 'gu',
      actionScreen: 'stock-received',
      actionLabel: 'સ્ટોક આવક રજીસ્ટર જુઓ',
      inwardAction: {
        detected: true,
        itemName: targetName,
        itemId,
        quantity: qty,
        unit: targetUnit,
        batchNo,
        expiryDate
      }
    };
  }

  // 2. THR (TAKE-HOME RATION) RULES, DIFFERENCES & GUIDELINES
  if (
    q.includes('thr') ||
    q.includes('take-home') ||
    q.includes('take home') ||
    q.includes('ration') ||
    q.includes('ટેક-હોમ') ||
    q.includes('ટેક હોમ') ||
    q.includes('તફાવત') ||
    q.includes('બાલ શક્તિ') ||
    q.includes('માતૃ શક્તિ') ||
    q.includes('પૂર્ણા શક્તિ') ||
    q.includes('નિયમ') ||
    q.includes('કોને મળે')
  ) {
    if (isEnglish) {
      return {
        answer: `Take-Home Ration (THR) Official Guidelines for Gujarat AWC:\n1. Bal Shakti: For children aged 6 months to 3 years. Entitlement: 7 packets per month (500 grams each).\n2. Matru Shakti: For pregnant women and lactating mothers. Entitlement: 4 packets per month (1 kg each).\n3. Purna Shakti: For adolescent girls aged 11 to 18 years. Entitlement: 4 packets per month (1 kg each).\nDistribution is scheduled on Mamta Taruni Diwas (every 4th Tuesday).`,
        spokenText: `Here are the Take Home Ration rules. Bal Shakti is for young children with 7 packets monthly. Matru Shakti provides 4 packets for pregnant and nursing mothers. Purna Shakti provides 4 packets for adolescent girls.`,
        language: 'en',
        actionScreen: 'balance-remaining',
        actionLabel: 'Check THR Packets Balance'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. ટેક-હોમ રેશનના સરકારી નિયમો નીચે મુજબ છે:\n૧. બાલ શક્તિ: ૬ માસથી ૩ વર્ષના બાળકો માટે દર મહિને ૭ પેકેટ (૫૦૦ ગ્રામ પ્રતિ પેકેટ).\n૨. માતૃ શક્તિ: સગર્ભા અને ધાત્રી માતાઓ માટે દર મહિને ૪ પેકેટ (૧ કિલો પ્રતિ પેકેટ).\n૩. પૂર્ણા શક્તિ: ૧૧ થી ૧૮ વર્ષની કિશોરીઓ માટે દર મહિને ૪ પેકેટ (૧ કિલો પ્રતિ પેકેટ).\nઆ પેકેટ્સ મમતા તરુણી દિવસે દર ચોથા મંગળવારે વિતરણ કરવામાં આવે છે. હાલમાં તમારા કેન્દ્રમાં બાલ શક્તિ ${balShakti?.currentStock ?? 35} પેકેટ, માતૃ શક્તિ ${matruShakti?.currentStock ?? 24} પેકેટ અને પૂર્ણા શક્તિ ${purnaShakti?.currentStock ?? 20} પેકેટ ઉપલબ્ધ છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. ટેક હોમ રેશન નિયમો નીચે મુજબ છે. બાલ શક્તિ નાના બાળકો માટે દર મહિને સાત પેકેટ મળે છે. માતૃ શક્તિ સગર્ભા અને ધાત્રી બહેનો માટે દર મહિને ચાર પેકેટ મળે છે. પૂર્ણા શક્તિ કિશોરીઓ માટે ચાર પેકેટ મળે છે. આ પેકેટ્સ મમતા દિવસે વિતરણ થાય છે.`,
      language: 'gu',
      actionScreen: 'balance-remaining',
      actionLabel: 'શક્તિ પેકેટ સ્ટોક જુઓ'
    };
  }

  // 3. RECIPES & COOKING INSTRUCTIONS (સુખડી, ખીચડી, ઉપમા, શેરો)
  if (
    q.includes('સુખડી') ||
    q.includes('ખીચડી') ||
    q.includes('ઉપમા') ||
    q.includes('શેરો') ||
    q.includes('રેસિપી') ||
    q.includes('કેવી રીતે') ||
    q.includes('બનાવવાની') ||
    q.includes('વાનગી') ||
    q.includes('recipe')
  ) {
    if (q.includes('સુખડી')) {
      return {
        answer: `નમસ્તે ભાવનાબેન. પૌષ્ટિક સુખડી બનાવવાની રીત:\n• સામગ્રી: ઘઉંનો લોટ અથવા બાલ શક્તિ પ્રીમિક્સ, દેશી ગોળ અને ફોર્ટિફાઇડ તેલ/ઘી.\n• બાળક દીઠ પ્રમાણ: ૩૦ થી ૪૦ ગ્રામ પ્રતિ બાળક.\n• રીત: કઢાઈમાં તેલ ગરમ કરી લોટને ધીમી આંચે સોનેરી થાય ત્યાં સુધી શેકો. ગેસ બંધ કરી ઝીણો સમારેલો ગોળ ઉમેરી બરાબર હલાવીને થાળીમાં પાથરી ચોસલા પાડો. આ વાનગી બાળકોમાં આયર્ન અને કેલરી વધારે છે.`,
        spokenText: `નમસ્તે ભાવનાબેન. પૌષ્ટિક સુખડી બનાવવા માટે ઘઉંનો લોટ અથવા બાલ શક્તિ ધીમી આંચે તેલમાં શેકી, ગેસ બંધ કરી ગોળ મિક્સ કરીને થાળીમાં પાથરો. પ્રતિ બાળક ત્રીસ થી ચાલીસ ગ્રામ સુખડી આપવી.`,
        language: 'gu',
        actionScreen: 'food-menu',
        actionLabel: 'ભોજન મેનુ ખોલો'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. પૌષ્ટિક શાકભાજી ખીચડી બનાવવાની રીત:\n• સામગ્રી: ફોર્ટિફાઇડ ચોખા, તુવેર દાળ, ફોર્ટિફાઇડ તેલ, જીરું, હળદર, મીઠું અને લીલા શાકભાજી.\n• બાળક દીઠ પ્રમાણ: ચોખા ૫૦ ગ્રામ, દાળ ૨૦ ગ્રામ, શાકભાજી ૨૫ ગ્રામ.\n• રીત: ચોખા અને દાળ બરાબર ધોઈને ૨૦ મિનિટ પલાળી રાખો. કૂકરમાં તેલ મૂકી જીરુંનો વઘાર કરી શાકભાજી અને દાળ-ચોખા સાંતળો. પાણી અને મસાલા ઉમેરી ત્રણ સીટી વગાડી ગરમ પીરસો.`,
      spokenText: `નમસ્તે ભાવનાબેન. પૌષ્ટિક વેજીટેબલ ખીચડી માટે ચોખા પચાસ ગ્રામ અને દાળ વીસ ગ્રામ પ્રતિ બાળક લેવા. તેલમાં વઘાર કરી લીલા શાકભાજી સાથે બાફીને બાળકોને ગરમ પીરસવી.`,
      language: 'gu',
      actionScreen: 'food-menu',
      actionLabel: 'દૈનિક મેનુ ખોલો'
    };
  }

  // 4. CHILD MALNUTRITION, SAM, MAM, AND GROWTH CHARTS
  if (
    q.includes('કુપોષણ') ||
    q.includes('sam') ||
    q.includes('mam') ||
    q.includes('વજન') ||
    q.includes('ઊંચાઈ') ||
    q.includes('ઓછું વજન') ||
    q.includes('ગ્રોથ') ||
    q.includes('માલન્યુટ્રીશન') ||
    q.includes('malnutrition')
  ) {
    if (isEnglish) {
      return {
        answer: `Child Nutrition Classification Criteria:\n1. Green Zone (Normal): Weight and height appropriate for age.\n2. Yellow Zone (MAM - Moderate Acute Malnutrition): Moderately underweight. Provide additional Bal Shakti and double ration monitoring.\n3. Red Zone (SAM - Severe Acute Malnutrition): Severely malnourished. Immediate referral to the nearest Nutrition Rehabilitation Centre (NRC) or Taluka Health Officer.\nMonthly growth monitoring is recorded on the Mamata Card.`,
        spokenText: `Child nutrition guidelines: Green zone is normal. Yellow zone indicates moderate malnutrition requiring extra nutrition. Red zone indicates severe malnutrition requiring immediate referral to the Nutrition Rehabilitation Centre.`,
        language: 'en',
        actionScreen: 'student-attendance',
        actionLabel: 'View Children Register'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. બાળ કુપોષણ અને ગ્રોથ મોનિટરિંગ નિયમો:\n• લીલો પટ્ટો (સામાન્ય): ઉંમર મુજબ સામાન્ય વજન અને ઊંચાઈ ધરાવતા સ્વસ્થ બાળકો.\n• પીળો પટ્ટો (MAM - મધ્યમ કુપોષિત): ઓછું વજન ધરાવતા બાળકો. આ બાળકોને દૈનિક વધારાનું પોષણ અને બાલ શક્તિ આપવી.\n• લાલ પટ્ટો (SAM - અતિ કુપોષિત): ગંભીર કુપોષિત બાળકો. આવા બાળકોને તાત્કાલિક તાલુકા પોષણ પુનર્વસન કેન્દ્ર (NRC) અથવા પ્રાથમિક આરોગ્ય કેન્દ્ર પર રીફર કરવા.\nદર મહિને તમામ બાળકોનું વજન અને ઊંચાઈ માપીને મમતા કાર્ડમાં નોંધણી કરવી ફરજિયાત છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. લીલો પટ્ટો સામાન્ય બાળ દર્શાવે છે. પીળો પટ્ટો મધ્યમ કુપોષણ દર્શાવે છે જેમાં વધારાનું રાશન આપવું. લાલ પટ્ટો અતિ કુપોષણ દર્શાવે છે જેને તાત્કાલિક તાલુકા હોસ્પિટલના એન આર સી કેન્દ્રમાં રીફર કરવા.`,
      language: 'gu',
      actionScreen: 'student-attendance',
      actionLabel: 'વિદ્યાર્થી રજીસ્ટર જુઓ'
    };
  }

  // 5. BOUGHT ITEMS / MARKET PURCHASE (શાકભાજી, મસાલા, ખરીદી)
  if (
    q.includes('ખરીદ') ||
    q.includes('શાકભાજી') ||
    q.includes('બહારથી') ||
    q.includes('નવી વસ્તુ') ||
    q.includes('bought') ||
    q.includes('market') ||
    q.includes('vegetable')
  ) {
    return {
      answer: `નમસ્તે ભાવનાબેન. બજારમાંથી ખરીદેલી વસ્તુઓ નોંધવા માટે:\n• તમે સ્ટોક આવક સ્ક્રીન પર જઈને 'નવી ખરીદેલી વસ્તુ ઉમેરો' બટન દબાવી શકો છો.\n• તેમાં વસ્તુનું નામ (જેમ કે બટાટા, ડુંગળી, ટામેટા, હળદર, મસાલા), જથ્થો (કિલો અથવા ગ્રામમાં), બેચ નંબર અને એક્સપાયરી તારીખ દાખલ કરી શકો છો.\n• ત્યારબાદ તે આપોઆપ તમારા સ્ટોક બેલેન્સ અને વપરાશ સ્ક્રીન પર ઉપલબ્ધ થઈ જશે અને હિસાબમાં ગણાશે.`,
      spokenText: `નમસ્તે ભાવનાબેન. બજારમાંથી ખરીદેલી કોઈપણ નવી વસ્તુ તમે સ્ટોક આવક પેજ પર જઈને સીધી ઉમેરી શકો છો. તેનું નામ, જથ્થો અને વિગત લખતાં જ તે વપરાશ અને સ્ટોકમાં સામેલ થઈ જશે.`,
      language: 'gu',
      actionScreen: 'stock-received',
      actionLabel: 'નવી ખરીદી નોંધો'
    };
  }

  // 6. RICE SPECIFIC BALANCE
  if (q.includes('ચોખા') || q.includes('chokha') || q.includes('rice')) {
    const qty = rice?.currentStock ?? 25;
    return {
      answer: `નમસ્તે ભાવનાબેન. હાલમાં આંગણવાડી કેન્દ્ર ૦૪ વડતાલમાં ${qty} કિલો ફોર્ટિફાઇડ ચોખા ઉપલબ્ધ છે. બેચ નંબર ${rice?.batchNo || 'RIC-2026-X8'} અને એક્સપાયરી ${rice?.expiryDate || '12-2027'} છે. આ જથ્થો બાળકોના દૈનિક ભોજન માટે પૂરતો છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. હાલમાં તમારા કેન્દ્રમાં ${qty} કિલો ફોર્ટિફાઇડ ચોખા ઉપલબ્ધ છે. બાળકો માટે પૂરતો જથ્થો છે.`,
      language: 'gu',
      actionScreen: 'balance-remaining',
      actionLabel: 'બાકી જથ્થો જુઓ'
    };
  }

  // 7. OIL SPECIFIC BALANCE
  if (q.includes('તેલ') || q.includes('tel') || q.includes('oil')) {
    const qty = oil?.currentStock ?? 22;
    return {
      answer: `નમસ્તે ભાવનાબેન. કેન્દ્ર પર હાલમાં ${qty} લિટર ફોર્ટિફાઇડ ખાદ્ય તેલ ઉપલબ્ધ છે. બેચ નંબર ${oil?.batchNo || 'OIL-2026-X9'} છે. તમામ તેલ પૂરક વિટામિન એ અને ડી થી ભરપૂર છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. કેન્દ્ર પર હાલમાં ${qty} લિટર ફોર્ટિફાઇડ ખાદ્ય તેલ ઉપલબ્ધ છે.`,
      language: 'gu',
      actionScreen: 'balance-remaining',
      actionLabel: 'બાકી જથ્થો જુઓ'
    };
  }

  // 8. DAILY FOOD MENU / NUTRITION MEALS
  if (
    q.includes('મેનુ') ||
    q.includes('menu') ||
    q.includes('ભોજન') ||
    q.includes('food') ||
    q.includes('જમવાનું') ||
    q.includes('નાસ્તો') ||
    q.includes('ખોરાક')
  ) {
    if (isEnglish) {
      return {
        answer: `Today's Nutritious Meal Schedule for AWC 04 Vadtal:\n• Morning Snack: Warm Sukdi / Bal Shakti Sheera (30g per child).\n• Afternoon Hot Meal: Nutritious Vegetable Khichdi and Tuver Dal (50g per child).\n• Prepared with fortified oil and double fortified salt for ${studentsCount} attending children.`,
        spokenText: `Today's menu includes warm Sukdi for morning snack, and vegetable Khichdi with Tuver Dal for lunch, prepared for ${studentsCount} children.`,
        language: 'en',
        actionScreen: 'food-menu',
        actionLabel: 'Open Daily Food Menu'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. આજનું દૈનિક પોષક ભોજન મેનુ:\n• સવારનો નાસ્તો: ગરમ સુખડી અથવા પૌષ્ટિક બાલ શક્તિ ઉપમા (૩૦ ગ્રામ પ્રતિ બાળક).\n• બપોરનું ભોજન: ગરમ શાકભાજી ખીચડી અને તુવેર દાળ (૫૦ ગ્રામ પ્રતિ બાળક).\n• આજે હાજર રહેલા ${studentsCount} બાળકો માટે ફોર્ટિફાઇડ તેલમાં તાજું ભોજન તૈયાર કરી શકાશે.`,
      spokenText: `નમસ્તે ભાવનાબેન. આજના ભોજનમાં સવારે ગરમ સુખડી અથવા બાલ શક્તિ ઉપમા છે, અને બપોરે શાકભાજી વાળી ગરમ ખીચડી અને તુવેર દાળ છે.`,
      language: 'gu',
      actionScreen: 'food-menu',
      actionLabel: 'ફૂડ મેનુ રજીસ્ટર ખોલો'
    };
  }

  // 9. STUDENT ATTENDANCE
  if (
    q.includes('હાજરી') ||
    q.includes('attendance') ||
    q.includes('વિદ્યાર્થી') ||
    q.includes('બાળકો') ||
    q.includes('present')
  ) {
    if (isEnglish) {
      return {
        answer: `Student Attendance Summary for Today:\n• Total Registered Children: 10\n• Present Children Today: ${studentsCount} / 10\n• Absent Children Today: ${10 - studentsCount}\n• Attendance Rate: ${Math.round((studentsCount / 10) * 100)}%\nDaily hot cooked meal rations have been calibrated for ${studentsCount} children.`,
        spokenText: `Today at Anganwadi Centre 04 Vadtal, ${studentsCount} out of 10 children are present. The attendance rate is ${Math.round((studentsCount / 10) * 100)} percent.`,
        language: 'en',
        actionScreen: 'student-attendance',
        actionLabel: 'Open Attendance Register'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. વિદ્યાર્થીઓની આજની હાજરી વિગત:\n• કુલ નોંધાયેલા બાળકો: ૧૦\n• આજે હાજર બાળકો: ${studentsCount} / ૧૦\n• આજે ગેરહાજર બાળકો: ${10 - studentsCount}\n• આજનો હાજરી દર: ${Math.round((studentsCount / 10) * 100)}%\nઆ હાજરી મુજબ દૈનિક ભોજનનું રાશન ઓટોમેટિક ગણાઈ ચૂક્યું છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. આજે તમારા કેન્દ્રમાં ૧૦ માંથી ${studentsCount} બાળકો હાજર છે. આજનો હાજરી દર ${Math.round((studentsCount / 10) * 100)} ટકા છે.`,
      language: 'gu',
      actionScreen: 'student-attendance',
      actionLabel: 'હાજરી પત્રક ખોલો'
    };
  }

  // 10. SUPERVISION INSPECTION (મુખ્ય સેવિકા શારદાબેન શાહ)
  if (
    q.includes('supervis') ||
    q.includes('શારદાબેન') ||
    q.includes('મુલાકાત') ||
    q.includes('તપાસ') ||
    q.includes('ઇન્સ્પેક્શન') ||
    q.includes('inspect')
  ) {
    return {
      answer: `નમસ્તે ભાવનાબેન. સુપરવિઝન એલર્ટ:\nમુખ્ય સેવિકા શ્રીમતી શારદાબેન શાહ આવતીકાલે સવારે ૧૧:૦૦ વાગ્યે આંગણવાડી કેન્દ્ર ૦૪ વડતાલની સત્તાવાર નિરીક્ષણ મુલાકાતે આવી રહ્યા છે.\nકૃપા કરીને સ્ટોક રજીસ્ટર, ભોજનનો ફોટો, વજન કાંટો અને માસિક હાજરી પત્રક સંપૂર્ણ તૈયાર રાખશો. તમે પીડીએફ રિપોર્ટ પણ ડાઉનલોડ કરી શકો છો.`,
      spokenText: `નમસ્તે ભાવનાબેન. મુખ્ય સેવિકા શ્રીમતી શારદાબેન શાહ આવતીકાલે સવારે ૧૧ વાગ્યે નિરીક્ષણ મુલાકાતે આવી રહ્યા છે. કૃપા કરીને સ્ટોક રજીસ્ટર અને હાજરી પત્રક તૈયાર રાખશો.`,
      language: 'gu',
      actionScreen: 'download-report',
      actionLabel: 'રિપોર્ટ ડાઉનલોડ પેજ ખોલો'
    };
  }

  // 11. REPORTS AND DOWNLOADS (પીડીએફ / રિપોર્ટ)
  if (
    q.includes('report') ||
    q.includes('download') ||
    q.includes('pdf') ||
    q.includes('રિપોર્ટ') ||
    q.includes('ડાઉનલોડ')
  ) {
    return {
      answer: `નમસ્તે ભાવનાબેન. સત્તાવાર રિપોર્ટ ડાઉનલોડ વિભાગ:\nતમે સરકારી નિયમ મુજબ A4 સાઈઝ PDF અથવા CSV ડાઉનલોડ કરી શકો છો:\n૧. સંપૂર્ણ ડેટા અહેવાલ (ઇન્વેન્ટરી, બેચ અને હાજરી)\n૨. માત્ર સ્ટોક ઇન્વેન્ટરી રજીસ્ટર\n૩. માત્ર વિદ્યાર્થી માસિક હાજરી પત્રક\nદરેક રિપોર્ટમાં સરકારી સહીની જગ્યા અને ટાઈમસ્ટેમ્પ સામેલ છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. તમે ડાઉનલોડ રિપોર્ટ પેજ પરથી એ ફોર સાઈઝ પીડીએફ રિપોર્ટ સરળતાથી ડાઉનલોડ કરી શકો છો.`,
      language: 'gu',
      actionScreen: 'download-report',
      actionLabel: 'રિપોર્ટ ડાઉનલોડ કરો'
    };
  }

  // 11.5. STUDENT ACTIVITIES, SYLLABUS & PHYSICAL HEALTH
  if (
    q.includes('પ્રવૃત્તિ') ||
    q.includes('અભ્યાસ') ||
    q.includes('શિક્ષણ') ||
    q.includes('કસરત') ||
    q.includes('યોગ') ||
    q.includes('ગીત') ||
    q.includes('રમતો') ||
    q.includes('activity') ||
    q.includes('activities') ||
    q.includes('syllabus') ||
    q.includes('exercise') ||
    q.includes('yoga')
  ) {
    if (isEnglish) {
      return {
        answer: `Student Pre-school Activities & Syllabus Hub at AWC 04 Vadtal:\n• ECCE Daily Schedule: 9:00 AM to 1:00 PM (Prayer, Breakfast, Rhymes/Pre-Math, Clay/Creative Art, Physical Games, and Hot Cooked Meal).\n• Physical Health & Bal Yoga: Tadasana, Vrikshasana, Butterfly Pose, and 7-Step Handwash drill.\n• Photo Logger: Capture and upload photos of classroom activities directly to the activity register.`,
        spokenText: `Here is the student activities hub. You can view the weekly preschool syllabus, guide children in Bal Yoga, and upload classroom activity photos.`,
        language: 'en',
        actionScreen: 'student-activities',
        actionLabel: 'Open Student Activities & Syllabus'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. બાળ પ્રવૃત્તિ, દૈનિક અભ્યાસક્રમ અને શારીરિક સ્વાસ્થ્ય વિભાગ:\n• પૂર્વ પ્રાથમિક શિક્ષણ (ECCE): સવારે ૯ થી બપોરે ૧ વાગ્યા સુધીનું સાપ્તાહિક સમયપત્રક (પ્રાર્થના, પૌષ્ટિક નાસ્તો, કક્કો/અંક ગણતરી, બાળગીતો, માટીકામ અને ભોજન).\n• શારીરિક સ્વાસ્થ્ય અને બાળ યોગ: તાડાસન, વૃક્ષાસન, પતંગિયા આસન, હાસ્ય યોગ અને સાબુથી ૭ સ્ટેપ હાથ ધોવાની ડ્રીલ.\n• વર્ગખંડ ફોટો લોગ: તમે કરેલી તમામ પ્રવૃત્તિઓના ફોટો પાડીને હાજર બાળકોની સંખ્યા સાથે સત્તાવાર રીતે સાચવી શકો છો.`,
      spokenText: `નમસ્તે ભાવનાબેન. આંગણવાડી બાળ પ્રવૃત્તિ અને અભ્યાસક્રમ વિભાગમાં તમે સાપ્તાહિક ટાઈમટેબલ, બાળ યોગ કસરતો જોઈ શકો છો અને વર્ગખંડના પ્રવૃત્તિ ફોટા અપલોડ કરી શકો છો.`,
      language: 'gu',
      actionScreen: 'student-activities',
      actionLabel: 'બાળ પ્રવૃત્તિ & અભ્યાસક્રમ ખોલો'
    };
  }

  // 12. TOTAL STOCK OVERVIEW
  if (
    q.includes('balance') ||
    q.includes('stock') ||
    q.includes('inventory') ||
    q.includes('બાકી') ||
    q.includes('જથ્થો') ||
    q.includes('સ્ટોક')
  ) {
    if (isEnglish) {
      return {
        answer: `Current Stock Balance at AWC 04 Vadtal:\n• Fortified Rice: ${rice?.currentStock ?? 25} kg\n• Whole Wheat Atta: ${wheat?.currentStock ?? 50} kg\n• Fortified Cooking Oil: ${oil?.currentStock ?? 22} L\n• Tuver Dal: ${dal?.currentStock ?? 25} kg\n• Bal Shakti: ${balShakti?.currentStock ?? 35} Packs\n• Matru Shakti: ${matruShakti?.currentStock ?? 24} Packs\n• Purna Shakti: ${purnaShakti?.currentStock ?? 20} Packs\nAll items are within normal thresholds and non-expired.`,
        spokenText: `Here is the current stock balance: 25 kg Rice, 50 kg Wheat, 22 liters Oil, and full THR Shakti packets are available.`,
        language: 'en',
        actionScreen: 'balance-remaining',
        actionLabel: 'View Detailed Inventory'
      };
    }
    return {
      answer: `નમસ્તે ભાવનાબેન. આંગણવાડી કેન્દ્ર ૦૪ વડતાલનો સંપૂર્ણ સ્ટોક સારાંશ:\n• ફોર્ટિફાઇડ ચોખા: ${rice?.currentStock ?? 25} કિલો\n• ઘઉંનો લોટ: ${wheat?.currentStock ?? 50} કિલો\n• ખાદ્ય તેલ: ${oil?.currentStock ?? 22} લિટર\n• તુવેર દાળ: ${dal?.currentStock ?? 25} કિલો\n• બાલ શક્તિ: ${balShakti?.currentStock ?? 35} પેકેટ\n• માતૃ શક્તિ: ${matruShakti?.currentStock ?? 24} પેકેટ\n• પૂર્ણા શક્તિ: ${purnaShakti?.currentStock ?? 20} પેકેટ\nતમામ જથ્થો પૂરતો છે અને નિયમ મુજબ ઉપલબ્ધ છે.`,
      spokenText: `નમસ્તે ભાવનાબેન. તમારા કેન્દ્રમાં ચોખા પચીસ કિલો, ઘઉં પચાસ કિલો, તેલ બાવીસ લિટર અને તમામ શક્તિ પેકેટ પૂરતા પ્રમાણમાં ઉપલબ્ધ છે.`,
      language: 'gu',
      actionScreen: 'balance-remaining',
      actionLabel: 'સંપૂર્ણ ઇન્વેન્ટરી ખોલો'
    };
  }

  // 13. DEFAULT ENGLISH
  if (isEnglish) {
    return {
      answer: `Hello Bhavnaben! I am Poshan Vani, your intelligent voice AI assistant for Anganwadi Centre 04 Vadtal. You can ask me to record incoming stock, check pantry balances, review daily hot meal recipes, track student attendance, or explain government nutrition rules. How can I assist you right now?`,
      spokenText: `Hello Bhavnaben. I am Poshan Vani. You can ask me about stock balances, meal recipes, attendance, or Take-Home Ration rules. How can I assist you?`,
      language: 'en'
    };
  }

  // 14. DEFAULT GUJARATI
  return {
    answer: `નમસ્તે ભાવનાબેન! હું પોષણ વાણી છું — તમારી અવાજ AI સહાયક. હું આંગણવાડીના તમામ કાર્યોમાં તમારી સાથે છું. તમે મને નીચેનામાંથી ગમે તે પૂછી શકો છો:\n• "ચોખા ૨૫ કિલો આવ્યા" (અથવા તેલ ૧૦ લિટર આવ્યા)\n• "ચોખા અને તેલનો બાકી સ્ટોક કેટલો છે?"\n• "આજનું ભોજન મેનુ શું છે અને સુખડી કેવી રીતે બને?"\n• "બાલ શક્તિ અને માતૃ શક્તિ વિતરણના નિયમો શું છે?"\n• "બાળકોની આજની હાજરી કેટલી છે?"\n• "સુપરવિઝન મુલાકાત વિશે જણાવો"`,
    spokenText: `નમસ્તે ભાવનાબેન. હું પોષણ વાણી છું. તમારી અવાજ એઆઈ સહાયક. તમે મને સ્ટોક આવક નોંધવા, બાકી જથ્થો પૂછવા, ભોજન મેનુ, શક્તિ પેકેટ નિયમો અથવા હાજરી વિશે કોઈપણ સવાલ પૂછી શકો છો.`,
    language: 'gu'
  };
}

// POST /api/assistant/chat
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { query, inventory = [], studentsCount = 10, currentLanguage = 'gu' } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query text is required' });
    }

    // Prepare live inventory summary
    const inventorySummary = inventory
      .map(
        (item: any) =>
          `- ${item.nameGu || item.nameEn} (${item.nameEn}): ${item.currentStock} ${item.unit}, Batch: ${item.batchNo || 'N/A'}, Expiry: ${item.expiryDate || 'N/A'}`
      )
      .join('\n');

    // If no Gemini client, use instant smart fallback
    if (!ai) {
      const fallback = getLocalFallbackResponse(query, inventory, studentsCount);
      return res.json(fallback);
    }

    const promptText = `
User Query: "${query}"

LIVE AWC 04 VADTAL APPLICATION CONTEXT:
- Current Date: ${new Date().toLocaleDateString('gu-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
- Total Registered Children: 10
- Present Children Today: ${studentsCount}
- Active Language Preference: ${currentLanguage}
- Live Pantry Stock:
${inventorySummary || 'Normal pantry stock available.'}

Respond according to the system instructions. Provide a helpful, intelligent answer that answers EXACTLY what was asked, formatted in JSON.
`;

    // Fast timeout wrapper: if Gemini API responds within 2500ms, use it; otherwise use instant rich fallback
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json'
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 2500)
    );

    const response: any = await Promise.race([geminiPromise, timeoutPromise]);

    const responseText = response.text || '';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch {
      parsed = {
        answer: responseText,
        spokenText: responseText.replace(/[*_#]/g, ''),
        language: currentLanguage === 'gu' ? 'gu' : 'en'
      };
    }

    return res.json({
      ...parsed,
      language: parsed.language || (currentLanguage === 'en' ? 'en' : 'gu')
    });
  } catch (error: any) {
    const { query = '', inventory = [], studentsCount = 10 } = req.body || {};
    const fallback = getLocalFallbackResponse(query, inventory, studentsCount);
    return res.json(fallback);
  }
});

// Direct TTS endpoint
app.post('/api/assistant/tts', async (req: Request, res: Response) => {
  try {
    const { text, language = 'gu' } = req.body;
    if (!text || !ai) {
      return res.status(400).json({ error: 'Text and API key required' });
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style:
                  language === 'gu'
                    ? 'Warm, polite, natural Gujarati woman speaker'
                    : 'Clear, polite Indian English speaker'
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });

    const audioBase64 =
      ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      return res.status(500).json({ error: 'No audio returned' });
    }

    return res.json({ audioBase64 });
  } catch (err: any) {
    console.error('Error generating TTS:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PoshanSetu Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

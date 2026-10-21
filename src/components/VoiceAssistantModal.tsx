import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  PackagePlus,
  Package,
  Calendar,
  Layers,
  Users
} from 'lucide-react';
import { Language, InventoryItem, InwardItemDetail } from '../types';
import { translations } from '../data/translations';
import { playTransactionSuccessSound } from '../utils/audioEffects';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  inventory: InventoryItem[];
  studentsCount: number;
  onNavigate: (screen: string) => void;
  onVoiceInward?: (data: {
    inwardDate: string;
    challanNo: string;
    supplier: string;
    items: InwardItemDetail[];
  }) => void;
  onSetAllStudents?: (present: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionScreen?: string;
  actionLabel?: string;
  inwardSuccess?: {
    itemName: string;
    quantity: number;
    unit: string;
    batchNo: string;
    expiryDate: string;
    newTotal: number;
  };
  timestamp: string;
}

// Gujarati numeral translation helper
const GUJARATI_NUMBERS: Record<string, number> = {
  '૦': 0, '૧': 1, '૨': 2, '૩': 3, '૪': 4,
  '૫': 5, '૬': 6, '૭': 7, '૮': 8, '૯': 9,
  'એક': 1, 'બે': 2, 'ત્રણ': 3, 'ચાર': 4, 'પાંચ': 5,
  'છ': 6, 'સાત': 7, 'આઠ': 8, 'નવ': 9, 'દસ': 10,
  'પંદર': 15, 'વીસ': 20, 'પચીસ': 25, 'ત્રીસ': 30,
  'ચાલીસ': 40, 'પચાસ': 50, 'સાઠ': 60, 'સિત્તેર': 70,
  'એંસી': 80, 'નેવું': 90, 'સો': 100
};

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  inventory,
  studentsCount,
  onNavigate,
  onVoiceInward,
  onSetAllStudents
}) => {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Gujarati is the primary language for voice interactions
  const [activeSpeechLang, setActiveSpeechLang] = useState<'gu-IN' | 'en-IN'>('gu-IN');

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message in Gujarati
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        'નમસ્તે ભાવનાબેન! 🙏 હું પોષણ વાણી છું — તમારી ગુજરાતી અવાજ સહાયક.\n\nતમે બોલીને સ્ટોક આવક નોંધાવી શકો છો (દા.ત. "ચોખા ૨૫ કિલો આવક" અથવા "તેલ ૧૦ લિટર આવ્યા"), બાકી જથ્થો ચકાસી શકો છો, આજનું ભોજન મેનુ જોઈ શકો છો અથવા A4 રિપોર્ટ ડાઉનલોડ કરી શકો છો.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages, isListening]);

  // Stop speech synthesis when closing modal
  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Setup Web Speech API Recognition with Gujarati by default
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = activeSpeechLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition setup failed:', err);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [activeSpeechLang]);

  // Trigger Gujarati speech synthesis
  const speakText = (text: string, voiceLang: string = 'gu-IN') => {
    if (!audioEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean emojis and markdown from speech string
    const cleanSpeech = text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[•*#✓🚨📥🍲👶📦🛢️🥣📄]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = voiceLang;
    utterance.rate = 0.92; // Warm, steady, respectful tone for Anganwadi worker
    utterance.pitch = 1.05;

    // Pick Gujarati or Indian phonetic voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('gu') ||
        v.lang.toLowerCase().includes('in') ||
        v.name.toLowerCase().includes('gujarati') ||
        v.name.toLowerCase().includes('india')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Start / Stop Voice Listening
  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
    }

    if (!speechSupported) {
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (transcript.trim()) {
        handleProcessQuery(transcript.trim());
      }
    } else {
      setTranscript('');
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = activeSpeechLang;
          recognitionRef.current.start();
        }
      } catch (e) {
        console.warn('Error starting speech recognition:', e);
      }
    }
  };

  // Helper: Extract quantity from text (Gujarati numbers or digits)
  const extractQuantity = (text: string, defaultQty: number = 25): number => {
    // 1. Look for English digits
    const digitMatch = text.match(/\d+(\.\d+)?/);
    if (digitMatch) {
      return parseFloat(digitMatch[0]);
    }

    // 2. Look for Gujarati numerals
    const gujDigitsMatch = text.match(/[૦-૯]+/);
    if (gujDigitsMatch) {
      const converted = gujDigitsMatch[0]
        .split('')
        .map((ch) => GUJARATI_NUMBERS[ch] ?? 0)
        .join('');
      return parseFloat(converted) || defaultQty;
    }

    // 3. Look for Gujarati word numbers
    for (const [word, val] of Object.entries(GUJARATI_NUMBERS)) {
      if (text.includes(word)) {
        return val;
      }
    }

    return defaultQty;
  };

  // Process query and return intelligent Gujarati response
  const handleProcessQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscript('');
    setTextInput('');

    const q = queryText.toLowerCase();

    let responseText = '';
    let actionScreen: string | undefined;
    let actionLabel: string | undefined;
    let inwardRecord: ChatMessage['inwardSuccess'];

    // Helper item quantity fetcher
    const getItem = (id: string) => inventory.find((i) => i.id === id);
    const rice = getItem('rice');
    const wheat = getItem('atta') || getItem('wheat');
    const oil = getItem('oil');
    const balShakti = getItem('bal_shakti');
    const matruShakti = getItem('matru_shakti');
    const purnaShakti = getItem('purna_shakti');
    const dal = getItem('dal');

    // =========================================================================
    // 1. VOICE STOCK INWARD (ગુજરાતીમાં સ્ટોક આવક નોંધણી)
    // Matches inputs like: "ચોખા ૨૫ કિલો આવક", "તેલ ૧૦ લિટર આવ્યા", "૫૦ કિલો ચોખા ઉમેરો", "બાલ શક્તિ ૨૦ પેકેટ આવક"
    // =========================================================================
    const isInwardQuery =
      q.includes('આવક') ||
      q.includes('આવ્યા') ||
      q.includes('આવ્યો') ||
      q.includes('ઉમેરો') ||
      q.includes('નોંધો') ||
      q.includes('મળ્યા') ||
      q.includes('inward') ||
      q.includes('received') ||
      q.includes('add stock');

    if (
      isInwardQuery &&
      (q.includes('ચોખા') ||
        q.includes('rice') ||
        q.includes('તેલ') ||
        q.includes('oil') ||
        q.includes('ઘઉં') ||
        q.includes('લોટ') ||
        q.includes('atta') ||
        q.includes('શક્તિ') ||
        q.includes('બાલ') ||
        q.includes('માતૃ') ||
        q.includes('પૂર્ણા') ||
        q.includes('દાળ') ||
        q.includes('dal'))
    ) {
      let targetItem = rice;
      let targetName = 'ફોર્ટિફાઇડ ચોખા (Rice)';
      let targetUnit = 'kg';
      let batchPrefix = 'RIC-2026';
      let defaultQuantity = 25;

      if (q.includes('તેલ') || q.includes('oil')) {
        targetItem = oil;
        targetName = 'ફોર્ટિફાઇડ ખાદ્ય તેલ (Fortified Oil)';
        targetUnit = 'litre';
        batchPrefix = 'OIL-2026';
        defaultQuantity = 10;
      } else if (q.includes('ઘઉં') || q.includes('લોટ') || q.includes('atta')) {
        targetItem = wheat;
        targetName = 'ઘઉંનો લોટ / આટો (Whole Wheat Atta)';
        targetUnit = 'kg';
        batchPrefix = 'ATT-2026';
        defaultQuantity = 30;
      } else if (q.includes('બાલ') || (q.includes('shakti') && !q.includes('માતૃ') && !q.includes('પૂર્ણા'))) {
        targetItem = balShakti;
        targetName = 'બાલ શક્તિ પૂરક આહાર (Bal Shakti)';
        targetUnit = 'Pack';
        batchPrefix = 'BAL-26';
        defaultQuantity = 20;
      } else if (q.includes('માતૃ')) {
        targetItem = matruShakti;
        targetName = 'માતૃ શક્તિ પૂરક આહાર (Matru Shakti)';
        targetUnit = 'Pack';
        batchPrefix = 'MAT-26';
        defaultQuantity = 15;
      } else if (q.includes('પૂર્ણા') || q.includes('poon') || q.includes('purna')) {
        targetItem = purnaShakti;
        targetName = 'પૂર્ણા શક્તિ પૂરક આહાર (Purna Shakti)';
        targetUnit = 'Pack';
        batchPrefix = 'PUR-26';
        defaultQuantity = 15;
      } else if (q.includes('દાળ') || q.includes('dal') || q.includes('તુવેર')) {
        targetItem = dal;
        targetName = 'તુવેર દાળ (Tuver Dal)';
        targetUnit = 'kg';
        batchPrefix = 'DAL-26';
        defaultQuantity = 20;
      }

      const qty = extractQuantity(queryText, defaultQuantity);
      const generatedBatch = `${batchPrefix}-X${Math.floor(Math.random() * 80) + 10}`;
      const expiryDate = '12-2027';
      const todayDate = new Date().toISOString().slice(0, 10);
      const challanNo = `CHL-VAD-${Date.now().toString().slice(-4)}`;

      // Execute stock inward directly through parent handler
      if (onVoiceInward && targetItem) {
        onVoiceInward({
          inwardDate: todayDate,
          challanNo,
          supplier: 'જિલ્લા અન્ન અને નાગરિક પુરવઠા નિગમ (આણંદ ગોડાઉન)',
          items: [
            {
              itemId: targetItem.id,
              itemName: targetItem.nameEn,
              quantity: qty,
              unit: targetUnit,
              batchNo: generatedBatch,
              expiryDate: expiryDate
            }
          ]
        });
        playTransactionSuccessSound();
      }

      const currentQty = targetItem?.currentStock ?? 0;
      const newTotal = currentQty + qty;

      responseText = `✓ સફળ સ્ટોક આવક નોંધણી!\n• વસ્તુ: ${targetName}\n• જથ્થો: +${qty} ${targetUnit}\n• બેચ નંબર: ${generatedBatch}\n• એક્સપાયરી તારીખ: ${expiryDate}\n• નવો ઉપલબ્ધ સ્ટોક: ${newTotal} ${targetUnit}\n\nઆ એન્ટ્રી ચલણ #${challanNo} હેઠળ સત્તાવાર સ્ટોક રજીસ્ટરમાં સુરક્ષિત રીતે નોંધાઈ ગઈ છે.`;
      actionLabel = 'સ્ટોક આવક રજીસ્ટર જુઓ';
      actionScreen = 'stock-received';

      inwardRecord = {
        itemName: targetName,
        quantity: qty,
        unit: targetUnit,
        batchNo: generatedBatch,
        expiryDate,
        newTotal
      };
    }

    // =========================================================================
    // 2. FOOD MENU / DAILY MEAL (આજનું ભોજન મેનુ)
    // =========================================================================
    else if (
      q.includes('menu') ||
      q.includes('food') ||
      q.includes('meal') ||
      q.includes('lunch') ||
      q.includes('breakfast') ||
      q.includes('ખોરાક') ||
      q.includes('મેનુ') ||
      q.includes('રસોઈ') ||
      q.includes('જમવાનું') ||
      q.includes('નાસ્તો')
    ) {
      const neededKg = (studentsCount * 80) / 1000;
      const neededKgStr = Number.isInteger(neededKg) ? neededKg.toString() : neededKg.toFixed(3);
      responseText = `આજનું દૈનિક પોષક ભોજન મેનુ:\n• સવારનો નાસ્તો (Meal 1): સુખડી / પૌષ્ટિક બાલ શક્તિ ઉપમા (૩૦ ગ્રામ પ્રતિ બાળક).\n• બપોરનું ભોજન (Meal 2): ગરમ વેજીટેબલ ખીચડી અને તુવેર દાળ (૫૦ ગ્રામ પ્રતિ બાળક).\n• ${studentsCount} હાજર બાળકો માટે ફોર્ટિફાઇડ તેલમાં તૈયાર થશે.\n• કુલ જરૂરી રાશન: ${neededKgStr} કિલો.`;
      actionLabel = 'દૈનિક ફૂડ મેનુ રજીસ્ટર ખોલો';
      actionScreen = 'food-menu';
    }

    // =========================================================================
    // 3. RICE STOCK (ચોખાનો સ્ટોક)
    // =========================================================================
    else if (q.includes('rice') || q.includes('chokha') || q.includes('ચોખા')) {
      const qty = rice?.currentStock ?? 25;
      responseText = `ચોખાનો બાકી જથ્થો:\nહાલમાં આંગણવાડી કેન્દ્ર ૦૪ વડતાલમાં ${qty} કિલો ફોર્ટિફાઇડ ચોખા ઉપલબ્ધ છે.\nબેચ નંબર: ${rice?.batchNo || 'RIC-2026-X8'}\nએક્સપાયરી: ${rice?.expiryDate || '12-2027'}\nસ્થિતિ: ${qty > 10 ? 'પૂરતો જથ્થો ઉપલબ્ધ છે' : 'ઓછો જથ્થો - તાત્કાલિક માગણી કરો'}.`;
      actionLabel = 'બાકી જથ્થો રજીસ્ટર જુઓ';
      actionScreen = 'balance-remaining';
    }

    // =========================================================================
    // 4. OIL STOCK (તેલનો સ્ટોક)
    // =========================================================================
    else if (q.includes('oil') || q.includes('tel') || q.includes('તેલ')) {
      const qty = oil?.currentStock ?? 10;
      responseText = `તેલનો બાકી જથ્થો:\nહાલમાં કેન્દ્ર પર ${qty} લિટર ફોર્ટિફાઇડ ખાદ્ય તેલ ઉપલબ્ધ છે.\nબેચ નંબર: ${oil?.batchNo || 'OIL-2026-X9'}\nએક્સપાયરી: ${oil?.expiryDate || '08-2027'}\nઆ તેલ દૈનિક ભોજન માટે યોગ્ય છે.`;
      actionLabel = 'બાકી જથ્થો રજીસ્ટર જુઓ';
      actionScreen = 'balance-remaining';
    }

    // =========================================================================
    // 5. BAL / MATRU / PURNA SHAKTI (શક્તિ પેકેટ સ્ટોક)
    // =========================================================================
    else if (
      q.includes('shakti') ||
      q.includes('bal') ||
      q.includes('matru') ||
      q.includes('poon') ||
      q.includes('purna') ||
      q.includes('શક્તિ') ||
      q.includes('બાલ') ||
      q.includes('માતૃ') ||
      q.includes('પૂર્ણા')
    ) {
      const bQty = balShakti?.currentStock ?? 35;
      const mQty = matruShakti?.currentStock ?? 24;
      const pQty = purnaShakti?.currentStock ?? 20;
      responseText = `ટેક-હોમ રેશન (THR) શક્તિ પેકેટ સ્ટોક:\n• બાલ શક્તિ (બાળકો માટે): ${bQty} પેકેટ (બેચ: ${balShakti?.batchNo})\n• માતૃ શક્તિ (ધાત્રી-સગર્ભા બહેનો માટે): ${mQty} પેકેટ (બેચ: ${matruShakti?.batchNo})\n• પૂર્ણા શક્તિ (કિશોરીઓ માટે): ${pQty} પેકેટ (બેચ: ${purnaShakti?.batchNo})`;
      actionLabel = 'આઇટમવાઇઝ બેલેન્સ જુઓ';
      actionScreen = 'balance-remaining';
    }

    // =========================================================================
    // 6. TOTAL STOCK BALANCE / OVERVIEW (કુલ સ્ટોક / ઇન્વેન્ટરી)
    // =========================================================================
    else if (
      q.includes('balance') ||
      q.includes('stock') ||
      q.includes('inventory') ||
      q.includes('remaining') ||
      q.includes('જથ્થો') ||
      q.includes('સ્ટોક') ||
      q.includes('કેટલો') ||
      q.includes('બાકી') ||
      q.includes('માલ')
    ) {
      responseText = `આંગણવાડી સેન્ટર ૦૪ વડતાલનો વર્તમાન સ્ટોક સારાંશ:\n• ચોખા: ${rice?.currentStock ?? 25} કિલો\n• ઘઉં લોટ: ${wheat?.currentStock ?? 50} કિલો\n• ખાદ્ય તેલ: ${oil?.currentStock ?? 22} લિટર\n• તુવેર દાળ: ${dal?.currentStock ?? 25} કિલો\n• બાલ શક્તિ: ${balShakti?.currentStock ?? 35} પેકેટ\n• માતૃ શક્તિ: ${matruShakti?.currentStock ?? 24} પેકેટ\n• પૂર્ણા શક્તિ: ${purnaShakti?.currentStock ?? 20} પેકેટ`;
      actionLabel = 'સંપૂર્ણ ઇન્વેન્ટરી રજીસ્ટર ખોલો';
      actionScreen = 'balance-remaining';
    }

    // =========================================================================
    // 7. STUDENT ATTENDANCE (વિદ્યાર્થી હાજરી)
    // =========================================================================
    else if (
      q.includes('attendance') ||
      q.includes('student') ||
      q.includes('children') ||
      q.includes('present') ||
      q.includes('હાજરી') ||
      q.includes('વિદ્યાર્થી') ||
      q.includes('બાળકો')
    ) {
      responseText = `વિદ્યાર્થીઓની આજની હાજરી:\n• કુલ નોંધાયેલા બાળકો: ૧૦\n• આજે હાજર બાળકો: ${studentsCount} / ૧૦\n• આજે ગેરહાજર બાળકો: ${10 - studentsCount}\n• આજનો હાજરી દર: ${Math.round((studentsCount / 10) * 100)}%\n• આ સંખ્યા મુજબ દૈનિક ભોજનનું રાશન ઓટોમેટિક ગણાઈ ગયું છે.`;
      actionLabel = 'વિદ્યાર્થી હાજરી પત્રક ખોલો';
      actionScreen = 'student-attendance';
    }

    // =========================================================================
    // 8. MARK ALL STUDENTS PRESENT (બધા હાજર કરો)
    // =========================================================================
    else if (
      q.includes('બધા હાજર') ||
      q.includes('તમામ હાજર') ||
      q.includes('all present') ||
      q.includes('mark all')
    ) {
      if (onSetAllStudents) {
        onSetAllStudents(true);
      }
      responseText = `✓ તમામ ૧૦ વિદ્યાર્થીઓની હાજરી સફળતાપૂર્વક 'હાજર' તરીકે નોંધાઈ ગઈ છે!\nદૈનિક ભોજન માટે ૧૦ બાળકોનું સંપૂર્ણ રાશન તૈયાર કરી શકાય છે.`;
      actionLabel = 'હાજરી પત્રક ચકાસો';
      actionScreen = 'student-attendance';
    }

    // =========================================================================
    // 9. SUPERVISION ALERT (મુખ્ય સેવિકા મુલાકાત)
    // =========================================================================
    else if (
      q.includes('supervis') ||
      q.includes('inspect') ||
      q.includes('shardaben') ||
      q.includes('visit') ||
      q.includes('સુપરવિઝન') ||
      q.includes('મુલાકાત') ||
      q.includes('તપાસ') ||
      q.includes('એલર્ટ') ||
      q.includes('શારદાબેન')
    ) {
      responseText = `🚨 સુપરવિઝન ચેતવણી:\nમુખ્ય સેવિકા શ્રીમતી શારદાબેન શાહ આવતીકાલે સવારે ૧૧:૦૦ વાગ્યે આંગણવાડી કેન્દ્ર ૦૪ વડતાલની નિરીક્ષણ મુલાકાતે આવી રહ્યા છે.\nમહેરબાની કરીને સ્ટોક રજીસ્ટર, ભોજનનો ફોટો અને વિદ્યાર્થી માસિક હાજરી પત્રક તૈયાર રાખો.`;
      actionLabel = 'ડાઉનલોડ રિપોર્ટ પેજ ખોલો';
      actionScreen = 'download-report';
    }

    // =========================================================================
    // 10. DOWNLOAD REPORT (રિપોર્ટ ડાઉનલોડ વિકલ્પો)
    // =========================================================================
    else if (
      q.includes('report') ||
      q.includes('download') ||
      q.includes('pdf') ||
      q.includes('csv') ||
      q.includes('રિપોર્ટ') ||
      q.includes('ડાઉનલોડ')
    ) {
      responseText = `સત્તાવાર અહેવાલ ડાઉનલોડ સેક્શન:\nતમે ૩ વિકલ્પોમાંથી પસંદ કરીને માન્ય A4 સાઈઝ PDF અથવા CSV ડાઉનલોડ કરી શકો છો:\n૧. સંપૂર્ણ ડેટા અહેવાલ (ઇન્વેન્ટરી, બેચ અને માસિક હાજરી)\n૨. માત્ર સ્ટોક ઇન્વેન્ટરી અહેવાલ\n૩. માત્ર વિદ્યાર્થી માસિક હાજરી અહેવાલ\n\nદરેક રિપોર્ટમાં ચોક્કસ સમય અને સરકારી સહીઓ સામેલ છે.`;
      actionLabel = 'રિપોર્ટ ડાઉનલોડ પેજ પર જાઓ';
      actionScreen = 'download-report';
    }

    // =========================================================================
    // 11. SETU SHARE EXCHANGE (સેતુ શેર આપ-લે)
    // =========================================================================
    else if (
      q.includes('share') ||
      q.includes('exchange') ||
      q.includes('transfer') ||
      q.includes('સેતુ') ||
      q.includes('શેર') ||
      q.includes('આપ-લે')
    ) {
      responseText = `સેતુ શેર એક્સચેન્જ:\nનજીકના આંગણવાડી કેન્દ્ર સાથે ઈમરજન્સી રાશનની આપ-લે કરવા માટે સેતુ શેર મોડ્યુલ તૈયાર છે. સુપરવાઈઝર પિન #8491 સાથે તમામ વ્યવહારો સત્તાવાર રીતે વેરિફાઇ થાય છે.`;
      actionLabel = 'સેતુ શેર એક્સચેન્જ ખોલો';
      actionScreen = 'setu-share';
    }

    // =========================================================================
    // 12. DEFAULT GUJARATI HELP
    // =========================================================================
    else {
      responseText = `હું તમારી મદદ માટે હંમેશા હાજર છું ભાવનાબેન! તમે નીચે મુજબ પૂછી શકો છો:\n• "ચોખા ૨૫ કિલો આવક નોંધો" (અથવા તેલ ૧૦ લિટર)\n• "ચોખા અને તેલનો સ્ટોક કેટલો છે?"\n• "આજનું ભોજન મેનુ શું છે?"\n• "વિદ્યાર્થીઓની હાજરી કેટલી છે?"\n• "સુપરવિઝન મુલાકાત વિશે જણાવો"\n• "સત્તાવાર રિપોર્ટ ડાઉનલોડ કરો"`;
    }

    // Add assistant response to history
    const assistantMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      actionScreen,
      actionLabel,
      inwardSuccess: inwardRecord,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Speak aloud in Gujarati
    speakText(responseText, 'gu-IN');
  };

  // Quick Gujarati suggestion chips
  const quickPrompts = [
    {
      label: '📥 ચોખા ૨૫ કિ.ગ્રા. આવક',
      query: 'ચોખા ૨૫ કિલો આવક આવી'
    },
    {
      label: '🛢️ તેલ ૧૦ લિટર આવક',
      query: 'તેલ ૧૦ લિટર આવક આવી'
    },
    {
      label: '📦 ચોખાનો સ્ટોક કેટલો?',
      query: 'ચોખાનો સ્ટોક કેટલો છે?'
    },
    {
      label: '🍲 આજનું ભોજન મેનુ',
      query: 'આજનું ભોજન મેનુ શું છે?'
    },
    {
      label: '👶 વિદ્યાર્થીઓની હાજરી',
      query: 'વિદ્યાર્થીઓની હાજરી કેટલી છે?'
    },
    {
      label: '🚨 સુપરવિઝન ચેતવણી',
      query: 'સુપરવિઝન મુલાકાત ક્યારે છે?'
    },
    {
      label: '📄 રિપોર્ટ ડાઉનલોડ',
      query: 'રિપોર્ટ ડાઉનલોડ કરવો છે'
    },
    {
      label: '🥣 બાલ શક્તિ પેકેટ્સ',
      query: 'બાલ શક્તિ પેકેટ કેટલા છે?'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8FAF9] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col h-[90vh] sm:h-[650px] max-h-[92vh] overflow-hidden border border-emerald-300/40">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm tracking-tight">પોષણ વાણી</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-100 font-bold px-2 py-0.2 rounded-full border border-emerald-300/30">
                  ગુજરાતી AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                આંગણવાડી અવાજ સહાયક • સ્ટોક આવક અને હાજરી
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setAudioEnabled(!audioEnabled);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                audioEnabled
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-rose-500/30 text-rose-200 hover:bg-rose-500/40'
              }`}
              title={audioEnabled ? 'અવાજ બંધ કરો' : 'અવાજ ચાલુ કરો'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/15 text-white hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Live Speaking Indicator Banner */}
        {isSpeaking && (
          <div className="px-4 py-2 bg-emerald-100/90 border-b border-emerald-200 flex items-center justify-between text-xs text-emerald-950 font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>પોષણ વાણી બોલી રહ્યું છે...</span>
            </div>
            <button
              onClick={stopSpeaking}
              className="text-[11px] text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
            >
              રોકો
            </button>
          </div>
        )}

        {/* Chat History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-white to-[#F4FAF4]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs space-y-2 ${
                    isUser
                      ? 'bg-[#15803D] text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-[12.5px] font-medium">
                    {msg.text}
                  </p>

                  {/* Stock Inward Confirmation Card */}
                  {msg.inwardSuccess && (
                    <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>સ્ટોક આવક સત્તાવાર રજીસ્ટર થઈ ગઈ છે!</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                        <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                          <span className="text-slate-500 block text-[9.5px]">આવક જથ્થો</span>
                          <span className="font-bold text-emerald-700">
                            +{msg.inwardSuccess.quantity} {msg.inwardSuccess.unit}
                          </span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
                          <span className="text-slate-500 block text-[9.5px]">નવો સ્ટોક</span>
                          <span className="font-bold text-slate-900">
                            {msg.inwardSuccess.newTotal} {msg.inwardSuccess.unit}
                          </span>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg border border-emerald-100 col-span-2">
                          <span className="text-slate-500 block text-[9.5px]">બેચ & એક્સપાયરી</span>
                          <span className="font-mono font-bold text-slate-800">
                            {msg.inwardSuccess.batchNo} • Exp: {msg.inwardSuccess.expiryDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Screen Navigation Button */}
                  {msg.actionScreen && (
                    <button
                      onClick={() => {
                        stopSpeaking();
                        onClose();
                        onNavigate(msg.actionScreen!);
                      }}
                      className="mt-2 w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>{msg.actionLabel || 'સ્ક્રીન ખોલો'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, 'gu-IN')}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>સાંભળો</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Listening Live Waveform Card */}
          {isListening && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3 animate-pulse shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4 animate-ping" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-emerald-950 block">
                  ગુજરાતીમાં સાંભળી રહ્યું છે...
                </span>
                <p className="text-[11px] text-emerald-800 italic">
                  {transcript || 'બોલો: જેમ કે "ચોખા ૨૫ કિલો આવક", "તેલનો સ્ટોક કેટલો છે?"...'}
                </p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips (All in Gujarati) */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleProcessQuery(p.query)}
              className="py-1.5 px-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-full text-xs font-bold text-slate-700 hover:text-emerald-900 whitespace-nowrap transition-all shadow-2xs cursor-pointer shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input & Microphone Control Bar */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (textInput.trim()) {
                handleProcessQuery(textInput.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            {/* Primary Gujarati Voice Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                  : 'bg-[#15803D] hover:bg-[#166534] text-white'
              }`}
              title={isListening ? 'સાંભળવાનું બંધ કરો' : 'ગુજરાતીમાં બોલો'}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5 stroke-[2.3]" />
              )}
            </button>

            {/* Text Input with Gujarati Placeholder */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="ગુજરાતીમાં લખો (દા.ત. ચોખા ૨૫ કિલો આવક)..."
                className="w-full h-12 pl-3.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className={`absolute right-2 top-2.5 w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  textInput.trim()
                    ? 'bg-emerald-700 text-white cursor-pointer hover:bg-emerald-800'
                    : 'text-slate-300'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between text-[10.5px] text-slate-500 px-1 font-medium">
            <span>🎤 અવાજ ભાષા: <strong>ગુજરાતી (gu-IN)</strong></span>
            <span>✓ સ્ટોક આવક & હાજરી ઓટો-સિન્ક</span>
          </div>
        </div>
      </div>
    </div>
  );
};

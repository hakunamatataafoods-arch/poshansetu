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
  AlertCircle
} from 'lucide-react';
import { Language, InventoryItem } from '../types';
import { translations } from '../data/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  inventory: InventoryItem[];
  studentsCount: number;
  onNavigate: (screen: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionScreen?: string;
  actionLabel?: string;
  timestamp: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  inventory,
  studentsCount,
  onNavigate
}) => {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [activeSpeechLang, setActiveSpeechLang] = useState<'gu-IN' | 'en-IN'>(
    lang === 'gu' ? 'gu-IN' : 'en-IN'
  );

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        lang === 'gu'
          ? 'નમસ્તે ભાવનાબેન! 🙏 હું પોષણ વાણી છું — તમારી આંગણવાડી અવાજ સહાયક. માઇક પર ટેપ કરો અને સ્ટોક, આજનો ખોરાક, અથવા હાજરી વિશે પૂછો.'
          : 'Namaste Bhavnaben! 🙏 I am Poshan Vani — your Anganwadi Voice Assistant. Tap the mic and ask about stock, today’s meal menu, or attendance.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Keep speech language in sync with main app language
  useEffect(() => {
    setActiveSpeechLang(lang === 'gu' ? 'gu-IN' : 'en-IN');
  }, [lang]);

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

  // Setup Web Speech API Recognition
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

  // Trigger speech synthesis
  const speakText = (text: string, voiceLang: string = activeSpeechLang) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    // Clean emojis and markdown from speech string
    const cleanSpeech = text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[•*#]/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = voiceLang;
    utterance.rate = 0.95; // Gentle, clear speed for Anganwadi workers
    utterance.pitch = 1.05;

    // Try finding Gujarati or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase().includes(voiceLang.toLowerCase()) || v.lang.includes('IN')
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

  // Start Voice Listening
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

  // Process query and return intelligent response
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

    // Process intent
    const q = queryText.toLowerCase();
    const isGujarati =
      lang === 'gu' ||
      /[\u0A80-\u0AFF]/.test(queryText) ||
      q.includes('ખોરાક') ||
      q.includes('મેનુ') ||
      q.includes('ચોખા') ||
      q.includes('તેલ') ||
      q.includes('સ્ટોક') ||
      q.includes('હાજરી') ||
      q.includes('સુપરવિઝન') ||
      q.includes('રિપોર્ટ');

    let responseText = '';
    let actionScreen: string | undefined;
    let actionLabel: string | undefined;

    // Helper item quantity fetcher
    const getItem = (id: string) => inventory.find((i) => i.id === id);
    const rice = getItem('rice');
    const wheat = getItem('atta') || getItem('wheat');
    const oil = getItem('oil');
    const balShakti = getItem('bal_shakti');
    const matruShakti = getItem('matru_shakti');
    const purnaShakti = getItem('purna_shakti');

    // 1. Food Menu / Daily Meal
    if (
      q.includes('menu') ||
      q.includes('food') ||
      q.includes('meal') ||
      q.includes('lunch') ||
      q.includes('breakfast') ||
      q.includes('ખોરાક') ||
      q.includes('મેનુ') ||
      q.includes('રસોઈ') ||
      q.includes('જમવાનું')
    ) {
      if (isGujarati) {
        responseText = `આજનું દૈનિક ભોજન મેનુ:\n• પૌષ્ટિક ગરમ ભોજન: ચોખા અને તુવેર દાળ.\n• ૨૪ હાજર બાળકો માટે ફોર્ટિફાઇડ તેલમાં તૈયાર કરવામાં આવ્યું છે.\n• સવારે નાસ્તો: બાલ શક્તિ ઉપમા.`;
        actionLabel = 'દૈનિક ફૂડ મેનુ ખોલો';
      } else {
        responseText = `Today's Daily Food Menu:\n• Hot Cooked Meal: Fortified Rice & Tuver Dal.\n• Prepared with fortified edible oil for ${studentsCount} attending children.\n• Morning snack: Bal Shakti Upma.`;
        actionLabel = 'Open Daily Food Menu';
      }
      actionScreen = 'food-menu';
    }

    // 2. Rice stock
    else if (q.includes('rice') || q.includes('chokha') || q.includes('ચોખા')) {
      const qty = rice?.currentStock ?? 25;
      if (isGujarati) {
        responseText = `ચોખાનો બાકી જથ્થો: હાલમાં ${qty} કિલો ચોખા ઉપલબ્ધ છે. બેચ નંબર: RIC-VAD-26-04, એક્સપાયરી: ૧૨/૨૦૨૭.`;
        actionLabel = 'બાકી જથ્થો રજીસ્ટર જુઓ';
      } else {
        responseText = `Fortified Rice Balance: Currently ${qty} kg is available in stock. Batch: RIC-VAD-26-04, Expiry: 12/2027.`;
        actionLabel = 'View Stock Balance';
      }
      actionScreen = 'balance-remaining';
    }

    // 3. Oil stock
    else if (q.includes('oil') || q.includes('tel') || q.includes('તેલ')) {
      const qty = oil?.currentStock ?? 10;
      if (isGujarati) {
        responseText = `તેલનો બાકી જથ્થો: હાલમાં ${qty} લિટર ફોર્ટિફાઇડ તેલ ઉપલબ્ધ છે. બેચ નંબર: OIL-VAD-26-09.`;
        actionLabel = 'બાકી જથ્થો રજીસ્ટર જુઓ';
      } else {
        responseText = `Fortified Edible Oil Balance: Currently ${qty} litres available in stock. Batch: OIL-VAD-26-09.`;
        actionLabel = 'View Stock Balance';
      }
      actionScreen = 'balance-remaining';
    }

    // 4. Bal Shakti / Matru Shakti / Purna Shakti
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
      const bQty = balShakti?.currentStock ?? 15;
      const mQty = matruShakti?.currentStock ?? 10;
      const pQty = purnaShakti?.currentStock ?? 10;
      if (isGujarati) {
        responseText = `શક્તિ પ્રીમિક્સ સ્ટોક:\n• બાલ શક્તિ: ${bQty} પેકેટ\n• માતૃ શક્તિ: ${mQty} પેકેટ\n• પૂર્ણા શક્તિ: ${pQty} પેકેટ`;
        actionLabel = 'બાકી જથ્થો તપાસો';
      } else {
        responseText = `Shakti Premix Stock:\n• Bal Shakti: ${bQty} packets\n• Matru Shakti: ${mQty} packets\n• Purna Shakti: ${pQty} packets`;
        actionLabel = 'View Item-wise Balance';
      }
      actionScreen = 'balance-remaining';
    }

    // 5. Total Stock Balance / Inventory overview
    else if (
      q.includes('balance') ||
      q.includes('stock') ||
      q.includes('inventory') ||
      q.includes('remaining') ||
      q.includes('જથ્થો') ||
      q.includes('સ્ટોક') ||
      q.includes('કેટલો') ||
      q.includes('બાકી')
    ) {
      if (isGujarati) {
        responseText = `આંગણવાડી સેન્ટર ૦૪ વડતાલનો વર્તમાન સ્ટોક:\n• ચોખા: ${rice?.currentStock ?? 25} કિલો\n• ઘઉં લોટ: ${wheat?.currentStock ?? 20} કિલો\n• તેલ: ${oil?.currentStock ?? 10} લિટર\n• બાલ શક્તિ: ${balShakti?.currentStock ?? 15} પેકેટ\n• માતૃ શક્તિ: ${matruShakti?.currentStock ?? 10} પેકેટ\n• પૂર્ણા શક્તિ: ${purnaShakti?.currentStock ?? 10} પેકેટ`;
        actionLabel = 'બાકી જથ્થો વિગતવાર જુઓ';
      } else {
        responseText = `Current Stock at AWVAD04 Centre:\n• Fortified Rice: ${rice?.currentStock ?? 25} kg\n• Whole Wheat Atta: ${wheat?.currentStock ?? 20} kg\n• Fortified Oil: ${oil?.currentStock ?? 10} litres\n• Bal Shakti: ${balShakti?.currentStock ?? 15} packets\n• Matru Shakti: ${matruShakti?.currentStock ?? 10} packets\n• Purna Shakti: ${purnaShakti?.currentStock ?? 10} packets`;
        actionLabel = 'View Complete Inventory';
      }
      actionScreen = 'balance-remaining';
    }

    // 6. Student Attendance
    else if (
      q.includes('attendance') ||
      q.includes('student') ||
      q.includes('children') ||
      q.includes('present') ||
      q.includes('હાજરી') ||
      q.includes('વિદ્યાર્થી') ||
      q.includes('બાળકો')
    ) {
      if (isGujarati) {
        responseText = `આજની વિદ્યાર્થી હાજરી:\n• ૨૫ નોંધાયેલા બાળકોમાંથી ${studentsCount} બાળકો હાજર છે.\n• હાજરી દર: ${Math.round((studentsCount / 25) * 100)}%.\n• શું તમારે હાજરી પત્રક ખોલવું છે?`;
        actionLabel = 'વિદ્યાર્થીઓની હાજરી ખોલો';
      } else {
        responseText = `Today's Student Attendance:\n• ${studentsCount} out of 25 enrolled students are marked present.\n• Attendance rate: ${Math.round((studentsCount / 25) * 100)}%.\n• Tap below to review or update attendance.`;
        actionLabel = 'Open Student Attendance';
      }
      actionScreen = 'student-attendance';
    }

    // 7. Supervision Alert
    else if (
      q.includes('supervis') ||
      q.includes('inspect') ||
      q.includes('alert') ||
      q.includes('shardaben') ||
      q.includes('visit') ||
      q.includes('સુપરવિઝન') ||
      q.includes('મુલાકાત') ||
      q.includes('તપાસ') ||
      q.includes('એલર્ટ')
    ) {
      if (isGujarati) {
        responseText = `🚨 સુપરવિઝન ચેતવણી:\nમુખ્ય સેવિકા શારદાબેન શાહ આવતીકાલે સવારે ૧૧:૦૦ વાગ્યે આંગણવાડી કેન્દ્ર ૦૪ વડતાલની મુલાકાતે આવી રહ્યા છે.\nમહેરબાની કરીને સ્ટોક રજીસ્ટર, ભોજન નમૂનો અને હાજરી પત્રક તૈયાર રાખો.`;
        actionLabel = 'રિપોર્ટ ચકાસો';
      } else {
        responseText = `🚨 Supervision Alert:\nAnganwadi Supervisor Smt. Shardaben Shah is arriving tomorrow at 11:00 AM for inspection at 04 Vadtal Centre.\nPlease ensure stock registers, meal photos, and attendance books are up to date.`;
        actionLabel = 'Review Reports';
      }
      actionScreen = 'download-report';
    }

    // 8. Stock Inward / Received
    else if (
      q.includes('received') ||
      q.includes('inward') ||
      q.includes('challan') ||
      q.includes('batch') ||
      q.includes('આવક') ||
      q.includes('ચલણ') ||
      q.includes('બેચ')
    ) {
      if (isGujarati) {
        responseText = `સ્ટોક આવક રજીસ્ટર:\nનવા માલની એન્ટ્રી માટે સ્ટોક આવક સ્ક્રીન ખોલી રહ્યા છીએ. ત્યાં દરેક વસ્તુનો બેચ નંબર અને એક્સપાયરી તારીખ દાખલ કરી શકો છો.`;
        actionLabel = 'સ્ટોક આવક ખોલો';
      } else {
        responseText = `Stock Received Register:\nOpening the Stock Inward screen where you can record new stock supplies with individual batch numbers, challan numbers, and expiry dates.`;
        actionLabel = 'Open Stock Received';
      }
      actionScreen = 'stock-received';
    }

    // 9. Stock Usage / Distribution
    else if (
      q.includes('usage') ||
      q.includes('consume') ||
      q.includes('distribut') ||
      q.includes('વપરાશ') ||
      q.includes('વિતરણ')
    ) {
      if (isGujarati) {
        responseText = `દૈનિક સ્ટોક વપરાશ:\nબાળકોના ભોજન અને લાભાર્થીઓને રેશન વિતરણની નોંધ કરવા સ્ટોક વપરાશ સ્ક્રીન ઉપલબ્ધ છે.`;
        actionLabel = 'સ્ટોક વપરાશ ખોલો';
      } else {
        responseText = `Stock Usage Register:\nOpening the Stock Usage screen to record daily food consumption and beneficiary ration distribution.`;
        actionLabel = 'Open Stock Usage';
      }
      actionScreen = 'stock-usage';
    }

    // 10. Download Report
    else if (
      q.includes('report') ||
      q.includes('download') ||
      q.includes('pdf') ||
      q.includes('csv') ||
      q.includes('રિપોર્ટ') ||
      q.includes('ડાઉનલોડ')
    ) {
      if (isGujarati) {
        responseText = `સત્તાવાર માસિક રિપોર્ટ:\nતમે ચોક્કસ સમય, બેચ નંબર અને આંગણવાડી સેતુ આપ-લે (Inter-AWC Transfer) સાથે માન્ય A4 સાઈઝ PDF અને CSV ડાઉનલોડ કરી શકો છો.`;
        actionLabel = 'રિપોર્ટ ડાઉનલોડ પેજ';
      } else {
        responseText = `Official Monthly Report:\nYou can download standard A4 size PDF and CSV with exact generation timestamp, individual item batch numbers, and Inter-AWC Setu Share exchanges.`;
        actionLabel = 'Open Download Report';
      }
      actionScreen = 'download-report';
    }

    // 11. Setu Share Exchange
    else if (
      q.includes('share') ||
      q.includes('exchange') ||
      q.includes('transfer') ||
      q.includes('સેતુ') ||
      q.includes('શેર') ||
      q.includes('આપ-લે')
    ) {
      if (isGujarati) {
        responseText = `સેતુ શેર એક્સચેન્જ:\nનજીકની આંગણવાડી સાથે અનાજ કે તેલની આપ-લે કરવા માટે સેતુ શેર સ્ક્રીન ખોલી રહ્યા છીએ.`;
        actionLabel = 'સેતુ શેર એક્સચેન્જ ખોલો';
      } else {
        responseText = `Setu Share Exchange:\nOpening the Inter-AWC transfer module where you can record emergency stock exchanges with nearby Anganwadi centres.`;
        actionLabel = 'Open Setu Share';
      }
      actionScreen = 'setu-share';
    }

    // 12. Smart Ration
    else if (
      q.includes('ration') ||
      q.includes('smart') ||
      q.includes('રેશન') ||
      q.includes('સ્માર્ટ')
    ) {
      if (isGujarati) {
        responseText = `સ્માર્ટ રેશન:\nધાત્રી માતાઓ, સગર્ભા બહેનો અને કિશોરીઓ માટે પૌષ્ટિક આહાર વિતરણ કિટનું આયોજન કરો.`;
        actionLabel = 'સ્માર્ટ રેશન ખોલો';
      } else {
        responseText = `Smart Ration:\nPlan take-home ration kits for pregnant women, lactating mothers, and adolescent girls.`;
        actionLabel = 'Open Smart Ration';
      }
      actionScreen = 'smart-ration';
    }

    // 13. Meal Photo
    else if (
      q.includes('photo') ||
      q.includes('camera') ||
      q.includes('picture') ||
      q.includes('ફોટો') ||
      q.includes('કેમેરા')
    ) {
      if (isGujarati) {
        responseText = `ભોજન ફોટો અપલોડ:\nઆજના તાજા રાંધેલા ભોજનનો ફોટો જીઓ-ટેગ સાથે અપલોડ કરો.`;
        actionLabel = 'ફોટો અપલોડ ખોલો';
      } else {
        responseText = `Meal Photo Upload:\nCapture and upload today's hot cooked meal plate with geo-timestamp verification.`;
        actionLabel = 'Open Meal Photo';
      }
      actionScreen = 'meal-photo';
    }

    // 14. Default / Greeting
    else {
      if (isGujarati) {
        responseText = `હું તમારી મદદ માટે હાજર છું. તમે નીચેનામાંથી કોઈ એક પ્રશ્ન પૂછી શકો છો:\n૧. "આજનો ખોરાક શું છે?"\n૨. "ચોખા અને તેલનો સ્ટોક કેટલો છે?"\n૩. "વિદ્યાર્થીઓની હાજરી કેટલી છે?"\n૪. "સુપરવિઝન એલર્ટ બતાવો"`;
      } else {
        responseText = `I'm here to assist you! Try asking:\n1. "What is today's meal menu?"\n2. "How much rice and oil stock is remaining?"\n3. "Show student attendance"\n4. "Check supervision alert"`;
      }
    }

    // Add assistant response to history
    const assistantMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      actionScreen,
      actionLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Speak aloud the assistant message
    speakText(responseText, isGujarati ? 'gu-IN' : 'en-IN');
  };

  // Quick suggestion chips
  const quickPrompts = [
    {
      label: lang === 'gu' ? '🍲 આજનો ખોરાક' : "🍲 Today's Food Menu",
      query: lang === 'gu' ? 'આજનો ખોરાક શું છે?' : "What is today's food menu?"
    },
    {
      label: lang === 'gu' ? '🌾 ચોખા & તેલ સ્ટોક' : '🌾 Rice & Oil Stock',
      query: lang === 'gu' ? 'ચોખા અને તેલનો બાકી સ્ટોક કેટલો છે?' : 'What is the stock balance of rice and oil?'
    },
    {
      label: lang === 'gu' ? '👶 બાલ શક્તિ સ્ટોક' : '👶 Bal Shakti Stock',
      query: lang === 'gu' ? 'બાલ શક્તિ સ્ટોક કેટલો છે?' : 'How many packets of Bal Shakti are left?'
    },
    {
      label: lang === 'gu' ? '📋 વિદ્યાર્થી હાજરી' : '📋 Student Attendance',
      query: lang === 'gu' ? 'વિદ્યાર્થીઓની હાજરી કેટલી છે?' : 'What is the student attendance today?'
    },
    {
      label: lang === 'gu' ? '🚨 સુપરવિઝન એલર્ટ' : '🚨 Supervision Alert',
      query: lang === 'gu' ? 'સુપરવિઝન મુલાકાત વિશે માહિતી આપો' : 'Tell me about the supervision inspection visit'
    },
    {
      label: lang === 'gu' ? '📄 રિપોર્ટ ડાઉનલોડ' : '📄 Download Report',
      query: lang === 'gu' ? 'રિપોર્ટ ડાઉનલોડ કરો' : 'Download monthly report'
    },
    {
      label: lang === 'gu' ? '📦 સ્ટોક આવક' : '📦 Stock Received',
      query: lang === 'gu' ? 'સ્ટોક આવક રજીસ્ટર ખોલો' : 'Open stock received register'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] h-[640px] border border-slate-200/90 animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center ring-2 ring-white/30 text-emerald-200 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base tracking-tight leading-tight">
                  {lang === 'gu' ? 'પોષણ વાણી' : 'Poshan Vani'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/40 text-emerald-100 border border-emerald-300/30">
                  {lang === 'gu' ? 'અવાજ સહાયક' : 'Voice Assistant'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 leading-tight">
                {lang === 'gu'
                  ? 'આંગણવાડી કાર્યકર અવાજ સેવા • AWVAD04'
                  : 'Anganwadi Worker Voice Assistant • AWVAD04'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Speech Mute / Unmute Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/30 text-amber-200 hover:bg-amber-500/40 border border-amber-300/40 text-[11px] font-semibold transition-all animate-pulse"
                title="Stop audio playback"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}

            {/* Language toggle inside assistant */}
            <button
              onClick={() => {
                const nextLang = lang === 'en' ? 'gu' : 'en';
                onLanguageChange(nextLang);
                setActiveSpeechLang(nextLang === 'gu' ? 'gu-IN' : 'en-IN');
              }}
              className="px-2 py-1 bg-white/15 hover:bg-white/25 rounded-full text-[11px] font-bold text-white border border-white/20 transition-colors"
            >
              {lang === 'en' ? 'ગુજરાતી' : 'English'}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAF8]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs font-medium'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Optional Action Button Trigger */}
                {msg.actionScreen && (
                  <button
                    onClick={() => {
                      if (msg.actionScreen) {
                        onNavigate(msg.actionScreen);
                        onClose();
                      }
                    }}
                    className="mt-2.5 w-full flex items-center justify-between px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-200 transition-colors group cursor-pointer text-[11px]"
                  >
                    <span>{msg.actionLabel || 'Go to screen'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="flex items-center gap-1 hover:text-emerald-700 transition-colors ml-2 cursor-pointer"
                      title="Speak response"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>{lang === 'gu' ? 'સાંભળો' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Active Listening Waveform or Transcript Indicator */}
          {isListening && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl animate-pulse">
              <div className="w-4 h-4 rounded-full bg-emerald-600 animate-ping shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-emerald-800">
                  {lang === 'gu' ? 'સાંભળી રહ્યા છીએ... બોલો' : 'Listening... Speak now'}
                </p>
                <p className="text-xs text-emerald-950 font-medium italic mt-0.5">
                  {transcript || (lang === 'gu' ? 'તમારો અવાજ કેપ્ચર થઈ રહ્યો છે...' : 'Waiting for voice input...')}
                </p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 pt-2 pb-1.5 bg-white border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
            {lang === 'gu' ? 'ઝડપી અવાજ પ્રશ્નો (ટેપ કરો):' : 'Quick Voice Queries (Tap to ask):'}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleProcessQuery(item.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Bottom Control Bar */}
        <div className="p-3 bg-white border-t border-slate-200/80">
          {/* Main Voice Activation Area */}
          <div className="flex items-center gap-2">
            {/* Input field for typing query */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleProcessQuery(textInput);
                  }
                }}
                placeholder={
                  lang === 'gu'
                    ? 'અહીં લખો અથવા માઇક પર બોલો...'
                    : 'Type a question or tap mic...'
                }
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all font-medium"
              />
              {textInput.trim() && (
                <button
                  onClick={() => handleProcessQuery(textInput)}
                  className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Glowing Microphone Button */}
            <button
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full font-bold transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-400/50 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white ring-2 ring-emerald-500/30'
              }`}
              title={
                isListening
                  ? 'Stop listening'
                  : lang === 'gu'
                  ? 'બોલવા માટે ટેપ કરો'
                  : 'Tap to speak'
              }
            >
              {isListening ? (
                <MicOff className="w-5 h-5 animate-spin" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Subtext info */}
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>
              {isListening
                ? lang === 'gu'
                  ? 'સાંભળી રહ્યા છીએ... ટેપ કરીને પૂર્ણ કરો'
                  : 'Listening... Tap mic when finished'
                : lang === 'gu'
                ? 'સપોર્ટ: ગુજરાતી & English'
                : 'Supports: English & Gujarati'}
            </span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Poshan Setu AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

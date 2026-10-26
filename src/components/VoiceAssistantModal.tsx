import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Languages,
  Loader2,
  Volume1
} from 'lucide-react';
import { Language, InventoryItem, InwardItemDetail } from '../types';
import { translations } from '../data/translations';
import { playTransactionSuccessSound, playPopClickSound } from '../utils/audioEffects';
import {
  formatTextForSpeech,
  isGujaratiText,
  getBestVoice,
  gujaratiToDevanagari
} from '../utils/speechHelper';

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
  spokenText?: string;
  audioBase64?: string;
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Active recognition speech language: default to Gujarati (gu-IN)
  const [activeSpeechLang, setActiveSpeechLang] = useState<'gu-IN' | 'en-IN'>('gu-IN');

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text:
        'નમસ્તે ભાવનાબેન! 🙏 હું પોષણ વાણી છું — તમારી સ્માર્ટ એઆઈ (AI) સહાયક.\n\nતમે મને બોલીને સ્ટોક આવક નોંધાવી શકો છો, બાકી જથ્થો પૂછી શકો છો, આજનું ભોજન મેનુ, બાળકોની હાજરી, ટેક-હોમ રેશન (THR) નિયમો અથવા આંગણવાડી અંગે કોઈપણ સવાલ પૂછી શકો છો. હું તમને શુદ્ધ ગુજરાતીમાં સાચો જવાબ આપીશ.',
      spokenText:
        'નમસ્તે ભાવનાબેન. હું પોષણ વાણી છું. તમારી સ્માર્ટ એઆઈ સહાયક. તમે મને સ્ટોક, ભોજન મેનુ, હાજરી અથવા પોષણ યોજના વિશે કોઈપણ સવાલ પૂછી શકો છો.',
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
  }, [isOpen, messages, isListening, isLoading]);

  // Clean stop when closing modal
  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Stop any ongoing speech or WAV playback
  const stopAllAudio = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      } catch {
        // ignore
      }
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Play audio: tries Gemini TTS WAV first, then falls back to natural Web Speech API
  const playSpeech = (rawText: string, audioBase64?: string, targetLanguage?: 'gu' | 'en') => {
    if (!audioEnabled) return;

    stopAllAudio();

    // 1. If Gemini TTS audioBase64 is available, play crystal-clear studio audio
    if (audioBase64) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        currentAudioRef.current = audio;
        setIsSpeaking(true);

        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          // Fall back to Web Speech API
          speakWithBrowser(rawText, targetLanguage);
        };

        audio.play().catch(() => {
          // If autoplay blocked or error, fallback to browser synthesis
          speakWithBrowser(rawText, targetLanguage);
        });
        return;
      } catch (err) {
        console.warn('Audio element error:', err);
      }
    }

    // 2. High-quality browser speech synthesis fallback
    speakWithBrowser(rawText, targetLanguage);
  };

  // Human-like browser speech synthesis with Gujarati / Devanagari phonetic optimization
  const speakWithBrowser = (text: string, targetLanguage?: 'gu' | 'en') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const isGujarati = targetLanguage ? targetLanguage === 'gu' : isGujaratiText(text);
    const cleanedSpeech = formatTextForSpeech(text, isGujarati);

    if (!cleanedSpeech) return;

    const { voice, useDevanagari } = getBestVoice(isGujarati);

    // If using Hindi Indian voice, map Gujarati characters to Devanagari for native pronunciation
    const finalUtteranceText = isGujarati && useDevanagari ? gujaratiToDevanagari(cleanedSpeech) : cleanedSpeech;

    const utterance = new SpeechSynthesisUtterance(finalUtteranceText);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = isGujarati ? 'gu-IN' : 'en-IN';
    }

    // Warm, steady, respectful cadence
    utterance.rate = isGujarati ? 0.91 : 0.95;
    utterance.pitch = 1.02;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

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
        } catch {
          // ignore
        }
      }
    };
  }, [activeSpeechLang]);

  // Toggle listening
  const toggleListening = () => {
    stopAllAudio();

    if (!speechSupported) return;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      if (transcript.trim()) {
        handleSubmitQuery(transcript.trim());
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

  // Submit query to Gemini-powered AI backend
  const handleSubmitQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const query = queryText.trim();
    stopAllAudio();

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    setTextInput('');
    setIsLoading(true);

    try {
      // 2. Call server API
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          inventory,
          studentsCount,
          currentLanguage: lang
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setIsLoading(false);

      let inwardRecord: ChatMessage['inwardSuccess'];

      // Check if server detected stock inward intent
      if (data.inwardAction?.detected && onVoiceInward) {
        const itemInfo = data.inwardAction;
        const targetItem =
          inventory.find((i) => i.id === itemInfo.itemId) ||
          inventory.find((i) => i.nameEn.toLowerCase().includes(itemInfo.itemId)) ||
          inventory[0];

        const todayDate = new Date().toISOString().slice(0, 10);
        const challanNo = `CHL-VAD-${Date.now().toString().slice(-4)}`;
        const batchNo = itemInfo.batchNo || `VAD-26-X${Math.floor(Math.random() * 80) + 10}`;
        const expiryDate = itemInfo.expiryDate || '12-2027';

        onVoiceInward({
          inwardDate: todayDate,
          challanNo,
          supplier: 'જિલ્લા અન્ન અને નાગરિક પુરવઠા નિગમ (આણંદ ગોડાઉન)',
          items: [
            {
              itemId: targetItem ? targetItem.id : 'rice',
              itemName: targetItem ? targetItem.nameEn : itemInfo.itemName,
              quantity: itemInfo.quantity,
              unit: itemInfo.unit || targetItem?.unit || 'kg',
              batchNo,
              expiryDate
            }
          ]
        });

        playTransactionSuccessSound();

        const currentQty = targetItem?.currentStock ?? 0;
        inwardRecord = {
          itemName: targetItem?.nameGu || itemInfo.itemName,
          quantity: itemInfo.quantity,
          unit: itemInfo.unit || targetItem?.unit || 'kg',
          batchNo,
          expiryDate,
          newTotal: currentQty + itemInfo.quantity
        };
      }

      // Check if mark all students present requested
      if (
        (query.toLowerCase().includes('બધા હાજર') ||
          query.toLowerCase().includes('all present') ||
          query.toLowerCase().includes('તમામ હાજર')) &&
        onSetAllStudents
      ) {
        onSetAllStudents(true);
        playTransactionSuccessSound();
      }

      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'નમસ્તે ભાવનાબેન, તમારી વિનંતી સફળતાપૂર્વક પૂર્ણ થઈ ગઈ છે.',
        spokenText: data.spokenText || data.answer,
        audioBase64: data.audioBase64,
        actionScreen: data.actionScreen,
        actionLabel: data.actionLabel,
        inwardSuccess: inwardRecord,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Speak response aloud in human Gujarati/English
      playSpeech(
        data.spokenText || data.answer,
        data.audioBase64,
        data.language === 'en' ? 'en' : 'gu'
      );
    } catch (err) {
      console.error('Failed to get assistant response:', err);
      setIsLoading(false);

      const errorReply =
        lang === 'gu'
          ? 'નમસ્તે ભાવનાબેન. તમારા આંગણવાડી કેન્દ્ર ૦૪ વડતાલનો સ્ટોક અને માહિતી ઉપલબ્ધ છે. તમે ચોખા, તેલ, ભોજન મેનુ અથવા હાજરી વિશે ફરી પૂછી શકો છો.'
          : 'Hello Bhavnaben. AWC 04 Vadtal pantry records are ready. Please feel free to ask about stock balance, daily meals, or student attendance.';

      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: errorReply,
        spokenText: errorReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, fallbackMsg]);
      playSpeech(errorReply, undefined, lang);
    }
  };

  // Quick suggestion prompts in pure Gujarati
  const quickPrompts = [
    { label: '🏃 બાળ પ્રવૃત્તિ & કસરત', query: 'બાળકોની પ્રવૃત્તિ, બાળ યોગાસન અને અભ્યાસક્રમ શું છે?' },
    { label: '📚 આજનો અભ્યાસક્રમ', query: 'આંગણવાડીમાં આજે શું ભણાવવાનું છે અને ટાઈમટેબલ શું છે?' },
    { label: '📦 ચોખાનો સ્ટોક કેટલો છે?', query: 'ચોખાનો સ્ટોક કેટલો છે?' },
    { label: '🛢️ તેલનો બાકી જથ્થો?', query: 'તેલનો બાકી જથ્થો કેટલો છે?' },
    { label: '🍲 આજનું ભોજન મેનુ', query: 'આજનું ભોજન મેનુ શું છે?' },
    { label: '📥 ચોખા ૨૫ કિલો આવ્યા', query: 'ચોખા ૨૫ કિલો આવક આવી છે' },
    { label: '🛢️ તેલ ૧૦ લિટર આવ્યા', query: 'તેલ ૧૦ લિટર આવ્યા છે ઉમેરો' },
    { label: '👶 બાળકોની આજની હાજરી', query: 'વિદ્યાર્થીઓની આજની હાજરી કેટલી છે?' },
    { label: '🥣 THR બાલ શક્તિ નિયમો', query: 'બાલ શક્તિ અને માતૃ શક્તિ વિતરણના સરકારી નિયમો શું છે?' },
    { label: '📄 રિપોર્ટ ડાઉનલોડ', query: 'સત્તાવાર રજીસ્ટર રિપોર્ટ કેવી રીતે ડાઉનલોડ કરવો?' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#F8FAF9] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col h-[90vh] sm:h-[680px] max-h-[92vh] overflow-hidden border border-emerald-300/40">
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Bot className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm tracking-tight">પોષણ વાણી</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  ગુજરાતી AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                માનવ અવાજ સહાયક • જે પૂછશો તેનો સાચો જવાબ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Speech Language Toggle (Gujarati / English) */}
            <button
              onClick={() => {
                const nextLang = activeSpeechLang === 'gu-IN' ? 'en-IN' : 'gu-IN';
                setActiveSpeechLang(nextLang);
                playPopClickSound();
              }}
              className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="અવાજ ભાષા બદલો"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{activeSpeechLang === 'gu-IN' ? 'ગુજરાતી' : 'English'}</span>
            </button>

            {/* Audio On/Off Toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopAllAudio();
                setAudioEnabled(!audioEnabled);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
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
                stopAllAudio();
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
          <div className="px-4 py-2 bg-emerald-100 border-b border-emerald-300/60 flex items-center justify-between text-xs text-emerald-950 font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>પોષણ વાણી બોલી રહ્યું છે... (કુદરતી ગુજરાતી અવાજ)</span>
            </div>
            <button
              onClick={stopAllAudio}
              className="text-[11px] bg-emerald-700 text-white px-2 py-0.5 rounded-md hover:bg-emerald-800 cursor-pointer"
            >
              અવાજ રોકો
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
                        <span>સ્ટોક આવક સત્તાવાર નોંધાઈ ગઈ છે!</span>
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
                        stopAllAudio();
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
                        onClick={() =>
                          playSpeech(
                            msg.spokenText || msg.text,
                            msg.audioBase64,
                            isGujaratiText(msg.text) ? 'gu' : 'en'
                          )
                        }
                        className="text-[10.5px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
                      >
                        <Volume1 className="w-3.5 h-3.5" />
                        <span>ફરી સાંભળો</span>
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

          {/* AI Thinking State */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-emerald-200 rounded-2xl w-fit shadow-xs">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold text-emerald-900">
                પોષણ વાણી જવાબ તૈયાર કરી રહ્યું છે...
              </span>
            </div>
          )}

          {/* Listening Live Waveform Card */}
          {isListening && (
            <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl flex items-center gap-3 animate-pulse shadow-sm">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Mic className="w-4 h-4 animate-ping" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-xs text-emerald-950 block">
                  {activeSpeechLang === 'gu-IN' ? 'ગુજરાતીમાં સાંભળી રહ્યું છે...' : 'Listening in English...'}
                </span>
                <p className="text-[11px] text-emerald-800 italic">
                  {transcript || 'બોલો: જેમ કે "ચોખાનો સ્ટોક કેટલો છે?", "ચોખા ૨૫ કિલો આવ્યા"...'}
                </p>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmitQuery(p.query)}
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
                handleSubmitQuery(textInput.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            {/* Primary Voice Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                  : 'bg-[#15803D] hover:bg-[#166534] text-white active:scale-95'
              }`}
              title={isListening ? 'સાંભળવાનું બંધ કરો' : 'બોલવા માટે માઇક દબાવો'}
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
                placeholder="કોઈપણ સવાલ પૂછો અથવા સ્ટોક આવક લખો..."
                className="w-full h-12 pl-3.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isLoading}
                className={`absolute right-2 top-2.5 w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  textInput.trim() && !isLoading
                    ? 'bg-emerald-700 text-white cursor-pointer hover:bg-emerald-800'
                    : 'text-slate-300'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between text-[10.5px] text-slate-500 px-1 font-medium">
            <span className="flex items-center gap-1.5">
              <span>🎤 માઇક ભાષા:</span>
              <strong className="text-emerald-800">
                {activeSpeechLang === 'gu-IN' ? 'ગુજરાતી (gu-IN)' : 'English (en-IN)'}
              </strong>
            </span>
            <span className="text-emerald-700 font-bold">✓ કુદરતી ઉચ્ચારણ & સંપૂર્ણ AI સહાયક</span>
          </div>
        </div>
      </div>
    </div>
  );
};

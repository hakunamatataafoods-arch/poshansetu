// Specialized speech synthesis and phonetic helper for Gujarati & English in PoshanSetu

// Map Gujarati digits to Gujarati words for human-like reading
const GUJARATI_NUM_WORDS: Record<string, string> = {
  '0': 'શૂન્ય',
  '1': 'એક',
  '2': 'બે',
  '3': 'ત્રણ',
  '4': 'ચાર',
  '5': 'પાંચ',
  '6': 'છ',
  '7': 'સાત',
  '8': 'આઠ',
  '9': 'નવ',
  '10': 'દસ',
  '11': 'અગિયાર',
  '12': 'બાર',
  '13': 'તેર',
  '14': 'ચૌદ',
  '15': 'પંદર',
  '16': 'સોળ',
  '17': 'સત્તર',
  '18': 'અઢાર',
  '19': 'ઓગણીસ',
  '20': 'વીસ',
  '21': 'એકવીસ',
  '22': 'બાવીસ',
  '23': 'તેવીસ',
  '24': 'ચોવીસ',
  '25': 'પચીસ',
  '26': 'છવીસ',
  '27': 'સત્તાવીસ',
  '28': 'અઠ્ઠાવીસ',
  '29': 'ઓગણત્રીસ',
  '30': 'ત્રીસ',
  '35': 'પાંત્રીસ',
  '40': 'ચાલીસ',
  '45': 'પિસ્તાલીસ',
  '50': 'પચાસ',
  '60': 'સાઠ',
  '70': 'સિત્તેર',
  '75': 'પંચોતેર',
  '80': 'એંસી',
  '90': 'નેવું',
  '100': 'સો'
};

// Convert Gujarati Unicode characters to Devanagari for Hindi voice fallback
export function gujaratiToDevanagari(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    // Gujarati unicode block: 0x0A81 to 0x0AEF
    // Devanagari unicode block: 0x0901 to 0x096F (offset: -0x0180)
    if (code >= 0x0a81 && code <= 0x0aef) {
      result += String.fromCharCode(code - 0x0180);
    } else {
      result += text[i];
    }
  }
  return result;
}

// Convert numbers in string to natural Gujarati words
export function convertNumbersToGujaratiWords(text: string): string {
  // Replace standalone 1- or 2-digit numbers
  return text.replace(/\b(\d{1,2})\b/g, (match) => {
    return GUJARATI_NUM_WORDS[match] || match;
  });
}

// Clean text for speech synthesis so it sounds human, polite, and well-punctuated
export function formatTextForSpeech(text: string, isGujarati: boolean = true): string {
  if (!text) return '';

  let cleaned = text;

  // Remove markdown bold, italic, code, bullets
  cleaned = cleaned.replace(/[*_~`#]/g, '');
  cleaned = cleaned.replace(/^[\s•\-\+✓🚨📥🍲👶📦🛢️🥣📄]+\s*/gm, '');

  // Remove English parenthetical transliterations in Gujarati mode like "(Rice)", "(Whole Wheat Atta)", "(THR)"
  if (isGujarati) {
    cleaned = cleaned.replace(/\([A-Za-z0-9\s.,\-_/]+\)/g, '');
    // Convert common units to Gujarati spoken words
    cleaned = cleaned.replace(/\bkg\b|\bk\.g\b|\bkgs\b/gi, 'કિલો');
    cleaned = cleaned.replace(/\blitre\b|\bltr\b|\bl\b/gi, 'લિટર');
    cleaned = cleaned.replace(/\bgm\b|\bgrams\b|\bg\b/gi, 'ગ્રામ');
    cleaned = cleaned.replace(/\bpacks?\b|\bpkts?\b/gi, 'પેકેટ');
    cleaned = cleaned.replace(/\bexp\b/gi, 'એક્સપાયરી');
    cleaned = cleaned.replace(/\bbatch\b/gi, 'બેચ');
    cleaned = cleaned.replace(/\bchokha\b/gi, 'ચોખા');
    cleaned = cleaned.replace(/\btel\b/gi, 'તેલ');

    // Replace English digits with spoken Gujarati numbers
    cleaned = convertNumbersToGujaratiWords(cleaned);
  }

  // Remove excess whitespace and newlines, replacing them with commas or full stops for natural human pacing
  cleaned = cleaned
    .replace(/\n\n+/g, '. ')
    .replace(/\n/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();

  // Ensure sentence ends with punctuation
  if (!/[.!?।]$/.test(cleaned)) {
    cleaned += '.';
  }

  return cleaned;
}

// Detect language of text: returns true if Gujarati script is prominent
export function isGujaratiText(text: string): boolean {
  if (!text) return false;
  const gujaratiRegex = /[\u0A80-\u0AFF]/;
  const hasGujarati = gujaratiRegex.test(text);
  if (hasGujarati) return true;

  // Also detect common Gujarati transliterated phrases
  const lower = text.toLowerCase();
  const commonGujaratiWords = [
    'chokha', 'ketla', 'aavya', 'aavak', 'nondho', 'tel', 'rotli', 'bhavnaben',
    'shakti', 'balsena', 'hajari', 'vidyarthi', 'kem', 'aaje', 'rasoi', 'dholka',
    'vadtal', 'anand', 'anganwadi', 'masik', 'menu', 'jaththo', 'baki'
  ];
  return commonGujaratiWords.some((w) => lower.includes(w));
}

// Get the best available voice on the device
export function getBestVoice(isGujarati: boolean): { voice: SpeechSynthesisVoice | null; useDevanagari: boolean } {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return { voice: null, useDevanagari: false };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) {
    return { voice: null, useDevanagari: false };
  }

  if (isGujarati) {
    // 1. Look for direct Gujarati voice (gu-IN, gu)
    const guVoice = voices.find((v) => {
      const l = v.lang.toLowerCase();
      const n = v.name.toLowerCase();
      return l.startsWith('gu') || l.includes('guj') || n.includes('gujarati');
    });
    if (guVoice) {
      return { voice: guVoice, useDevanagari: false };
    }

    // 2. Look for Indian Hindi voice (hi-IN, hi)
    // Devanagari mapped text through Hindi TTS sounds authentic and human
    const hiVoice = voices.find((v) => {
      const l = v.lang.toLowerCase();
      const n = v.name.toLowerCase();
      return (
        l.startsWith('hi') ||
        n.includes('hindi') ||
        n.includes('lekha') ||
        n.includes('neerja') ||
        n.includes('swara') ||
        n.includes('kalpana') ||
        n.includes('madhur')
      );
    });
    if (hiVoice) {
      return { voice: hiVoice, useDevanagari: true };
    }

    // 3. Indian English voice as safe accent fallback
    const inEnVoice = voices.find((v) => {
      const l = v.lang.toLowerCase();
      return l === 'en-in';
    });
    if (inEnVoice) {
      return { voice: inEnVoice, useDevanagari: false };
    }
  } else {
    // English query: find Indian English or natural English voice
    const inEnVoice = voices.find((v) => v.lang.toLowerCase() === 'en-in');
    if (inEnVoice) {
      return { voice: inEnVoice, useDevanagari: false };
    }

    const enVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (enVoice) {
      return { voice: enVoice, useDevanagari: false };
    }
  }

  return { voice: voices[0] || null, useDevanagari: false };
}

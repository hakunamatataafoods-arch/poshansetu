import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Calendar,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Activity,
  BookOpen,
  Heart,
  Smile,
  Award,
  ChevronRight,
  Plus,
  Trash2,
  Share2,
  Eye,
  Filter,
  Check,
  Zap,
  Volume2,
  Download,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { playPopClickSound, playTransactionSuccessSound } from '../utils/audioEffects';

export interface ClassroomActivityRecord {
  id: string;
  titleGu: string;
  titleEn: string;
  category: 'physical' | 'syllabus' | 'creative' | 'nutrition' | 'sensory';
  dateStr: string;
  timeStr: string;
  childrenCount: number;
  photoUrl: string;
  notesGu: string;
  notesEn: string;
  ageGroup: '3-4' | '4-5' | '5-6' | 'all';
  verified: boolean;
}

interface StudentActivitiesScreenProps {
  onBack: () => void;
  lang: Language;
  isOnline?: boolean;
}

// Initial realistic pre-seeded classroom activities with high-quality SVG graphics
const INITIAL_ACTIVITIES: ClassroomActivityRecord[] = [
  {
    id: 'act-001',
    titleGu: 'સવારની બાલ યોગાસન અને શારીરિક કસરત',
    titleEn: 'Morning Bal Yoga & Physical Stretching Drill',
    category: 'physical',
    dateStr: 'Today, 26-Oct-2026',
    timeStr: '09:40 AM',
    childrenCount: 24,
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="none"><rect width="400" height="260" rx="16" fill="%23ECFDF5"/><ellipse cx="200" cy="220" rx="160" ry="20" fill="%23D1FAE5"/><circle cx="80" cy="70" r="30" fill="%23FEF3C7"/><path d="M80 30V20M80 120V110M30 70H20M140 70H130" stroke="%23F59E0B" stroke-width="3" stroke-linecap="round"/><g transform="translate(140, 60)"><circle cx="60" cy="30" r="18" fill="%23FCD34D"/><path d="M45 28C45 18 52 14 60 14C68 14 75 18 75 28H45Z" fill="%231E293B"/><circle cx="55" cy="28" r="2.5" fill="%231E293B"/><circle cx="65" cy="28" r="2.5" fill="%231E293B"/><path d="M54 36C57 39 63 39 66 36" stroke="%23B45309" stroke-width="2" stroke-linecap="round"/><path d="M40 70L24 40L30 36L48 60Z" fill="%23059669"/><circle cx="24" cy="37" r="5" fill="%23FCD34D"/><path d="M80 70L96 40L90 36L72 60Z" fill="%23059669"/><circle cx="96" cy="37" r="5" fill="%23FCD34D"/><rect x="42" y="56" width="36" height="48" rx="6" fill="%2310B981"/><path d="M46 104L42 145H54L60 120L66 145H78L74 104Z" fill="%231E40AF"/><ellipse cx="46" cy="147" rx="9" ry="5" fill="%23047857"/><ellipse cx="74" cy="147" rx="9" ry="5" fill="%23047857"/></g><rect x="30" y="190" width="130" height="28" rx="8" fill="%23065F46"/><text x="40" y="209" fill="%23FFFFFF" font-size="12" font-weight="bold" font-family="sans-serif">તાડાસન કસરત પૂર્ણ ✓</text></svg>',
    notesGu: 'બધા ૨૪ બાળકોએ તાડાસન, વૃક્ષાસન અને ઊંડા શ્વાસ લેવાની કસરત ઉત્સાહપૂર્વક કરી.',
    notesEn: 'All 24 children performed Tadasana, Vrikshasana, and deep breathing drills with enthusiasm.',
    ageGroup: 'all',
    verified: true
  },
  {
    id: 'act-002',
    titleGu: 'ચાંદો સૂરજ રમતા તા - ગુજરાતી બાળગીત અને અભિનય',
    titleEn: 'Gujarati Rhyme & Action Song: "Chando Suraj Ramta Ta"',
    category: 'syllabus',
    dateStr: 'Yesterday, 25-Oct-2026',
    timeStr: '10:30 AM',
    childrenCount: 22,
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="none"><rect width="400" height="260" rx="16" fill="%23FFF7ED"/><ellipse cx="200" cy="225" rx="170" ry="22" fill="%23FED7AA" opacity="0.6"/><g transform="translate(60, 40)"><rect x="0" y="0" width="70" height="85" rx="8" fill="%23047857"/><text x="14" y="32" fill="%23FEF08A" font-size="20" font-weight="bold" font-family="sans-serif">ચાંદો</text><text x="14" y="60" fill="%23BAE6FD" font-size="20" font-weight="bold" font-family="sans-serif">સૂરજ</text><circle cx="56" cy="68" r="4" fill="%23F59E0B"/></g><g transform="translate(180, 50)"><circle cx="50" cy="30" r="18" fill="%23FCD34D"/><path d="M35 28C35 18 42 14 50 14C58 14 65 18 65 28H35Z" fill="%231E293B"/><circle cx="45" cy="28" r="2.5" fill="%231E293B"/><circle cx="55" cy="28" r="2.5" fill="%231E293B"/><path d="M44 36C47 40 53 40 56 36" stroke="%23B45309" stroke-width="2" stroke-linecap="round"/><rect x="32" y="56" width="36" height="44" rx="6" fill="%23F97316"/><path d="M32 64L14 80L20 86L38 72Z" fill="%23EA580C"/><path d="M68 64L86 80L80 86L62 72Z" fill="%23EA580C"/><path d="M36 100L32 135H44L50 115L56 135H68L64 100Z" fill="%234338CA"/></g><rect x="220" y="190" width="150" height="28" rx="8" fill="%23EA580C"/><text x="230" y="209" fill="%23FFFFFF" font-size="12" font-weight="bold" font-family="sans-serif">અભિનય ગીત સત્ર ✓</text></svg>',
    notesGu: 'બાળકોએ તાળી પાડીને અને ગોળ ફરીને સંપૂર્ણ અભિનય સાથે ગીત ગાયું.',
    notesEn: 'Preschoolers recited the rhymes with full clapping, hand movements and circle dance.',
    ageGroup: '3-4',
    verified: true
  },
  {
    id: 'act-003',
    titleGu: 'માટીકામ અને આકારોની ઓળખ (ગોળ, ચોરસ, ત્રિકોણ)',
    titleEn: 'Clay Modeling & Shape Discovery (Circle, Square, Triangle)',
    category: 'creative',
    dateStr: '24-Oct-2026',
    timeStr: '11:15 AM',
    childrenCount: 20,
    photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="none"><rect width="400" height="260" rx="16" fill="%23F0FDF4"/><circle cx="120" cy="110" r="34" fill="%23EF4444"/><rect x="180" y="78" width="60" height="60" rx="8" fill="%233B82F6"/><polygon points="290,140 325,78 360,140" fill="%23F59E0B"/><text x="105" y="117" fill="%23FFFFFF" font-size="16" font-weight="bold" font-family="sans-serif">ગોળ</text><text x="190" y="114" fill="%23FFFFFF" font-size="15" font-weight="bold" font-family="sans-serif">ચોરસ</text><text x="306" y="126" fill="%23FFFFFF" font-size="15" font-weight="bold" font-family="sans-serif">ત્રિકોણ</text><rect x="40" y="190" width="160" height="28" rx="8" fill="%232563EB"/><text x="50" y="209" fill="%23FFFFFF" font-size="12" font-weight="bold" font-family="sans-serif">સર્જનાત્મક માટીકામ ✓</text></svg>',
    notesGu: 'બાળકોએ રંગબેરંગી માટીમાંથી લાડુ, રોટલી અને ત્રિકોણ આકાર બનાવતા શીખ્યા.',
    notesEn: 'Children molded clay into circles, squares, and balls to build fine motor dexterity.',
    ageGroup: '4-5',
    verified: true
  }
];

// Weekly Timetable Data for Gujarat Anganwadi Pre-school Education
const WEEKLY_SCHEDULE = [
  {
    dayGu: 'સોમવાર',
    dayEn: 'Monday',
    themeGu: 'ભાષા અને સામાજિક શિષ્ટાચાર',
    themeEn: 'Language & Social Manners',
    color: 'emerald',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના, સ્વાગત ગીત અને નખ/સ્વચ્છતા ચકાસણી',
        titleEn: 'Morning Prayer, Welcome Song & Hygiene Inspection',
        tagGu: 'સ્વચ્છતા',
        tagEn: 'Hygiene'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'ગરમ પૌષ્ટિક નાસ્તો (સુખડી / શીરો)',
        titleEn: 'Hot Nutritious Breakfast (Sukhdi / Sheera)',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'ગુજરાતી મૂળાક્ષર ગીત (ક, ખ, ગ) & ચિત્ર ઓળખ',
        titleEn: 'Gujarati Alphabet Song (Ka, Kha, Ga) & Picture Flashcards',
        tagGu: 'અભ્યાસ',
        tagEn: 'Syllabus'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'મુક્ત રમત: બિલ્ડીંગ બ્લોક્સ & કાગળની હોડી',
        titleEn: 'Free Play: Building Blocks & Origami Boat',
        tagGu: 'સર્જનાત્મક',
        tagEn: 'Creative'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'શારીરિક રમત: સંતુલન રેખા પર ચાલવું & દેડકા કૂદ',
        titleEn: 'Physical Game: Balance Line Walk & Frog Jumps',
        tagGu: 'કસરત',
        tagEn: 'Movement'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'બપોરનું ભોજન (દાળ-ભાત), હાથ ધોવાની ૭ રીતો & વિદાય',
        titleEn: 'Lunch (Dal-Rice), 7-Step Handwash Drill & Goodbye Song',
        tagGu: 'આહાર',
        tagEn: 'Meal'
      }
    ]
  },
  {
    dayGu: 'મંગળવાર',
    dayEn: 'Tuesday',
    themeGu: 'ગણિત પૂર્વ તૈયારી & અંક ગણતરી',
    themeEn: 'Pre-Math & Number Counting',
    color: 'amber',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના અને દૈનિક હાજરી પત્રક ઉત્સાહ સત્ર',
        titleEn: 'Morning Prayer & Interactive Roll Call',
        tagGu: 'હાજરી',
        tagEn: 'Attendance'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'પૌષ્ટિક નાસ્તો (પૌંઆ / ઉપમા)',
        titleEn: 'Nutritious Breakfast (Poha / Upma)',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'અંક ૧ થી ૧૦ ગણતરી: કાંકરા, પાંદડા અને બટન દ્વારા',
        titleEn: 'Numbers 1 to 10: Counting with Pebbles, Leaves & Buttons',
        tagGu: 'ગણિત',
        tagEn: 'Math'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'ચિત્રકામ: મોટા ગોળ અને ચોરસમાં રંગ પૂરવો',
        titleEn: 'Coloring: Filling Bright Colors inside Shapes',
        tagGu: 'સર્જનાત્મક',
        tagEn: 'Art'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'રમતો: રિંગ ફેંક & મોટા દડાને કેચ પકડવો',
        titleEn: 'Outdoor Game: Ring Toss & Big Ball Catching',
        tagGu: 'કસરત',
        tagEn: 'Movement'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'શાકભાજીયુક્ત ખીચડી ભોજન & વાર્તા',
        titleEn: 'Nutritious Vegetable Khichdi & Short Moral Story',
        tagGu: 'આહાર',
        tagEn: 'Meal'
      }
    ]
  },
  {
    dayGu: 'બુધવાર',
    dayEn: 'Wednesday',
    themeGu: 'પર્યાવરણ, પક્ષીઓ અને પ્રાણીઓ',
    themeEn: 'Nature, Animals & Birds Exploration',
    color: 'sky',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના, સૂર્ય નમસ્કાર અને બાળ યોગ',
        titleEn: 'Morning Prayer, Surya Namaskar & Bal Yoga',
        tagGu: 'યોગ',
        tagEn: 'Yoga'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'નાસ્તો: બાલ શક્તિ પૂરક આહાર',
        titleEn: 'Breakfast: Bal Shakti Premix Porridge',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'વાર્તાકથન: "ચતુર કાગડો અને કાંકરા" (કઠપૂતળી દ્વારા)',
        titleEn: 'Storytelling: "The Thirsty Crow" with Puppet Props',
        tagGu: 'વાર્તા',
        tagEn: 'Story'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'પ્રાણીઓના અવાજ અને ચાલવાની નકલ (સિંહ, હાથી, સસલું)',
        titleEn: 'Animal Mimicry & Sounds (Lion roar, Elephant stomp, Bunny hop)',
        tagGu: 'અભિનય',
        tagEn: 'Drama'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'સ્નાયુ વિકાસ: માટીમાંથી પ્રાણીના આકાર બનાવવા',
        titleEn: 'Fine Motor: Shaping clay animals and fruits',
        tagGu: 'માટીકામ',
        tagEn: 'Clay'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'ગરમ ભોજન & સ્વચ્છતા મુલાકાત',
        titleEn: 'Hot Cooked Meal & Water Hydration Drill',
        tagGu: 'આહાર',
        tagEn: 'Meal'
      }
    ]
  },
  {
    dayGu: 'ગુરુવાર',
    dayEn: 'Thursday',
    themeGu: 'રંગો, આકારો અને સંવેદના વિકાસ',
    themeEn: 'Colors, Shapes & Sensory Discovery',
    color: 'emerald',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના, અંગ કસરત અને હાસ્ય યોગ',
        titleEn: 'Morning Prayer, Limb Stretches & Laughter Yoga',
        tagGu: 'કસરત',
        tagEn: 'Movement'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'પૌષ્ટિક નાસ્તો: મુઠીયા / ઢોકળા',
        titleEn: 'Nutritious Breakfast: Steamed Muthiya / Dhokla',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'પ્રાથમિક રંગો (લાલ, પીળો, લીલો, વાદળી) ની પ્રકૃતિમાંથી શોધ',
        titleEn: 'Primary Colors in Nature: Tomato, Lemon, Leaf, Sky',
        tagGu: 'ઓળખ',
        tagEn: 'Cognitive'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'સંવેદના રમત: આંખે પાટા બાંધી વસ્તુઓ સ્પર્શથી ઓળખવી',
        titleEn: 'Sensory Game: Blindfold Touch & Guess Texture',
        tagGu: 'સંવેદના',
        tagEn: 'Sensory'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'રમતો: સંગીતમય ખુરશી રમત & રૂમાલ ખેંચ',
        titleEn: 'Musical Chair Movement & Handkerchief Race',
        tagGu: 'રમતો',
        tagEn: 'Play'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'બપોરનું ગરમ ભોજન અને આરામ ગીત',
        titleEn: 'Hot Cooked Meal & Soothing Lullaby',
        tagGu: 'આહાર',
        tagEn: 'Meal'
      }
    ]
  },
  {
    dayGu: 'શુક્રવાર',
    dayEn: 'Friday',
    themeGu: 'શરીરના અંગો અને વ્યક્તિગત આરોગ્ય',
    themeEn: 'Body Parts & Healthy Living Habits',
    color: 'purple',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના, "આ નાની મારી આંખ" ગીત & આરોગ્ય તપાસ',
        titleEn: 'Morning Prayer, Gujarati Body Parts Rhyme & Health Check',
        tagGu: 'સ્વાસ્થ્ય',
        tagEn: 'Health'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'પૌષ્ટિક નાસ્તો (બાફેલી મગ દાળ / ચણા)',
        titleEn: 'Breakfast: Steamed Moong Dal / Sprouts',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'હાથ ધોવાના ૭ તબક્કા (સાબુથી ૨૦ સેકન્ડ સુધી ધોવા)',
        titleEn: '7-Step Handwash Protocol with Soap (20 seconds drill)',
        tagGu: 'સ્વચ્છતા',
        tagEn: 'Cleanliness'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'પેન્સિલ પકડવાની પૂર્વ તૈયારી (ટ્રેસિંગ & ટપકાં જોડવા)',
        titleEn: 'Pre-Writing Readiness (Dot Connecting & Line Tracing)',
        tagGu: 'લેખન',
        tagEn: 'Pre-Writing'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'શારીરિક રમતો: દોરડા કૂદ & ઝિગ-ઝાગ દોડ',
        titleEn: 'Physical Motor: Rope Skip & Zig-Zag Obstacle Run',
        tagGu: 'કસરત',
        tagEn: 'Movement'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'બપોરનું પૌષ્ટિક ભોજન (રોટલી, શાક, દાળ)',
        titleEn: 'Nutritious Lunch (Roti, Sabji, Dal) & Goodbye',
        tagGu: 'આહાર',
        tagEn: 'Meal'
      }
    ]
  },
  {
    dayGu: 'શનિવાર',
    dayEn: 'Saturday',
    themeGu: 'બાળ મેળો, બાળગીત ઉત્સવ & આનંદી પ્રવૃત્તિ',
    themeEn: 'Bal Mela, Weekly Rhyme Recital & Fun Festival',
    color: 'orange',
    slots: [
      {
        time: '09:00 - 09:30',
        titleGu: 'પ્રાર્થના, સામૂહિક નૃત્ય અને ઉષ્માભર્યું સ્વાગત',
        titleEn: 'Morning Assembly, Group Dance & Warm Up',
        tagGu: 'આનંદ',
        tagEn: 'Joy'
      },
      {
        time: '09:30 - 10:00',
        titleGu: 'ગરમ મીઠો પૌષ્ટિક નાસ્તો (લાપસી / ખીર)',
        titleEn: 'Sweet Nutritious Treat (Lapsi / Kheer)',
        tagGu: 'પોષણ',
        tagEn: 'Nutrition'
      },
      {
        time: '10:00 - 10:45',
        titleGu: 'સાપ્તાહિક બાળગીતોનું સંમેલન & મનપસંદ જોડકણાં',
        titleEn: 'Weekly Rhymes Showcase: Children Recite on Stage',
        tagGu: 'ગીત',
        tagEn: 'Rhymes'
      },
      {
        time: '10:45 - 11:30',
        titleGu: 'બાળ મેળો: મુક્ત ચિત્રકામ, કાગળની ટોપી બનાવવી',
        titleEn: 'Bal Mela: Free Drawing, Paper Cap Making & Face Fun',
        tagGu: 'સર્જનાત્મક',
        tagEn: 'Creative'
      },
      {
        time: '11:30 - 12:15',
        titleGu: 'રમતો: રૂમાલ દાવ, સિંહ-બકરી અને સંગીતમય રમતો',
        titleEn: 'Traditional Games: Lion & Goat, Ringa Ringa Roses',
        tagGu: 'રમતો',
        tagEn: 'Games'
      },
      {
        time: '12:15 - 01:00',
        titleGu: 'વિશેષ ભોજન, માતા-પિતા સાથે સંવાદ & સાપ્તાહિક વિદાય',
        titleEn: 'Special Lunch, Parent Interaction & Weekly Closure',
        tagGu: 'વિદાય',
        tagEn: 'Closure'
      }
    ]
  }
];

// Physical Health & Yoga Routines for 3-6 year old children
const PHYSICAL_ROUTINES = [
  {
    id: 'tadasana',
    nameGu: '૧. તાડાસન (પર્વત/તાડ મુદ્રા)',
    nameEn: '1. Tadasana (Palm Tree / Mountain Pose)',
    benefitsGu: 'બાળકોની ઊંચાઈ વધારવામાં, કરોડરજ્જુ સીધી રાખવામાં અને શારીરિક સંતુલનમાં મદદ કરે છે.',
    benefitsEn: 'Promotes height growth, straight spine posture, and steady body balance.',
    duration: '૫ મિનિટ (5 Mins)',
    difficultyGu: 'સરળ',
    difficultyEn: 'Easy',
    stepsGu: [
      'સીધા ઊભા રહો, બંને પગ વચ્ચે થોડી જગ્યા રાખો.',
      'ધીમે ધીમે બંને હાથ માથા ઉપર ઊંચા કરો અને આંગળીઓ ગૂંથી લો.',
      'શ્વાસ લેતાં લેતાં પગની એડીઓ ઊંચી કરો અને અંગૂઠા પર ઊભા રહો.',
      '૧૦ થી ૧૫ સેકન્ડ સ્થિર રહી ધીમેથી સામાન્ય સ્થિતિમાં આવો.'
    ],
    stepsEn: [
      'Stand upright with feet comfortably hip-width apart.',
      'Slowly raise both arms overhead and interlock fingers.',
      'Inhale and gently lift heels, balancing on toes like a tall palm tree.',
      'Hold for 10-15 seconds and gently lower down.'
    ],
    completedToday: true
  },
  {
    id: 'vrikshasana',
    nameGu: '૨. વૃક્ષાસન (વૃક્ષ મુદ્રા)',
    nameEn: '2. Vrikshasana (Tree Pose Balance)',
    benefitsGu: 'એકાગ્રતા વધારે છે, પગના સ્નાયુઓને મજબૂત બનાવે છે અને ચંચળતા ઘટાડે છે.',
    benefitsEn: 'Sharpens mental focus, strengthens leg muscles, and reduces restlessness.',
    duration: '૩ મિનિટ (3 Mins)',
    difficultyGu: 'મધ્યમ',
    difficultyEn: 'Medium',
    stepsGu: [
      'ડાબા પગ પર સ્થિર ઊભા રહો.',
      'જમણા પગને વાળીને ડાબી જાંઘ પર મૂકો.',
      'બંને હાથ છાતી સામે નમસ્તે મુદ્રામાં જોડો.',
      'સામે કોઈ એક બિંદુ પર નજર રાખી શ્વાસ સામાન્ય રાખો.'
    ],
    stepsEn: [
      'Stand steady on the left foot.',
      'Bend the right knee and place foot on the inner thigh or calf.',
      'Join palms in front of chest in Namaste prayer pose.',
      'Focus eyes on a fixed spot in front and breathe steadily.'
    ],
    completedToday: true
  },
  {
    id: 'titliasana',
    nameGu: '૩. પતંગિયા આસન (બટરફ્લાય મુદ્રા)',
    nameEn: '3. Titli Asana (Butterfly Pose)',
    benefitsGu: 'સાંધાની લચીલાપણું વધારે છે, પાચન સુધારે છે અને બાળકોને ખૂબ આનંદ આપે છે.',
    benefitsEn: 'Enhances hip and leg flexibility, aids digestion, and sparks playful joy.',
    duration: '૪ મિનિટ (4 Mins)',
    difficultyGu: 'ખૂબ સરળ',
    difficultyEn: 'Very Easy',
    stepsGu: [
      'જમીન પર બેસી બંને પગના તળિયા એકબીજા સાથે જોડો.',
      'બંને હાથથી પગના પંજા પકડી રાખો.',
      'પતંગિયાની પાંખોની જેમ બંને ઘૂંટણને ઉપર-નીચે ધીમે ધીમે હલાવો.',
      '"ઉડતું પતંગિયું" ગીત સાથે અભિનય કરાવો.'
    ],
    stepsEn: [
      'Sit comfortably on the mat and bring soles of both feet together.',
      'Hold toes firmly with both hands.',
      'Gently flap knees up and down like butterfly wings.',
      'Recite the colorful butterfly poem while flapping.'
    ],
    completedToday: false
  },
  {
    id: 'bhujangasana',
    nameGu: '૪. ભુજંગાસન (નાગાસન / કોબ્રા પોઝ)',
    nameEn: '4. Bhujangasana (Cobra Stretch)',
    benefitsGu: 'છાતીના સ્નાયુઓ ખોલે છે, ફેફસાં મજબૂત કરે છે અને ઊંડા શ્વાસ લેવાની આદત પાડે છે.',
    benefitsEn: 'Expands chest muscles, strengthens lungs, and fosters deep breathing.',
    duration: '૩ મિનિટ (3 Mins)',
    difficultyGu: 'સરળ',
    difficultyEn: 'Easy',
    stepsGu: [
      'પેટ પર સૂઈ જાઓ, બંને હાથ ખભાની બાજુમાં જમીન પર રાખો.',
      'ધીમે ધીમે શ્વાસ લેતાં માથું અને છાતી નાગની જેમ ઊંચી કરો.',
      'નાભિ જમીનને અડેલી રહે તે ધ્યાન રાખો.',
      '"ફૂંફાડો" મારવાનો અભિનય કરી બાળકોને રમત જેવો આનંદ આપો.'
    ],
    stepsEn: [
      'Lie flat on the belly with hands under shoulders.',
      'Inhale deeply and gently raise the head and chest like a cobra snake.',
      'Keep navel gently touching the floor.',
      'Make a fun "hiss" sound together to keep it playful.'
    ],
    completedToday: false
  },
  {
    id: 'laughter',
    nameGu: '૫. હાસ્ય યોગ & ઊંડા શ્વાસ (લાફિંગ યોગ)',
    nameEn: '5. Laughter Yoga & Deep Breath Drill',
    benefitsGu: 'બાળકોમાં તણાવ દૂર કરે છે, ખુશી વધારે છે અને મન પ્રફુલ્લિત રાખે છે.',
    benefitsEn: 'Releases stress, triggers happy hormones, and builds peer bonding.',
    duration: '૫ મિનિટ (5 Mins)',
    difficultyGu: 'ખૂબ સરળ',
    difficultyEn: 'Very Easy',
    stepsGu: [
      'બધા બાળકો ગોળ કુંડાળામાં ઊભા રહે.',
      'બંને હાથ આકાશ તરફ ઊંચા કરી જોરથી "હા હા હા, હી હી હી" હસો.',
      'એકબીજા તરફ જોઈને તાળી પાડો.',
      'ઊંડો શ્વાસ લઈ ધીમેથી બહાર કાઢો.'
    ],
    stepsEn: [
      'Form a warm circle holding hands.',
      'Raise arms towards the sky and laugh loudly: "Ha Ha Ha, Hee Hee Hee!".',
      'Clap hands towards friends and smile.',
      'Take 3 deep slow breaths to calm down.'
    ],
    completedToday: true
  }
];

export const StudentActivitiesScreen: React.FC<StudentActivitiesScreenProps> = ({
  onBack,
  lang,
  isOnline = true
}) => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'syllabus' | 'health' | 'guidelines'>('tracker');
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(() => {
    // Current day of week: Monday=0, Tuesday=1 ... Saturday=5, Sunday=0
    const day = new Date().getDay();
    if (day >= 1 && day <= 6) return day - 1;
    return 0; // Default to Monday
  });

  // Activities Log stored in localStorage
  const [activities, setActivities] = useState<ClassroomActivityRecord[]>(() => {
    try {
      const saved = localStorage.getItem('poshan_setu_classroom_activities');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load activities from storage:', e);
    }
    return INITIAL_ACTIVITIES;
  });

  // Routines checked state
  const [completedRoutines, setCompletedRoutines] = useState<Record<string, boolean>>({
    tadasana: true,
    vrikshasana: true,
    titliasana: false,
    bhujangasana: false,
    laughter: true
  });

  // Modal / Form state for new activity entry
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'physical' | 'syllabus' | 'creative' | 'nutrition' | 'sensory'>('physical');
  const [newChildrenCount, setNewChildrenCount] = useState<number>(24);
  const [newAgeGroup, setNewAgeGroup] = useState<'3-4' | '4-5' | '5-6' | 'all'>('all');
  const [newNotes, setNewNotes] = useState('');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Filter state in activity tracker
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('poshan_setu_classroom_activities', JSON.stringify(activities));
    } catch (e) {
      console.warn('Failed to save activities:', e);
    }
  }, [activities]);

  // Handle Photo File Upload
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPhotoUploading(true);
    playPopClickSound();

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setUploadedPhotoUrl(result);
      setIsPhotoUploading(false);
    };
    reader.onerror = () => {
      setIsPhotoUploading(false);
      alert(lang === 'gu' ? 'ફોટો અપલોડ કરવામાં ક્ષતિ આવી.' : 'Error loading photo.');
    };
    reader.readAsDataURL(file);
  };

  // Submit New Activity
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert(lang === 'gu' ? 'કૃપા કરીને પ્રવૃત્તિનું નામ લખો.' : 'Please enter an activity title.');
      return;
    }

    const now = new Date();
    const dateStr = `Today, ${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Fallback cute SVG if no photo was uploaded
    const finalPhoto =
      uploadedPhotoUrl ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260" fill="none"><rect width="400" height="260" rx="16" fill="%23ECFDF5"/><circle cx="200" cy="110" r="45" fill="%2310B981"/><path d="M185 110L195 120L215 100" stroke="%23FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="80" y="180" width="240" height="32" rx="8" fill="%23047857"/><text x="100" y="202" fill="%23FFFFFF" font-size="14" font-weight="bold" font-family="sans-serif">${encodeURIComponent(newTitle.slice(0, 24))}</text></svg>`;

    const newRecord: ClassroomActivityRecord = {
      id: `act-${Date.now()}`,
      titleGu: newTitle,
      titleEn: newTitle,
      category: newCategory,
      dateStr,
      timeStr,
      childrenCount: newChildrenCount,
      photoUrl: finalPhoto,
      notesGu: newNotes || (lang === 'gu' ? 'આંગણવાડી કેન્દ્ર ૦૪ વડતાલ ખાતે સફળતાપૂર્વક પ્રવૃત્તિ પૂર્ણ.' : 'Activity completed successfully at AWC 04 Vadtal.'),
      notesEn: newNotes || 'Activity completed successfully at AWC 04 Vadtal.',
      ageGroup: newAgeGroup,
      verified: true
    };

    setActivities((prev) => [newRecord, ...prev]);
    playTransactionSuccessSound();

    // Reset Form
    setNewTitle('');
    setNewNotes('');
    setUploadedPhotoUrl('');
    setIsAddModalOpen(false);

    setSaveSuccessMsg(
      lang === 'gu'
        ? '✓ પ્રવૃત્તિ અને વર્ગખંડ ફોટો સફળતાપૂર્વક નોંધાયા!'
        : '✓ Classroom activity & photo saved successfully!'
    );

    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // Toggle routine done
  const handleToggleRoutine = (routineId: string) => {
    playPopClickSound();
    setCompletedRoutines((prev) => ({
      ...prev,
      [routineId]: !prev[routineId]
    }));
  };

  // Mark all routines done
  const handleMarkAllRoutinesDone = () => {
    playTransactionSuccessSound();
    const updated: Record<string, boolean> = {};
    PHYSICAL_ROUTINES.forEach((r) => {
      updated[r.id] = true;
    });
    setCompletedRoutines(updated);
  };

  // Filtered activities
  const filteredActivities = activities.filter((act) => {
    if (filterCategory === 'all') return true;
    return act.category === filterCategory;
  });

  const selectedDay = WEEKLY_SCHEDULE[selectedDayIdx];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 text-slate-900">
      {/* 1. Header Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-200/80 px-4 py-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playPopClickSound();
                onBack();
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition-colors border border-slate-200/80 cursor-pointer"
              title={lang === 'gu' ? 'પાછા જાઓ' : 'Go Back'}
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                  {lang === 'gu' ? 'બાળ પ્રવૃત્તિ & અભ્યાસક્રમ' : 'Student Activities & Syllabus'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {lang === 'gu' ? 'ECCE ૨૦૨૬' : 'ECCE 2026'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {lang === 'gu'
                  ? 'AWC ૦૪ વડતાલ • દૈનિક શિક્ષણ ટાઈમટેબલ & ફોટો ટ્રેકર'
                  : 'AWC 04 Vadtal • Pre-School Schedule & Photo Logger'}
              </p>
            </div>
          </div>

          {/* Quick Add Activity Button */}
          <button
            onClick={() => {
              playPopClickSound();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === 'gu' ? '+ ફોટો અપલોડ' : '+ Log Photo'}
            </span>
            <span className="sm:hidden">{lang === 'gu' ? '+ ફોટો' : '+ Log'}</span>
          </button>
        </div>

        {/* 2. Top Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 mt-3 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('tracker');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'tracker'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="truncate">{lang === 'gu' ? 'ફોટો લોગ' : 'Photo Log'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('syllabus');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'syllabus'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="truncate">{lang === 'gu' ? 'અભ્યાસક્રમ' : 'Syllabus'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('health');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'health'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="truncate">{lang === 'gu' ? 'કસરત & યોગ' : 'Exercises'}</span>
          </button>

          <button
            onClick={() => {
              playPopClickSound();
              setActiveTab('guidelines');
            }}
            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'guidelines'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span className="truncate">{lang === 'gu' ? 'થીમ & ગાઈડ' : 'Themes'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-3.5 space-y-4">
        {/* Success Toast */}
        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <span>{saveSuccessMsg}</span>
            <button
              onClick={() => setSaveSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-black cursor-pointer px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: ACTIVITY TRACKER & PHOTO LOG                           */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'tracker' && (
          <div className="space-y-3.5">
            {/* Summary Stat Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-3 shadow-2xs">
                <span className="text-[10.5px] font-semibold text-emerald-100 block">
                  {lang === 'gu' ? 'કુલ પ્રવૃત્તિઓ' : 'Total Activities'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black">{activities.length}</span>
                  <span className="text-[11px] text-emerald-200">
                    {lang === 'gu' ? 'નોંધણી' : 'logged'}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-3 shadow-2xs">
                <span className="text-[10.5px] font-semibold text-slate-500 block">
                  {lang === 'gu' ? 'સરેરાશ બાળકો' : 'Avg Children'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900">22</span>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'gu' ? '/ ૨૮ કુલ' : '/ 28 total'}
                  </span>
                </div>
              </div>

              <div className="bg-white border border-orange-200 rounded-2xl p-3 shadow-2xs">
                <span className="text-[10.5px] font-semibold text-amber-700 block">
                  {lang === 'gu' ? 'આજનો શારીરિક ડ્રીલ' : 'Today Exercise'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  <span className="text-xs font-bold text-slate-900">
                    {lang === 'gu' ? 'પૂર્ણ ✓' : 'Done ✓'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Banner: Capture Today's Classroom Photo */}
            <div className="bg-gradient-to-r from-[#EAF7EE] to-[#FFF7ED] border border-emerald-200/90 rounded-3xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 text-xs sm:text-sm tracking-tight truncate">
                    {lang === 'gu'
                      ? 'આજના વર્ગખંડની પ્રવૃત્તિનો ફોટો અપલોડ કરો'
                      : 'Capture Today’s Classroom Activity Photo'}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5 truncate">
                    {lang === 'gu'
                      ? 'યોગ, બાળગીત, ચિત્રકામ અથવા નાસ્તાની ક્ષણો સાચવો'
                      : 'Log photos of morning exercise, rhymes, clay art or meals'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  playPopClickSound();
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shrink-0 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'gu' ? 'નવો ફોટો' : 'Add Photo'}</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'gu' ? 'બધી પ્રવૃત્તિઓ' : 'All Activities'}
              </button>
              <button
                onClick={() => setFilterCategory('physical')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  filterCategory === 'physical'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'gu' ? '🏃 શારીરિક / કસરત' : '🏃 Physical Health'}
              </button>
              <button
                onClick={() => setFilterCategory('syllabus')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  filterCategory === 'syllabus'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'gu' ? '📚 અભ્યાસ / બાળગીત' : '📚 Rhymes & Pre-school'}
              </button>
              <button
                onClick={() => setFilterCategory('creative')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  filterCategory === 'creative'
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lang === 'gu' ? '🎨 માટીકામ / ચિત્ર' : '🎨 Arts & Crafts'}
              </button>
            </div>

            {/* Activities List Cards */}
            <div className="space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">
                    {lang === 'gu'
                      ? 'આ કેટેગરીમાં કોઈ પ્રવૃત્તિ નોંધાયેલી નથી.'
                      : 'No activities found in this category.'}
                  </p>
                </div>
              ) : (
                filteredActivities.map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 shadow-2xs overflow-hidden transition-all group"
                  >
                    {/* Activity Photo Image Banner */}
                    <div className="w-full h-44 sm:h-52 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={act.photoUrl}
                        alt={lang === 'gu' ? act.titleGu : act.titleEn}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs border border-slate-200">
                          {act.category === 'physical' && '🏃 શારીરિક કસરત'}
                          {act.category === 'syllabus' && '📚 બાળગીત & શિક્ષણ'}
                          {act.category === 'creative' && '🎨 સર્જનાત્મક કલા'}
                          {act.category === 'nutrition' && '🍎 પોષણ આહાર'}
                          {act.category === 'sensory' && '✨ સંવેદના વિકાસ'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                          {act.dateStr}
                        </span>
                      </div>

                      {/* Verified Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>

                      {/* Student Attendance Count Pill on Image */}
                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs">
                        <Users className="w-3 h-3 text-emerald-400" />
                        <span>
                          {act.childrenCount} {lang === 'gu' ? 'બાળકો હાજર' : 'children'}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                            {lang === 'gu' ? act.titleGu : act.titleEn}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {act.timeStr}
                            </span>
                            <span>•</span>
                            <span>
                              {lang === 'gu'
                                ? `વયજૂથ: ${act.ageGroup === 'all' ? 'તમામ (૩-૬ વર્ષ)' : `${act.ageGroup} વર્ષ`}`
                                : `Age Group: ${act.ageGroup === 'all' ? 'All (3-6 yrs)' : `${act.ageGroup} yrs`}`}
                            </span>
                          </div>
                        </div>

                        {/* Delete action if user created */}
                        {act.id.startsWith('act-') && !INITIAL_ACTIVITIES.some((ia) => ia.id === act.id) && (
                          <button
                            onClick={() => {
                              if (confirm(lang === 'gu' ? 'શું તમે આ પ્રવૃત્તિ કાઢી નાખવા માંગો છો?' : 'Delete this activity?')) {
                                setActivities((prev) => prev.filter((a) => a.id !== act.id));
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Teacher Observations / Notes */}
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 font-medium">
                        {lang === 'gu' ? act.notesGu : act.notesEn}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: ECCE PRE-SCHOOL SYLLABUS & WEEKLY TIMETABLE            */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'syllabus' && (
          <div className="space-y-3.5">
            {/* Header info */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  {lang === 'gu'
                    ? 'ગુજરાત ICDS & NEP 2020 પૂર્વ પ્રાથમિક શિક્ષણ માળખું'
                    : 'Gujarat ICDS & NEP 2020 ECCE Pre-School Framework'}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {lang === 'gu'
                  ? 'આંગણવાડીમાં ૩ થી ૬ વર્ષના બાળકોના સર્વાંગી વિકાસ માટે સાપ્તાહિક દૈનિક ટાઈમટેબલ નીચે મુજબ નિયત થયેલ છે.'
                  : 'Daily 9:00 AM to 1:00 PM structured preschool curriculum for physical, cognitive, linguistic, and social-emotional growth.'}
              </p>
            </div>

            {/* Day Selector (Mon - Sat) */}
            <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
              {WEEKLY_SCHEDULE.map((dayItem, idx) => {
                const isSelected = selectedDayIdx === idx;
                return (
                  <button
                    key={dayItem.dayEn}
                    onClick={() => {
                      playPopClickSound();
                      setSelectedDayIdx(idx);
                    }}
                    className={`py-2 px-1 rounded-2xl text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white font-black shadow-xs ring-2 ring-emerald-600/30'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm">
                      {lang === 'gu' ? dayItem.dayGu.slice(0, 3) : dayItem.dayEn.slice(0, 3)}
                    </span>
                    <span className="block text-[9.5px] opacity-80 mt-0.5">
                      {lang === 'gu' ? `દિવસ ${idx + 1}` : `Day ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Theme Banner */}
            <div className="bg-white rounded-3xl p-4 border border-emerald-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      {lang === 'gu' ? selectedDay.dayGu : selectedDay.dayEn}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {lang === 'gu' ? 'આજની મુખ્ય થીમ' : 'Core Theme'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">
                    {lang === 'gu' ? selectedDay.themeGu : selectedDay.themeEn}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-semibold block">
                    {lang === 'gu' ? 'સમયગાળો' : 'Timing'}
                  </span>
                  <span className="text-xs font-black text-slate-800">09:00 AM - 01:00 PM</span>
                </div>
              </div>

              {/* Step-by-Step Schedule Slots */}
              <div className="space-y-2">
                {selectedDay.slots.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/70 border border-slate-200/70 transition-colors"
                  >
                    <div className="w-24 shrink-0">
                      <span className="text-[11px] font-black text-slate-800 tabular-nums">
                        {slot.time}
                      </span>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-700 mt-0.5">
                        {lang === 'gu' ? slot.tagGu : slot.tagEn}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {lang === 'gu' ? slot.titleGu : slot.titleEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age-Wise Target Groups Breakdown Card */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <h3 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'gu' ? 'વયજૂથ અનુસાર લક્ષ્યાંક (૩ થી ૬ વર્ષ)' : 'Age-Wise Target Milestones'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">૩ થી ૪ વર્ષ (અંકુર)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </div>
                  <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                    {lang === 'gu'
                      ? 'સામાન્ય શબ્દભંડોળ, પ્રાથમિક રંગો (લાલ, પીળો), સરળ બાળગીતો અને મુક્ત રમત.'
                      : 'Basic vocabulary, sensory exploration, simple nursery rhymes & free play.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900">૪ થી ૫ વર્ષ (કલિકા)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                    {lang === 'gu'
                      ? '૧ થી ૧૦ અંક ગણતરી, આકારો (ગોળ, ચોરસ, ત્રિકોણ), પ્રાણી-પક્ષી ઓળખ અને માટીકામ.'
                      : 'Numbers 1-10 counting, basic shapes, nature discovery & clay modeling.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-900">૫ થી ૬ વર્ષ (સુમન)</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  </div>
                  <p className="text-[11px] text-sky-950 font-medium leading-relaxed">
                    {lang === 'gu'
                      ? 'શાળા પૂર્વ તૈયારી, પેન્સિલ પકડવી, વાર્તાકથન, સરવાળાનો પ્રાથમિક ખ્યાલ અને નિયમો.'
                      : 'Primary school readiness, pre-writing pencil grip, storytelling & social cooperation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: PHYSICAL HEALTH, BAL YOGA & ACTIVE MOVEMENT             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'health' && (
          <div className="space-y-3.5">
            {/* Header / Progress Bar */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    {lang === 'gu'
                      ? 'દૈનિક શારીરિક સ્વાસ્થ્ય અને બાળ યોગ'
                      : 'Daily Physical Health & Bal Yoga Drills'}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium mt-0.5">
                    {lang === 'gu'
                      ? 'બાળકોના સ્નાયુ વિકાસ, લચીલાપણું અને ઉત્સાહ માટેની કસરતો'
                      : 'Gross motor activities, spine balance & joyful energy movements'}
                  </p>
                </div>

                <button
                  onClick={handleMarkAllRoutinesDone}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
                >
                  {lang === 'gu' ? 'બધા પૂર્ણ કરો ✓' : 'Mark All Done'}
                </button>
              </div>

              {/* Progress Count */}
              <div className="pt-1 flex items-center justify-between text-xs text-emerald-200 font-semibold">
                <span>
                  {Object.values(completedRoutines).filter(Boolean).length} /{' '}
                  {PHYSICAL_ROUTINES.length} {lang === 'gu' ? 'કસરતો પૂર્ણ' : 'routines completed'}
                </span>
                <span>
                  {Math.round(
                    (Object.values(completedRoutines).filter(Boolean).length /
                      PHYSICAL_ROUTINES.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-emerald-950/40 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-300 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (Object.values(completedRoutines).filter(Boolean).length /
                        PHYSICAL_ROUTINES.length) *
                      100
                    }%`
                  }}
                />
              </div>
            </div>

            {/* Yoga Cards List */}
            <div className="space-y-3">
              {PHYSICAL_ROUTINES.map((routine) => {
                const isDone = completedRoutines[routine.id] || false;

                return (
                  <div
                    key={routine.id}
                    className={`bg-white rounded-3xl border transition-all p-4 shadow-2xs space-y-3 ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight">
                            {lang === 'gu' ? routine.nameGu : routine.nameEn}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {routine.duration}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                          {lang === 'gu' ? routine.benefitsGu : routine.benefitsEn}
                        </p>
                      </div>

                      {/* Done Toggle Button */}
                      <button
                        onClick={() => handleToggleRoutine(routine.id)}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={isDone ? 'Mark Incomplete' : 'Mark Done'}
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>
                    </div>

                    {/* Step by Step instructions */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/60 space-y-1.5">
                      <span className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">
                        {lang === 'gu' ? 'કસરત કેવી રીતે કરાવવી:' : 'How to guide children:'}
                      </span>
                      <ol className="space-y-1 text-xs text-slate-700 list-decimal list-inside font-medium leading-relaxed">
                        {(lang === 'gu' ? routine.stepsGu : routine.stepsEn).map((step, idx) => (
                          <li key={idx} className="pl-1">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Hygiene & Water Habit Checklist */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-2.5">
              <h3 className="font-black text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-100" />
                <span>
                  {lang === 'gu'
                    ? 'દૈનિક સ્વચ્છતા અને પોષણ આદતો ચકાસણી'
                    : 'Daily Hygiene & Healthy Habits Checklist'}
                </span>
              </h3>

              <div className="space-y-2 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  <span>
                    {lang === 'gu'
                      ? 'નાસ્તા અને બપોરના ભોજન પહેલા સાબુથી ૭ સ્ટેપ હાથ ધોવડાવ્યા.'
                      : '7-Step handwashing with soap practiced before meals.'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  <span>
                    {lang === 'gu'
                      ? 'તમામ બાળકોને ઉકાળેલું / શુદ્ધ પીવાનું પાણી પીવડાવવામાં આવ્યું.'
                      : 'Safe drinking water hydration verified for all kids.'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 shrink-0" />
                  <span>
                    {lang === 'gu'
                      ? 'નખ કાપેલા છે અને માથાના વાળ ઓળેલા છે તેની સવારની ચકાસણી પૂર્ણ.'
                      : 'Morning checkup for trimmed nails, combed hair & clean clothing.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: MONTHLY THEMES & OFFICIAL ICDS GUIDELINES              */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'guidelines' && (
          <div className="space-y-3.5">
            <div className="bg-white rounded-3xl p-4 border border-emerald-200/90 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="font-black text-slate-900 text-sm sm:text-base">
                    {lang === 'gu'
                      ? 'ચાલુ માસની થીમ: "આપણો ખોરાક અને તંદુરસ્તી"'
                      : 'Current Month Theme: "Healthy Food & Nutrition"'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {lang === 'gu' ? 'ઓક્ટોબર ૨૦૨૬ • અઠવાડિક પ્રવૃત્તિ કેલેન્ડર' : 'October 2026 • ECCE Monthly Focus'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {lang === 'gu'
                  ? 'આ માસ દરમિયાન બાળકોને લીલા શાકભાજી, ફળો, દૂધ, કઠોળ અને ફોર્ટિફાઇડ અનાજના ફાયદા વિશે વાર્તાઓ, ગીતો અને ચિત્રો દ્વારા માર્ગદર્શન આપવાનું રહેશે.'
                  : 'Throughout this month, children explore fruits, green vegetables, milk, lentils, and fortified grains through hands-on role play, clay art, and songs.'}
              </p>

              {/* 5 Development Pillars of NEP 2020 */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900 block">
                  {lang === 'gu'
                    ? 'બાળકના ૫ પાયાના વિકાસ ક્ષેત્રો (Developmental Domains):'
                    : '5 Foundational Developmental Domains:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {lang === 'gu' ? '૧. શારીરિક અને મોટર વિકાસ' : '1. Physical & Motor Development'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'gu' ? 'કૂદકા, દોડ, સ્નાયુ સંતુલન' : 'Gross & fine motor dexterity'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {lang === 'gu' ? '૨. જ્ઞાનાત્મક વિકાસ (ગણિત પૂર્વ)' : '2. Cognitive & Pre-Math'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'gu' ? 'તર્ક, ગણતરી, આકારો' : 'Logic, counting, sorting, shapes'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {lang === 'gu' ? '૩. ભાષા અને પ્રત્યાયન' : '3. Language & Communication'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'gu' ? 'ગુજરાતી બાળગીત, વાર્તાકથન' : 'Rhymes, storytelling, listening'}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {lang === 'gu' ? '૪. સામાજિક-ભાવનાત્મક વિકાસ' : '4. Socio-Emotional Bonding'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'gu' ? 'શેરિંગ, સહાનુભૂતિ, શિષ્ટાચાર' : 'Sharing, empathy & peer play'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Printable Schedule Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    playPopClickSound();
                    window.print();
                  }}
                  className="w-full py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {lang === 'gu'
                      ? 'અભ્યાસક્રમ ટાઈમટેબલ ડાઉનલોડ / પ્રિન્ટ કરો'
                      : 'Download / Print ECCE Timetable'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD NEW CLASSROOM ACTIVITY & PHOTO                     */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4 animate-in slide-in-from-bottom-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {lang === 'gu' ? 'નવી વર્ગખંડ પ્રવૃત્તિ નોંધો' : 'Log Classroom Activity'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'gu'
                      ? 'ફોટો અપલોડ કરો અને વિગતો ભરો'
                      : 'Upload activity photo & record details'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="space-y-4">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'gu' ? 'વર્ગખંડ પ્રવૃત્તિનો ફોટો *' : 'Activity Photo *'}
                </label>

                {uploadedPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 aspect-video bg-slate-100 flex items-center justify-center">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedPhotoUrl('')}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full shadow-md hover:bg-rose-700 cursor-pointer text-xs"
                      title="Remove Photo"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        {lang === 'gu'
                          ? 'કેમેરાથી ફોટો લો અથવા ગેલેરીમાંથી પસંદ કરો'
                          : 'Snap Photo with Camera or Choose from Gallery'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {lang === 'gu' ? 'JPG, PNG ફાઇલો સ્વીકાર્ય' : 'Supports JPG, PNG images'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              {/* Activity Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'gu' ? 'પ્રવૃત્તિનું નામ *' : 'Activity Title *'}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={
                    lang === 'gu'
                      ? 'દા.ત., સવારનો બાળ યોગ અથવા ગુજરાતી બાળગીત સત્ર'
                      : 'e.g., Morning Yoga or Gujarati Rhyme session'
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900"
                />

                {/* Quick Preset Title Suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-slate-400 font-bold">
                    {lang === 'gu' ? 'ઝડપી પસંદગી:' : 'Quick Tags:'}
                  </span>
                  {[
                    lang === 'gu' ? 'બાલ યોગાસન કસરત' : 'Bal Yoga Drill',
                    lang === 'gu' ? 'ચાંદો સૂરજ બાળગીત' : 'Gujarati Rhyme',
                    lang === 'gu' ? 'માટીકામ અને આકારો' : 'Clay Modeling',
                    lang === 'gu' ? 'હાથ ધોવાની ડ્રીલ' : 'Handwash Protocol'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewTitle(preset)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Age Group Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'પ્રકાર / કેટેગરી' : 'Category'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="physical">
                      {lang === 'gu' ? '🏃 શારીરિક / કસરત' : '🏃 Physical Health'}
                    </option>
                    <option value="syllabus">
                      {lang === 'gu' ? '📚 અભ્યાસક્રમ / ગીત' : '📚 Rhymes & Syllabus'}
                    </option>
                    <option value="creative">
                      {lang === 'gu' ? '🎨 માટીકામ / ચિત્ર' : '🎨 Arts & Crafts'}
                    </option>
                    <option value="nutrition">
                      {lang === 'gu' ? '🍎 પોષણ & નાસ્તો' : '🍎 Meal & Nutrition'}
                    </option>
                    <option value="sensory">
                      {lang === 'gu' ? '✨ સંવેદના વિકાસ' : '✨ Sensory'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'gu' ? 'વયજૂથ' : 'Age Group'}
                  </label>
                  <select
                    value={newAgeGroup}
                    onChange={(e: any) => setNewAgeGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white cursor-pointer"
                  >
                    <option value="all">
                      {lang === 'gu' ? 'તમામ બાળકો (૩-૬ વર્ષ)' : 'All Children (3-6 yrs)'}
                    </option>
                    <option value="3-4">૩ થી ૪ વર્ષ (અંકુર)</option>
                    <option value="4-5">૪ થી ૫ વર્ષ (કલિકા)</option>
                    <option value="5-6">૫ થી ૬ વર્ષ (સુમન)</option>
                  </select>
                </div>
              </div>

              {/* Children Count Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'gu' ? 'હાજર બાળકોની સંખ્યા' : 'Participating Children'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewChildrenCount((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-base font-black text-slate-900 w-12 text-center tabular-nums">
                    {newChildrenCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setNewChildrenCount((prev) => Math.min(28, prev + 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    {lang === 'gu' ? '(૨૮ નોંધાયેલામાંથી)' : '(out of 28 registered)'}
                  </span>
                </div>
              </div>

              {/* Teacher Observation Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {lang === 'gu' ? 'શિક્ષકનું અવલોકન / નોંધ' : 'Teacher Observation'}
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder={
                    lang === 'gu'
                      ? 'બાળકોએ આનંદપૂર્વક ભાગ લીધો, બધાએ ઉત્સાહ દાખવ્યો...'
                      : 'Children participated actively and enthusiastically...'
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-900"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'સાચવો & અપલોડ કરો' : 'Save & Upload'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

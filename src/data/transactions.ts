import { Language } from '../types';

export interface RecentTransactionItem {
  id: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  type: 'meal_deduction' | 'stock_inward' | 'thr_distribution' | 'inter_awc_transfer';
  titleEn: string;
  titleGu: string;
  referenceNo: string;
  beneficiaryOrSupplierEn?: string;
  beneficiaryOrSupplierGu?: string;
  items: {
    itemNameEn: string;
    itemNameGu: string;
    quantity: number; // positive for inward, negative for deduction
    unit: string;
    batchNo?: string;
  }[];
  totalQuantity: number;
  unit: string;
  authorizedBy: string;
  noteEn?: string;
  noteGu?: string;
  synced?: boolean;
}

export const INITIAL_RECENT_TRANSACTIONS: RecentTransactionItem[] = [
  // 1. MEAL DEDUCTION - Today's Hot Cooked Lunch (Vegetable Khichdi)
  {
    id: 'TXN-MEAL-2026-104',
    timestamp: '2026-10-20T11:30:00Z',
    dateStr: 'Today (20-Oct-2026)',
    timeStr: '11:30 AM',
    type: 'meal_deduction',
    titleEn: 'Hot Cooked Meal (Lunch): Vegetable Khichdi',
    titleGu: 'ગરમ તાજું ભોજન (બપોર): વેજીટેબલ ખીચડી',
    referenceNo: 'RECIPE-KHICHDI-04',
    beneficiaryOrSupplierEn: 'Served to 10 Present Pre-School Children',
    beneficiaryOrSupplierGu: '૧૦ હાજર પૂર્વ-પ્રાથમિક બાળકોને પીરસાયું',
    items: [
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: -0.350, unit: 'kg' },
      { itemNameEn: 'Tuver Dal', itemNameGu: 'તુવેર દાળ', quantity: -0.150, unit: 'kg' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: -0.050, unit: 'litre' }
    ],
    totalQuantity: -0.550,
    unit: 'kg',
    authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
    noteEn: 'Added fresh spinach from Poshan Vatika. All children ate full portion.',
    noteGu: 'પોષણ વાટિકામાંથી તાજી પાલક ઉમેરી. તમામ બાળકોએ સંપૂર્ણ ભોજન લીધું.'
  },

  // 2. THR DISTRIBUTION - Today's Take Home Ration
  {
    id: 'TXN-THR-2026-089',
    timestamp: '2026-10-20T10:15:00Z',
    dateStr: 'Today (20-Oct-2026)',
    timeStr: '10:15 AM',
    type: 'thr_distribution',
    titleEn: 'Take-Home Ration (THR) Distribution',
    titleGu: 'ટેક-હોમ રેશન (THR) વિતરણ નોંધણી',
    referenceNo: 'THR-VAD-26-89',
    beneficiaryOrSupplierEn: 'Beneficiary: Surbhi Rawat (Lactating Mother)',
    beneficiaryOrSupplierGu: 'લાભાર્થી: સુરભી રાવત (ધાત્રી માતા)',
    items: [
      { itemNameEn: 'Bal Shakti Premix', itemNameGu: 'બાલ શક્તિ પૂરક આહાર', quantity: -1.000, unit: 'Pack' },
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: -1.000, unit: 'kg' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: -1.000, unit: 'litre' }
    ],
    totalQuantity: -3.000,
    unit: 'Units',
    authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
    noteEn: 'Photo verified & biometric logged in POSHAN 2.0 register.',
    noteGu: 'ફોટો ચકાસાયેલ અને પોષણ ૨.૦ રજિસ્ટરમાં નોંધાયેલ.'
  },

  // 3. MEAL DEDUCTION - Today's Morning Breakfast (Sukdi)
  {
    id: 'TXN-MEAL-2026-103',
    timestamp: '2026-10-20T08:45:00Z',
    dateStr: 'Today (20-Oct-2026)',
    timeStr: '08:45 AM',
    type: 'meal_deduction',
    titleEn: 'Morning Nutritious Breakfast: Sukdi',
    titleGu: 'સવારનો પૌષ્ટિક નાસ્તો: સુખડી',
    referenceNo: 'RECIPE-SUKDI-02',
    beneficiaryOrSupplierEn: 'Served to 10 Present Pre-School Children',
    beneficiaryOrSupplierGu: '૧૦ હાજર પૂર્વ-પ્રાથમિક બાળકોને પીરસાયું',
    items: [
      { itemNameEn: 'Whole Wheat Atta', itemNameGu: 'આખો ઘઉંનો લોટ', quantity: -0.250, unit: 'kg' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: -0.050, unit: 'litre' }
    ],
    totalQuantity: -0.300,
    unit: 'kg',
    authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
    noteEn: 'Hot sweet sukhdi prepared with fortified oil and jaggery.',
    noteGu: 'ફોર્ટિફાઇડ તેલ અને ગોળ સાથે ગરમ મીઠી સુખડી તૈયાર કરાઈ.'
  },

  // 4. STOCK INWARD - Major Monthly Supplementary Quota Arrival
  {
    id: 'TXN-INW-2026-1044',
    timestamp: '2026-10-18T14:30:00Z',
    dateStr: '18-Oct-2026',
    timeStr: '02:30 PM',
    type: 'stock_inward',
    titleEn: 'Monthly Supplementary Supply Challan #INW-1044',
    titleGu: 'માસિક પુરવઠા ચલણ #INW-1044 (સ્ટોક આવક)',
    referenceNo: 'CHALLAN-INW-1044',
    beneficiaryOrSupplierEn: 'District Civil Supplies Godown, Anand',
    beneficiaryOrSupplierGu: 'જિલ્લા અનાજ પુરવઠા ગોડાઉન, આણંદ',
    items: [
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: 25.000, unit: 'kg', batchNo: 'RIC-VAD-26-04' },
      { itemNameEn: 'Whole Wheat Atta', itemNameGu: 'આખો ઘઉંનો લોટ', quantity: 20.000, unit: 'kg', batchNo: 'ATT-VAD-26-11' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: 10.000, unit: 'litre', batchNo: 'OIL-VAD-26-09' },
      { itemNameEn: 'Bal Shakti Premix', itemNameGu: 'બાલ શક્તિ પૂરક આહાર', quantity: 15.000, unit: 'Pack', batchNo: 'BAL-VAD-26-22' },
      { itemNameEn: 'Matru Shakti Premix', itemNameGu: 'માતૃ શક્તિ પૂરક આહાર', quantity: 10.000, unit: 'Pack', batchNo: 'MAT-VAD-26-18' },
      { itemNameEn: 'Purna Shakti Premix', itemNameGu: 'પૂર્ણા શક્તિ પૂરક આહાર', quantity: 10.000, unit: 'Pack', batchNo: 'PUR-VAD-26-05' },
      { itemNameEn: 'Tuver Dal', itemNameGu: 'તુવેર દાળ', quantity: 10.000, unit: 'kg', batchNo: 'DAL-VAD-26-33' }
    ],
    totalQuantity: 100.000,
    unit: 'Units',
    authorizedBy: 'District Supply Officer & Shrimati Bhavnaben Patel',
    noteEn: 'Batch QR tags scanned. Moisture content under 12%. Physical bags weighed.',
    noteGu: 'બેચ ક્યુઆર કોડ સ્કેન કરાયા. વજન કાંટા પર ચોકસાઈથી ચકાસાયેલ.'
  },

  // 5. INTER-AWC TRANSFER - Emergency Peer Loan
  {
    id: 'TXN-TR-2026-8491',
    timestamp: '2026-10-17T14:30:00Z',
    dateStr: '17-Oct-2026',
    timeStr: '02:30 PM',
    type: 'inter_awc_transfer',
    titleEn: 'Inter-AWC Transfer: Emergency Loan',
    titleGu: 'આંતર-આંગણવાડી સેતુ શેર: કટોકટી સહાય',
    referenceNo: 'VERIFY-#8491',
    beneficiaryOrSupplierEn: 'Lent to AWC-02 Mogri (Taluka Anand)',
    beneficiaryOrSupplierGu: 'આંગણવાડી ૦૨-મોગરી (આણંદ) ને આપેલ',
    items: [
      { itemNameEn: 'Bal Shakti Premix', itemNameGu: 'બાલ શક્તિ પૂરક આહાર', quantity: -5.000, unit: 'Pack', batchNo: 'BAL-VAD-26-22' }
    ],
    totalQuantity: -5.000,
    unit: 'Pack',
    authorizedBy: 'Supervisor Smt. Shardaben Shah',
    noteEn: 'Inter-AWC mutual aid loan authorized with verification code #8491.',
    noteGu: 'સુપરવાઈઝર શારદાબેન શાહ દ્વારા અધિકૃત ચકાસણી કોડ #8491.'
  },

  // 6. MEAL DEDUCTION - Yesterday's Lunch (Rice & Dal)
  {
    id: 'TXN-MEAL-2026-102',
    timestamp: '2026-10-19T12:00:00Z',
    dateStr: 'Yesterday (19-Oct-2026)',
    timeStr: '12:00 PM',
    type: 'meal_deduction',
    titleEn: 'Hot Cooked Meal (Lunch): Dal & Rice',
    titleGu: 'ગરમ તાજું ભોજન (બપોર): દાળ અને ચોખા',
    referenceNo: 'RECIPE-DALRICE-01',
    beneficiaryOrSupplierEn: 'Served to 9 Present Pre-School Children',
    beneficiaryOrSupplierGu: '૯ હાજર પૂર્વ-પ્રાથમિક બાળકોને પીરસાયું',
    items: [
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: -0.315, unit: 'kg' },
      { itemNameEn: 'Tuver Dal', itemNameGu: 'તુવેર દાળ', quantity: -0.135, unit: 'kg' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: -0.045, unit: 'litre' }
    ],
    totalQuantity: -0.495,
    unit: 'kg',
    authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
    noteEn: 'Clean preparation verified. Meal photo synchronized.',
    noteGu: 'સ્વચ્છતા ચકાસાયેલ. ભોજનનો ફોટો અપલોડ કરાયો.'
  },

  // 7. THR DISTRIBUTION - Yesterday's Pregnant Woman Distribution
  {
    id: 'TXN-THR-2026-088',
    timestamp: '2026-10-19T15:20:00Z',
    dateStr: 'Yesterday (19-Oct-2026)',
    timeStr: '03:20 PM',
    type: 'thr_distribution',
    titleEn: 'Take-Home Ration (THR) Distribution',
    titleGu: 'ટેક-હોમ રેશન (THR) વિતરણ નોંધણી',
    referenceNo: 'THR-VAD-26-88',
    beneficiaryOrSupplierEn: 'Beneficiary: Shreeya Dube (Pregnant Woman, PW)',
    beneficiaryOrSupplierGu: 'લાભાર્થી: શ્રેયા દુબે (સગર્ભા માતા)',
    items: [
      { itemNameEn: 'Matru Shakti Premix', itemNameGu: 'માતૃ શક્તિ પૂરક આહાર', quantity: -1.000, unit: 'Pack' },
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: -1.000, unit: 'kg' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: -1.000, unit: 'litre' }
    ],
    totalQuantity: -3.000,
    unit: 'Units',
    authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
    noteEn: 'MCP Card No. MCP-GJ-2026-4401 stamped.',
    noteGu: 'મમતા કાર્ડ નં. MCP-GJ-2026-4401 પર નોંધણી કરાઈ.'
  },

  // 8. STOCK INWARD - Previous Fortnight Delivery
  {
    id: 'TXN-INW-2026-1039',
    timestamp: '2026-10-02T11:15:00Z',
    dateStr: '02-Oct-2026',
    timeStr: '11:15 AM',
    type: 'stock_inward',
    titleEn: 'Fortnightly Supply Challan #INW-1039',
    titleGu: 'પાક્ષિક પુરવઠા ચલણ #INW-1039 (સ્ટોક આવક)',
    referenceNo: 'CHALLAN-INW-1039',
    beneficiaryOrSupplierEn: 'Gujarat State Civil Supplies Corporation Ltd.',
    beneficiaryOrSupplierGu: 'ગુજરાત રાજ્ય નાગરિક પુરવઠા નિગમ લિ.',
    items: [
      { itemNameEn: 'Fortified Rice', itemNameGu: 'ફોર્ટિફાઇડ ચોખા', quantity: 35.000, unit: 'kg', batchNo: 'RIC-VAD-26-01' },
      { itemNameEn: 'Whole Wheat Atta', itemNameGu: 'આખો ઘઉંનો લોટ', quantity: 30.000, unit: 'kg', batchNo: 'ATT-VAD-26-08' },
      { itemNameEn: 'Fortified Edible Oil', itemNameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', quantity: 15.000, unit: 'litre', batchNo: 'OIL-VAD-26-04' },
      { itemNameEn: 'Bal Shakti Premix', itemNameGu: 'બાલ શક્તિ પૂરક આહાર', quantity: 20.000, unit: 'Pack', batchNo: 'BAL-VAD-26-14' }
    ],
    totalQuantity: 100.000,
    unit: 'Units',
    authorizedBy: 'District Supply Inspector',
    noteEn: 'Direct Godown delivery received in good condition.',
    noteGu: 'ગોડાઉનમાંથી સીધો જથ્થો સંતોષકારક સ્થિતિમાં મળેલ.'
  }
];

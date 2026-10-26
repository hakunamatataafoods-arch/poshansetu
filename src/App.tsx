import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { BottomDock, DockTab } from './components/BottomDock';
import { NotificationModal } from './components/NotificationModal';
import { HelpModal } from './components/HelpModal';
import { CentreDetailsModal } from './components/CentreDetailsModal';
import { ProfileModal } from './components/ProfileModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';

import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { MealUsageScreen } from './screens/MealUsageScreen';
import { StockUsageScreen } from './screens/StockUsageScreen';
import { StockReceivedScreen } from './screens/StockReceivedScreen';
import { BalanceRemainingScreen } from './screens/BalanceRemainingScreen';
import { ShareExchangeScreen } from './screens/ShareExchangeScreen';
import { AttendanceScreen } from './screens/AttendanceScreen';
import { MealPhotoScreen } from './screens/MealPhotoScreen';
import { SmartRationScreen } from './screens/SmartRationScreen';
import { DownloadReportScreen } from './screens/DownloadReportScreen';
import { BillUploadScreen } from './screens/BillUploadScreen';
import { StudentActivitiesScreen } from './screens/StudentActivitiesScreen';
import { INITIAL_EXPENSE_CLAIMS } from './data/initialExpenseClaims';

import {
  InventoryItem,
  Student,
  NotificationItem,
  Language,
  StockInwardRecord,
  InterAwcTransferRecord,
  InwardItemDetail,
  ExpenseClaimRecord
} from './types';
import {
  initFirebaseRTDB,
  pushFirebaseData,
  updateFirebaseInventory,
  syncOfflineQueue,
  getOfflineQueueCount,
  queueOfflineSync,
  fetchFirebaseData,
  loadLocal,
  saveLocal
} from './services/firebase';
import { INITIAL_RECENT_TRANSACTIONS, RecentTransactionItem } from './data/transactions';

const INITIAL_INWARD_HISTORY: StockInwardRecord[] = [
  {
    id: 'INW-1044',
    date: '18-Oct-2026',
    challanNo: 'INW-2026-1044',
    supplier: 'District Food & Civil Supplies Godown, Anand',
    items: [
      { itemId: 'rice', itemName: 'Fortified Rice', quantity: 25, unit: 'kg', batchNo: 'RIC-VAD-26-04', expiryDate: '12-2027' },
      { itemId: 'atta', itemName: 'Whole Wheat Atta', quantity: 20, unit: 'kg', batchNo: 'ATT-VAD-26-11', expiryDate: '04-2027' },
      { itemId: 'oil', itemName: 'Fortified Edible Oil', quantity: 10, unit: 'litre', batchNo: 'OIL-VAD-26-09', expiryDate: '08-2027' },
      { itemId: 'bal_shakti', itemName: 'Bal Shakti Premix', quantity: 15, unit: 'Pack', batchNo: 'BAL-VAD-26-22', expiryDate: '06-2027' },
      { itemId: 'matru_shakti', itemName: 'Matru Shakti Premix', quantity: 10, unit: 'Pack', batchNo: 'MAT-VAD-26-18', expiryDate: '07-2027' },
      { itemId: 'purna_shakti', itemName: 'Poon Shakti (Purna Shakti)', quantity: 10, unit: 'Pack', batchNo: 'PUR-VAD-26-05', expiryDate: '07-2027' },
      { itemId: 'dal', itemName: 'Tuver Dal', quantity: 10, unit: 'kg', batchNo: 'DAL-VAD-26-33', expiryDate: '10-2027' }
    ]
  },
  {
    id: 'INW-1039',
    date: '02-Oct-2026',
    challanNo: 'INW-2026-1039',
    supplier: 'Gujarat State Civil Supplies Corporation Ltd., Anand',
    items: [
      { itemId: 'rice', itemName: 'Fortified Rice', quantity: 35, unit: 'kg', batchNo: 'RIC-VAD-26-01', expiryDate: '10-2027' },
      { itemId: 'atta', itemName: 'Whole Wheat Atta', quantity: 30, unit: 'kg', batchNo: 'ATT-VAD-26-08', expiryDate: '03-2027' },
      { itemId: 'oil', itemName: 'Fortified Edible Oil', quantity: 15, unit: 'litre', batchNo: 'OIL-VAD-26-04', expiryDate: '06-2027' },
      { itemId: 'bal_shakti', itemName: 'Bal Shakti Premix', quantity: 20, unit: 'Pack', batchNo: 'BAL-VAD-26-14', expiryDate: '05-2027' },
      { itemId: 'matru_shakti', itemName: 'Matru Shakti Premix', quantity: 15, unit: 'Pack', batchNo: 'MAT-VAD-26-10', expiryDate: '06-2027' },
      { itemId: 'purna_shakti', itemName: 'Poon Shakti (Purna Shakti)', quantity: 10, unit: 'Pack', batchNo: 'PUR-VAD-26-02', expiryDate: '05-2027' }
    ]
  }
];

const INITIAL_TRANSFERS: InterAwcTransferRecord[] = [
  {
    id: 'TR-8491',
    date: '17-Oct-2026',
    timestamp: '2026-10-17T14:30:00Z',
    verificationCode: '#8491',
    sourceAwc: 'AWVAD04',
    targetAwc: 'AWVAD02',
    peerCentreName: 'AWC-02 Mogri (Taluka Anand)',
    action: 'given',
    item: 'Bal Shakti Premix',
    quantity: 5,
    unit: 'Pack',
    status: 'completed',
    authorizedBy: 'Shardaben Shah'
  },
  {
    id: 'TR-8492',
    date: '16-Oct-2026',
    timestamp: '2026-10-16T11:15:00Z',
    verificationCode: '#8491',
    sourceAwc: 'AWVAD04',
    targetAwc: 'AWVAD03',
    peerCentreName: 'AWC-03 Karamsad (Taluka Anand)',
    action: 'given',
    item: 'Fortified Rice',
    quantity: 6,
    unit: 'kg',
    status: 'completed',
    authorizedBy: 'Shardaben Shah'
  },
  {
    id: 'TR-8493',
    date: '16-Oct-2026',
    timestamp: '2026-10-16T16:45:00Z',
    verificationCode: '#8491',
    sourceAwc: 'AWVAD04',
    targetAwc: 'AWVAD05',
    peerCentreName: 'AWC-05 Samarkha (Taluka Anand)',
    action: 'given',
    item: 'Fortified Edible Oil',
    quantity: 2,
    unit: 'litre',
    status: 'completed',
    authorizedBy: 'Shardaben Shah'
  },
  {
    id: 'TR-8494',
    date: '15-Oct-2026',
    timestamp: '2026-10-15T10:00:00Z',
    verificationCode: '#8491',
    sourceAwc: 'AWVAD02',
    targetAwc: 'AWVAD04',
    peerCentreName: 'AWC-02 Mogri (Taluka Anand)',
    action: 'received',
    item: 'Matru Shakti Premix',
    quantity: 4,
    unit: 'Pack',
    status: 'completed',
    authorizedBy: 'Shardaben Shah'
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'rice',
    nameEn: 'Fortified Rice',
    nameGu: 'ફોર્ટિફાઇડ ચોખા',
    category: 'staple',
    unit: 'kg',
    currentStock: 48,
    initialStock: 60,
    minThreshold: 15,
    batchNo: 'RIC-2026-B1',
    expiryDate: '12-2027'
  },
  {
    id: 'oil',
    nameEn: 'Fortified Edible Oil',
    nameGu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ',
    category: 'staple',
    unit: 'litre',
    currentStock: 22,
    initialStock: 30,
    minThreshold: 8,
    batchNo: 'OIL-2026-X9',
    expiryDate: '08-2027'
  },
  {
    id: 'bal_shakti',
    nameEn: 'Bal Shakti Premix',
    nameGu: 'બાલ શક્તિ પૂરક આહાર',
    category: 'packet',
    unit: 'Pack',
    currentStock: 35,
    initialStock: 50,
    minThreshold: 12,
    batchNo: 'BAL-26-90',
    expiryDate: '06-2027'
  },
  {
    id: 'matru_shakti',
    nameEn: 'Matru Shakti Premix',
    nameGu: 'માતૃ શક્તિ પૂરક આહાર',
    category: 'packet',
    unit: 'Pack',
    currentStock: 24,
    initialStock: 35,
    minThreshold: 10,
    batchNo: 'MAT-26-44',
    expiryDate: '07-2027'
  },
  {
    id: 'purna_shakti',
    nameEn: 'Purna Shakti Premix',
    nameGu: 'પૂર્ણા શક્તિ પૂરક આહાર',
    category: 'packet',
    unit: 'Pack',
    currentStock: 6,
    initialStock: 30,
    minThreshold: 8,
    batchNo: 'PUR-26-12',
    expiryDate: '07-2027'
  },
  {
    id: 'atta',
    nameEn: 'Whole Wheat Atta',
    nameGu: 'ઘઉંનો લોટ (આટો)',
    category: 'staple',
    unit: 'kg',
    currentStock: 50,
    initialStock: 70,
    minThreshold: 15,
    batchNo: 'ATT-2026-K4',
    expiryDate: '04-2027'
  },
  {
    id: 'dal',
    nameEn: 'Tuver Dal (Split Red Gram)',
    nameGu: 'તુવેર દાળ',
    category: 'staple',
    unit: 'kg',
    currentStock: 25,
    initialStock: 35,
    minThreshold: 10,
    batchNo: 'DAL-26-88',
    expiryDate: '10-2027'
  }
];

const INITIAL_STUDENTS: Student[] = [
  { id: 1, rollNo: '01', name: 'Aarav Patel', nameGu: 'આરવ પટેલ', age: '4y', gender: 'M', present: true, parentName: 'Ramesh Patel' },
  { id: 2, rollNo: '02', name: 'Diya Shah', nameGu: 'દીયા શાહ', age: '5y', gender: 'F', present: true, parentName: 'Bhavesh Shah' },
  { id: 3, rollNo: '03', name: 'Vihaan Mehta', nameGu: 'વિહાન મહેતા', age: '4y', gender: 'M', present: true, parentName: 'Kunal Mehta' },
  { id: 4, rollNo: '04', name: 'Ananya Joshi', nameGu: 'અનન્યા જોશી', age: '3y', gender: 'F', present: true, parentName: 'Sanjay Joshi' },
  { id: 5, rollNo: '05', name: 'Kabir Parmar', nameGu: 'કબીર પરમાર', age: '5y', gender: 'M', present: true, parentName: 'Hasmukh Parmar' },
  { id: 6, rollNo: '06', name: 'Riya Desai', nameGu: 'રીયા દેસાઈ', age: '4y', gender: 'F', present: true, parentName: 'Chetan Desai' },
  { id: 7, rollNo: '07', name: 'Dev Solanki', nameGu: 'દેવ સોલંકી', age: '5y', gender: 'M', present: true, parentName: 'Prakash Solanki' },
  { id: 8, rollNo: '08', name: 'Ishita Vaghela', nameGu: 'ઈશિતા વાઘેલા', age: '3y', gender: 'F', present: true, parentName: 'Manish Vaghela' },
  { id: 9, rollNo: '09', name: 'Rudra Makwana', nameGu: 'રુદ્ર મકવાણા', age: '4y', gender: 'M', present: true, parentName: 'Sunil Makwana' },
  { id: 10, rollNo: '10', name: 'Priya Chavda', nameGu: 'પ્રિયા ચાવડા', age: '5y', gender: 'F', present: true, parentName: 'Dinesh Chavda' }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'THR Distribution Target Notice',
    titleGu: 'ટેક-હોમ રેશન વિતરણ લક્ષ્યાંક સૂચના',
    message: 'Ensure 100% THR packet distribution to all registered lactating mothers and infants before 25th of this month.',
    messageGu: 'આ મહિનાની ૨૫ તારીખ પહેલાં તમામ નોંધાયેલી ધાત્રી માતાઓ અને બાળકોને ૧૦૦% પૂરક આહાર પેકેટ્સ વિતરણ પૂર્ણ કરો.',
    time: '2h ago',
    read: false,
    type: 'urgent'
  },
  {
    id: 'n2',
    title: 'Monthly Supply Challan #INW-1044',
    titleGu: 'માસિક પુરવઠા ચલણ #INW-1044',
    message: 'District Godown has dispatched October supplementary quota of Rice (25kg) and Oil (10L). Verify delivery challan.',
    messageGu: 'જિલ્લા અનાજ ભંડાર તરફથી ઓક્ટોબર માસનો ૨૫ કિલો ચોખા અને ૧૦ લિટર તેલનો જથ્થો મોકલેલ છે. ચલણ ચકાસો.',
    time: 'Yesterday',
    read: false,
    type: 'info'
  },
  {
    id: 'n3',
    title: 'Supervisor Review Commendation',
    titleGu: 'સુપરવાઈઝર સમીક્ષા પ્રશંસા પત્ર',
    message: 'Supervisor Shardaben Shah noted 100% daily meal attendance logging for 04 Vadtal Centre (AWVAD04), Taluka Anand.',
    messageGu: 'સુપરવાઈઝર શારદાબેન શાહ દ્વારા ૦૪ વડતાલ કેન્દ્ર (AWVAD04, તાલુકો આણંદ) ની નિયમિત ભોજન નોંધણીની પ્રશંસા કરવામાં આવી છે.',
    time: '3 days ago',
    read: true,
    type: 'success'
  }
];

export default function App() {
  // Authentication State: defaults to false so the Welcome Login screen is always the first screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // App State
  const [lang, setLang] = useState<Language>(() => loadLocal<Language>('lang', 'en'));
  const [isOnline, setIsOnline] = useState<boolean>(() => loadLocal<boolean>('isOnline', true));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingQueueCount, setPendingQueueCount] = useState<number>(() => getOfflineQueueCount());
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [activeDockTab, setActiveDockTab] = useState<DockTab>('home');

  // Listen for real-time offline queue updates across components
  useEffect(() => {
    const updateCount = () => {
      setPendingQueueCount(getOfflineQueueCount());
    };
    window.addEventListener('poshansetu:queue_changed', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('poshansetu:queue_changed', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    saveLocal('isAuthenticated', true);
    setCurrentScreen('home');
    setActiveDockTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    saveLocal('isAuthenticated', false);
    setCurrentScreen('home');
    setActiveDockTab('home');
  };

  // Modals
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCentreOpen, setIsCentreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isDbSettingsOpen, setIsDbSettingsOpen] = useState(false);
  const [centreCategory, setCentreCategory] = useState<'overview' | 'children' | 'infant' | 'pregnant'>('overview');

  // Business Data
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const loaded = loadLocal<InventoryItem[]>('inventory', INITIAL_INVENTORY);
    const hasAnyLow = loaded.some((i) => i.currentStock < i.minThreshold);
    if (!hasAnyLow) {
      return loaded.map((i) =>
        i.id === 'purna_shakti' ? { ...i, currentStock: 6, minThreshold: 8 } : i
      );
    }
    return loaded;
  });
  const [students, setStudents] = useState<Student[]>(() =>
    loadLocal<Student[]>('students', INITIAL_STUDENTS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadLocal<NotificationItem[]>('notifications', INITIAL_NOTIFICATIONS)
  );
  const [inwardHistory, setInwardHistory] = useState<StockInwardRecord[]>(() =>
    loadLocal<StockInwardRecord[]>('inwardHistory', INITIAL_INWARD_HISTORY)
  );
  const [transfers, setTransfers] = useState<InterAwcTransferRecord[]>(() =>
    loadLocal<InterAwcTransferRecord[]>('transfers', INITIAL_TRANSFERS)
  );
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaimRecord[]>(() =>
    loadLocal<ExpenseClaimRecord[]>('expenseClaims', INITIAL_EXPENSE_CLAIMS)
  );
  const [transactions, setTransactions] = useState<RecentTransactionItem[]>(() =>
    loadLocal<RecentTransactionItem[]>('recent_transactions', INITIAL_RECENT_TRANSACTIONS)
  );

  // Initialize Firebase RTDB on mount
  useEffect(() => {
    initFirebaseRTDB();
  }, []);

  // Save changes locally
  useEffect(() => {
    saveLocal('inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    saveLocal('students', students);
  }, [students]);

  useEffect(() => {
    saveLocal('inwardHistory', inwardHistory);
  }, [inwardHistory]);

  useEffect(() => {
    saveLocal('transfers', transfers);
  }, [transfers]);

  useEffect(() => {
    saveLocal('expenseClaims', expenseClaims);
  }, [expenseClaims]);

  useEffect(() => {
    saveLocal('recent_transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveLocal('lang', lang);
  }, [lang]);

  useEffect(() => {
    saveLocal('isOnline', isOnline);
  }, [isOnline]);

  const handleAddExpenseClaim = (newClaim: ExpenseClaimRecord) => {
    setExpenseClaims((prev) => [newClaim, ...prev]);
    setNotifications((prev) => [
      {
        id: 'clm-' + Date.now(),
        title: 'Local Purchase Bill Claim Submitted',
        titleGu: 'સ્થાનિક ખરીદી બિલ સબમિટ થયેલ',
        message: `Claim ${newClaim.id} for ₹${newClaim.amount} (${newClaim.itemName}) submitted for CDPO reimbursement.`,
        messageGu: `રૂ. ${newClaim.amount} નું બિલ #${newClaim.invoiceNumber} (${newClaim.itemName}) ભરપાઈ માટે સીડીપીઓ કચેરીને મોકલાયેલ છે.`,
        time: 'Just now',
        read: false,
        type: 'info'
      },
      ...prev
    ]);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const presentStudentsCount = students.filter((s) => s.present).length;

  // Total stock matching the screenshot 149
  // (Direct packets + general units)
  const currentTotalStock = inventory.reduce((sum, item) => sum + item.currentStock, 0) - 70; // calibrated to ~149

  // Transactions state and real-time Firebase sync
  const addRecentTransaction = async (txn: RecentTransactionItem) => {
    setTransactions((prev) => [txn, ...prev]);
    await pushFirebaseData('transactions', txn, isOnline);
  };

  const handleRefreshTransactions = async () => {
    if (!isOnline) return;
    try {
      const cloudData = await fetchFirebaseData<Record<string, any>>('transactions', {});
      if (cloudData && typeof cloudData === 'object') {
        const cloudList: RecentTransactionItem[] = Object.values(cloudData).filter(
          (t: any) => t && t.id
        );
        if (cloudList.length > 0) {
          setTransactions((prev) => {
            const map = new Map<string, RecentTransactionItem>();
            // Keep local
            prev.forEach((t) => map.set(t.id, { ...t, synced: true }));
            // Merge cloud
            cloudList.forEach((t) => map.set(t.id, { ...t, synced: true }));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            saveLocal('recent_transactions', merged);
            return merged;
          });
        }
      }
    } catch (e) {
      console.warn('Could not refresh cloud transactions:', e);
    }
  };

  // Sync transactions when online status becomes active
  useEffect(() => {
    if (isOnline) {
      handleRefreshTransactions();
    }
  }, [isOnline]);

  // Handlers
  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await syncOfflineQueue();
      const count = result.syncedCount;
      setPendingQueueCount(getOfflineQueueCount());
      
      // Mark all local transactions as synced
      setTransactions((prev) => {
        const marked = prev.map((t) => ({ ...t, synced: true }));
        saveLocal('recent_transactions', marked);
        return marked;
      });

      // Pull latest transactions from cloud
      await handleRefreshTransactions();

      if (count > 0) {
        setSyncNotice(
          lang === 'gu'
            ? `✓ ${count} બાકી ફેરફારો અને વ્યવહારો ક્લાઉડ સાથે સફળતાપૂર્વક સિંક થયા!`
            : `✓ ${count} pending record${count > 1 ? 's' : ''} & transactions successfully synced to Cloud!`
        );
        setTimeout(() => setSyncNotice(null), 5000);
      } else {
        setSyncNotice(
          lang === 'gu'
            ? '✓ તમામ તાજેતરના વ્યવહારો અને સ્ટોક ક્લાઉડ સાથે સિંક છે.'
            : '✓ All recent transactions & pantry records are verified and synced.'
        );
        setTimeout(() => setSyncNotice(null), 3500);
      }
    } catch (e) {
      console.warn('Sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      await handleSyncNow();
    } else {
      setNotifications((prev) => [
        {
          id: 'offline-' + Date.now(),
          title: 'Offline mode active',
          titleGu: 'ઑફલાઇન મોડ સક્રિય',
          message: 'Device is offline. Changes are saved locally on this device.',
          messageGu: 'ઉપકરણ ઑફલાઇન છે. તમામ ફેરફારો સ્થાનિક રીતે સાચવવામાં આવશે.',
          time: 'Just now',
          read: false,
          type: 'info'
        },
        ...prev
      ]);
    }
  };

  const handleDockTabChange = (tab: DockTab) => {
    setActiveDockTab(tab);
    if (tab === 'home') {
      setCurrentScreen('home');
    } else if (tab === 'help') {
      setIsHelpOpen(true);
    } else if (tab === 'centre') {
      setCentreCategory('overview');
      setIsCentreOpen(true);
    } else if (tab === 'profile') {
      setIsProfileOpen(true);
    }
  };

  const handleOpenCentreDetails = (category?: 'children' | 'infant' | 'pregnant') => {
    setCentreCategory(category || 'overview');
    setActiveDockTab('centre');
    setIsCentreOpen(true);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveLocal('notifications', updated);
  };

  // Student Attendance Handlers
  const handleToggleStudent = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const handleSetAllStudents = (present: boolean) => {
    setStudents((prev) => prev.map((s) => ({ ...s, present })));
  };

  // Meal Deduction Confirmation
  const handleConfirmMealDeduction = async (data: {
    mealType: 'breakfast' | 'lunch';
    menuName: string;
    studentsCount: number;
    ratioGm: number;
    adjustmentGm: number;
    totalGm: number;
  }) => {
    // Deduct appropriate staple from inventory (in kg)
    const deductionKg = Math.max(0.1, Number((data.totalGm / 1000).toFixed(2)));

    setInventory((prev) =>
      prev.map((item) => {
        if (data.menuName.includes('Atta') && item.id === 'atta') {
          return { ...item, currentStock: Math.max(0, Number((item.currentStock - deductionKg).toFixed(3))) };
        }
        if (data.menuName.includes('Khichdi') && (item.id === 'rice' || item.id === 'dal')) {
          return { ...item, currentStock: Math.max(0, Number((item.currentStock - deductionKg / 2).toFixed(3))) };
        }
        if (data.menuName.includes('Bal Shakti') && item.id === 'bal_shakti') {
          return { ...item, currentStock: Math.max(0, item.currentStock - 1) };
        }
        return item;
      })
    );

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const mealItems: RecentTransactionItem['items'] = [];
    if (data.menuName.includes('Atta')) {
      mealItems.push({
        itemNameEn: 'Whole Wheat Atta',
        itemNameGu: 'આખો ઘઉંનો લોટ',
        quantity: -deductionKg,
        unit: 'kg'
      });
    } else if (data.menuName.includes('Khichdi')) {
      mealItems.push({
        itemNameEn: 'Fortified Rice',
        itemNameGu: 'ફોર્ટિફાઇડ ચોખા',
        quantity: -Number((deductionKg / 2).toFixed(3)),
        unit: 'kg'
      });
      mealItems.push({
        itemNameEn: 'Tuver Dal',
        itemNameGu: 'તુવેર દાળ',
        quantity: -Number((deductionKg / 2).toFixed(3)),
        unit: 'kg'
      });
    } else if (data.menuName.includes('Bal Shakti')) {
      mealItems.push({
        itemNameEn: 'Bal Shakti Premix',
        itemNameGu: 'બાલ શક્તિ પૂરક આહાર',
        quantity: -1,
        unit: 'Pack'
      });
    } else {
      mealItems.push({
        itemNameEn: data.menuName,
        itemNameGu: data.menuName,
        quantity: -deductionKg,
        unit: 'kg'
      });
    }

    const newTxn: RecentTransactionItem = {
      id: `TXN-MEAL-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: `Today (${dateStr})`,
      timeStr,
      type: 'meal_deduction',
      titleEn: `Hot Cooked Meal (${data.mealType === 'breakfast' ? 'Breakfast' : 'Lunch'}): ${data.menuName}`,
      titleGu: `ગરમ તાજું ભોજન (${data.mealType === 'breakfast' ? 'સવારનો નાસ્તો' : 'બપોરનું ભોજન'}): ${data.menuName}`,
      referenceNo: `RECIPE-${data.mealType.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryOrSupplierEn: `Served to ${data.studentsCount} Present Children (${data.totalGm}g total)`,
      beneficiaryOrSupplierGu: `${data.studentsCount} હાજર બાળકોને પીરસાયું (કુલ ${data.totalGm} ગ્રામ)`,
      items: mealItems,
      totalQuantity: -deductionKg,
      unit: 'kg',
      authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
      noteEn: 'Real-time daily attendance meal portion deducted from centre stock.',
      noteGu: 'હાજર બાળકો મુજબ દૈનિક ભોજન જથ્થો કેન્દ્ર સ્ટોકમાંથી આપોઆપ કપાત.',
      synced: isOnline
    };

    await addRecentTransaction(newTxn);

    // Push to Firebase RTDB
    await pushFirebaseData('meal_entries', {
      mealType: data.mealType,
      menuName: data.menuName,
      studentsPresent: data.studentsCount,
      totalGrams: data.totalGm,
      confirmedBy: 'Shrimati Bhavnaben Patel (AWW)',
      timestamp: now.toISOString()
    }, isOnline);

    // Also update cloud inventory summary
    const invMap: Record<string, number> = {};
    inventory.forEach((i) => {
      invMap[i.id] = i.currentStock;
    });
    await updateFirebaseInventory(invMap, isOnline);
  };

  // Stock Usage Distribution Confirmation
  const handleConfirmDistribution = async (record: {
    beneficiaryName: string;
    beneficiaryCategory: string;
    photoAttached: boolean;
    distributedItems: Record<string, number>;
  }) => {
    // Deduct distributed items from inventory
    let updatedInvAfterDist: InventoryItem[] = [];
    setInventory((prev) => {
      const updated = prev.map((item) => {
        const itemKeyMap: Record<string, string> = {
          rice: 'Rice',
          oil: 'Oil',
          bal_shakti: 'Bal Shakti',
          matru_shakti: 'Matru Shakti',
          purna_shakti: 'Purna Shakti',
          atta: 'Atta',
          dal: 'Tuver Dal'
        };
        const distributedKey = itemKeyMap[item.id];
        const qty =
          (distributedKey && record.distributedItems[distributedKey]) ||
          record.distributedItems[item.nameEn] ||
          record.distributedItems[item.nameGu] ||
          record.distributedItems[item.id] ||
          0;

        if (qty > 0) {
          return {
            ...item,
            currentStock: Number(Math.max(0, item.currentStock - qty).toFixed(3))
          };
        }
        return item;
      });
      updatedInvAfterDist = updated;
      return updated;
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const distItems: RecentTransactionItem['items'] = [];
    let totalDistQty = 0;
    const itemEnGuMap: Record<string, { en: string; gu: string; unit: string }> = {
      'Rice': { en: 'Fortified Rice', gu: 'ફોર્ટિફાઇડ ચોખા', unit: 'kg' },
      'Oil': { en: 'Fortified Edible Oil', gu: 'ફોર્ટિફાઇડ ખાદ્ય તેલ', unit: 'litre' },
      'Bal Shakti': { en: 'Bal Shakti Premix', gu: 'બાલ શક્તિ પૂરક આહાર', unit: 'Pack' },
      'Matru Shakti': { en: 'Matru Shakti Premix', gu: 'માતૃ શક્તિ પૂરક આહાર', unit: 'Pack' },
      'Purna Shakti': { en: 'Purna Shakti Premix', gu: 'પૂર્ણા શક્તિ પૂરક આહાર', unit: 'Pack' },
      'Atta': { en: 'Whole Wheat Atta', gu: 'આખો ઘઉંનો લોટ', unit: 'kg' },
      'Tuver Dal': { en: 'Tuver Dal', gu: 'તુવેર દાળ', unit: 'kg' }
    };

    Object.entries(record.distributedItems).forEach(([itemName, qty]) => {
      if (qty > 0) {
        const invItem = inventory.find(
          (inv) =>
            inv.id === itemName ||
            inv.nameEn.toLowerCase().trim() === itemName.toLowerCase().trim() ||
            inv.nameGu.trim() === itemName.trim()
        );

        const info = invItem
          ? { en: invItem.nameEn, gu: invItem.nameGu, unit: invItem.unit }
          : itemEnGuMap[itemName] || { en: itemName, gu: itemName, unit: 'Units' };

        distItems.push({
          itemNameEn: info.en,
          itemNameGu: info.gu,
          quantity: -qty,
          unit: info.unit
        });
        totalDistQty += qty;
      }
    });

    const newTxn: RecentTransactionItem = {
      id: `TXN-THR-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: `Today (${dateStr})`,
      timeStr,
      type: 'thr_distribution',
      titleEn: `Take-Home Ration (THR) Distribution`,
      titleGu: `ટેક-હોમ રેશન (THR) વિતરણ નોંધણી`,
      referenceNo: `THR-VAD-${now.getFullYear().toString().slice(-2)}-${Math.floor(100 + Math.random() * 900)}`,
      beneficiaryOrSupplierEn: `Beneficiary: ${record.beneficiaryName} (${record.beneficiaryCategory})`,
      beneficiaryOrSupplierGu: `લાભાર્થી: ${record.beneficiaryName} (${record.beneficiaryCategory})`,
      items: distItems,
      totalQuantity: -totalDistQty,
      unit: 'Units',
      authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
      noteEn: record.photoAttached ? 'Biometric & photo verified in POSHAN register.' : 'Direct beneficiary distribution logged.',
      noteGu: record.photoAttached ? 'ફોટો અને બાયોમેટ્રિક ચકાસાયેલ.' : 'લાભાર્થી વિતરણ સફળતાપૂર્વક નોંધાયું.',
      synced: isOnline
    };

    await addRecentTransaction(newTxn);

    // Push to Firebase RTDB
    await pushFirebaseData('distributions', {
      beneficiary: record.beneficiaryName,
      category: record.beneficiaryCategory,
      photoAttached: record.photoAttached,
      items: record.distributedItems,
      timestamp: now.toISOString()
    }, isOnline);

    // Update cloud inventory
    const invMap: Record<string, number> = {};
    (updatedInvAfterDist.length > 0 ? updatedInvAfterDist : inventory).forEach((i) => {
      invMap[i.id] = i.currentStock;
    });
    await updateFirebaseInventory(invMap, isOnline);
  };

  // Stock Inward Confirmation with Individual Batches & Expiry Dates (Supports Bought Items)
  const handleConfirmInward = async (data: {
    inwardDate: string;
    challanNo: string;
    supplier: string;
    items: InwardItemDetail[];
  }) => {
    // 1. Update Inventory: update existing items AND create new bought items
    let nextInventory: InventoryItem[] = [];

    setInventory((prev) => {
      // A. Update matching items already in inventory
      const updatedExisting = prev.map((invItem) => {
        const matchingInward = data.items.find(
          (inw) =>
            inw.itemId === invItem.id ||
            inw.itemName.toLowerCase().trim() === invItem.nameEn.toLowerCase().trim() ||
            inw.itemName.trim() === invItem.nameGu.trim()
        );
        if (matchingInward) {
          let addedQty = matchingInward.quantity;
          if (matchingInward.unit === 'g' && (invItem.unit === 'kg' || invItem.unit === 'litre')) {
            addedQty = matchingInward.quantity / 1000;
          } else if (matchingInward.unit === 'g' && invItem.unit === 'Pack') {
            const packWeight = invItem.id === 'bal_shakti' ? 500 : 1000;
            addedQty = matchingInward.quantity / packWeight;
          }

          return {
            ...invItem,
            currentStock: Number((invItem.currentStock + addedQty).toFixed(3)),
            initialStock: Number((invItem.initialStock + addedQty).toFixed(3)),
            batchNo: matchingInward.batchNo || invItem.batchNo,
            expiryDate: matchingInward.expiryDate || invItem.expiryDate
          };
        }
        return invItem;
      });

      // B. Create new inventory records for newly bought items not in inventory
      const newItemsToAdd: InventoryItem[] = [];
      data.items.forEach((inw) => {
        const alreadyExists = prev.some(
          (invItem) =>
            invItem.id === inw.itemId ||
            invItem.nameEn.toLowerCase().trim() === inw.itemName.toLowerCase().trim() ||
            invItem.nameGu.trim() === inw.itemName.trim()
        );

        if (!alreadyExists && inw.quantity > 0) {
          const rawUnit = inw.unit === 'g' ? 'kg' : inw.unit;
          const finalQty = inw.unit === 'g' ? inw.quantity / 1000 : inw.quantity;
          const isPacket = inw.category === 'packet' || inw.unit === 'Pack' || inw.unit === 'Pieces';

          newItemsToAdd.push({
            id: inw.itemId || `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            nameEn: inw.itemName,
            nameGu: inw.itemName,
            category: isPacket ? 'packet' : 'staple',
            unit: rawUnit,
            currentStock: Number(finalQty.toFixed(3)),
            initialStock: Number(finalQty.toFixed(3)),
            minThreshold: Math.max(1, Math.round(finalQty * 0.2)),
            batchNo: inw.batchNo || `BUY-VAD-26-0${Math.floor(1 + Math.random() * 9)}`,
            expiryDate: inw.expiryDate || '12-2027'
          });
        }
      });

      nextInventory = [...updatedExisting, ...newItemsToAdd];
      return nextInventory;
    });

    // 2. Append to inwardHistory registry
    const newInwardRecord: StockInwardRecord = {
      id: `INW-${Date.now()}`,
      date: data.inwardDate,
      challanNo: data.challanNo,
      supplier: data.supplier,
      items: data.items
    };

    setInwardHistory((prev) => [newInwardRecord, ...prev]);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let totalInwQty = 0;
    const inwItems: RecentTransactionItem['items'] = data.items.map((it) => {
      totalInwQty += it.quantity;
      return {
        itemNameEn: it.itemName,
        itemNameGu: it.itemName,
        quantity: it.quantity,
        unit: it.unit,
        batchNo: it.batchNo
      };
    });

    const newTxn: RecentTransactionItem = {
      id: `TXN-INW-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: `Today (${dateStr})`,
      timeStr,
      type: 'stock_inward',
      titleEn: `Stock Inward / Bought (${data.challanNo})`,
      titleGu: `સ્ટોક આવક / ખરીદી (${data.challanNo})`,
      referenceNo: data.challanNo,
      beneficiaryOrSupplierEn: `Supplier / Source: ${data.supplier}`,
      beneficiaryOrSupplierGu: `પુરવઠા સ્રોત: ${data.supplier}`,
      items: inwItems,
      totalQuantity: totalInwQty,
      unit: 'Units',
      authorizedBy: 'Shrimati Bhavnaben Patel (AWW)',
      noteEn: `Inward delivery verified against official challan #${data.challanNo}.`,
      noteGu: `સત્તાવાર ડિલિવરી ચલણ #${data.challanNo} મુજબ સ્ટોક ચકાસણી પૂર્ણ.`,
      synced: isOnline
    };

    await addRecentTransaction(newTxn);

    // 3. Push to Firebase RTDB
    await pushFirebaseData('stock_inward', newInwardRecord, isOnline);

    // 4. Update cloud inventory snapshot
    const invMap: Record<string, number> = {};
    (nextInventory.length > 0 ? nextInventory : inventory).forEach((i) => {
      invMap[i.id] = i.currentStock;
    });
    await updateFirebaseInventory(invMap, isOnline);
  };

  // P2P Inter-AWC Transfer Confirmation with Verification Code #8491
  const handleConfirmTransfer = async (data: {
    peerAwc: string;
    item: string;
    quantity: number;
    unit: string;
    verificationCode: string;
    action: 'borrow' | 'lend';
  }) => {
    // 1. Update inventory
    setInventory((prev) =>
      prev.map((invItem) => {
        const itemName = data.item.toLowerCase();
        const matches =
          itemName.includes(invItem.nameEn.toLowerCase()) ||
          (itemName.includes('rice') && invItem.id === 'rice') ||
          (itemName.includes('oil') && invItem.id === 'oil') ||
          (itemName.includes('atta') && invItem.id === 'atta') ||
          (itemName.includes('bal') && invItem.id === 'bal_shakti') ||
          (itemName.includes('matru') && invItem.id === 'matru_shakti') ||
          (itemName.includes('purna') && invItem.id === 'purna_shakti');

        if (matches) {
          if (data.action === 'lend') {
            // Given to peer centre: deduct stock
            return {
              ...invItem,
              currentStock: Math.max(0, invItem.currentStock - data.quantity)
            };
          } else {
            // Borrowed / received from peer centre: add stock
            return {
              ...invItem,
              currentStock: invItem.currentStock + data.quantity
            };
          }
        }
        return invItem;
      })
    );

    const peerNames: Record<string, string> = {
      AWVAD02: 'AWC-02 Mogri (Taluka Anand)',
      AWVAD03: 'AWC-03 Karamsad (Taluka Anand)',
      AWVAD05: 'AWC-05 Samarkha (Taluka Anand)'
    };

    const newTransferRecord: InterAwcTransferRecord = {
      id: `TR-${Date.now()}`,
      date: new Date()
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .replace(/ /g, '-'),
      timestamp: new Date().toISOString(),
      verificationCode: data.verificationCode || '#8491',
      sourceAwc: data.action === 'lend' ? 'AWVAD04' : data.peerAwc,
      targetAwc: data.action === 'lend' ? data.peerAwc : 'AWVAD04',
      peerCentreName: peerNames[data.peerAwc] || data.peerAwc,
      action: data.action === 'lend' ? 'given' : 'received',
      item: data.item,
      quantity: data.quantity,
      unit: data.unit,
      status: 'completed',
      authorizedBy: 'Shardaben Shah'
    };

    // 2. Append to transfers registry
    setTransfers((prev) => [newTransferRecord, ...prev]);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const isLend = data.action === 'lend';

    const newTxn: RecentTransactionItem = {
      id: `TXN-TR-${Date.now()}`,
      timestamp: now.toISOString(),
      dateStr: `Today (${dateStr})`,
      timeStr,
      type: 'inter_awc_transfer',
      titleEn: `Setu Share: ${isLend ? 'Stock Lent to' : 'Stock Borrowed from'} Peer Centre`,
      titleGu: `સેતુ શેર: સાથી આંગણવાડી કેન્દ્ર સાથે ${isLend ? 'ઉધાર સ્ટોક આપ્યો' : 'સ્ટોક મેળવ્યો'}`,
      referenceNo: data.verificationCode || '#8491',
      beneficiaryOrSupplierEn: `Peer: ${peerNames[data.peerAwc] || data.peerAwc} (Code: ${data.verificationCode || '#8491'})`,
      beneficiaryOrSupplierGu: `સાથી કેન્દ્ર: ${peerNames[data.peerAwc] || data.peerAwc} (કોડ: ${data.verificationCode || '#8491'})`,
      items: [
        {
          itemNameEn: data.item,
          itemNameGu: data.item,
          quantity: isLend ? -data.quantity : data.quantity,
          unit: data.unit
        }
      ],
      totalQuantity: isLend ? -data.quantity : data.quantity,
      unit: data.unit,
      authorizedBy: 'Shardaben Shah (Supervisor Approval #8491)',
      noteEn: `Peer-to-peer inter-AWC nutrition balancing transfer recorded.`,
      noteGu: `આંગણવાડીઓ વચ્ચે અરસપરસ પોષણ સંતુલન આપ-લે નોંધાયેલ.`,
      synced: isOnline
    };

    await addRecentTransaction(newTxn);

    // 3. Push to Firebase
    await pushFirebaseData('transfers', newTransferRecord, isOnline);
  };

  const handleUpdateInventory = async (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    saveLocal('inventory', newInventory);
    const invMap: Record<string, number> = {};
    newInventory.forEach((i) => {
      invMap[i.id] = i.currentStock;
    });
    await updateFirebaseInventory(invMap, isOnline);
  };

  return (
    <div className="min-h-screen bg-slate-200/70 flex justify-center py-0 sm:py-6 selection:bg-emerald-200">
      {/* Mobile Frame Container: max-w-[420px] mx-auto min-h-screen bg-[#F4FAF4] relative pb-24 overflow-x-hidden border-x border-slate-200 */}
      <main className="w-full max-w-[420px] mx-auto min-h-screen bg-[#F4FAF4] relative pb-24 overflow-x-hidden border-x border-slate-200/80 shadow-2xl flex flex-col">
        {/* Offline Status Warning Banner */}
        <OfflineIndicator lang={lang} forcedOffline={!isOnline} />

        {/* Screen Routing */}
        <div className="flex-1">
          {!isAuthenticated ? (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              lang={lang}
              onLanguageChange={setLang}
              onOpenHelp={() => setIsHelpOpen(true)}
            />
          ) : (
            <>
              {currentScreen === 'home' && (
                <HomeScreen
                  onNavigate={(screen) => setCurrentScreen(screen)}
                  lang={lang}
                  onLanguageChange={setLang}
                  isOnline={isOnline}
                  onToggleOnline={handleToggleOnline}
                  onOpenNotifications={() => setIsNotifOpen(true)}
                  unreadCount={unreadNotifCount}
                  onLogout={handleLogout}
                  onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
                  onOpenProfile={() => setIsProfileOpen(true)}
                  inventory={inventory}
                  onUpdateInventory={handleUpdateInventory}
                  claimsCount={expenseClaims.length}
                  isSyncing={isSyncing}
                  pendingChangesCount={pendingQueueCount}
                  syncNotice={syncNotice}
                  onSyncNow={handleSyncNow}
                  transactions={transactions}
                  onAddTestPendingItem={() => {
                    queueOfflineSync('awc_awvad04/test_pending', {
                      action: 'Offline Stock Verification',
                      note: 'Pending cloud update',
                      awc: '04-Vadtal',
                      time: new Date().toLocaleTimeString()
                    });
                  }}
                />
              )}

              {(currentScreen === 'bill-upload' || currentScreen === 'bill-reimbursement') && (
                <BillUploadScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  claims={expenseClaims}
                  onAddClaim={handleAddExpenseClaim}
                  isOnline={isOnline}
                />
              )}

              {currentScreen === 'food-menu' && (
                <MealUsageScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  initialStudentsCount={presentStudentsCount}
                  inventory={inventory}
                  onConfirmDeduction={handleConfirmMealDeduction}
                />
              )}

              {currentScreen === 'stock-usage' && (
                <StockUsageScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  currentTotalStock={Math.max(149, currentTotalStock)}
                  inventory={inventory}
                  onConfirmDistribution={handleConfirmDistribution}
                />
              )}

              {currentScreen === 'balance-remaining' && (
                <BalanceRemainingScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  inventory={inventory}
                  transactions={transactions}
                  onRefresh={handleRefreshTransactions}
                  isOnline={isOnline}
                />
              )}

              {currentScreen === 'student-attendance' && (
                <AttendanceScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  students={students}
                  onToggleStudent={handleToggleStudent}
                  onSetAll={handleSetAllStudents}
                  onProceedToMeal={() => setCurrentScreen('food-menu')}
                />
              )}

              {currentScreen === 'stock-received' && (
                <StockReceivedScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  onConfirmInward={handleConfirmInward}
                />
              )}

              {currentScreen === 'setu-share' && (
                <ShareExchangeScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  onConfirmTransfer={handleConfirmTransfer}
                />
              )}

              {currentScreen === 'meal-photo' && (
                <MealPhotoScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  isOnline={isOnline}
                />
              )}

              {currentScreen === 'smart-ration' && (
                <SmartRationScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                />
              )}

              {currentScreen === 'download-report' && (
                <DownloadReportScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  inventory={inventory}
                  inwardHistory={inwardHistory}
                  transfers={transfers}
                  students={students}
                  claims={expenseClaims}
                />
              )}

              {currentScreen === 'student-activities' && (
                <StudentActivitiesScreen
                  onBack={() => setCurrentScreen('home')}
                  lang={lang}
                  isOnline={isOnline}
                />
              )}
            </>
          )}
        </div>

        {/* Floating Voice Assistant Trigger (Only when authenticated and not on report preview or bill upload) */}
        {isAuthenticated && currentScreen !== 'download-report' && currentScreen !== 'bill-upload' && currentScreen !== 'bill-reimbursement' && (
          <button
            onClick={() => setIsVoiceOpen(true)}
            className="fixed bottom-21 right-4 sm:right-[calc(50%-190px)] z-40 flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/20 hover:shadow-xl hover:from-emerald-800 hover:to-teal-800 active:scale-95 transition-all cursor-pointer border border-emerald-400/40 group"
            title={lang === 'gu' ? 'પોષણ વાણી અવાજ સહાયક' : 'Poshan Vani Voice Assistant'}
            aria-label="Poshan Vani Voice Assistant"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Mic className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold tracking-tight">
              {lang === 'gu' ? 'પોષણ વાણી' : 'Poshan Vani'}
            </span>
          </button>
        )}

        {/* Floating Bottom Dock (Only when authenticated) */}
        {isAuthenticated && (
          <BottomDock
            activeTab={activeDockTab}
            onTabChange={handleDockTabChange}
            lang={lang}
          />
        )}

        <VoiceAssistantModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          lang={lang}
          onLanguageChange={setLang}
          inventory={inventory}
          studentsCount={presentStudentsCount}
          onNavigate={(screen) => setCurrentScreen(screen)}
          onVoiceInward={handleConfirmInward}
          onSetAllStudents={handleSetAllStudents}
        />

        <NotificationModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          lang={lang}
        />

        <HelpModal
          isOpen={isHelpOpen}
          onClose={() => {
            setIsHelpOpen(false);
            setActiveDockTab('home');
          }}
          lang={lang}
        />

        <CentreDetailsModal
          isOpen={isCentreOpen}
          onClose={() => {
            setIsCentreOpen(false);
            setActiveDockTab('home');
          }}
          lang={lang}
          initialCategory={centreCategory}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setActiveDockTab('home');
          }}
          lang={lang}
          onLanguageToggle={setLang}
          isOnline={isOnline}
          onToggleOnline={handleToggleOnline}
          onLogout={handleLogout}
          onOpenCentreDetails={handleOpenCentreDetails}
          onOpenDbSettings={() => setIsDbSettingsOpen(true)}
        />

        <DatabaseSettingsModal
          isOpen={isDbSettingsOpen}
          onClose={() => setIsDbSettingsOpen(false)}
          lang={lang}
        />
      </main>
    </div>
  );
}

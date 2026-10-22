export type Language = 'en' | 'gu';

export interface InventoryItem {
  id: string;
  nameEn: string;
  nameGu: string;
  category: 'packet' | 'staple';
  unit: string;
  currentStock: number;
  initialStock: number;
  minThreshold: number;
  batchNo: string;
  expiryDate: string;
}

export interface Student {
  id: number;
  rollNo: string;
  name: string;
  nameGu: string;
  age: string;
  gender: 'M' | 'F';
  present: boolean;
  parentName: string;
}

export interface MealMaterialItem {
  id: string;
  nameEn: string;
  nameGu: string;
  gmPerStudent: number;
  totalGm: number;
  totalKg: number;
}

export interface MealDeductionRecord {
  id: string;
  timestamp: string;
  date?: string;
  mealType: 'breakfast' | 'lunch';
  menuName: string;
  studentsPresent: number;
  ratioPerStudentGm: number;
  adjustmentGm?: number;
  materialsUsed: MealMaterialItem[];
  totalQuantityGm: number;
  totalQuantityKg: number;
  workerNote?: string;
  confirmedBy: string;
  supervisorReviewed?: boolean;
}

export interface StockDistributionRecord {
  id: string;
  timestamp: string;
  beneficiaryName: string;
  beneficiaryCategory: string;
  photoUrl?: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  awcId: string;
}

export interface InwardItemDetail {
  itemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  batchNo: string;
  expiryDate: string;
}

export interface StockInwardRecord {
  id: string;
  date: string;
  challanNo: string;
  supplier: string;
  items: InwardItemDetail[];
}

export interface InterAwcTransferRecord {
  id: string;
  date: string;
  timestamp: string;
  verificationCode: string; // e.g. #8491
  sourceAwc: string;
  targetAwc: string;
  peerCentreName: string;
  action: 'given' | 'received'; // given to other center or received
  item: string;
  quantity: number;
  unit: string;
  status: 'verified' | 'completed';
  authorizedBy: string;
}

export interface ExpenseClaimRecord {
  id: string;
  date: string;
  timestamp: string;
  invoiceNumber: string;
  category:
    | 'vegetables'
    | 'spices'
    | 'gas'
    | 'fruits'
    | 'cleaning'
    | 'repairs'
    | 'stationery'
    | 'emergency_food'
    | 'other';
  categoryLabelEn: string;
  categoryLabelGu: string;
  itemName: string;
  vendorName: string;
  vendorContact?: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'bank_transfer';
  billPhotoUrl: string;
  remarks: string;
  workerName: string;
  workerBankName: string;
  workerAccountLast4: string;
  awcCode: string;
  status: 'submitted' | 'approved_by_supervisor' | 'credited_to_bank' | 'rejected';
  utrNumber?: string;
  approvedDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleGu: string;
  message: string;
  messageGu: string;
  time: string;
  read: boolean;
  type: 'urgent' | 'info' | 'success';
}

export interface MealPhotoRecord {
  id: string;
  date: string;
  time: string;
  timestamp: string;
  mealType: 'breakfast' | 'lunch' | 'snack';
  menuName: string;
  childrenCount: number;
  photoUrl: string;
  photoName?: string;
  remarks?: string;
  location: string;
  gpsCoordinates: string;
  awcCode: string;
  workerName: string;
  supervisorName: string;
  status: 'verified' | 'submitted';
}

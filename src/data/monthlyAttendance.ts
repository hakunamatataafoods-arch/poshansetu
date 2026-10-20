import { Student } from '../types';

export interface MonthlyAttendanceRecord {
  monthName: string;
  monthNameGu: string;
  year: number;
  workingDates: string[]; // e.g. ['01-Oct', '02-Oct', '03-Oct', ...]
  studentsAttendance: {
    studentId: number;
    rollNo: string;
    name: string;
    nameGu: string;
    parentName: string;
    age: string;
    gender: 'M' | 'F';
    dailyStatus: Record<string, 'P' | 'A'>; // date -> 'P' or 'A'
    totalPresent: number;
    totalAbsent: number;
    percentage: number;
  }[];
}

// 16 working days in October 2026 up to October 19 (excluding Sundays)
export const OCTOBER_2026_DATES: string[] = [
  '01-Oct',
  '02-Oct',
  '03-Oct',
  '05-Oct',
  '06-Oct',
  '07-Oct',
  '08-Oct',
  '09-Oct',
  '10-Oct',
  '12-Oct',
  '13-Oct',
  '14-Oct',
  '15-Oct',
  '16-Oct',
  '17-Oct',
  '19-Oct' // Today's date (synced live)
];

// Base historical attendance pattern for 10 students (Oct 1 to Oct 17)
const HISTORICAL_PATTERNS: Record<number, Record<string, 'P' | 'A'>> = {
  1: { // Aarav Patel
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'A',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  2: { // Diya Shah
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  3: { // Vihaan Mehta
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'A', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'A', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  4: { // Ananya Joshi
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'A',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'A', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'A', '16-Oct': 'P', '17-Oct': 'P'
  },
  5: { // Kabir Parmar
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'A',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  6: { // Riya Desai
    '01-Oct': 'P', '02-Oct': 'A', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'A', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  7: { // Dev Solanki
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'A', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  8: { // Ishita Vaghela
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'A', '05-Oct': 'P', '06-Oct': 'A',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'A',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  9: { // Rudra Makwana
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'A', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'P', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'A', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  },
  10: { // Priya Chavda
    '01-Oct': 'P', '02-Oct': 'P', '03-Oct': 'P', '05-Oct': 'P', '06-Oct': 'P',
    '07-Oct': 'P', '08-Oct': 'P', '09-Oct': 'P', '10-Oct': 'A', '12-Oct': 'P',
    '13-Oct': 'P', '14-Oct': 'P', '15-Oct': 'P', '16-Oct': 'P', '17-Oct': 'P'
  }
};

/**
 * Computes full monthly attendance register for all students,
 * combining historical records with today's live presence toggle.
 */
export function getMonthlyAttendanceRecord(students: Student[]): MonthlyAttendanceRecord {
  const workingDates = OCTOBER_2026_DATES;
  const todayKey = '19-Oct';

  const studentsAttendance = students.map((s) => {
    const historical = HISTORICAL_PATTERNS[s.id] || {};
    const dailyStatus: Record<string, 'P' | 'A'> = { ...historical };
    
    // Dynamically set today's status based on live state
    dailyStatus[todayKey] = s.present ? 'P' : 'A';

    let totalPresent = 0;
    let totalAbsent = 0;

    workingDates.forEach((date) => {
      const status = dailyStatus[date] || 'P';
      if (status === 'P') {
        totalPresent += 1;
      } else {
        totalAbsent += 1;
      }
    });

    const totalDays = workingDates.length;
    const percentage = Math.round((totalPresent / totalDays) * 100);

    return {
      studentId: s.id,
      rollNo: s.rollNo,
      name: s.name,
      nameGu: s.nameGu,
      parentName: s.parentName,
      age: s.age,
      gender: s.gender,
      dailyStatus,
      totalPresent,
      totalAbsent,
      percentage
    };
  });

  return {
    monthName: 'October 2026',
    monthNameGu: 'ઓક્ટોબર ૨૦૨૬',
    year: 2026,
    workingDates,
    studentsAttendance
  };
}

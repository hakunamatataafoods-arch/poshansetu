import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Clock,
  Package,
  ArrowRightLeft,
  Users,
  Check,
  X,
  FileCheck,
  ShieldCheck,
  Layers,
  Home
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { InventoryItem, StockInwardRecord, InterAwcTransferRecord, Student, Language } from '../types';
import { translations } from '../data/translations';
import { getMonthlyAttendanceRecord, OCTOBER_2026_DATES } from '../data/monthlyAttendance';
import { getPoshanSetuLogoDataUrl } from '../utils/pdfLogo';

export const formatBalance = (val: number): string => {
  if (val === null || val === undefined || isNaN(val)) return '0';
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(3);
};

interface DownloadReportScreenProps {
  onBack: () => void;
  lang: Language;
  inventory: InventoryItem[];
  inwardHistory: StockInwardRecord[];
  transfers: InterAwcTransferRecord[];
  students: Student[];
}

export type ReportScope = 'full' | 'inventory' | 'attendance';

export const DownloadReportScreen: React.FC<DownloadReportScreenProps> = ({
  onBack,
  lang,
  inventory,
  inwardHistory,
  transfers,
  students
}) => {
  const t = translations[lang];

  // Dynamic Current Timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState<string>('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [lastDownloadedFile, setLastDownloadedFile] = useState<string>('');
  
  // Selected Report Scope: Full Data, Only Inventory, Only Attendance
  const [reportScope, setReportScope] = useState<ReportScope>('full');

  const updateTimestamp = () => {
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
    setCurrentTimestamp(formatted);
    return formatted;
  };

  useEffect(() => {
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute calculated metrics
  const presentCount = students.filter((s) => s.present).length;
  const breakfastConsumptionGm = presentCount * 30;
  const lunchConsumptionGm = presentCount * 50;
  const totalMealConsumptionGm = breakfastConsumptionGm + lunchConsumptionGm;

  // Monthly Attendance Calculation
  const monthlyData = getMonthlyAttendanceRecord(students);
  const totalEnrolled = students.length;
  const averageAttendance = Math.round(
    monthlyData.studentsAttendance.reduce((acc, curr) => acc + curr.percentage, 0) /
      monthlyData.studentsAttendance.length
  );

  // Generate Official A4 PDF using jsPDF and autoTable
  const generatePDF = () => {
    const genTime = updateTimestamp();
    
    // A4 Portrait dimensions: 210mm x 297mm
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const isGuj = lang === 'gu';

    // Helper: Add Running Header Banner with PoshanSetu logo on left for subsequent pages
    const addRunningHeader = () => {
      doc.setFillColor(21, 128, 61); // Forest Green
      doc.rect(0, 0, 210, 16, 'F');

      // Poshan Setu Logo on left side
      try {
        const logoUrl = getPoshanSetuLogoDataUrl();
        if (logoUrl) {
          doc.addImage(logoUrl, 'PNG', 10, 1.5, 13, 13);
        }
      } catch (e) {
        console.warn('Logo render error', e);
      }

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('GOVERNMENT OF GUJARAT • POSHANSETU (ICDS) • AWC 04 VADTAL (AWVAD04)', 114, 10, { align: 'center' });
    };

    // Page 1: Header Banner (24mm height with Poshan Setu logo on the left)
    doc.setFillColor(21, 128, 61); // #15803D Forest Green
    doc.rect(0, 0, 210, 24, 'F');

    // Poshan Setu Logo positioned on left side
    try {
      const logoUrl = getPoshanSetuLogoDataUrl();
      if (logoUrl) {
        doc.addImage(logoUrl, 'PNG', 10, 2.5, 19, 19);
      }
    } catch (e) {
      console.warn('Could not add PoshanSetu logo to PDF', e);
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('GOVERNMENT OF GUJARAT • WOMEN & CHILD DEVELOPMENT DEPARTMENT', 114, 8.5, { align: 'center' });
    
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(254, 240, 138); // Soft Gold
    doc.text('POSHANSETU (POSHAN SETU) • ICDS GUJARAT', 114, 14.5, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 252, 231);
    doc.text('INTEGRATED CHILD DEVELOPMENT SERVICES • OFFICIAL AUDIT & INVENTORY LEDGER', 114, 20, { align: 'center' });

    // Document Title based on selected scope
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);

    let docTitle = 'COMPREHENSIVE ANGANWADI PROGRESS & INVENTORY LEDGER (FORM MPR-6)';
    if (reportScope === 'inventory') {
      docTitle = 'OFFICIAL STOCK INVENTORY, BATCH REGISTRY & USAGE REPORT';
    } else if (reportScope === 'attendance') {
      docTitle = 'MONTHLY STUDENT ATTENDANCE & PARTICIPATION REGISTER (FORM MPR-3)';
    }
    doc.text(docTitle, 105, 31, { align: 'center' });

    // Meta Information Box
    doc.setFillColor(244, 250, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(12, 35, 186, 22, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('CENTRE DETAILS:', 16, 40.5);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('04 Vadtal (AWVAD04) • Taluka Anand, Dist. Anand', 48, 40.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('WORKER (AWW):', 16, 46);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('Shrimati Bhavnaben Patel', 48, 46);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('SUPERVISOR:', 16, 51.5);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('Shardaben Shah (Verified Sector Supervisor)', 48, 51.5);

    // Right Column in Meta Box: Exact Generation Time
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(234, 88, 12);
    doc.text('GENERATED AT:', 116, 40.5);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(genTime, 146, 40.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('REPORT SCOPE:', 116, 46);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(
      reportScope === 'full'
        ? 'Full Data (Stock + Attendance)'
        : reportScope === 'inventory'
        ? 'Stock Inventory & Batches Only'
        : 'Student Attendance Register Only',
      146,
      46
    );

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('PERIOD & STATUS:', 116, 51.5);
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.text('October 2026 • Certified Official', 146, 51.5);

    let currentY = 62;

    // =========================================================================
    // SECTION 1 & 2 & 3: INVENTORY, INWARD BATCHES & EXCHANGES (for 'full' or 'inventory')
    // =========================================================================
    if (reportScope === 'full' || reportScope === 'inventory') {
      // 1. INVENTORY BALANCE
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(21, 128, 61);
      doc.text('1. STOCK INVENTORY & CONSUMPTION BALANCE SHEET', 12, currentY);

      const inventoryRows = inventory.map((item) => {
        const used = Math.max(0, item.initialStock - item.currentStock);
        return [
          item.nameEn,
          item.category === 'packet' ? 'THR Packet' : 'Staple Ration',
          item.unit,
          `${formatBalance(item.initialStock)} ${item.unit}`,
          `-${formatBalance(used)} ${item.unit}`,
          `${formatBalance(item.currentStock)} ${item.unit}`,
          item.batchNo,
          item.expiryDate,
          item.currentStock > item.minThreshold ? 'Sufficient' : 'Low Stock'
        ];
      });

      autoTable(doc, {
        startY: currentY + 2.5,
        head: [['Item Name', 'Category', 'Unit', 'Opening', 'Consumed', 'Balance', 'Batch No', 'Expiry', 'Status']],
        body: inventoryRows,
        theme: 'grid',
        styles: {
          fontSize: 7.2,
          cellPadding: 1.5,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [21, 128, 61],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.6
        },
        columnStyles: {
          0: { cellWidth: 32, fontStyle: 'bold' },
          1: { cellWidth: 22 },
          2: { cellWidth: 12, halign: 'center' },
          3: { cellWidth: 20, halign: 'right' },
          4: { cellWidth: 22, halign: 'right', fontStyle: 'bold', textColor: [185, 28, 28] },
          5: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] },
          6: { cellWidth: 20, fontStyle: 'bold', halign: 'center' },
          7: { cellWidth: 16, halign: 'center' },
          8: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }
        },
        margin: { left: 12, right: 12 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 6;

      // 2. STOCK INWARD PURCHASES & BATCH REGISTRY
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(21, 128, 61);
      doc.text('2. STOCK INWARD & PURCHASE BATCH REGISTRY', 12, currentY);

      const inwardRows: any[] = [];
      inwardHistory.forEach((rec) => {
        rec.items.forEach((item) => {
          inwardRows.push([
            rec.date,
            rec.challanNo,
            item.itemName,
            `+${item.quantity} ${item.unit}`,
            item.batchNo,
            item.expiryDate,
            rec.supplier
          ]);
        });
      });

      autoTable(doc, {
        startY: currentY + 2,
        head: [['Purchase Date', 'Challan #', 'Item Inwarded', 'Quantity', 'Batch Number', 'Expiry Date', 'Supplier Godown']],
        body: inwardRows,
        theme: 'grid',
        styles: {
          fontSize: 7.2,
          cellPadding: 1.4,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.8
        },
        columnStyles: {
          0: { cellWidth: 22, fontStyle: 'bold' },
          1: { cellWidth: 22 },
          2: { cellWidth: 32, fontStyle: 'bold' },
          3: { cellWidth: 20, halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] },
          4: { cellWidth: 26, fontStyle: 'bold' },
          5: { cellWidth: 20 },
          6: { cellWidth: 44 }
        },
        margin: { left: 12, right: 12 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 6;

      // Check if page break needed
      if (currentY > 215) {
        doc.addPage();
        addRunningHeader();
        currentY = 22;
      }

      // 3. INTER-AWC EMERGENCY STOCK EXCHANGE REGISTRY
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(21, 128, 61);
      doc.text('3. INTER-AWC EMERGENCY STOCK TRANSFERS & EXCHANGES', 12, currentY);

      const transferRows = transfers.map((tr) => [
        tr.date,
        tr.action === 'given' ? 'GIVEN TO' : 'RECEIVED FROM',
        tr.peerCentreName,
        tr.item,
        `${formatBalance(tr.quantity)} ${tr.unit}`,
        tr.verificationCode,
        tr.authorizedBy,
        'Approved & Synchronized'
      ]);

      autoTable(doc, {
        startY: currentY + 2,
        head: [['Date', 'Exchange Type', 'Peer Anganwadi Centre', 'Item Transferred', 'Quantity', 'Auth Code', 'Supervisor', 'Status']],
        body: transferRows,
        theme: 'grid',
        styles: {
          fontSize: 7.2,
          cellPadding: 1.4,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [234, 88, 12],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.8
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 24, fontStyle: 'bold' },
          2: { cellWidth: 40 },
          3: { cellWidth: 30, fontStyle: 'bold' },
          4: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
          5: { cellWidth: 16, fontStyle: 'bold' },
          6: { cellWidth: 22 },
          7: { cellWidth: 14 }
        },
        margin: { left: 12, right: 12 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 6;

      if (reportScope === 'full') {
        if (currentY > 230) {
          doc.addPage();
          addRunningHeader();
          currentY = 22;
        }

        // 4. DAILY MEAL ATTENDANCE CALCULATIONS
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(21, 128, 61);
        doc.text('4. DAILY MEAL ATTENDANCE & RATIO CALCULATIONS', 12, currentY);

        const mealSummaryRows = [
          ['Meal 1 – Breakfast', 'Sukdi (Atta) / Poha', '30 gm / child', `${presentCount} / 10`, `${breakfastConsumptionGm} gm (${formatBalance(breakfastConsumptionGm / 1000)} kg)`],
          ['Meal 2 – Lunch', 'Vegetable Khichdi (Rice + Dal)', '50 gm / child', `${presentCount} / 10`, `${lunchConsumptionGm} gm (${formatBalance(lunchConsumptionGm / 1000)} kg)`],
          ['Total Daily Cooked Ration', 'Combined Breakfast + Lunch', '80 gm / child', `${presentCount} Students`, `${totalMealConsumptionGm} gm (${formatBalance(totalMealConsumptionGm / 1000)} kg)`]
        ];

        autoTable(doc, {
          startY: currentY + 2,
          head: [['Meal Session', 'Standard Menu', 'Prescribed Ratio Norm', 'Students Present', 'Total Computed Quantity']],
          body: mealSummaryRows,
          theme: 'grid',
          styles: {
            fontSize: 7.2,
            cellPadding: 1.5,
            textColor: [30, 41, 59]
          },
          headStyles: {
            fillColor: [21, 128, 61],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7.8
          },
          columnStyles: {
            0: { fontStyle: 'bold' },
            3: { halign: 'center', fontStyle: 'bold' },
            4: { halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] }
          },
          margin: { left: 12, right: 12 }
        });

        currentY = (doc as any).lastAutoTable.finalY + 7;
      }
    }

    // =========================================================================
    // SECTION: STUDENT MONTHLY ATTENDANCE REGISTER (for 'full' or 'attendance')
    // =========================================================================
    if (reportScope === 'full' || reportScope === 'attendance') {
      if (reportScope === 'full') {
        doc.addPage();
        addRunningHeader();
        currentY = 22;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(21, 128, 61);
      doc.text(
        reportScope === 'full'
          ? '5. STUDENT MONTHLY ATTENDANCE REGISTER (OCTOBER 2026 - FORM MPR-3)'
          : '1. STUDENT MONTHLY ATTENDANCE REGISTER (OCTOBER 2026 - FORM MPR-3)',
        12,
        currentY
      );

      // Attendance Summary Subhead
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Total Enrolled: ${totalEnrolled} • Today Present (19-Oct): ${presentCount} • Monthly Average Attendance: ${averageAttendance}% • Total Working Days: 16`,
        12,
        currentY + 5
      );

      // 1. Roster & Summary Table (Latin text ensures Helvetica renders with zero glyph artifacts)
      const rosterRows = monthlyData.studentsAttendance.map((st) => [
        st.rollNo,
        st.name,
        st.parentName,
        `${st.age} • ${st.gender === 'M' ? 'Boy' : 'Girl'}`,
        st.dailyStatus['19-Oct'] === 'P' ? 'PRESENT' : 'ABSENT',
        `${st.totalPresent} Days`,
        `${st.totalAbsent} Days`,
        `${st.percentage}%`
      ]);

      autoTable(doc, {
        startY: currentY + 7,
        head: [['Roll #', 'Student Name', 'Parent / Guardian', 'Age/Gen', 'Today (19-Oct)', 'Present Days', 'Absent Days', 'Attd %']],
        body: rosterRows,
        theme: 'grid',
        styles: {
          fontSize: 7.2,
          cellPadding: 1.5,
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [21, 128, 61],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7.8
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 46, fontStyle: 'bold' },
          2: { cellWidth: 32 },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 24, halign: 'center', fontStyle: 'bold' },
          5: { cellWidth: 18, halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] },
          6: { cellWidth: 18, halign: 'right', textColor: [185, 28, 28] },
          7: { cellWidth: 18, halign: 'right', fontStyle: 'bold' }
        },
        margin: { left: 12, right: 12 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // 2. Day-by-Day Monthly Presence Grid Table (Which day present / which day absent)
      if (currentY > 215) {
        doc.addPage();
        addRunningHeader();
        currentY = 22;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(21, 128, 61);
      doc.text('DAY-BY-DAY ATTENDANCE LOG (OCTOBER 2026: P = Present, A = Absent)', 12, currentY);

      const dayHeaders = ['Roll', 'Student Name', ...OCTOBER_2026_DATES.map((d) => d.replace('-Oct', ''))];
      const dayRows = monthlyData.studentsAttendance.map((st) => [
        st.rollNo,
        st.name,
        ...OCTOBER_2026_DATES.map((d) => st.dailyStatus[d] || 'P')
      ]);

      autoTable(doc, {
        startY: currentY + 2,
        head: [dayHeaders],
        body: dayRows,
        theme: 'grid',
        styles: {
          fontSize: 6.8,
          cellPadding: 1.2,
          halign: 'center',
          textColor: [30, 41, 59]
        },
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 7
        },
        columnStyles: {
          0: { cellWidth: 10, fontStyle: 'bold' },
          1: { cellWidth: 32, halign: 'left', fontStyle: 'bold' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index >= 2) {
            if (data.cell.raw === 'A') {
              data.cell.styles.textColor = [220, 38, 38];
              data.cell.styles.fontStyle = 'bold';
            } else if (data.cell.raw === 'P') {
              data.cell.styles.textColor = [21, 128, 61];
            }
          }
        },
        margin: { left: 12, right: 12 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // =========================================================================
    // FOOTER: SIGNATURES & VERIFICATION (A4 Safe Height)
    // =========================================================================
    if (currentY > 255) {
      doc.addPage();
      addRunningHeader();
      currentY = 22;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(12, currentY, 198, currentY);
    doc.line(12, currentY, 198, currentY);

    currentY += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('SUBMITTED BY (AWW):', 25, currentY);
    doc.text('VERIFIED & AUDITED BY (SUPERVISOR):', 130, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.text('Shrimati Bhavnaben Patel', 25, currentY);
    doc.text('Shardaben Shah', 130, currentY);

    currentY += 4;
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Anganwadi Worker, 04 Vadtal (AWVAD04)', 25, currentY);
    doc.text('Sector Supervisor, Taluka Anand', 130, currentY);

    // Stamp footer and page number across all pages
    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Official PoshanSetu System Document • Generated on: ${genTime} • Page ${p} of ${totalPages} • A4 Certified No Cuts`,
        105,
        290,
        { align: 'center' }
      );
    }

    // Save with descriptive file name based on scope
    const filePrefix =
      reportScope === 'full'
        ? 'PoshanSetu_Full_Comprehensive_Report'
        : reportScope === 'inventory'
        ? 'PoshanSetu_Stock_Inventory_Report'
        : 'PoshanSetu_Monthly_Attendance_Report';

    const filename = `${filePrefix}_04_Vadtal_AWVAD04_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    setLastDownloadedFile(filename);
    setShowReturnModal(true);

    setDownloadNotice(
      lang === 'gu'
        ? `✓ A4 PDF સફળતાપૂર્વક ડાઉનલોડ થઈ: ${filename} (${genTime})`
        : `✓ Downloaded A4 PDF: ${filename} (Generated at ${genTime})`
    );
    setTimeout(() => setDownloadNotice(null), 6000);
  };

  // Generate Official CSV with UTF-8 BOM
  const generateCSV = () => {
    const genTime = updateTimestamp();
    const rows: string[][] = [];

    // Header
    rows.push(['GOVERNMENT OF GUJARAT - WOMEN & CHILD DEVELOPMENT DEPARTMENT']);
    rows.push([
      reportScope === 'full'
        ? 'POSHANSETU FULL COMPREHENSIVE ANGANWADI LEDGER & ATTENDANCE REGISTER'
        : reportScope === 'inventory'
        ? 'POSHANSETU STOCK INVENTORY, BATCH REGISTRY & USAGE LEDGER'
        : 'POSHANSETU MONTHLY STUDENT ATTENDANCE REGISTER (FORM MPR-3)'
    ]);
    rows.push(['REPORT GENERATION TIMESTAMP', genTime]);
    rows.push(['REPORT SCOPE', reportScope.toUpperCase()]);
    rows.push(['CENTRE NAME', '04 Vadtal (AWVAD04)']);
    rows.push(['TALUKA', 'Taluka Anand']);
    rows.push(['DISTRICT', 'Anand']);
    rows.push(['ANGANWADI WORKER (AWW)', 'Shrimati Bhavnaben Patel']);
    rows.push(['SECTOR SUPERVISOR', 'Shardaben Shah']);
    rows.push([]);

    // 1. INVENTORY (if full or inventory)
    if (reportScope === 'full' || reportScope === 'inventory') {
      rows.push(['--- SECTION 1: STOCK INVENTORY & CONSUMPTION BALANCE SHEET ---']);
      rows.push(['Item ID', 'Item Name', 'Category', 'Unit', 'Opening Stock', 'Used / Consumed', 'Closing Balance', 'Current Batch No', 'Expiry Date', 'Status']);
      inventory.forEach((i) => {
        const used = Math.max(0, i.initialStock - i.currentStock);
        rows.push([
          i.id,
          i.nameEn,
          i.category,
          i.unit,
          formatBalance(i.initialStock),
          formatBalance(used),
          formatBalance(i.currentStock),
          i.batchNo,
          i.expiryDate,
          i.currentStock > i.minThreshold ? 'Sufficient' : 'Low Stock'
        ]);
      });
      rows.push([]);

      rows.push(['--- SECTION 2: STOCK INWARD PURCHASES & BATCH REGISTRY ---']);
      rows.push(['Purchase / Inward Date', 'Challan Number', 'Item Name', 'Quantity Received', 'Unit', 'Batch Number', 'Expiry Date', 'Supplier Godown']);
      inwardHistory.forEach((rec) => {
        rec.items.forEach((item) => {
          rows.push([
            rec.date,
            rec.challanNo,
            item.itemName,
            String(item.quantity),
            item.unit,
            item.batchNo,
            item.expiryDate,
            rec.supplier
          ]);
        });
      });
      rows.push([]);

      rows.push(['--- SECTION 3: INTER-AWC EMERGENCY STOCK TRANSFERS & EXCHANGES ---']);
      rows.push(['Date', 'Exchange Action', 'Source Centre', 'Destination / Peer Centre', 'Item Transferred', 'Quantity', 'Unit', 'Security Auth Code', 'Supervisor Authorization']);
      transfers.forEach((tr) => {
        rows.push([
          tr.date,
          tr.action === 'given' ? 'GIVEN TO OTHER CENTRE' : 'RECEIVED FROM OTHER CENTRE',
          tr.sourceAwc,
          tr.peerCentreName,
          tr.item,
          formatBalance(tr.quantity),
          tr.unit,
          tr.verificationCode,
          tr.authorizedBy
        ]);
      });
      rows.push([]);

      if (reportScope === 'full') {
        rows.push(['--- SECTION 4: DAILY MEAL ATTENDANCE CALCULATIONS ---']);
        rows.push(['Meal Type', 'Standard Menu', 'Norm Ratio', 'Students Present', 'Total Grams', 'Total KG']);
        rows.push(['Meal 1 - Breakfast', 'Sukdi (Atta) / Poha', '30 gm/student', String(presentCount), String(breakfastConsumptionGm), formatBalance(breakfastConsumptionGm / 1000)]);
        rows.push(['Meal 2 - Lunch', 'Vegetable Khichdi (Rice + Dal)', '50 gm/student', String(presentCount), String(lunchConsumptionGm), formatBalance(lunchConsumptionGm / 1000)]);
        rows.push(['Daily Total', 'Cooked Supplementary Nutrition', '80 gm/student', String(presentCount), String(totalMealConsumptionGm), formatBalance(totalMealConsumptionGm / 1000)]);
        rows.push([]);
      }
    }

    // 2. STUDENT ATTENDANCE (if full or attendance)
    if (reportScope === 'full' || reportScope === 'attendance') {
      rows.push([
        reportScope === 'full'
          ? '--- SECTION 5: MONTHLY STUDENT ATTENDANCE REGISTER (OCTOBER 2026 - FORM MPR-3) ---'
          : '--- SECTION 1: MONTHLY STUDENT ATTENDANCE REGISTER (OCTOBER 2026 - FORM MPR-3) ---'
      ]);
      rows.push([
        'Roll No',
        'Student Name (English)',
        'Student Name (Gujarati)',
        'Parent / Guardian',
        'Age',
        'Gender',
        'Today Status (19-Oct)',
        ...OCTOBER_2026_DATES,
        'Total Present Days',
        'Total Absent Days',
        'Attendance %'
      ]);

      monthlyData.studentsAttendance.forEach((st) => {
        rows.push([
          st.rollNo,
          st.name,
          st.nameGu,
          st.parentName,
          st.age,
          st.gender,
          st.dailyStatus['19-Oct'] === 'P' ? 'Present' : 'Absent',
          ...OCTOBER_2026_DATES.map((d) => st.dailyStatus[d] || 'P'),
          String(st.totalPresent),
          String(st.totalAbsent),
          `${st.percentage}%`
        ]);
      });

      rows.push([]);
      rows.push(['ATTENDANCE SUMMARY STATISTICS']);
      rows.push(['Total Enrolled Students', String(totalEnrolled)]);
      rows.push(['Total Students Present Today', String(presentCount)]);
      rows.push(['Total Students Absent Today', String(totalEnrolled - presentCount)]);
      rows.push(['Monthly Average Attendance Rate', `${averageAttendance}%`]);
      rows.push(['Total Working Days in Month', '16 Days']);
    }

    // Build CSV string with quotes & escape
    const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filePrefix =
      reportScope === 'full'
        ? 'PoshanSetu_Full_Comprehensive_Data'
        : reportScope === 'inventory'
        ? 'PoshanSetu_Stock_Inventory_Data'
        : 'PoshanSetu_Monthly_Attendance_Register';

    const filename = `${filePrefix}_04_Vadtal_AWVAD04_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setLastDownloadedFile(filename);
    setShowReturnModal(true);

    setDownloadNotice(
      lang === 'gu'
        ? `✓ CSV સફળતાપૂર્વક ડાઉનલોડ થઈ: ${filename} (${genTime})`
        : `✓ Downloaded CSV: ${filename} (Generated at ${genTime})`
    );
    setTimeout(() => setDownloadNotice(null), 6000);
  };

  return (
    <div className="px-4 pt-1 pb-16 space-y-4">
      {/* Header */}
      <div className="relative flex flex-col items-center no-print">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#EAF7EE] text-[#15803D] flex items-center justify-center hover:bg-[#dcf4e2] transition-colors shadow-2xs"
          aria-label={t.back}
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div className="flex flex-col items-center pt-0.5">
          <PoshanSetuLogo size="sm" />
          <span className="text-[12px] font-semibold text-[#15803D] tracking-tight mt-0.5">
            {t.tagline}
          </span>
        </div>
      </div>

      <div className="text-center pt-1 no-print">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {lang === 'gu' ? 'સત્તાવાર અહેવાલ ડાઉનલોડ' : t.downloadReportSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'A4 Official PDF & Excel CSV with Timestamps and Batches'
            : 'સમય, બેચ નંબર અને માસિક હાજરી સાથે માન્ય A4 PDF અને CSV'}
        </p>
      </div>

      {/* Download Alert Notification */}
      {downloadNotice && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-950 font-bold animate-in fade-in shadow-xs no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Generation Timestamp Live Indicator */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs shadow-2xs no-print">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-700 animate-spin-slow" />
          <span className="text-slate-600 font-semibold">
            {lang === 'en' ? 'Report Timestamp:' : 'અહેવાલ સમય:'}
          </span>
        </div>
        <span className="font-mono font-bold text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
          {currentTimestamp || 'Calculating...'}
        </span>
      </div>

      {/* ==================================================================== */}
      {/* 2 Primary Download Action Buttons (PRINT A4 BUTTON REMOVED AS REQUESTED) */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 gap-3 no-print">
        {/* PDF Download Button */}
        <button
          onClick={generatePDF}
          className="py-3 px-4 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-md shadow-emerald-900/10 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-black leading-tight">
              {lang === 'gu' ? 'PDF ડાઉનલોડ કરો' : 'Download PDF'}
            </span>
            <span className="text-[10px] font-normal opacity-90 block">
              {lang === 'gu' ? 'A4 સાઈઝ • કોઈ કાપ નહીં' : 'A4 Size • No Cuts'}
            </span>
          </div>
        </button>

        {/* CSV Export Button */}
        <button
          onClick={generateCSV}
          className="py-3 px-4 bg-white border border-slate-200/90 hover:bg-slate-50 active:scale-[0.98] transition-all text-slate-800 font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700 stroke-[2.3]" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-black text-slate-900 leading-tight">
              {lang === 'gu' ? 'CSV એક્સપોર્ટ કરો' : 'Export CSV'}
            </span>
            <span className="text-[10px] font-normal text-slate-500 block">
              {lang === 'gu' ? 'એક્સેલ રેડી UTF-8' : 'Excel Ready UTF-8'}
            </span>
          </div>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* REPORT TYPE SELECTOR (User can select what to download) */}
      {/* 1. Full Data (Inventory, Batches, Exchanges, Attendance)              */}
      {/* 2. Only Inventory Report                                             */}
      {/* 3. Only Attendance Report                                            */}
      {/* ==================================================================== */}
      <div className="space-y-2 no-print">
        <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
          {lang === 'gu' ? 'ડાઉનલોડ કરવા માટે રિપોર્ટ પસંદ કરો:' : 'Select Report Option To Download:'}
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {/* Option 1: Full Data Report */}
          <div
            onClick={() => setReportScope('full')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              reportScope === 'full'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  reportScope === 'full' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Layers className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">
                  {lang === 'gu'
                    ? '૧. સંપૂર્ણ ડેટા અહેવાલ (ઇન્વેન્ટરી, બેચ, એક્સચેન્જ અને હાજરી)'
                    : '1. Full Data Report (All Inventory, Batches, Exchanges & Attendance)'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'gu'
                    ? 'સમગ્ર આંગણવાડી ડેટા: સ્ટોક, ખરીદી બેચ, સેતુ શેર અને માસિક હાજરી રજીસ્ટર એકસાથે'
                    : 'Download complete dataset covering all operations in one document'}
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                reportScope === 'full' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'
              }`}
            >
              {reportScope === 'full' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Option 2: Only Inventory Report */}
          <div
            onClick={() => setReportScope('inventory')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              reportScope === 'inventory'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  reportScope === 'inventory' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Package className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">
                  {lang === 'gu'
                    ? '૨. માત્ર સ્ટોક ઇન્વેન્ટરી અહેવાલ'
                    : '2. Only Download Inventory Report'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'gu'
                    ? 'શરૂઆતનો સ્ટોક, વપરાશ, બાકી જથ્થો, બેચ નંબર અને સેતુ શેર આપ-લે'
                    : 'Opening balance, consumption, closing stock, batch numbers & expiry'}
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                reportScope === 'inventory' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'
              }`}
            >
              {reportScope === 'inventory' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>

          {/* Option 3: Only Attendance Report */}
          <div
            onClick={() => setReportScope('attendance')}
            className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              reportScope === 'attendance'
                ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  reportScope === 'attendance' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">
                  {lang === 'gu'
                    ? '૩. માત્ર વિદ્યાર્થીઓની માસિક હાજરી અહેવાલ'
                    : '3. Only Download Attendance Report'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {lang === 'gu'
                    ? 'દરેક બાળકની દૈનિક હાજરી, કયા દિવસે હાજર/ગેરહાજર રહ્યા તેની તારીખવાર નોંધ'
                    : 'Full monthly attendance register covering every day present or absent'}
                </span>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                reportScope === 'attendance' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'
              }`}
            >
              {reportScope === 'attendance' && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* Complete A4 Sheet Document Preview (Displays Selected Report) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-sm space-y-4 text-slate-900 text-xs">
        {/* Gujarat Government Official Header with Logos */}
        <div className="border-b-2 border-emerald-800 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#EAF7EE] border border-emerald-300 flex items-center justify-center p-1 shrink-0">
                <PoshanSetuLogo size="compact" />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 block">
                  Government of Gujarat • ICDS
                </span>
                <span className="text-xs font-black text-slate-900 block">
                  પોષણ સેતુ • PoshanSetu Official Ledger
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Certified A4 MPR
              </span>
            </div>
          </div>

          <div className="text-center pt-1 space-y-1">
            <h2 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
              {reportScope === 'full' &&
                'PoshanSetu (પોષણ સેતુ) • Comprehensive Anganwadi Ledger & Attendance (Form MPR-6)'}
              {reportScope === 'inventory' &&
                'PoshanSetu (પોષણ સેતુ) • Stock Inventory & Batch Registry Ledger'}
              {reportScope === 'attendance' &&
                'PoshanSetu (પોષણ સેતુ) • Monthly Student Attendance Register (Form MPR-3)'}
            </h2>

            {/* Aligned 2x2 Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-left mt-2">
              <div>
                <span className="text-slate-500 font-medium block text-[9.5px]">AWC Centre:</span>
                <strong className="text-slate-900 font-bold">04 Vadtal (AWVAD04)</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[9.5px]">Taluka & District:</span>
                <strong className="text-slate-900 font-bold">Anand, Gujarat</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[9.5px]">Worker (AWW):</span>
                <strong className="text-slate-900 font-bold">Shrimati Bhavnaben Patel</strong>
              </div>
              <div>
                <span className="text-slate-500 font-medium block text-[9.5px]">Sector Supervisor:</span>
                <strong className="text-slate-900 font-bold">Shardaben Shah (Verified)</strong>
              </div>
            </div>

            <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mt-1 border border-amber-200">
              Certified Generated at: {currentTimestamp}
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* SECTION 1: STOCK INVENTORY & CONSUMPTION (for Full or Inventory) */}
        {/* ================================================================== */}
        {(reportScope === 'full' || reportScope === 'inventory') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. Stock Inventory & Consumption Balance Sheet</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Month: October 2026</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[460px]">
                <thead>
                  <tr className="bg-[#15803D] text-white text-[10.5px]">
                    <th className="py-2 px-2.5">Item Name</th>
                    <th className="py-2 px-2 text-right">Opening</th>
                    <th className="py-2 px-2 text-right">Consumed</th>
                    <th className="py-2 px-2 text-right">Balance</th>
                    <th className="py-2 px-2">Batch No</th>
                    <th className="py-2 px-2">Expiry</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {inventory.map((item) => {
                    const used = Math.max(0, item.initialStock - item.currentStock);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80">
                        <td className="py-2 px-2.5 font-bold text-slate-900">
                          {lang === 'en' ? item.nameEn : item.nameGu}
                        </td>
                        <td className="py-2 px-2 text-right text-slate-600 tabular-nums">
                          {formatBalance(item.initialStock)} {item.unit}
                        </td>
                        <td className="py-2 px-2 text-right text-rose-600 font-bold tabular-nums">
                          -{formatBalance(used)} {item.unit}
                        </td>
                        <td className="py-2 px-2 text-right font-black text-[#15803D] tabular-nums">
                          {formatBalance(item.currentStock)} {item.unit}
                        </td>
                        <td className="py-2 px-2 font-mono text-[11px] text-slate-700 font-semibold">
                          {item.batchNo}
                        </td>
                        <td className="py-2 px-2 text-[11px] text-slate-600 font-semibold">
                          {item.expiryDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 2: STOCK INWARD PURCHASES & BATCHES (for Full or Inventory) */}
        {/* ================================================================== */}
        {(reportScope === 'full' || reportScope === 'inventory') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-700" />
                <span>2. Stock Purchases & Inward Consignment Registry</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">All Batches Recorded</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-800 text-white text-[10px]">
                    <th className="py-2 px-2.5">Purchase Date</th>
                    <th className="py-2 px-2">Challan #</th>
                    <th className="py-2 px-2.5">Item Name</th>
                    <th className="py-2 px-2 text-right">Inward Qty</th>
                    <th className="py-2 px-2">Batch Number</th>
                    <th className="py-2 px-2">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {inwardHistory.flatMap((rec) =>
                    rec.items.map((item, idx) => (
                      <tr key={`${rec.id}-${item.itemId}-${idx}`} className="hover:bg-slate-50/80">
                        <td className="py-1.5 px-2.5 font-bold text-slate-800 whitespace-nowrap">
                          {rec.date}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-[10px] text-slate-600">
                          {rec.challanNo}
                        </td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900">
                          {item.itemName}
                        </td>
                        <td className="py-1.5 px-2 text-right font-black text-emerald-700 tabular-nums whitespace-nowrap">
                          +{item.quantity} {item.unit}
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-slate-800">
                          {item.batchNo}
                        </td>
                        <td className="py-1.5 px-2 text-slate-600">
                          {item.expiryDate}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Supplier: District Food & Civil Supplies Godown, Anand • Form-6 Certified
            </p>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 3: INTER-AWC TRANSFERS & EXCHANGES (for Full or Inventory) */}
        {/* ================================================================== */}
        {(reportScope === 'full' || reportScope === 'inventory') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-[#EA580C] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>3. Inter-AWC Emergency Stock Transfer & Exchange Record</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Supervisor PIN #8491
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[480px]">
                <thead>
                  <tr className="bg-[#EA580C] text-white text-[10px]">
                    <th className="py-2 px-2.5">Date</th>
                    <th className="py-2 px-2">Action</th>
                    <th className="py-2 px-2.5">Peer Anganwadi Centre</th>
                    <th className="py-2 px-2">Item Exchanged</th>
                    <th className="py-2 px-2 text-right">Quantity</th>
                    <th className="py-2 px-2">Auth Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {transfers.map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50/80">
                      <td className="py-2 px-2.5 text-slate-700 whitespace-nowrap font-bold">
                        {tr.date}
                      </td>
                      <td className="py-2 px-2 whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-black uppercase ${
                            tr.action === 'given'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {tr.action === 'given' ? 'Given to' : 'Received from'}
                        </span>
                      </td>
                      <td className="py-2 px-2.5 font-bold text-slate-900">
                        {tr.peerCentreName}
                      </td>
                      <td className="py-2 px-2 text-slate-800 font-semibold">
                        {tr.item}
                      </td>
                      <td className="py-2 px-2 text-right font-black text-slate-900 tabular-nums whitespace-nowrap">
                        {formatBalance(tr.quantity)} {tr.unit}
                      </td>
                      <td className="py-2 px-2 font-mono font-bold text-amber-900">
                        {tr.verificationCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION: STUDENT MONTHLY ATTENDANCE REGISTER (Full or Attendance)  */}
        {/* ================================================================== */}
        {(reportScope === 'full' || reportScope === 'attendance') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {reportScope === 'full'
                    ? '4. Student Monthly Attendance Register (Form MPR-3)'
                    : '1. Student Monthly Attendance Register (Form MPR-3)'}
                </span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Month: October 2026
              </span>
            </div>

            {/* Attendance Overview Card */}
            <div className="grid grid-cols-4 gap-2 bg-[#F4FAF4] p-2.5 rounded-2xl border border-emerald-200 text-center shadow-2xs">
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Enrolled</span>
                <span className="text-sm font-black text-slate-900">{totalEnrolled}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Today Present</span>
                <span className="text-sm font-black text-emerald-700">{presentCount}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Today Absent</span>
                <span className="text-sm font-black text-rose-600">{totalEnrolled - presentCount}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-500 font-semibold">Monthly Avg</span>
                <span className="text-sm font-black text-teal-800">{averageAttendance}%</span>
              </div>
            </div>

            {/* Attendance Summary Roster Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-[#15803D] text-white text-[10px]">
                    <th className="py-2 px-2 text-center">Roll</th>
                    <th className="py-2 px-2.5">Student Name</th>
                    <th className="py-2 px-2">Parent Name</th>
                    <th className="py-2 px-1 text-center">Age</th>
                    <th className="py-2 px-2 text-center">Today (19-Oct)</th>
                    <th className="py-2 px-2 text-right">Present</th>
                    <th className="py-2 px-2 text-right">Absent</th>
                    <th className="py-2 px-2 text-right">Attd %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {monthlyData.studentsAttendance.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80">
                      <td className="py-2 px-2 text-center font-bold text-slate-600">
                        {st.rollNo}
                      </td>
                      <td className="py-2 px-2.5 font-bold text-slate-900">
                        <span>{st.name}</span>
                        <span className="block text-[9.5px] text-slate-500 font-normal">
                          {st.nameGu}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-slate-600">
                        {st.parentName}
                      </td>
                      <td className="py-2 px-1 text-center text-slate-600">
                        {st.age}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.dailyStatus['19-Oct'] === 'P'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.dailyStatus['19-Oct'] === 'P' ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-700">
                        {st.totalPresent} d
                      </td>
                      <td className="py-2 px-2 text-right text-rose-600">
                        {st.totalAbsent} d
                      </td>
                      <td className="py-2 px-2 text-right font-black text-slate-900">
                        {st.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detailed Day-by-Day Monthly Register with Sticky Student Column */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">
                  {lang === 'gu'
                    ? 'દૈનિક હાજરી પત્રક (ઓક્ટોબર ૨૦૨૬: P = હાજર, A = ગેરહાજર)'
                    : 'Day-by-Day Monthly Log (October 2026: P = Present, A = Absent)'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {lang === 'gu' ? '← તારીખો જોવા સ્ક્રોલ કરો →' : '← Scroll to view dates →'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-center text-[10px] border-collapse min-w-[540px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="py-2 px-2.5 text-left sticky left-0 bg-slate-800 z-10 shadow-sm whitespace-nowrap">
                        Roll & Student
                      </th>
                      {OCTOBER_2026_DATES.map((date) => (
                        <th key={date} className="py-2 px-1 font-mono text-[9px] whitespace-nowrap">
                          {date.replace('-Oct', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {monthlyData.studentsAttendance.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2.5 text-left font-bold text-slate-900 whitespace-nowrap sticky left-0 bg-white z-10 shadow-xs border-r border-slate-100">
                          {st.rollNo}. {st.name.split(' ')[0]}
                        </td>
                        {OCTOBER_2026_DATES.map((date) => {
                          const status = st.dailyStatus[date];
                          return (
                            <td key={date} className="py-1.5 px-1">
                              <span
                                className={`inline-block w-4 h-4 rounded text-[9.5px] font-bold leading-4 ${
                                  status === 'P'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SIGNATURES SECTION */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs avoid-break">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-500">
              Anganwadi Worker (AWW)
            </span>
            <span className="font-black text-slate-900 text-sm">
              Shrimati Bhavnaben Patel
            </span>
            <span className="block text-[10px] text-emerald-700 font-semibold">
              ✓ Digital Certified
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-500">
              Sector Supervisor
            </span>
            <span className="font-black text-slate-900 text-sm">
              Shardaben Shah
            </span>
            <span className="block text-[10px] text-emerald-700 font-semibold">
              ✓ Audit Verified
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Buttons for Export (Two Buttons Only) */}
      <div className="grid grid-cols-2 gap-3 pt-2 no-print">
        <button
          onClick={generatePDF}
          className="h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.3]" />
          <span>{lang === 'gu' ? 'PDF ડાઉનલોડ કરો' : `${t.downloadPDF} (A4)`}</span>
        </button>

        <button
          onClick={generateCSV}
          className="h-12 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700 stroke-[2.3]" />
          <span>{lang === 'gu' ? 'CSV એક્સપોર્ટ કરો' : t.exportExcel}</span>
        </button>
      </div>

      {/* Return to Home Page Button */}
      <div className="pt-2 no-print">
        <button
          onClick={onBack}
          className="w-full py-3 bg-[#EAF7EE] hover:bg-[#dcf4e2] text-[#15803D] border border-emerald-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
        >
          <Home className="w-4 h-4 stroke-[2.2]" />
          <span>{lang === 'gu' ? 'મુખ્ય પેજ પર પાછા જાઓ' : 'Return to Home Page'}</span>
        </button>
      </div>

      {/* Return to Home Page Modal after Process Completion */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-100 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'gu' ? 'અહેવાલ સફળતાપૂર્વક ડાઉનલોડ થયો છે!' : 'Report Downloaded Successfully!'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {lang === 'gu'
                  ? 'ફાઇલ તમારા ઉપકરણમાં સેવ થઈ ગઈ છે. શું તમે મુખ્ય પેજ પર પાછા જવા માંગો છો?'
                  : 'The report has been saved to your device. Would you like to return to the home page?'}
              </p>
            </div>

            {lastDownloadedFile && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 truncate">
                {lastDownloadedFile}
              </div>
            )}

            <div className="space-y-2 pt-1">
              <button
                onClick={onBack}
                className="w-full py-3.5 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Home className="w-4 h-4 stroke-[2.2]" />
                <span>{lang === 'gu' ? 'મુખ્ય પેજ પર પાછા જાઓ' : 'Return to Home Page'}</span>
              </button>

              <button
                onClick={() => setShowReturnModal(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'gu' ? 'અહેવાલ પેજ પર રહો' : 'Stay on Reports Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

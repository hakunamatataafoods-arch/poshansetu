import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Calendar,
  Building,
  Clock,
  ShieldCheck,
  Package,
  ArrowRightLeft,
  FileText,
  AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PoshanSetuLogo } from '../components/PoshanSetuLogo';
import { InventoryItem, StockInwardRecord, InterAwcTransferRecord, Student, Language } from '../types';
import { translations } from '../data/translations';

interface DownloadReportScreenProps {
  onBack: () => void;
  lang: Language;
  inventory: InventoryItem[];
  inwardHistory: StockInwardRecord[];
  transfers: InterAwcTransferRecord[];
  students: Student[];
}

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
  const [activeTab, setActiveTab] = useState<'all' | 'stock' | 'inward' | 'exchanges'>('all');

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

  // Generate Official A4 PDF using jsPDF and autoTable
  const generatePDF = () => {
    const genTime = updateTimestamp();
    
    // A4 Portrait dimensions: 210mm x 297mm
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [21, 128, 61]; // #15803D Forest Green
    const secondaryColor = [234, 88, 12]; // #EA580C Saffron Orange
    const darkSlate = [30, 41, 59]; // #1E293B

    // Header Banner
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 210, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('GOVERNMENT OF GUJARAT • WOMEN & CHILD DEVELOPMENT DEPARTMENT', 105, 8, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('POSHANSETU (POSHAN SETU) • INTEGRATED CHILD DEVELOPMENT SERVICES (ICDS)', 105, 14, { align: 'center' });

    // Document Title & Generation Timestamp
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('MONTHLY PROGRESS & STOCK CONSUMPTION LEDGER (FORM MPR-6)', 105, 29, { align: 'center' });

    // Meta Information Box
    doc.setFillColor(244, 250, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(12, 33, 186, 22, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('CENTRE DETAILS:', 16, 38);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('04 Vadtal (AWVAD04) • Taluka Anand, Dist. Anand', 46, 38);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('WORKER (AWW):', 16, 44);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('Shrimati Bhavnaben Patel', 46, 44);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('SUPERVISOR:', 16, 50);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('Shardaben Shah (Verified)', 46, 50);

    // Right Column in Meta Box: Exact Generation Time
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(234, 88, 12);
    doc.text('GENERATION TIME:', 116, 38);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text(genTime, 148, 38);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('REPORT PERIOD:', 116, 44);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'normal');
    doc.text('October 2026 (Daily Sync)', 148, 44);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text('AUDIT STATUS:', 116, 50);
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL VERIFIED (A4 OK)', 148, 50);

    let currentY = 58;

    // SECTION 1: INVENTORY & CONSUMPTION BALANCE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(21, 128, 61);
    doc.text('1. STOCK INVENTORY & CONSUMPTION BALANCE SHEET', 12, currentY);

    const inventoryRows = inventory.map((item) => {
      const used = Math.max(0, item.initialStock - item.currentStock);
      return [
        item.nameEn,
        item.category === 'packet' ? 'THR Packet' : 'Staple Ration',
        item.unit,
        `${item.initialStock} ${item.unit}`,
        `-${used.toFixed(1)} ${item.unit}`,
        `${item.currentStock.toFixed(1)} ${item.unit}`,
        item.batchNo,
        item.expiryDate,
        item.currentStock > item.minThreshold ? 'Sufficient' : 'Low Stock'
      ];
    });

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Item Name', 'Category', 'Unit', 'Opening', 'Consumed/Used', 'Closing Balance', 'Current Batch', 'Expiry', 'Status']],
      body: inventoryRows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 1.5,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [21, 128, 61],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 34, fontStyle: 'bold' },
        3: { halign: 'right' },
        4: { halign: 'right', textColor: [185, 28, 28] },
        5: { halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] },
        6: { fontStyle: 'bold' }
      },
      margin: { left: 12, right: 12 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;

    // SECTION 2: STOCK INWARD PURCHASES & BATCH REGISTRY
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
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
        cellPadding: 1.5,
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

    currentY = (doc as any).lastAutoTable.finalY + 7;

    // Check if new page is needed for Section 3
    if (currentY > 215) {
      doc.addPage();
      currentY = 20;
    }

    // SECTION 3: INTER-AWC EMERGENCY STOCK EXCHANGE REGISTRY
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(21, 128, 61);
    doc.text('3. INTER-AWC EMERGENCY STOCK TRANSFERS & EXCHANGES', 12, currentY);

    const transferRows = transfers.map((tr) => [
      tr.date,
      tr.action === 'given' ? 'GIVEN TO' : 'RECEIVED FROM',
      tr.peerCentreName,
      tr.item,
      `${tr.quantity} ${tr.unit}`,
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
        cellPadding: 1.5,
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

    currentY = (doc as any).lastAutoTable.finalY + 7;

    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }

    // SECTION 4: DAILY MEAL USAGE REGISTER (BREAKFAST 30G & LUNCH 50G)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(21, 128, 61);
    doc.text('4. DAILY MEAL ATTENDANCE & PRESCRIBED NORMS CALCULATION', 12, currentY);

    const mealSummaryRows = [
      ['Meal 1 – Breakfast', 'Sukdi (Atta) / Poha', '30 gm / child', `${presentCount} / 10`, `${breakfastConsumptionGm} gm (0.30 kg)`],
      ['Meal 2 – Lunch', 'Vegetable Khichdi (Rice + Dal)', '50 gm / child', `${presentCount} / 10`, `${lunchConsumptionGm} gm (0.50 kg)`],
      ['Total Daily Cooked Ration', 'Combined Breakfast + Lunch', '80 gm / child', `${presentCount} Students`, `${totalMealConsumptionGm} gm (0.80 kg)`]
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Meal Session', 'Standard Menu', 'Prescribed Ratio Norm', 'Students Present', 'Total Computed Quantity']],
      body: mealSummaryRows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
        textColor: [30, 41, 59]
      },
      headStyles: {
        fillColor: [21, 128, 61],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        3: { halign: 'center', fontStyle: 'bold' },
        4: { halign: 'right', fontStyle: 'bold', textColor: [21, 128, 61] }
      },
      margin: { left: 12, right: 12 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;

    if (currentY > 260) {
      doc.addPage();
      currentY = 25;
    }

    // SECTION 5: SIGNATURES & OFFICIAL VERIFICATION FOOTER
    doc.setDrawColor(203, 213, 225);
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

    currentY += 8;
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Official PoshanSetu System Document • Generated on: ${genTime} • Page ${doc.getNumberOfPages()} of ${doc.getNumberOfPages()} • A4 Certified No Cuts`, 105, 290, { align: 'center' });

    // Download PDF directly
    const filename = `PoshanSetu_Report_04_Vadtal_AWVAD04_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);

    setDownloadNotice(`✓ Downloaded A4 PDF: ${filename} (Generated at ${genTime})`);
    setTimeout(() => setDownloadNotice(null), 6000);
  };

  // Generate Official CSV with UTF-8 BOM
  const generateCSV = () => {
    const genTime = updateTimestamp();
    const rows: string[][] = [];

    // Header
    rows.push(['GOVERNMENT OF GUJARAT - WOMEN & CHILD DEVELOPMENT DEPARTMENT']);
    rows.push(['POSHANSETU OFFICIAL ANGANWADI STOCK & RATION CONSUMPTION LEDGER (FORM MPR-6)']);
    rows.push(['REPORT GENERATION TIMESTAMP', genTime]);
    rows.push(['CENTRE NAME', '04 Vadtal (AWVAD04)']);
    rows.push(['TALUKA', 'Taluka Anand']);
    rows.push(['DISTRICT', 'Anand']);
    rows.push(['ANGANWADI WORKER (AWW)', 'Shrimati Bhavnaben Patel']);
    rows.push(['SECTOR SUPERVISOR', 'Shardaben Shah']);
    rows.push([]);

    // SECTION 1: INVENTORY BALANCE
    rows.push(['--- SECTION 1: STOCK INVENTORY & CONSUMPTION BALANCE SHEET ---']);
    rows.push(['Item ID', 'Item Name', 'Category', 'Unit', 'Opening Stock', 'Used / Consumed', 'Closing Balance', 'Current Batch No', 'Expiry Date', 'Status']);
    inventory.forEach((i) => {
      const used = Math.max(0, i.initialStock - i.currentStock);
      rows.push([
        i.id,
        i.nameEn,
        i.category,
        i.unit,
        String(i.initialStock),
        String(used.toFixed(1)),
        String(i.currentStock.toFixed(1)),
        i.batchNo,
        i.expiryDate,
        i.currentStock > i.minThreshold ? 'Sufficient' : 'Low Stock'
      ]);
    });
    rows.push([]);

    // SECTION 2: STOCK INWARD PURCHASES & BATCH REGISTRY
    rows.push(['--- SECTION 2: STOCK INWARD & PURCHASE BATCH REGISTRY ---']);
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

    // SECTION 3: INTER-AWC EMERGENCY STOCK TRANSFERS & EXCHANGES
    rows.push(['--- SECTION 3: INTER-AWC EMERGENCY STOCK TRANSFERS & EXCHANGES ---']);
    rows.push(['Date', 'Exchange Action', 'Source Centre', 'Destination / Peer Centre', 'Item Transferred', 'Quantity', 'Unit', 'Security Auth Code', 'Supervisor Authorization']);
    transfers.forEach((tr) => {
      rows.push([
        tr.date,
        tr.action === 'given' ? 'GIVEN TO OTHER CENTRE' : 'RECEIVED FROM OTHER CENTRE',
        tr.sourceAwc,
        tr.peerCentreName,
        tr.item,
        String(tr.quantity),
        tr.unit,
        tr.verificationCode,
        tr.authorizedBy
      ]);
    });
    rows.push([]);

    // SECTION 4: DAILY MEAL ATTENDANCE CALCULATIONS
    rows.push(['--- SECTION 4: DAILY MEAL ATTENDANCE & RATIO CALCULATIONS ---']);
    rows.push(['Meal Type', 'Standard Menu', 'Norm Ratio', 'Students Present', 'Total Grams', 'Total KG']);
    rows.push(['Meal 1 - Breakfast', 'Sukdi (Atta) / Poha', '30 gm/student', String(presentCount), String(breakfastConsumptionGm), String((breakfastConsumptionGm / 1000).toFixed(2))]);
    rows.push(['Meal 2 - Lunch', 'Vegetable Khichdi (Rice + Dal)', '50 gm/student', String(presentCount), String(lunchConsumptionGm), String((lunchConsumptionGm / 1000).toFixed(2))]);
    rows.push(['Daily Total', 'Cooked Supplementary Nutrition', '80 gm/student', String(presentCount), String(totalMealConsumptionGm), String((totalMealConsumptionGm / 1000).toFixed(2))]);

    // Build CSV string with quotes & escape
    const csvContent = '\uFEFF' + rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `PoshanSetu_Stock_Ledger_04_Vadtal_AWVAD04_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadNotice(`✓ Downloaded CSV: ${filename} (Generated at ${genTime})`);
    setTimeout(() => setDownloadNotice(null), 6000);
  };

  // Trigger Native A4 Print (Zero cuts with dedicated print stylesheet)
  const handlePrintA4 = () => {
    updateTimestamp();
    window.print();
  };

  return (
    <div className="px-4 pt-1 pb-12 space-y-4">
      {/* Header (Hidden when printing) */}
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
          {t.downloadReportSingle}
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">
          {lang === 'en'
            ? 'Official Form-6 MIS Progress Report & Stock Consumption'
            : 'મહિલા અને બાળ વિકાસ વિભાગ સત્તાવાર ફોર્મ-૬ સ્ટોક રજિસ્ટર'}
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

      {/* Action Download Buttons Grid (Top Access) */}
      <div className="grid grid-cols-3 gap-2 no-print">
        {/* PDF Download Button */}
        <button
          onClick={generatePDF}
          className="py-3 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-xs rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.3]" />
          <span>Download PDF</span>
          <span className="text-[9.5px] font-normal opacity-90">(A4 Format)</span>
        </button>

        {/* CSV Export Button */}
        <button
          onClick={generateCSV}
          className="py-3 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all text-slate-800 font-bold text-xs rounded-2xl flex flex-col items-center justify-center gap-1 shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700 stroke-[2.3]" />
          <span>Export CSV</span>
          <span className="text-[9.5px] font-normal text-slate-500">(Excel Ready)</span>
        </button>

        {/* Print / Save A4 Button */}
        <button
          onClick={handlePrintA4}
          className="py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] transition-all text-white font-bold text-xs rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 stroke-[2.3]" />
          <span>Print A4</span>
          <span className="text-[9.5px] font-normal opacity-90">(Zero Cuts)</span>
        </button>
      </div>

      {/* Filter Tabs for Easy Navigation */}
      <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-center text-xs font-bold no-print">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-1.5 rounded-xl transition-all ${
            activeTab === 'all' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Full A4
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`py-1.5 rounded-xl transition-all ${
            activeTab === 'stock' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('inward')}
          className={`py-1.5 rounded-xl transition-all ${
            activeTab === 'inward' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Batches
        </button>
        <button
          onClick={() => setActiveTab('exchanges')}
          className={`py-1.5 rounded-xl transition-all ${
            activeTab === 'exchanges' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
          }`}
        >
          Exchanges
        </button>
      </div>

      {/* Complete A4 Sheet Document Preview (Strict A4 Layout Without Cuts) */}
      <div className="a4-print-container bg-white rounded-3xl p-4.5 border border-slate-200/90 shadow-sm space-y-4 text-slate-900 text-xs">
        {/* Gujarat Government Official Header */}
        <div className="text-center border-b-2 border-emerald-800 pb-3 space-y-1">
          <span className="text-[9.5px] font-black uppercase tracking-widest text-emerald-800 block">
            Government of Gujarat • Women & Child Development Department
          </span>
          <h2 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
            PoshanSetu (પોષણ સેતુ) • Anganwadi Stock & Consumption Ledger (Form MPR-6)
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10.5px] text-slate-600 font-semibold pt-0.5">
            <span>AWC: <strong>04 Vadtal (AWVAD04)</strong></span>
            <span>•</span>
            <span>Taluka: <strong>Anand</strong></span>
            <span>•</span>
            <span>Worker: <strong>Shrimati Bhavnaben Patel</strong></span>
            <span>•</span>
            <span>Supervisor: <strong>Shardaben Shah</strong></span>
          </div>
          <div className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-1 border border-amber-200">
            Certified Generated at: {currentTimestamp}
          </div>
        </div>

        {/* SECTION 1: STOCK INVENTORY & CONSUMPTION BALANCE */}
        {(activeTab === 'all' || activeTab === 'stock') && (
          <div className="space-y-2 avoid-break">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. Stock Inventory & Consumption Balance Sheet</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">Month: October 2026</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
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
                          {item.initialStock} {item.unit}
                        </td>
                        <td className="py-2 px-2 text-right text-rose-600 font-bold tabular-nums">
                          -{used.toFixed(1)} {item.unit}
                        </td>
                        <td className="py-2 px-2 text-right font-black text-[#15803D] tabular-nums">
                          {item.currentStock.toFixed(1)} {item.unit}
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

        {/* SECTION 2: STOCK INWARD PURCHASES & BATCH REGISTRY */}
        {(activeTab === 'all' || activeTab === 'inward') && (
          <div className="space-y-2 avoid-break">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-700" />
                <span>2. Stock Purchases & Inward Consignment Registry</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500">All Batches Recorded</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[10px]">
                    <th className="py-1.5 px-2">Purchase Date</th>
                    <th className="py-1.5 px-2">Challan #</th>
                    <th className="py-1.5 px-2">Item Name</th>
                    <th className="py-1.5 px-2 text-right">Inward Qty</th>
                    <th className="py-1.5 px-2">Batch Number</th>
                    <th className="py-1.5 px-2">Expiry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {inwardHistory.flatMap((rec) =>
                    rec.items.map((item, idx) => (
                      <tr key={`${rec.id}-${item.itemId}-${idx}`} className="hover:bg-slate-50/80">
                        <td className="py-1.5 px-2 font-bold text-slate-800 whitespace-nowrap">
                          {rec.date}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-[10px] text-slate-600">
                          {rec.challanNo}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-slate-900">
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
              Supplier: District Food & Civil Supplies Godown, Anand • Form-6 Ledger Entry Certified
            </p>
          </div>
        )}

        {/* SECTION 3: INTER-AWC EMERGENCY STOCK EXCHANGE RECORD */}
        {(activeTab === 'all' || activeTab === 'exchanges') && (
          <div className="space-y-2 avoid-break">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xs text-[#EA580C] uppercase tracking-wider flex items-center gap-1.5">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>3. Inter-AWC Emergency Stock Transfer & Exchange Record</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Auth Code: #8491
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#EA580C] text-white text-[10px]">
                    <th className="py-1.5 px-2">Date</th>
                    <th className="py-1.5 px-2">Action</th>
                    <th className="py-1.5 px-2">Peer Anganwadi Centre</th>
                    <th className="py-1.5 px-2">Item Exchanged</th>
                    <th className="py-1.5 px-2 text-right">Quantity</th>
                    <th className="py-1.5 px-2">Auth Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[11px]">
                  {transfers.map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50/80">
                      <td className="py-2 px-2 text-slate-700 whitespace-nowrap font-bold">
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
                      <td className="py-2 px-2 font-bold text-slate-900">
                        {tr.peerCentreName}
                      </td>
                      <td className="py-2 px-2 text-slate-800 font-semibold">
                        {tr.item}
                      </td>
                      <td className="py-2 px-2 text-right font-black text-slate-900 tabular-nums whitespace-nowrap">
                        {tr.quantity} {tr.unit}
                      </td>
                      <td className="py-2 px-2 font-mono font-bold text-amber-900">
                        {tr.verificationCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              All transfers verified with Supervisor Shardaben Shah's Authorization PIN #8491.
            </p>
          </div>
        )}

        {/* SECTION 4: DAILY MEAL NORMS SUMMARY */}
        <div className="p-3 bg-[#F0FDF4] rounded-2xl border border-emerald-200 space-y-1.5 avoid-break">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
            <span>Daily Supplementary Nutrition Cooked Consumption:</span>
            <span>{presentCount} / 10 Children Present</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
            <div className="p-2 bg-white rounded-xl border border-emerald-100">
              <span className="font-bold text-slate-900 block">Meal 1 – Breakfast (30 gm)</span>
              <span>{presentCount} students × 30 gm = <strong>{breakfastConsumptionGm} gm</strong></span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-emerald-100">
              <span className="font-bold text-slate-900 block">Meal 2 – Lunch (50 gm)</span>
              <span>{presentCount} students × 50 gm = <strong>{lunchConsumptionGm} gm</strong></span>
            </div>
          </div>
        </div>

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

      {/* Floating Bottom Action Buttons for Export */}
      <div className="grid grid-cols-2 gap-3 pt-2 no-print">
        <button
          onClick={generatePDF}
          className="h-12 bg-[#15803D] hover:bg-[#166534] active:scale-[0.98] transition-all text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.3]" />
          <span>{t.downloadPDF} (A4)</span>
        </button>

        <button
          onClick={generateCSV}
          className="h-12 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition-all font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700 stroke-[2.3]" />
          <span>{t.exportExcel}</span>
        </button>
      </div>
    </div>
  );
};

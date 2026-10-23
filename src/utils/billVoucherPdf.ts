import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExpenseClaimRecord, Language } from '../types';
import { getPoshanSetuLogoDataUrl } from './pdfLogo';

// Helper to convert number to words for Indian Rupees
function numberToWordsINR(amount: number): string {
  const num = Math.floor(amount);
  if (num === 0) return 'Zero Rupees Only';

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (n: number): string => {
    let s = '';
    if (n >= 100) {
      s += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      s += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      s += a[n] + ' ';
    }
    return s.trim();
  };

  let result = '';
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (remainder > 0) result += convertLessThanOneThousand(remainder) + ' ';

  return 'Rupees ' + result.trim() + ' Only';
}

/**
 * Generates an official single-page A4 PDF voucher for an individual expense bill claim.
 * Follows the user's explicit instruction:
 * "Don't add the photo picture, but add the bill for the reimbursement so that details of the bill
 * on which date and how much money spent and what amount of spent. That all detail except image,
 * all the details will be shown in the report where I can download the report individually for the bill uploaded"
 */
export function generateIndividualBillVoucherPdf(claim: ExpenseClaimRecord, lang: Language = 'en'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const printTimestamp = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Top Green Banner (24mm height)
  doc.setFillColor(21, 128, 61); // #15803D Forest Green
  doc.rect(0, 0, 210, 24, 'F');

  // Orange sub-accent stripe (2mm)
  doc.setFillColor(234, 88, 12); // #EA580C Saffron Orange
  doc.rect(0, 24, 210, 2, 'F');

  // Poshan Setu Logo on left side
  try {
    const logoUrl = getPoshanSetuLogoDataUrl();
    if (logoUrl) {
      doc.addImage(logoUrl, 'PNG', 10, 2.5, 19, 19);
    }
  } catch (e) {
    console.warn('Could not add PoshanSetu logo to voucher PDF', e);
  }

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('GOVERNMENT OF GUJARAT • WOMEN & CHILD DEVELOPMENT DEPARTMENT', 114, 8, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setTextColor(254, 240, 138); // Soft Gold
  doc.text('POSHANSETU (POSHAN SETU) • ICDS GUJARAT', 114, 14, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 252, 231);
  doc.text('CONTINGENCY PURCHASE REIMBURSEMENT VOUCHER & DBT CLAIM REGISTER', 114, 19.5, { align: 'center' });

  // Voucher Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('LOCAL CONTINGENCY PURCHASE REIMBURSEMENT VOUCHER', 105, 33, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('(Official Out-of-Pocket Expenditure Claim under Mission Poshan 2.0 / ICDS Gujarat)', 105, 38, { align: 'center' });

  // Centre & Claimant Meta Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(12, 42, 186, 26, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('CENTRE DETAILS:', 16, 48);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text('04 Vadtal (AWVAD04) • Taluka Anand, Dist. Anand', 48, 48);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('CLAIMANT (AWW):', 16, 54);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text('Shrimati Bhavnaben Patel (Anganwadi Worker)', 48, 54);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('SECTOR SUPERVISOR:', 16, 60);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text('Shardaben Shah (Verified Circle Supervisor)', 48, 60);

  // Right column in Meta Box
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 88, 12);
  doc.text('VOUCHER CLAIM ID:', 120, 48);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(claim.id, 160, 48);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('DATE GENERATED:', 120, 54);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.text(printTimestamp, 160, 54);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('AUDIT STATUS:', 120, 60);
  doc.setTextColor(
    claim.status === 'credited_to_bank'
      ? 21
      : claim.status === 'approved_by_supervisor'
      ? 30
      : 234,
    claim.status === 'credited_to_bank'
      ? 128
      : claim.status === 'approved_by_supervisor'
      ? 64
      : 88,
    claim.status === 'credited_to_bank'
      ? 61
      : claim.status === 'approved_by_supervisor'
      ? 175
      : 12
  );
  doc.setFont('helvetica', 'bold');
  doc.text(
    claim.status === 'credited_to_bank'
      ? 'CREDITED TO BANK (PAID)'
      : claim.status === 'approved_by_supervisor'
      ? 'APPROVED BY SUPERVISOR'
      : 'SUBMITTED (PENDING)',
    160,
    60
  );

  // Section 1: Detailed Bill Particulars Table
  const statusLabel =
    claim.status === 'credited_to_bank'
      ? `Reimbursed via DBT Bank Transfer (UTR: ${claim.utrNumber || 'BOB-UTR-COMPLETED'})`
      : claim.status === 'approved_by_supervisor'
      ? `Verified & Approved by Sector Supervisor on ${claim.approvedDate || claim.date}`
      : 'Claim Logged & Under CDPO Office Audit';

  const billDetailsRows = [
    ['Invoice / Cash Memo Number', claim.invoiceNumber || 'N/A'],
    ['Date of Expense / Purchase', claim.date || 'N/A'],
    ['Expense Category', `${claim.categoryLabelEn || claim.category.toUpperCase()} (${claim.categoryLabelGu || ''})`],
    ['Items & Quantity Purchased', claim.itemName],
    ['Merchant / Vendor / Shop', claim.vendorName],
    ['Vendor Location & Contact', claim.vendorContact || 'Local Market, Vadtal'],
    ['Mode of Payment by Worker', claim.paymentMode ? claim.paymentMode.toUpperCase() : 'CASH'],
    ['Worker Remarks & Purpose', claim.remarks || 'Emergency / Local nutrition purchase for daily hot cooked meal.'],
    ['Beneficiary Bank Account', `Bank of Baroda • A/c ending in ****${claim.workerAccountLast4 || '4821'}`],
    ['Reimbursement Audit Status', statusLabel]
  ];

  autoTable(doc, {
    startY: 72,
    head: [['Expenditure Parameter', 'Official Certified Record']],
    body: billDetailsRows,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: [30, 41, 59]
    },
    headStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold', fillColor: [248, 250, 252] },
      1: { cellWidth: 131 }
    },
    margin: { left: 12, right: 12 }
  });

  const tableFinalY = (doc as any).lastAutoTable.finalY || 150;

  // Financial Amount Highlight Box
  doc.setFillColor(234, 247, 238); // #EAF7EE soft mint
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(12, tableFinalY + 5, 186, 26, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text('TOTAL REIMBURSEMENT AMOUNT CLAIMED:', 16, tableFinalY + 12);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(`Rs. ${claim.amount.toFixed(2)} /-`, 16, tableFinalY + 21);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('AMOUNT IN WORDS:', 90, tableFinalY + 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(15, 23, 42);
  doc.text(numberToWordsINR(claim.amount), 90, tableFinalY + 20);

  // Official Certificate Declaration
  const certY = tableFinalY + 36;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    'CERTIFICATION: It is certified that the above expenditure was incurred exclusively for Anganwadi Centre 04 Vadtal',
    12,
    certY
  );
  doc.text(
    'for the nutrition and maintenance of enrolled beneficiaries. The original voucher has been filed in the centre register.',
    12,
    certY + 4
  );

  // 3-Signature Verification Boxes
  const sigBoxY = certY + 10;
  const sigBoxWidth = 58;
  const sigBoxHeight = 32;

  // 1. AWW Signature
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(12, sigBoxY, sigBoxWidth, sigBoxHeight, 2, 2, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('1. CLAIMANT WORKER (AWW)', 16, sigBoxY + 5);
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Shrimati Bhavnaben Patel', 16, sigBoxY + 12);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Signature / Date of Submission)', 16, sigBoxY + 28);

  // 2. Supervisor Stamp
  doc.roundedRect(76, sigBoxY, sigBoxWidth, sigBoxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('2. SECTOR SUPERVISOR', 80, sigBoxY + 5);
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Shardaben Shah', 80, sigBoxY + 12);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Verified & Approved Stamp)', 80, sigBoxY + 28);

  // 3. CDPO Disbursing Officer
  doc.roundedRect(140, sigBoxY, sigBoxWidth, sigBoxHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('3. CDPO SANCTION OFFICER', 144, sigBoxY + 5);
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CDPO Office, Anand Rural', 144, sigBoxY + 12);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('(Passed for Payment & DBT File)', 144, sigBoxY + 28);

  // Bottom Footer
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(0, 285, 210, 285);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('PoshanSetu ICDS Gujarat • Form No. CONT-VOUCH-04 • Digital Ledger Record • Verified Official', 12, 292);
  doc.text('Page 1 of 1', 198, 292, { align: 'right' });

  // Save PDF
  const filename = `PoshanSetu_Bill_Voucher_${claim.invoiceNumber || claim.id}.pdf`;
  doc.save(filename);
}

/**
 * High-resolution official PoshanSetu Logo & Gujarat Government Emblem Generator for jsPDF
 */

export const getPoshanSetuLogoDataUrl = (): string => {
  if (typeof document === 'undefined') return '';

  const size = 300;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, size, size);

  // White circular badge with subtle border
  const center = size / 2;
  const radius = size * 0.47;

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#15803D';
  ctx.stroke();

  // Draw the exact uploaded Poshan Setu Logo
  ctx.save();
  // Center emblem in canvas
  ctx.translate(center - 110, center - 120);
  ctx.scale(0.55, 0.55);

  // Top-Left Large Leaf (Lime Green)
  ctx.fillStyle = '#7CB342';
  ctx.beginPath();
  ctx.moveTo(120, 160);
  ctx.bezierCurveTo(95, 105, 130, 55, 175, 75);
  ctx.bezierCurveTo(195, 115, 175, 165, 120, 160);
  ctx.fill();

  // Top-Right Large Leaf (Lime Green)
  ctx.beginPath();
  ctx.moveTo(380, 160);
  ctx.bezierCurveTo(405, 105, 370, 55, 325, 75);
  ctx.bezierCurveTo(305, 115, 325, 165, 380, 160);
  ctx.fill();

  // Mid-Left Medium Leaf (Dark Green)
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.moveTo(88, 172);
  ctx.bezierCurveTo(86, 160, 110, 162, 135, 190);
  ctx.bezierCurveTo(142, 210, 120, 216, 88, 172);
  ctx.fill();

  // Mid-Right Medium Leaf (Dark Green)
  ctx.beginPath();
  ctx.moveTo(412, 165);
  ctx.bezierCurveTo(414, 153, 390, 157, 368, 186);
  ctx.bezierCurveTo(362, 206, 384, 212, 412, 165);
  ctx.fill();

  // Central Saffron Figure (Mother/Youth with arm high)
  ctx.fillStyle = '#E85D04';
  ctx.beginPath();
  ctx.arc(258, 95, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(195, 44);
  ctx.bezierCurveTo(182, 85, 200, 135, 236, 158);
  ctx.bezierCurveTo(265, 178, 290, 220, 241, 285);
  ctx.bezierCurveTo(275, 238, 296, 178, 274, 136);
  ctx.bezierCurveTo(255, 100, 230, 68, 195, 44);
  ctx.fill();

  // Left Child Figure (Dark Forest Green)
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.arc(180, 214, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(133, 220);
  ctx.bezierCurveTo(145, 235, 160, 238, 178, 238);
  ctx.bezierCurveTo(196, 238, 210, 234, 233, 200);
  ctx.bezierCurveTo(220, 238, 206, 280, 181, 298);
  ctx.bezierCurveTo(158, 280, 144, 238, 133, 220);
  ctx.fill();

  // Right Child Figure (Girl in Lime Green with Pigtails)
  ctx.fillStyle = '#7CB342';
  ctx.beginPath();
  ctx.arc(340, 226, 21, 0, Math.PI * 2);
  ctx.fill();

  // Pigtails
  ctx.beginPath();
  ctx.arc(314, 210, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(366, 214, 8, 0, Math.PI * 2);
  ctx.fill();

  // Girl body
  ctx.beginPath();
  ctx.moveTo(292, 226);
  ctx.bezierCurveTo(305, 242, 320, 246, 338, 246);
  ctx.bezierCurveTo(354, 246, 366, 242, 372, 246);
  ctx.bezierCurveTo(362, 278, 348, 296, 325, 302);
  ctx.bezierCurveTo(310, 286, 298, 246, 292, 226);
  ctx.fill();

  // Arch Bridge Structure (Setu in Dark Green)
  ctx.fillStyle = '#15803D';
  ctx.beginPath();
  ctx.moveTo(148, 332);
  ctx.bezierCurveTo(195, 298, 305, 298, 352, 332);
  ctx.lineTo(352, 370);
  ctx.lineTo(322, 370);
  ctx.bezierCurveTo(322, 346, 308, 336, 292, 336);
  ctx.bezierCurveTo(276, 336, 272, 346, 272, 370);
  ctx.lineTo(228, 370);
  ctx.bezierCurveTo(228, 346, 224, 336, 208, 336);
  ctx.bezierCurveTo(192, 336, 178, 346, 178, 370);
  ctx.lineTo(148, 370);
  ctx.closePath();
  ctx.fill();

  // Base Leaves Flanking Bridge
  ctx.fillStyle = '#7CB342';
  ctx.beginPath();
  ctx.moveTo(35, 315);
  ctx.bezierCurveTo(90, 315, 155, 338, 200, 372);
  ctx.bezierCurveTo(145, 372, 80, 352, 35, 315);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(465, 315);
  ctx.bezierCurveTo(410, 315, 345, 338, 300, 372);
  ctx.bezierCurveTo(355, 372, 420, 352, 465, 315);
  ctx.fill();

  // Wordmark "Poshan Setu"
  ctx.font = '900 52px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#E85D04';
  ctx.fillText('Poshan', 60, 435);

  ctx.fillStyle = '#15803D';
  ctx.fillText('Setu', 265, 435);

  ctx.restore();

  return canvas.toDataURL('image/png');
};

/**
 * Gujarat Government Ashok Chakra Emblem Data URL for Header
 */
export const getGujaratGovEmblemDataUrl = (): string => {
  if (typeof document === 'undefined') return '';

  const size = 180;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const center = size / 2;
  const radius = size * 0.44;

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1E3A8A'; // Deep Navy
  ctx.stroke();

  // Ashoka Chakra
  ctx.save();
  ctx.translate(center, center - 6);

  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#1E3A8A';
  ctx.stroke();

  // 12 spokes
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const angle = (i * Math.PI) / 6;
    ctx.lineTo(24 * Math.cos(angle), 24 * Math.sin(angle));
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#1E3A8A';
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#1E3A8A';
  ctx.fill();

  ctx.restore();

  ctx.fillStyle = '#1E3A8A';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SATYAMEV JAYATE', center, size - 28);

  ctx.font = 'bold 10px sans-serif';
  ctx.fillStyle = '#047857';
  ctx.fillText('ICDS GUJARAT', center, size - 14);

  return canvas.toDataURL('image/png');
};

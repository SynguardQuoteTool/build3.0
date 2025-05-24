import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Synguard brand colors
const COLORS = {
  primary: '#002C5F',    // Synguard Blue
  secondary: '#B19E5F',  // Synguard Gold
  accent: '#F3966C',     // Synguard Salmon
  white: '#FFFFFF',
  lightGrey: '#F8F9FA',
  grey: '#E1E5EA',
  darkGrey: '#6C757D',
  success: '#28A745',
  text: '#343A40'
};

// Country contact information
const COUNTRY_CONTACTS = {
  UK: { 
    phone: "+44 1234 567890", 
    website: "www.synguard.com", 
    email: "info@synguard.com",
    address: "Synguard UK Ltd\n123 Business Park\nLondon, SW1A 1AA"
  },
  Ireland: { 
    phone: "+353 1 234 5678", 
    website: "www.synguard.ie", 
    email: "info@synguard.ie",
    address: "Synguard Ireland Ltd\n456 Enterprise Centre\nDublin, D02 XY12"
  },
  Belgium: { 
    phone: "+32 11 249292", 
    website: "www.synguard.be", 
    email: "info@synguard.be",
    address: "Synguard NV\nGenebroekstraat 97\nB-3581 Beringen"
  },
  Germany: { 
    phone: "+49 30 123 4567", 
    website: "www.synguard.de", 
    email: "info@synguard.de",
    address: "Synguard Deutschland GmbH\n789 Technologie Park\n10115 Berlin"
  },
  France: { 
    phone: "+33 1 234 5678", 
    website: "www.synguard.fr", 
    email: "info@synguard.fr",
    address: "Synguard France SARL\n321 Zone d'Activité\n75001 Paris"
  },
  Netherlands: { 
    phone: "+31 20 123 4567", 
    website: "www.synguard.nl", 
    email: "info@synguard.nl",
    address: "Synguard Nederland BV\n654 Business District\n1000 AA Amsterdam"
  },
  // Add more countries as needed
};

export const generateStyledQuotePDF = (quote) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper functions
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const setColor = (color) => {
    const rgb = hexToRgb(color);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  };

  const setFillColor = (color) => {
    const rgb = hexToRgb(color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
  };

  const addRoundedRect = (x, y, width, height, radius, fillColor) => {
    if (fillColor) {
      setFillColor(fillColor);
      doc.roundedRect(x, y, width, height, radius, radius, 'F');
    } else {
      doc.roundedRect(x, y, width, height, radius, radius);
    }
  };

  // Extract quote data
  const quoteCurrency = quote.currencySymbol || '£';
  const currencyCode = quote.currency || 'GBP';
  const country = quote.country || 'UK';
  const contacts = COUNTRY_CONTACTS[country] || COUNTRY_CONTACTS.UK;
  const quoteRef = `SGD-${quote.id}`;
  const systemType = quote.systemType || quote.projectType || 'Unknown';
  
  // Calculate dates
  const quoteDate = new Date(quote.created || quote.date);
  const expirationDate = new Date(quoteDate);
  expirationDate.setMonth(expirationDate.getMonth() + 1);

  // === HEADER SECTION ===
  // Header background
  setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');

  // Synguard Logo Area (simulated with text - you can replace with actual logo)
  setColor(COLORS.white);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SYNGUARD', 15, 20);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('ALWAYS WITH YOU', 15, 26);

  // Contact Information (right side of header)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const contactLines = [
    contacts.phone,
    contacts.website,
    contacts.email
  ];
  
  contactLines.forEach((line, index) => {
    doc.text(line, pageWidth - 15, 15 + (index * 4), { align: 'right' });
  });

  yPosition = 45;

  // === QUOTE TITLE SECTION ===
  // Quote title background
  addRoundedRect(15, yPosition, pageWidth - 30, 15, 2, COLORS.lightGrey);
  
  setColor(COLORS.primary);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`QUOTATION № ${quoteRef}`, pageWidth / 2, yPosition + 10, { align: 'center' });

  yPosition += 25;

  // === QUOTE DETAILS SECTION ===
  // Quote details table
  const quoteDetailsData = [
    ['Quote Reference', quoteRef],
    ['Quote Name', quote.name || 'Unnamed Quote'],
    ['Date', quoteDate.toLocaleDateString('en-GB')],
    ['Valid Until', expirationDate.toLocaleDateString('en-GB')],
    ['System Type', systemType],
    ['Currency', `${currencyCode} (${quoteCurrency})`,],
    ['Client', quote.client || 'N/A']
  ];

  doc.autoTable({
    body: quoteDetailsData,
    startY: yPosition,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: { top: 3, right: 8, bottom: 3, left: 8 },
      textColor: hexToRgb(COLORS.text)
    },
    columnStyles: {
      0: { 
        fontStyle: 'bold', 
        fillColor: hexToRgb(COLORS.lightGrey),
        textColor: hexToRgb(COLORS.primary),
        cellWidth: 40
      },
      1: { 
        cellWidth: 80,
        textColor: hexToRgb(COLORS.text)
      }
    },
    margin: { left: 15, right: 15 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // === SYSTEM CONFIGURATION SECTION ===
  if (quote.systemDetails) {
    setColor(COLORS.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SYSTEM CONFIGURATION', 15, yPosition);
    
    yPosition += 8;

    const systemData = [
      ['Protocol', quote.systemDetails.protocol],
      ['Deployment', quote.systemDetails.deployment],
      ['Communication', quote.systemDetails.commsType],
      ['Doors', quote.systemDetails.doors],
      ['System Users', quote.systemDetails.systemUsers]
    ].filter(item => item[1]); // Only show non-empty values

    if (systemData.length > 0) {
      doc.autoTable({
        body: systemData,
        startY: yPosition,
        theme: 'plain',
        styles: {
          fontSize: 9,
          cellPadding: { top: 2, right: 6, bottom: 2, left: 6 },
          textColor: hexToRgb(COLORS.text)
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold',
            fillColor: hexToRgb(COLORS.lightGrey),
            textColor: hexToRgb(COLORS.primary),
            cellWidth: 35
          },
          1: { 
            cellWidth: 40,
            textColor: hexToRgb(COLORS.text)
          }
        },
        margin: { left: 15, right: 15 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    }
  }

  // Separate items by cost type
  const upfrontItems = quote.items?.filter(item => 
    item.costType !== 'Monthly' && item.costType !== 'monthly'
  ) || [];
  
  const recurringItems = quote.items?.filter(item => 
    item.costType === 'Monthly' || item.costType === 'monthly'
  ) || [];

  // === UPFRONT COSTS SECTION ===
  if (upfrontItems.length > 0) {
    // Section header with accent
    addRoundedRect(15, yPosition - 3, pageWidth - 30, 12, 2, COLORS.primary);
    setColor(COLORS.white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('UPFRONT COSTS', 20, yPosition + 5);

    yPosition += 15;

    // Prepare upfront table data
    const upfrontTableData = upfrontItems.map(item => {
      const msrp = Number(item.msrp || item.msrpGBP) || 0;
      const discount = Number(item.discountStandard || item.discount) || 0;
      const quantity = Number(item.qty || item.quantity) || 1;
      const lineTotal = msrp * quantity * (1 - discount / 100);

      return [
        `[${item.articleNumber || 'N/A'}]`,
        item.model || 'Unknown',
        item.description || '-',
        quantity.toString(),
        `${quoteCurrency}${msrp.toFixed(2)}`,
        `${discount.toFixed(1)}%`,
        `${quoteCurrency}${lineTotal.toFixed(2)}`
      ];
    });

    doc.autoTable({
      head: [['Article', 'Model', 'Description', 'Qty', `Unit Price (${currencyCode})`, 'Disc.', `Total (${currencyCode})`]],
      body: upfrontTableData,
      startY: yPosition,
      theme: 'striped',
      headStyles: {
        fillColor: hexToRgb(COLORS.secondary),
        textColor: hexToRgb(COLORS.white),
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
        textColor: hexToRgb(COLORS.text)
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 15, halign: 'center' },
        6: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 15, right: 15 }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Upfront total
    const upfrontTotal = parseFloat(quote.totalOneOff || 0);
    addRoundedRect(pageWidth - 80, yPosition - 2, 65, 10, 2, COLORS.lightGrey);
    setColor(COLORS.primary);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Upfront Total: ${quoteCurrency}${upfrontTotal.toFixed(2)}`, pageWidth - 15, yPosition + 5, { align: 'right' });

    yPosition += 20;
  }

  // === RECURRING COSTS SECTION ===
  if (recurringItems.length > 0) {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // Section header
    const recurringType = systemType === 'Cloud' ? 'MONTHLY RECURRING COSTS' : 'ANNUAL SMC COSTS';
    addRoundedRect(15, yPosition - 3, pageWidth - 30, 12, 2, COLORS.accent);
    setColor(COLORS.white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(recurringType, 20, yPosition + 5);

    yPosition += 15;

    // Prepare recurring table data
    const recurringTableData = recurringItems.map(item => {
      const msrp = Number(item.msrp || item.msrpGBP) || 0;
      const discount = Number(item.discountStandard || item.discount) || 0;
      const quantity = Number(item.qty || item.quantity) || 1;
      const lineTotal = msrp * quantity * (1 - discount / 100);

      return [
        `[${item.articleNumber || 'N/A'}]`,
        item.model || 'Unknown',
        item.description || '-',
        quantity.toString(),
        `${quoteCurrency}${msrp.toFixed(2)}`,
        `${discount.toFixed(1)}%`,
        `${quoteCurrency}${lineTotal.toFixed(2)}`
      ];
    });

    const recurringPeriod = systemType === 'Cloud' ? 'Monthly' : 'Annual';

    doc.autoTable({
      head: [['Article', 'Model', 'Description', 'Qty', `Unit Price (${currencyCode})`, 'Disc.', `${recurringPeriod} (${currencyCode})`]],
      body: recurringTableData,
      startY: yPosition,
      theme: 'striped',
      headStyles: {
        fillColor: hexToRgb(COLORS.accent),
        textColor: hexToRgb(COLORS.white),
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: { top: 4, right: 3, bottom: 4, left: 3 },
        textColor: hexToRgb(COLORS.text)
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 70 },
        3: { cellWidth: 15, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 15, halign: 'center' },
        6: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 15, right: 15 }
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Recurring total
    const recurringTotal = systemType === 'Cloud' 
      ? parseFloat(quote.totalMonthly || 0)
      : parseFloat(quote.smcCost || 0);
    
    const recurringLabel = systemType === 'Cloud' ? 'Monthly Total' : 'Annual SMC Total';
    
    addRoundedRect(pageWidth - 80, yPosition - 2, 65, 10, 2, COLORS.lightGrey);
    setColor(COLORS.accent);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${recurringLabel}: ${quoteCurrency}${recurringTotal.toFixed(2)}`, pageWidth - 15, yPosition + 5, { align: 'right' });

    yPosition += 20;
  }

  // === SUMMARY SECTION ===
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // Summary box
  addRoundedRect(15, yPosition, pageWidth - 30, 35, 3, COLORS.lightGrey);
  
  setColor(COLORS.primary);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTE SUMMARY', 20, yPosition + 10);

  // Summary details
  const summaryItems = [];
  if (upfrontItems.length > 0) {
    summaryItems.push(`Upfront Investment: ${quoteCurrency}${parseFloat(quote.totalOneOff || 0).toFixed(2)}`);
  }
  if (recurringItems.length > 0) {
    const recurringLabel = systemType === 'Cloud' ? 'Monthly Recurring' : 'Annual SMC';
    const recurringAmount = systemType === 'Cloud' 
      ? parseFloat(quote.totalMonthly || 0)
      : parseFloat(quote.smcCost || 0);
    summaryItems.push(`${recurringLabel}: ${quoteCurrency}${recurringAmount.toFixed(2)}`);
  }

  setColor(COLORS.text);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  summaryItems.forEach((item, index) => {
    doc.text(item, 20, yPosition + 20 + (index * 6));
  });

  yPosition += 45;

  // === FOOTER SECTION ===
  // Terms and conditions
  setColor(COLORS.darkGrey);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const terms = [
    'Terms & Conditions:',
    '• All prices are exclusive of VAT/taxes unless otherwise stated',
    '• Quote valid for 30 days from date of issue',
    '• Payment terms: 30 days net from invoice date',
    '• Cloud services subject to annual indexation as per service agreement',
    '• All hardware subject to availability and lead times'
  ];

  terms.forEach((term, index) => {
    if (yPosition > pageHeight - 10) {
      doc.addPage();
      yPosition = 20;
    }
    doc.text(term, 15, yPosition + (index * 4));
  });

  yPosition += 30;

  // Company footer
  if (yPosition > pageHeight - 20) {
    doc.addPage();
    yPosition = 20;
  }

  // Footer separator
  setFillColor(COLORS.grey);
  doc.rect(15, yPosition, pageWidth - 30, 0.5, 'F');
  yPosition += 5;

  // Company address
  setColor(COLORS.primary);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Synguard Access Control Solutions', 15, yPosition);
  
  setColor(COLORS.darkGrey);
  doc.setFont('helvetica', 'normal');
  const addressLines = contacts.address.split('\n');
  addressLines.forEach((line, index) => {
    doc.text(line, 15, yPosition + 5 + (index * 3));
  });

  // Generate filename
  const filename = `Quote_${quoteRef}_${quote.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}.pdf`;
  
  // Save the PDF
  doc.save(filename);
  
  return doc;
};
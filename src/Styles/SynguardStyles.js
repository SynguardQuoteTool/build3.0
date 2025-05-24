// src/styles/SynguardStyles.js

// Color palette from the Synguard brand guide
export const synguardColors = {
  blue: "#002C5F",
  gold: "#B19E5F",
  salmon: "#F3966C",
  white: "#FFFFFF",
  lightGrey: "#F5F5F5",
  grey: "#E1E5EA",
  darkGrey: "#6C757D"
};

// Grid backgrounds as CSS classes
export const gridStyles = `
  .sg-grid-digital {
    position: relative;
    background-color: ${synguardColors.blue};
  }
  
  .sg-grid-digital::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.3;
    background-image: url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23B19E5F' d='M0,0 L800,0 L800,800 L0,800 L0,0 Z M100,100 C100,144.183 135.817,180 180,180 C224.183,180 260,144.183 260,100 L300,100 C300,166.274 246.274,220 180,220 C113.726,220 60,166.274 60,100 L100,100 Z M540,100 C540,144.183 575.817,180 620,180 C664.183,180 700,144.183 700,100 L740,100 C740,166.274 686.274,220 620,220 C553.726,220 500,166.274 500,100 L540,100 Z M100,620 C100,575.817 135.817,540 180,540 C224.183,540 260,575.817 260,620 L300,620 C300,553.726 246.274,500 180,500 C113.726,500 60,553.726 60,620 L100,620 Z M540,620 C540,575.817 575.817,540 620,540 C664.183,540 700,575.817 700,620 L740,620 C740,553.726 686.274,500 620,500 C553.726,500 500,553.726 500,620 L540,620 Z'/%3E%3C/svg%3E");
    background-size: 800px 800px;
    background-position: center;
    z-index: 0;
  }
  
  .sg-grid-logo {
    position: relative;
    background-color: ${synguardColors.blue};
  }
  
  .sg-grid-logo::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23B19E5F' stroke-width='2' d='M50,250 L100,200 L150,250 L200,200 L250,250 L300,200 L350,250 L400,200 L450,250 L500,200 L550,250 M50,300 L100,350 L150,300 L200,350 L250,300 L300,350 L350,300 L400,350 L450,300 L500,350 L550,300 M150,100 L200,150 L250,100 L300,150 L350,100 L400,150 L450,100 M150,500 L200,450 L250,500 L300,450 L350,500 L400,450 L450,500'/%3E%3C/svg%3E");
    background-size: 600px 600px;
    background-position: center;
    z-index: 0;
  }
  
  .sg-content {
    position: relative;
    z-index: 1;
  }
`;

// Typography styles
export const typographyStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
  
  .sg-heading {
    color: ${synguardColors.blue};
    font-weight: 500;
    position: relative;
    margin-bottom: 15px;
  }
  
  .sg-heading::before {
    content: "";
    position: absolute;
    left: -15px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background-color: ${synguardColors.salmon};
    border-radius: 2px;
  }
  
  .sg-subheading {
    color: ${synguardColors.blue};
    font-weight: 500;
    margin-bottom: 10px;
  }
`;

// Component styles
export const componentStyles = `
  .sg-panel {
    background-color: ${synguardColors.white};
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
    padding: 20px;
    margin-bottom: 25px;
  }
  
  .sg-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    transition: all 0.2s ease;
    font-size: 14px;
  }
  
  .sg-button-primary {
    background-color: ${synguardColors.salmon};
    color: ${synguardColors.white};
  }
  
  .sg-button-primary:hover {
    background-color: #E88A60;
  }
  
  .sg-button-secondary {
    background-color: ${synguardColors.white};
    color: ${synguardColors.blue};
    border: 1px solid ${synguardColors.grey};
  }
  
  .sg-button-secondary:hover {
    background-color: ${synguardColors.lightGrey};
  }
  
  .sg-search {
    position: relative;
    max-width: 400px;
    margin-bottom: 20px;
  }
  
  .sg-search input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border-radius: 4px;
    border: 1px solid ${synguardColors.grey};
    font-size: 14px;
    font-family: 'Poppins', sans-serif;
  }
  
  .sg-search svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${synguardColors.darkGrey};
  }
  
  .sg-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 14px;
  }
  
  .sg-table th {
    background-color: ${synguardColors.lightGrey};
    color: ${synguardColors.blue};
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    border-bottom: 1px solid ${synguardColors.grey};
  }
  
  .sg-table th:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
  
  .sg-table th:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  
  .sg-table td {
    padding: 14px 15px;
    border-bottom: 1px solid ${synguardColors.grey};
  }
  
  .sg-table tr:nth-child(even) {
    background-color: ${synguardColors.lightGrey};
  }
  
  .sg-table tr:last-child td {
    border-bottom: none;
  }
  
  .sg-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .sg-badge-blue {
    background-color: rgba(0, 44, 95, 0.15);
    color: ${synguardColors.blue};
  }
  
  .sg-badge-gold {
    background-color: rgba(177, 158, 95, 0.15);
    color: #9A8A51;
  }
  
  .sg-badge-salmon {
    background-color: rgba(243, 150, 108, 0.15);
    color: #E07E56;
  }
`;

// Combine all styles
export const synguardStyles = `
  ${gridStyles}
  ${typographyStyles}
  ${componentStyles}
`;

// Export icons as React components
export const SynguardIcons = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
  ),
  Delete: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
  )
};
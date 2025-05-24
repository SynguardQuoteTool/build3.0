import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuotes } from "../context/QuotesContext";
import { useQuickConfig } from "../context/QuickConfigContext";
import NewQuoteModal from "./NewQuoteModal";
import ConfigModal from "./ConfigModal";
import SettingsModal from "./SettingsModal";

// Synguard brand colors
const colors = {
  blue: "#002C5F",
  gold: "#B19E5F", 
  salmon: "#F3966C",
  white: "#FFFFFF",
  lightGrey: "#F5F5F5",
  grey: "#E1E5EA",
  darkGrey: "#6C757D"
};

// Icon components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { quotes, deleteQuote } = useQuotes();
  const { resetConfigState } = useQuickConfig();
  const [searchTerm, setSearchTerm] = useState("");
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  console.log("Dashboard - showNewQuoteModal state:", showNewQuoteModal);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [quickQuoteConfig, setQuickQuoteConfig] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Currency helper function (same as Requirements.jsx and EditQuote.jsx)
  const getCurrentSystemCurrency = () => {
    try {
      const settings = localStorage.getItem('systemSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return {
          symbol: parsed.currency || '£',
          code: parsed.currency === '€' ? 'EUR' : (parsed.currency === '$' ? 'USD' : 'GBP')
        };
      }
    } catch (e) {
      // ignore
    }
    return { symbol: '£', code: 'GBP' };
  };

  // Helper function to get price based on currency
  const getPriceFromProduct = (item, targetCurrencyCode) => {
    if (!item) return 0;
    
    // If item already has current currency price, use it
    if (item.currency === targetCurrencyCode && item.msrp) {
      return item.msrp;
    }
    
    // Otherwise, select based on target currency
    switch (targetCurrencyCode) {
      case 'EUR':
        return item.msrpEUR || item.mrspEUR || item.msrpGBP || item.msrp || 0;
      case 'USD':
        return item.msrpUSD || item.mrspUSD || item.msrpGBP || item.msrp || 0;
      default: // GBP
        return item.msrpGBP || item.mrspGBP || item.msrp || 0;
    }
  };

  // Filter quotes based on search term
  const filteredQuotes = quotes.filter(quote => 
    quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.systemType && quote.systemType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate total value for a quote in current system currency
  const calculateTotalValue = (quote) => {
    if (!quote.items || !Array.isArray(quote.items)) return 0;
    
    const currentCurrency = getCurrentSystemCurrency();
    
    return quote.items.reduce((total, item) => {
      const price = getPriceFromProduct(item, currentCurrency.code);
      const qty = item.qty || 1;
      const discount = item.discountStandard || item.discountPercent || 0;
      const itemValue = price * qty * (1 - discount / 100);
      return total + itemValue;
    }, 0);
  };

  // Calculate recurring value (monthly or SMC) in current system currency
  const calculateRecurringValue = (quote) => {
    if (!quote.items || !Array.isArray(quote.items)) return 0;
    
    const currentCurrency = getCurrentSystemCurrency();
    
    return quote.items
      .filter(item => 
        item.costType === 'Monthly' || 
        item.costType === 'monthly' || 
        item.costType === 'recurring' ||
        item.method === 'Recurring'
      )
      .reduce((total, item) => {
        const price = getPriceFromProduct(item, currentCurrency.code);
        const qty = item.qty || 1;
        const discount = item.discountStandard || item.discountPercent || 0;
        const itemValue = price * qty * (1 - discount / 100);
        return total + itemValue;
      }, 0);
  };

  // Sample sales contacts data
  const salesContacts = [
    { id: 1, name: "Wesley Heiden", email: "wesley.heiden@synguard.nl", phone: "+31 653 44 33 72", region: "BE" },
    { id: 2, name: "Jan-Peter Hulsker", email: "janpeter.hulsker@synguard.nl", phone: "+31 850 60 24 92", region: "BE" },
    { id: 3, name: "Vincent Hamerlinck", email: "Vincent.Hamerlinck@synguard.be", phone: "+32 498 67 21 98", region: "RoW" },
    { id: 4, name: "Billy Hopkins", email: "billy.hopkins@synguard.co.uk", phone: "+44 792 716 7976", region: "UK" },
    { id: 5, name: "Paul Taylor", email: "paul.taylor@synguard.co.uk", phone: "+44 79 33 09 64 77", region: "UK" },
  ];

  return (
    <div style={{ 
      fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: colors.lightGrey,
      minHeight: "100vh"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: colors.blue,
        color: colors.white,
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            backgroundColor: colors.white,
            borderRadius: "8px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" rx="20" fill="#002C5F"/>
              <path d="M25 35C25 29.5 29.5 25 35 25H65C70.5 25 75 29.5 75 35V65C75 70.5 70.5 75 65 75H35C29.5 75 25 70.5 25 65V35Z" stroke="#FFFFFF" strokeWidth="8"/>
              <path d="M35 65L65 35M35 35L65 65" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            margin: 0
          }}>
            SYNGUARD
            <span style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "normal",
              letterSpacing: "1px"
            }}>
              ALWAYS WITH YOU
            </span>
          </h1>
        </div>
        <div style={{ fontSize: "14px" }}>
          <span style={{ marginRight: "15px", color: colors.lightGrey }}>
            Currency: <strong>{getCurrentSystemCurrency().code} ({getCurrentSystemCurrency().symbol})</strong>
          </span>
          Welcome, Admin | <a href="#" style={{ color: colors.salmon, textDecoration: "none" }}>Logout</a>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px 30px" }}>
        {/* Title and Actions */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "25px"
        }}>
          <h2 style={{ margin: 0, color: colors.blue, fontWeight: 500, fontSize: "24px" }}>
            Quote Management Dashboard
          </h2>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: colors.salmon,
                color: colors.white,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              onClick={() => setShowNewQuoteModal(true)}
            >
              <PlusIcon /> New Quote
            </button>
            <button 
              style={{
                padding: "10px 16px",
                backgroundColor: colors.white,
                color: colors.blue,
                border: `1px solid ${colors.grey}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: "14px"
              }}
              onClick={() => navigate("/products")}
            >
              Products
            </button>
            <button 
              style={{
                padding: "10px 16px",
                backgroundColor: colors.white,
                color: colors.blue,
                border: `1px solid ${colors.grey}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: "14px"
              }}
              onClick={() => navigate("/users")}
            >
              Users
            </button>
            <button 
              style={{
                padding: "10px 16px",
                backgroundColor: colors.white,
                color: colors.blue,
                border: `1px solid ${colors.grey}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: "14px"
              }}
              onClick={() => navigate("/advanced")}
            >
              Advanced Config
            </button>
            <button 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                backgroundColor: colors.white,
                color: colors.blue,
                border: `1px solid ${colors.grey}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                fontSize: "14px"
              }}
              onClick={() => setShowSettingsModal(true)}
            >
              <SettingsIcon /> Settings
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div style={{ 
          position: "relative",
          maxWidth: "400px",
          marginBottom: "25px"
        }}>
          <SearchIcon style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: colors.darkGrey
          }} />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              borderRadius: "4px",
              border: `1px solid ${colors.grey}`,
              fontSize: "14px",
              fontFamily: "inherit",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          />
        </div>
        
        {/* Quotes Section */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: "8px",
          padding: "25px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          marginBottom: "25px"
        }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h3 style={{
              margin: 0,
              color: colors.blue,
              fontWeight: 500,
              fontSize: "18px",
              position: "relative",
              paddingLeft: "15px"
            }}>
              <span style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: "4px",
                height: "20px",
                backgroundColor: colors.salmon,
                borderRadius: "2px"
              }}></span>
              Existing Quotes
            </h3>
            
            <div style={{ fontSize: "14px", color: colors.darkGrey }}>
              Showing {filteredQuotes.length} of {quotes.length} quotes | Prices in {getCurrentSystemCurrency().code}
            </div>
          </div>
          
          {filteredQuotes.length === 0 ? (
            <div style={{ 
              padding: "40px 20px", 
              textAlign: "center", 
              color: colors.darkGrey,
              backgroundColor: colors.lightGrey,
              borderRadius: "6px",
              fontStyle: "italic"
            }}>
              {quotes.length === 0 
                ? "No quotes available. Create a new quote to get started." 
                : "No quotes matching your search criteria."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "separate", 
                borderSpacing: "0",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.lightGrey }}>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600,
                      borderTopLeftRadius: "6px",
                      borderBottomLeftRadius: "6px"
                    }}>Name</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Date</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>System Type</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Added With</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "right", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Total Value ({getCurrentSystemCurrency().code})</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "right", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Recurring ({getCurrentSystemCurrency().code})</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "center", 
                      color: colors.blue,
                      fontWeight: 600,
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px"
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote, index) => {
                    const totalValue = calculateTotalValue(quote);
                    const recurringValue = calculateRecurringValue(quote);
                    const currentCurrency = getCurrentSystemCurrency();
                    const isLastRow = index === filteredQuotes.length - 1;
                    
                    return (
                      <tr key={quote.id} style={{ 
                        backgroundColor: index % 2 === 0 ? colors.white : colors.lightGrey
                      }}>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`,
                          fontWeight: 500,
                          color: colors.blue
                        }}>
                          {quote.name}
                          <div style={{ fontSize: "12px", color: colors.darkGrey, marginTop: "2px" }}>
                            {quote.id}
                          </div>
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          {new Date(quote.date).toLocaleDateString()}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          <span style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 500,
                            backgroundColor: quote.systemType === "Cloud" 
                              ? "rgba(243, 150, 108, 0.15)" 
                              : (quote.systemType === "On-Prem" 
                                ? "rgba(177, 158, 95, 0.15)" 
                                : "rgba(0, 44, 95, 0.15)"),
                            color: quote.systemType === "Cloud" 
                              ? "#E07E56" 
                              : (quote.systemType === "On-Prem" 
                                ? "#9A8A51" 
                                : colors.blue)
                          }}>
                            {quote.systemType}
                          </span>
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          {quote.status}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          textAlign: "right",
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`,
                          fontWeight: 500
                        }}>
                          {currentCurrency.symbol}{totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          textAlign: "right",
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          {recurringValue > 0 
                            ? `${currentCurrency.symbol}${recurringValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}`
                            : "N/A"}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          textAlign: "center",
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: colors.blue,
                                padding: "5px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                transition: "background-color 0.2s"
                              }}
                              title={`Edit ${quote.name}`}
                              onClick={() => {
                                resetConfigState();
                                if (quote.status === "Advanced Config" && quote.advancedConfigState) {
                                  navigate("/advanced", { state: quote.advancedConfigState });
                                } else {
                                  navigate(`/edit/${quote.id}`);
                                }
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <EditIcon />
                            </button>
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#d9534f",
                                padding: "5px",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                transition: "background-color 0.2s"
                              }}
                              title={`Delete ${quote.name}`}
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${quote.name}"?`)) {
                                  deleteQuote(quote.id);
                                }
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Sales Contacts Section */}
        <div style={{
          backgroundColor: colors.white,
          borderRadius: "8px",
          padding: "25px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}>
          <h3 style={{
            margin: "0 0 20px 0",
            color: colors.blue,
            fontWeight: 500,
            fontSize: "18px",
            position: "relative",
            paddingLeft: "15px"
          }}>
            <span style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "4px",
              height: "20px",
              backgroundColor: colors.gold,
              borderRadius: "2px"
            }}></span>
            Sales Contacts
          </h3>
          
          {salesContacts.length === 0 ? (
            <div style={{ 
              padding: "40px 20px", 
              textAlign: "center", 
              color: colors.darkGrey,
              backgroundColor: colors.lightGrey,
              borderRadius: "6px",
              fontStyle: "italic"
            }}>
              No sales contacts available.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ 
                width: "100%", 
                borderCollapse: "separate", 
                borderSpacing: "0",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.lightGrey }}>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600,
                      borderTopLeftRadius: "6px",
                      borderBottomLeftRadius: "6px"
                    }}>Name</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Email</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600 
                    }}>Phone</th>
                    <th style={{ 
                      padding: "12px 15px", 
                      textAlign: "left", 
                      color: colors.blue,
                      fontWeight: 600,
                      borderTopRightRadius: "6px",
                      borderBottomRightRadius: "6px"
                    }}>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {salesContacts.map((contact, index) => {
                    const isLastRow = index === salesContacts.length - 1;
                    
                    return (
                      <tr key={contact.id} style={{ 
                        backgroundColor: index % 2 === 0 ? colors.white : colors.lightGrey
                      }}>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`,
                          fontWeight: 500,
                          color: colors.blue
                        }}>
                          {contact.name}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          <a 
                            href={`mailto:${contact.email}`} 
                            style={{ 
                              color: colors.salmon, 
                              textDecoration: "none",
                              borderBottom: `1px dotted ${colors.salmon}`
                            }}
                          >
                            {contact.email}
                          </a>
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          {contact.phone}
                        </td>
                        <td style={{ 
                          padding: "14px 15px", 
                          borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                        }}>
                          <span style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 500,
                            backgroundColor: contact.region === "UK" 
                              ? "rgba(0, 44, 95, 0.15)" 
                              : (contact.region === "US" 
                                ? "rgba(243, 150, 108, 0.15)" 
                                : "rgba(177, 158, 95, 0.15)"),
                            color: contact.region === "UK" 
                              ? colors.blue 
                              : (contact.region === "US" 
                                ? "#E07E56" 
                                : "#9A8A51")
                          }}>
                            {contact.region}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* New Quote Modal */}
      {showNewQuoteModal && (
        <NewQuoteModal 
          onClose={() => setShowNewQuoteModal(false)}
          onAction={(actionType, data) => {
            if (actionType === "manual") {
              setShowNewQuoteModal(false);
              navigate(`/edit/${data.id}`);
            } else if (actionType === "system") {
              setShowNewQuoteModal(false);
              setShowConfigModal(true);
              setQuickQuoteConfig(data);
            }
          }}
        />
      )}

      {/* System Config Modal */}
      {showConfigModal && (
        <ConfigModal 
          initial={quickQuoteConfig}
          onClose={() => {
            setShowConfigModal(false);
          }}
          onSave={(config) => {
            const completeQuoteData = {
              name: quickQuoteConfig.name,
              systemType: quickQuoteConfig.systemType,
              date: quickQuoteConfig.date,
              protocol: config.protocol,
              doorComms: config.doorComms,
              deployment: config.deployment,
              targetDoorsPerController: config.targetDoorsPerController || "",
            };
            
            setShowConfigModal(false);
            navigate("/requirements", { state: completeQuoteData });
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          onClose={() => setShowSettingsModal(false)}
        />
      )}

    </div>
  );
}
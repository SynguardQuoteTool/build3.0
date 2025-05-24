import React, { useState } from "react";
import { useQuotes } from "../context/QuotesContext";
import { useSystem } from "../context/SystemContext";




// Custom Icon Components
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const IconCog = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const IconTools = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const colors = {
  blue: "#002C5F", // Main blue
  gold: "#B19E5F", // Gold color
  salmon: "#F3966C", // Salmon color
  white: "#FFFFFF",
  lightGrey: "#F5F5F5",
  grey: "#E1E5EA",
  darkGrey: "#6C757D",
  blueTransparent: "rgba(0, 44, 95, 0.9)",
};

// Custom Grid Pattern Background component
const GridBackground = ({ children, type = "digital" }) => {
  const backgroundStyle = {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    backgroundColor: colors.blue,
  };

  const patternStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: type === "digital" ? 0.2 : 0.3,
    backgroundSize: type === "digital" ? "800px 800px" : "600px 600px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundImage: type === "digital" 
      ? `url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23B19E5F' d='M0,0 L800,0 L800,800 L0,800 L0,0 Z M100,100 C100,144.183 135.817,180 180,180 C224.183,180 260,144.183 260,100 L300,100 C300,166.274 246.274,220 180,220 C113.726,220 60,166.274 60,100 L100,100 Z M540,100 C540,144.183 575.817,180 620,180 C664.183,180 700,144.183 700,100 L740,100 C740,166.274 686.274,220 620,220 C553.726,220 500,166.274 500,100 L540,100 Z M100,620 C100,575.817 135.817,540 180,540 C224.183,540 260,575.817 260,620 L300,620 C300,553.726 246.274,500 180,500 C113.726,500 60,553.726 60,620 L100,620 Z M540,620 C540,575.817 575.817,540 620,540 C664.183,540 700,575.817 700,620 L740,620 C740,553.726 686.274,500 620,500 C553.726,500 500,553.726 500,620 L540,620 Z'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg width='600' height='600' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' stroke='%23B19E5F' stroke-width='2' d='M50,250 L100,200 L150,250 L200,200 L250,250 L300,200 L350,250 L400,200 L450,250 L500,200 L550,250 M50,300 L100,350 L150,300 L200,350 L250,300 L300,350 L350,300 L400,350 L450,300 L500,350 L550,300 M150,100 L200,150 L250,100 L300,150 L350,100 L400,150 L450,100 M150,500 L200,450 L250,500 L300,450 L350,500 L400,450 L450,500'/%3E%3C/svg%3E")`,
  };

  return (
    <div style={backgroundStyle}>
      <div style={patternStyle} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

// Brand-compliant Button component
const Button = ({ children, onClick, primary = false, icon, title, style = {} }) => {
  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "Poppins, sans-serif",
    fontWeight: 500,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    ...style
  };

  const buttonStyle = primary
    ? {
        ...baseStyle,
        backgroundColor: colors.salmon,
        color: colors.white,
        "&:hover": {
          backgroundColor: "#E88A60",
        },
      }
    : {
        ...baseStyle,
        backgroundColor: colors.white,
        color: colors.blue,
        border: `1px solid ${colors.grey}`,
        "&:hover": {
          backgroundColor: colors.lightGrey,
        },
      };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      title={title}
    >
      {icon && icon}
      {children}
    </button>
  );
};

// Settings Modal Component
const SettingsModal = ({ onClose }) => {
  const [settings, setSettings] = useState({
    companyName: "Synguard Solutions",
    country: "UK",
    currency: "£"
  });

  const countryOptions = [
    "UK", "Ireland", "Belgium", "Italy", "Spain", "Netherlands", "Germany",
    "France", "Poland", "Finland", "Sweden", "Denmark", "UAE", "US"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
      // Auto-set currency based on country
      ...(name === 'country' && {
        currency: ["UK", "Ireland"].includes(value) ? "£" : (value === "US" ? "$" : "€")
      })
    }));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      fontFamily: "Poppins, sans-serif"
    }}>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: "8px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{
          padding: "20px",
          borderBottom: `1px solid ${colors.grey}`,
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: colors.blue,
          color: colors.white
        }}>
          <h2 style={{ margin: 0, fontWeight: 500, fontSize: "18px" }}>System Settings</h2>
          <button 
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: colors.white,
              fontSize: "24px",
              cursor: "pointer",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          padding: "20px",
          maxHeight: "70vh",
          overflowY: "auto"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: colors.blue }}>
              Company Name <span style={{ color: colors.salmon }}>*</span>
            </label>
            <input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: `1px solid ${colors.grey}`,
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: colors.blue }}>
              Default Country <span style={{ color: colors.salmon }}>*</span>
            </label>
            <select
              name="country"
              value={settings.country}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: `1px solid ${colors.grey}`,
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: colors.white
              }}
            >
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <small style={{ display: "block", marginTop: "5px", color: colors.darkGrey, fontSize: "12px" }}>
              Country selection affects contact details and VAT rates in quotes.
            </small>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: colors.blue }}>
              Currency
            </label>
            <input
              value={settings.currency}
              readOnly
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: `1px solid ${colors.grey}`,
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: colors.lightGrey
              }}
            />
            <small style={{ display: "block", marginTop: "5px", color: colors.darkGrey, fontSize: "12px" }}>
              Currency is automatically determined by country selection.
            </small>
          </div>
          
          {/* Contact Info Preview */}
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: colors.lightGrey,
            borderRadius: "5px",
            border: `1px solid ${colors.grey}`
          }}>
            <h4 style={{ 
              margin: "0 0 10px 0", 
              borderBottom: `1px solid ${colors.grey}`,
              paddingBottom: "8px",
              color: colors.blue,
              fontSize: "16px",
              fontWeight: 500
            }}>
              Contact Information Preview
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "8px", fontSize: "14px" }}>
              <div style={{ fontWeight: 600, color: colors.blue }}>Phone:</div>
              <div>+44 1234 567890</div>
              
              <div style={{ fontWeight: 600, color: colors.blue }}>Website:</div>
              <div>www.synguard.com</div>
              
              <div style={{ fontWeight: 600, color: colors.blue }}>Email:</div>
              <div>info@synguard.com</div>
              
              <div style={{ fontWeight: 600, color: colors.blue }}>Currency:</div>
              <div>{settings.currency}</div>
            </div>
          </div>
        </div>
        
        <div style={{
          padding: "15px 20px",
          borderTop: `1px solid ${colors.grey}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          backgroundColor: colors.white
        }}>
          <Button onClick={() => onClose()}>
            Cancel
          </Button>
          <Button primary onClick={() => onClose()}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function SynguardDashboard() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data
  const quotes = [
    { id: "SG-2023-001", name: "Mayflex HQ Security System", date: "2023-05-15", systemType: "Cloud", status: "Quick Config", totalValue: 25680.50, recurringValue: 1250.00, currency: "GBP" },
    { id: "SG-2023-002", name: "Securitek EU Office", date: "2023-06-22", systemType: "On-Prem", status: "Advanced Config", totalValue: 18450.75, recurringValue: 0, currency: "EUR" },
    { id: "SG-2023-003", name: "DataSafe Cloud Migration", date: "2023-07-10", systemType: "Cloud", status: "Quick Config", totalValue: 12350.00, recurringValue: 850.00, currency: "GBP" },
    { id: "SG-2023-004", name: "TechCorp Berlin", date: "2023-08-05", systemType: "On-Prem", status: "Advanced Config", totalValue: 31280.25, recurringValue: 0, currency: "EUR" },
    { id: "SG-2023-005", name: "GlobalSecure London", date: "2023-09-18", systemType: "Hybrid", status: "Quick Config", totalValue: 45120.80, recurringValue: 2200.00, currency: "GBP" },
  ];

  const filteredQuotes = quotes.filter(quote => 
    quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.systemType && quote.systemType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const salesContacts = [
    { id: 1, name: "John Smith", email: "john.smith@synguard.com", phone: "+44 20 1234 5678", region: "UK" },
    { id: 2, name: "Emma Johnson", email: "emma.johnson@synguard.com", phone: "+1 555 987 6543", region: "US" },
    { id: 3, name: "Liam Brown", email: "liam.brown@synguard.com", phone: "+33 1 2345 6789", region: "EU" },
  ];

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      fontFamily: "Poppins, sans-serif",
      background: colors.lightGrey
    }}>
      {/* Header */}
      <GridBackground type="logo">
        <div style={{ 
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
              margin: 0, 
              color: colors.white, 
              fontSize: "20px", 
              fontWeight: "500",
              letterSpacing: "0.5px"
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
          
          <div style={{ color: colors.white, fontSize: "14px" }}>
            Welcome, Admin | <a href="#" style={{ color: colors.salmon, textDecoration: "none" }}>Logout</a>
          </div>
        </div>
      </GridBackground>

      {/* Main Content */}
      <div style={{ 
        flex: 1,
        padding: "20px 30px",
        overflow: "auto"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Title and Actions */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px"
          }}>
            <h2 style={{ margin: 0, color: colors.blue, fontWeight: 500 }}>Quote Management Dashboard</h2>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <Button icon={<IconPlus />} primary>
                New Quote
              </Button>
              <Button icon={<IconFile />}>
                Products
              </Button>
              <Button icon={<IconUsers />}>
                Users
              </Button>
              <Button icon={<IconTools />}>
                Advanced Config
              </Button>
              <Button 
                icon={<IconCog />} 
                onClick={() => setShowSettingsModal(true)}
                title="System Settings"
              >
                Settings
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div style={{ 
            position: "relative",
            marginBottom: "25px",
            maxWidth: "400px"
          }}>
            <IconSearch style={{ 
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.darkGrey,
              fontSize: "16px"
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
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                fontFamily: "Poppins, sans-serif"
              }}
            />
          </div>
          
          {/* Quotes Section */}
          <div style={{ 
            backgroundColor: colors.white,
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
            marginBottom: "30px"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <h3 style={{ 
                margin: 0, 
                color: colors.blue, 
                fontWeight: 500,
                position: "relative",
                paddingLeft: "15px",
                fontSize: "18px"
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
                Showing {filteredQuotes.length} of {quotes.length} quotes
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
                    <tr style={{ 
                      backgroundColor: colors.lightGrey,
                      color: colors.blue,
                    }}>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600,
                        borderTopLeftRadius: "6px",
                        borderBottomLeftRadius: "6px"
                      }}>Name</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Date</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>System Type</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Added With</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "right", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Total Value</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "right", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Recurring</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "center", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600,
                        borderTopRightRadius: "6px",
                        borderBottomRightRadius: "6px"
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map((quote, index) => {
                      const isLastRow = index === filteredQuotes.length - 1;
                      const currencySymbol = quote.currency === "GBP" ? "£" : (quote.currency === "USD" ? "$" : "€");
                      
                      return (
                        <tr key={quote.id} style={{ 
                          backgroundColor: index % 2 === 0 ? colors.white : colors.lightGrey,
                          transition: "background-color 0.2s ease"
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
                                  : "#002C5F")
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
                            {currencySymbol}{quote.totalValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                          <td style={{ 
                            padding: "14px 15px", 
                            textAlign: "right",
                            borderBottom: isLastRow ? "none" : `1px solid ${colors.grey}`
                          }}>
                            {quote.recurringValue > 0 
                              ? `${currencySymbol}${quote.recurringValue.toLocaleString(undefined, {
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
                                  fontSize: "16px",
                                  padding: "5px",
                                  borderRadius: "4px",
                                  transition: "background-color 0.2s",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "30px",
                                  height: "30px"
                                }}
                                title={`Edit ${quote.name}`}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              >
                                <IconEdit />
                              </button>
                              <button
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "#d9534f",
                                  fontSize: "16px",
                                  padding: "5px",
                                  borderRadius: "4px",
                                  transition: "background-color 0.2s",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "30px",
                                  height: "30px"
                                }}
                                title={`Delete ${quote.name}`}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.lightGrey}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                              >
                                <IconTrash />
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
            padding: "20px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <h3 style={{ 
                margin: 0, 
                color: colors.blue, 
                fontWeight: 500,
                position: "relative",
                paddingLeft: "15px",
                fontSize: "18px"
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
            </div>
            
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
                    <tr style={{ 
                      backgroundColor: colors.lightGrey,
                      color: colors.blue,
                    }}>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600,
                        borderTopLeftRadius: "6px",
                        borderBottomLeftRadius: "6px"
                      }}>Name</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Email</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
                        fontWeight: 600 
                      }}>Phone</th>
                      <th style={{ 
                        padding: "12px 15px", 
                        textAlign: "left", 
                        borderBottom: `1px solid ${colors.grey}`,
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
                                ? "#002C5F" 
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
      </div>
      
      {/* Footer */}
      <GridBackground>
        <div style={{ 
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: colors.white,
          fontSize: "12px"
        }}>
          <div>
            &copy; {new Date().getFullYear()} Synguard. All rights reserved.
          </div>
          <div>
            ALWAYS WITH YOU
          </div>
        </div>
      </GridBackground>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
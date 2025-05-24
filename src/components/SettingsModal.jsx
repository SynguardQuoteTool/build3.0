import React, { useState } from "react";

export default function SettingsModal({ onClose }) {
  const getStoredSettings = () => {
    try {
      const stored = localStorage.getItem('systemSettings');
      return stored ? JSON.parse(stored) : { companyName: '', country: 'UK', currency: '£' };
    } catch {
      return { companyName: '', country: 'UK', currency: '£' };
    }
  };

  const [settings, setSettings] = useState(getStoredSettings());

  const countryData = {
    UK: { phone: "+44 1234 567890", website: "www.synguard.com", email: "info@synguard.com", currency: "£" },
    Ireland: { phone: "+353 1 234 5678", website: "www.synguard.ie", email: "info@synguard.ie", currency: "£" },
    Belgium: { phone: "+32 11 249292", website: "www.synguard.be", email: "info@synguard.be", currency: "€" },
    US: { phone: "+1 800 123 4567", website: "www.synguard.us", email: "info@synguard.us", currency: "$" }
  };

  const countryOptions = Object.keys(countryData).sort();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "country") {
      const selectedCountry = value;
      const associatedCurrency = countryData[selectedCountry]?.currency || "£";
      
      setSettings(prev => ({
        ...prev,
        country: selectedCountry,
        currency: associatedCurrency,
        contactInfo: countryData[selectedCountry]
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      alert("Settings saved successfully");
      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>System Settings</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Company Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            name="companyName"
            value={settings.companyName || ""}
            onChange={handleChange}
            placeholder="Enter your company name"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Default Country <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="country"
            value={settings.country || "UK"}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Currency
          </label>
          <input
            value={settings.currency || countryData[settings.country || "UK"].currency}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
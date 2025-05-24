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
    UK: { phone: "+44 1234 567890", website: "www.synguard.co.uk", email: "info@synguard.com", currency: "£" },
    Ireland: { phone: "+353 1 234 5678", website: "www.synguard.co.uk", email: "info@synguard.co.uk", currency: "€" },
    Belgium: { phone: "+32 11 249292", website: "www.synguard.be", email: "info@synguard.be", currency: "€" },
    Netherlands: { phone: "+49 30 123 4567", website: "www.synguard.nl", email: "info@synguard.nl", currency: "€" },

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
      alert("Settings saved successfully!");
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
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#002C5F' }}>System Settings</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002C5F' }}>
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
              border: '1px solid #E1E5EA',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002C5F' }}>
            Default Country <span style={{ color: "red" }}>*</span>
          </label>
          <select
            name="country"
            value={settings.country || "UK"}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #E1E5EA',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002C5F' }}>
            Currency
          </label>
          <input
            value={settings.currency || countryData[settings.country || "UK"].currency}
            readOnly
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #E1E5EA',
              borderRadius: '4px',
              backgroundColor: '#F5F5F5',
              fontSize: '14px'
            }}
          />
          <small style={{ color: '#6C757D', fontSize: '12px' }}>
            Currency is automatically determined by country selection.
          </small>
        </div>

        {/* Contact Preview */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#F5F5F5', 
          borderRadius: '6px', 
          marginBottom: '20px' 
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#002C5F' }}>Contact Information Preview</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            <div><strong>Phone:</strong> {countryData[settings.country || "UK"].phone}</div>
            <div><strong>Website:</strong> {countryData[settings.country || "UK"].website}</div>
            <div><strong>Email:</strong> {countryData[settings.country || "UK"].email}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6C757D',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#002C5F',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
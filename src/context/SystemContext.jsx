import React, { createContext, useContext, useState, useEffect } from "react";

const SystemContext = createContext();

export function useSystem() {
  return useContext(SystemContext);
}

export function SystemProvider({ children }) {
  const [systemSettings, setSystemSettings] = useState(() => {
    // Try to load from localStorage first
    const savedSettings = localStorage.getItem('systemSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
    
    // Default settings
    return {
      companyName: "",
      country: "UK",
      currency: "£",
      contactInfo: {
        phone: "+44 1234 567890",
        website: "www.synguard.com",
        email: "info@synguard.com"
      }
    };
  });

  const updateSystemSettings = (newSettings) => {
    setSystemSettings(newSettings);
    localStorage.setItem('systemSettings', JSON.stringify(newSettings));
  };

  const value = {
    systemSettings,
    updateSystemSettings
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
}
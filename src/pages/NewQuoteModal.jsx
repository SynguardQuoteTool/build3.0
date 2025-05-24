import React, { useState } from "react";
import { useQuotes } from "../context/QuotesContext";
import "./ModalStyles.css";
import { useSystem } from "../context/SystemContext";

export default function NewQuoteModal({ onAction, onClose }) {
  const { systemSettings } = useSystem() || {};
  const { addQuote, currentUser } = useQuotes();

  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    systemType: "",
  });

  const systemTypeOptions = ["Cloud", "On-Prem"];
  const defaultSelectOption = "- Select -";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentCurrency = () => {
    try {
      const settings = localStorage.getItem('systemSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        return {
          currency: parsed.currency || '£',
          currencyCode: parsed.currency === '€' ? 'EUR' : (parsed.currency === '$' ? 'USD' : 'GBP')
        };
      }
    } catch (e) {
      // ignore
    }
    return { currency: '£', currencyCode: 'GBP' };
  };
  
  const handleManualQuote = () => {
    if (!formData.name.trim()) {
      alert("Please enter a quote name.");
      return;
    }
    if (!formData.systemType) {
      alert("Please select a system type.");
      return;
    }
  
    const currentCurrency = getCurrentCurrency();
  
    const quoteObject = {
      id: String(Date.now()),
      name: formData.name.trim(),
      created: new Date().toISOString(),
      status: "Manual Quote",
      company: currentUser?.company || systemSettings?.companyName || "N/A",
      items: [],
      systemDetails: {
        systemType: formData.systemType,
      },
      projectType: formData.systemType,
      totalOneOff: "0.00",
      totalMonthly: "0.00",
      smcCost: "0.00",
      currency: currentCurrency.currencyCode,
      currencySymbol: currentCurrency.currency,
      approvalStatus: "Pending",
      client: "N/A",
      date: formData.date,
      notes: "",
      country: systemSettings?.country || "UK",
    };

    try {
      if (typeof addQuote === "function") {
        console.log("Saving manual quote:", quoteObject);
        addQuote(quoteObject);
        onAction("manual", quoteObject);
      } else {
        console.error("Error: addQuote is not a function.");
        alert("Error: Could not save quote.");
      }
    } catch (error) {
      console.error("Error saving quote:", error);
      alert(`Failed to save quote. Error: ${error.message}`);
    }
  };

  const handleSystemConfig = () => {
    if (!formData.name.trim()) {
      alert("Please enter a quote name.");
      return;
    }
    if (!formData.systemType) {
      alert("Please select a system type.");
      return;
    }
    onAction("system", formData);
  };

  return (
    <div className="sg-modal-overlay">
      <div className="sg-modal">
        <div className="sg-modal-header">
          <h2>Create New Quote</h2>
        </div>
        <div className="sg-modal-content">
          <div className="sg-form-group">
            <label>
              Quote Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="sg-form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter quote name..."
              required
            />
          </div>
          <div className="sg-form-group">
            <label>Date</label>
            <input
              className="sg-form-control"
              type="date"
              name="date"
              value={formData.date}
              readOnly
            />
          </div>
          <div className="sg-form-group">
            <label>
              System Type <span style={{ color: "red" }}>*</span>
            </label>
            <select
              className="sg-form-control"
              name="systemType"
              value={formData.systemType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                {defaultSelectOption}
              </option>
              {systemTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sg-modal-footer">
          <button 
            className="sg-btn sg-btn-primary"
            onClick={handleManualQuote}
          >
            Manual Quote
          </button>
          <button 
            className="sg-btn sg-btn-success"
            onClick={handleSystemConfig}
          >
            Continue to System Configuration
          </button>
          <button 
            className="sg-btn sg-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import "./ModalStyles.css";

export default function ControllerSelectionModal({ initialSelections = {}, onSave, onClose }) {
  const [selections, setSelections] = useState(initialSelections);

  const handleChange = (model, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setSelections(prev => ({
      ...prev,
      [model]: numValue
    }));
  };

  const handleSave = () => {
    onSave(selections);
  };

  return (
    <div className="sg-modal-overlay">
      <div className="sg-modal">
        <div className="sg-modal-header">
          <h2>Manual Controller Selection</h2>
        </div>
        <div className="sg-modal-content">
          <p>Adjust controller quantities manually:</p>
          
          {Object.keys(selections).map((model) => (
            <div key={model} className="sg-form-group">
              <label>{model}</label>
              <input
                className="sg-form-control"
                type="number"
                min="0"
                value={selections[model]}
                onChange={(e) => handleChange(model, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="sg-modal-footer">
          <button 
            className="sg-btn sg-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="sg-btn sg-btn-primary"
            onClick={handleSave}
          >
            Save Selections
          </button>
        </div>
      </div>
    </div>
  );
}
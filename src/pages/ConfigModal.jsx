import React, { useState, useEffect } from "react";
import "./ModalStyles.css";

export default function ConfigModal({ initial, doorCountOptions = [], onSave, onClose }) {
  const [config, setConfig] = useState({
    protocol: initial?.protocol || "",
    doorComms: initial?.doorComms || "",
    deployment: initial?.deployment || "In Only",
    targetDoorsPerController: initial?.targetDoorsPerController || "",
    allowFlexibility: initial?.allowFlexibility || false,
    cloudMode: initial?.cloudMode || "",
  });

  // Define valid combinations with cascading restrictions
  const getValidCommOptions = (protocol) => {
    if (!protocol) return [];
    
    const options = [];
    
    if (protocol === 'Wiegand') {
      options.push(
        { value: 'IP', label: 'IP' },
        { value: 'RS-485', label: 'RS-485' }
      );
    } else if (protocol === 'OSDP') {
      options.push(
        { value: 'IP', label: 'IP' },
        { value: 'RS-485', label: 'RS-485' },
        { value: 'Mixed (RS-485 & IP)', label: 'Mixed (RS-485 & IP)' }
      );
    }
    
    return options;
  };

  const getValidDeploymentOptions = (protocol, doorComms) => {
    if (!protocol || !doorComms) return [];
    
    const options = [
      { value: 'In Only', label: 'In Only' }
    ];
    
    // Wiegand + In & Out is only possible with RS-485
    if (protocol === 'Wiegand') {
      if (doorComms === 'RS-485') {
        options.push({ value: 'In & Out', label: 'In & Out' });
      }
      // Wiegand + IP cannot support In & Out
    } else if (protocol === 'OSDP') {
      // OSDP supports In & Out with any communication type
      options.push({ value: 'In & Out', label: 'In & Out' });
    }
    
    return options;
  };

  const getValidTargetDoorOptions = (protocol, doorComms, deployment) => {
    if (!protocol || !doorComms || !deployment) return [];
    
    const options = [];
    
    if (protocol === 'Wiegand') {
      if (deployment === 'In Only') {
        if (doorComms === 'IP') {
          options.push({ value: '1', label: '1 Door per Controller' });
        } else if (doorComms === 'RS-485') {
          options.push(
            { value: '1', label: '1 Door per Controller' },
            { value: '2', label: '2 Doors per Controller' },
            { value: '4', label: '4 Doors per Controller' }
          );
        }
      } else if (deployment === 'In & Out') {
        if (doorComms === 'RS-485') {
          // Special case: Wiegand In&Out only supports 1 door per controller
          options.push({ value: '1', label: '1 Door per Controller (In&Out Mode)' });
        }
      }
    } else if (protocol === 'OSDP') {
      if (doorComms === 'IP') {
        options.push(
          { value: '1', label: '1 Door per Controller' },
          { value: '8', label: '8 Doors per Controller' }
        );
      } else if (doorComms === 'RS-485') {
        options.push(
          { value: '1', label: '1 Door per Controller' },
          { value: '2', label: '2 Doors per Controller' },
          { value: '4', label: '4 Doors per Controller' },
          { value: '8', label: '8 Doors per Controller' }
        );
      } else if (doorComms === 'Mixed (RS-485 & IP)') {
        options.push(
          { value: '1', label: '1 Door per Controller' },
          { value: '2', label: '2 Doors per Controller' },
          { value: '4', label: '4 Doors per Controller' },
          { value: '8', label: '8 Doors per Controller' }
        );
      }
    }
    
    return options;
  };

  // Effect to cascade changes and reset invalid selections
  useEffect(() => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      let hasChanges = false;

      // Step 1: Validate communications based on protocol
      const validComms = getValidCommOptions(newConfig.protocol);
      const currentCommValid = validComms.some(opt => opt.value === newConfig.doorComms);
      
      if (!currentCommValid) {
        newConfig.doorComms = '';
        hasChanges = true;
      }

      // Step 2: Validate deployment based on protocol + communications
      if (newConfig.doorComms) {
        const validDeployments = getValidDeploymentOptions(newConfig.protocol, newConfig.doorComms);
        const currentDeploymentValid = validDeployments.some(opt => opt.value === newConfig.deployment);
        
        if (!currentDeploymentValid && validDeployments.length > 0) {
          newConfig.deployment = validDeployments[0].value;
          hasChanges = true;
        }
      }

      // Step 3: Validate target doors based on all selections
      if (newConfig.doorComms && newConfig.deployment) {
        const validTargets = getValidTargetDoorOptions(newConfig.protocol, newConfig.doorComms, newConfig.deployment);
        const currentTargetValid = !newConfig.targetDoorsPerController || 
                                 validTargets.some(opt => opt.value === newConfig.targetDoorsPerController);
        
        if (!currentTargetValid) {
          newConfig.targetDoorsPerController = '';
          newConfig.allowFlexibility = false; // Reset flexibility when target is reset
          hasChanges = true;
        }
      }

      return hasChanges ? newConfig : prevConfig;
    });
  }, [config.protocol, config.doorComms, config.deployment]); // Added deployment to trigger recalculation

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate that we have all required selections
    if (!config.protocol || !config.doorComms || !config.deployment) {
      alert('Please complete all configuration selections.');
      return;
    }

    // Check if the combination is valid
    const validComms = getValidCommOptions(config.protocol);
    const validDeployments = getValidDeploymentOptions(config.protocol, config.doorComms);
    
    if (!validComms.some(opt => opt.value === config.doorComms)) {
      alert('Invalid communication type for selected protocol.');
      return;
    }
    
    if (!validDeployments.some(opt => opt.value === config.deployment)) {
      alert('Invalid deployment type for selected protocol and communication combination.');
      return;
    }

    onSave(config);
  };

  const validCommOptions = getValidCommOptions(config.protocol);
  const validDeploymentOptions = getValidDeploymentOptions(config.protocol, config.doorComms);
  const validTargetOptions = getValidTargetDoorOptions(config.protocol, config.doorComms, config.deployment);

  return (
    <div className="sg-modal-overlay">
      <div className="sg-modal">
        <div className="sg-modal-header">
          <h2>System Configuration</h2>
        </div>
        <div className="sg-modal-content">
          {/* Protocol Selection - First tier */}
          <div className="sg-form-group">
            <label>Protocol *</label>
            <select
              className="sg-form-control"
              value={config.protocol}
              onChange={(e) => handleChange("protocol", e.target.value)}
            >
              <option value="" disabled>
                Select Protocol
              </option>
              <option value="Wiegand">Wiegand</option>
              <option value="OSDP">OSDP</option>
            </select>
          </div>
          
          {/* Communications Type - Second tier (depends on Protocol) */}
          <div className="sg-form-group">
            <label>Communications Type *</label>
            <select
              className="sg-form-control"
              value={config.doorComms}
              onChange={(e) => handleChange("doorComms", e.target.value)}
              disabled={!config.protocol}
              style={{
                backgroundColor: !config.protocol ? '#f8f9fa' : 'white',
                cursor: !config.protocol ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="" disabled>
                {!config.protocol ? 'Select Protocol First' : 'Select Communications'}
              </option>
              {validCommOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {config.protocol === 'Wiegand' && (
              <small style={{ 
                display: "block", 
                marginTop: "5px", 
                color: "#6c757d", 
                fontSize: "12px" 
              }}>
                Wiegand supports IP and RS-485 communications
              </small>
            )}
          </div>
          
          {/* Deployment - Third tier (depends on Protocol + Communications) */}
          <div className="sg-form-group">
            <label>Deployment *</label>
            <select
              className="sg-form-control"
              value={config.deployment}
              onChange={(e) => handleChange("deployment", e.target.value)}
              disabled={!config.protocol || !config.doorComms}
              style={{
                backgroundColor: (!config.protocol || !config.doorComms) ? '#f8f9fa' : 'white',
                cursor: (!config.protocol || !config.doorComms) ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="" disabled>
                {(!config.protocol || !config.doorComms) ? 'Complete Above Selections' : 'Select Deployment'}
              </option>
              {validDeploymentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {config.protocol === 'Wiegand' && config.doorComms === 'IP' && (
              <small style={{ 
                display: "block", 
                marginTop: "5px", 
                color: "#dc3545", 
                fontSize: "12px" 
              }}>
                ⚠️ Wiegand + IP does not support In & Out readers
              </small>
            )}
            {config.protocol === 'Wiegand' && config.deployment === 'In & Out' && (
              <small style={{ 
                display: "block", 
                marginTop: "5px", 
                color: "#856404", 
                fontSize: "12px" 
              }}>
                ℹ️ Wiegand In & Out requires RS-485 communication and uses 1 controller per door
              </small>
            )}
          </div>
          
          {/* Target Doors per Controller - Fourth tier (depends on all above) */}
          {validTargetOptions.length > 0 && (
            <div className="sg-form-group">
              <label>
                Target Doors per Controller
                <span 
                  style={{ 
                    cursor: "help", 
                    marginLeft: "5px", 
                    color: "#007bff",
                    fontSize: "14px"
                  }}
                  title="Set the number of doors required per controller. This is a system wide setting, to specify custom controllers use the Advanced Quote tool."
                >
                  ℹ️
                </span>
              </label>
              <select
                className="sg-form-control"
                value={config.targetDoorsPerController}
                onChange={(e) => handleChange("targetDoorsPerController", e.target.value)}
                disabled={validTargetOptions.length === 0}
              >
                <option value="">Auto (Optimize)</option>
                {validTargetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small style={{ 
                display: "block", 
                marginTop: "5px", 
                color: "#6c757d", 
                fontSize: "12px" 
              }}>
                Available options based on your protocol, communication, and deployment selections.
              </small>
            </div>
          )}

          {/* Flexibility Option - Only shown when target is selected */}
          {config.targetDoorsPerController && validTargetOptions.length > 1 && (
            <div className="sg-form-group">
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={config.allowFlexibility}
                  onChange={(e) => handleChange("allowFlexibility", e.target.checked)}
                  style={{ marginRight: "8px" }}
                />
                Flexibility: Smaller controllers
                <span 
                  style={{ 
                    cursor: "help", 
                    marginLeft: "5px", 
                    color: "#007bff",
                    fontSize: "14px"
                  }}
                  title="Allow deviation from target doors per controller to create the most efficient system design, whilst not moving away from the required comms type."
                >
                  ℹ️
                </span>
              </label>
              <small style={{ 
                display: "block", 
                marginTop: "5px", 
                color: "#6c757d", 
                fontSize: "12px",
                marginLeft: "20px"
              }}>
                Allow deviation from target doors per controller to create the most efficient system design, 
                whilst not moving away from the required comms type.
              </small>
            </div>
          )}

          {/* Configuration Summary */}
          {config.protocol && config.doorComms && config.deployment && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "4px"
            }}>
              <strong>Configuration Summary:</strong>
              <div style={{ marginTop: "5px", fontSize: "14px" }}>
                {config.protocol} | {config.doorComms} | {config.deployment}
                {config.targetDoorsPerController && ` | Target: ${config.targetDoorsPerController} Door${config.targetDoorsPerController !== '1' ? 's' : ''}`}
                {config.allowFlexibility && " | Flexibility Enabled"}
              </div>
            </div>
          )}
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
            disabled={!config.protocol || !config.doorComms || !config.deployment}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
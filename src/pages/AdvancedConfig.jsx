/**
 * AdvancedConfig.jsx
 *
 * Allows detailed configuration of Synguard access control systems,
 * supporting multiple sites and multiple site controllers per site.
 * Features collapsible controller views, door configuration, rule application,
 * resource calculation, and quote saving.
 */
 import React, { useState, useMemo, useEffect, useCallback } from "react";
 import { useNavigate } from "react-router-dom";
 import { useQuotes } from "../context/QuotesContext"; // Get context
 import { useProducts } from '../context/ProductsContext'; // Get products context
 import { v4 as uuid } from "uuid";
 import './AdvancedConfig.css'; // Styles for the component
 import {
     FaDoorOpen, FaDoorClosed, FaExchangeAlt, FaSignInAlt, FaSignOutAlt,
     FaPlug, FaLock, FaVolumeUp, FaCog, FaServer, FaSitemap, FaNetworkWired,
     FaPlus, FaTrashAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle,
     FaChevronUp, FaChevronDown // Added for collapse/expand
 } from 'react-icons/fa';
 import { BsArrowLeftRight } from 'react-icons/bs';
 
 // --- Configuration Constants ---
 const READER_PROTOCOLS = ["Wiegand", "OSDP"];
 const READER_MODES = ["In", "In/Out"];
 const INPUT_TYPES = ["Not Used", "Exit Button", "Door Status", "Generic"];
 const OUTPUT_TYPES = ["Not Used", "Door Lock", "Sounder", "Generic"];
 const MAX_DOORS_PER_SYNAPP_SYSTEM = 32; // Max 32 doors total for a SynApp + its dependents system
 
 // --- Controller Definitions (KEEP for structure/rules/capacity info not easily derived from product data) ---
 // Using updated SynApp limits (32 deps OR 128 readers)
 const CONTROLLERS = [
     { model: "SynApp",       description: "Main Site Controller",             inputs: 3,  outputs: 2, doorsSupported: 1, readersSupported: 2, supportsWiegand: true, isSiteController: true, maxDeps: 32, maxDepReaders: 128 },
     { model: "SynOne",       description: "1-Door IP Controller",             inputs: 3,  outputs: 2, doorsSupported: 1, readersSupported: 2, supportsWiegand: true, isSiteController: true, maxDeps: 0, maxDepReaders: 0 },
     { model: "SynConSC",     description: "2-Door RS-485 Controller",         inputs: 6,  outputs: 2, doorsSupported: 2, readersSupported: 4, supportsWiegand: true, isSiteController: false, maxDeps: 0, maxDepReaders: 0 },
     { model: "SynConDuoDuo", description: "4-Door RS-485 Controller",         inputs: 12, outputs: 4, doorsSupported: 4, readersSupported: 4, supportsWiegand: true, isSiteController: false, maxDeps: 0, maxDepReaders: 0 },
     { model: "SynConEvo",    description: "8-Door IP Controller (OSDP only)", inputs: 20, outputs: 8, doorsSupported: 8, readersSupported: 8, supportsWiegand: false, isSiteController: false, maxDeps: 0, maxDepReaders: 0 },
     { model: "SynIO",        description: "I/O Module",                       inputs: 16, outputs: 16, doorsSupported: 0, readersSupported: 0, supportsWiegand: true, isSiteController: false, maxDeps: 0, maxDepReaders: 0 },
 ];
 
 // --- Helper Functions for State Creation ---
 const createDoor = (doorNumber, enabled = true) => ({
     id: uuid(), doorNumber, enabled,
     config: { readerProtocol: 'Wiegand', readerMode: 'In', input1: 'Door Status', input2: 'Exit Button', input3: 'Not Used', output1: 'Door Lock', output2: 'Not Used' },
     isDisabledByRule: false, forcedEnableState: null, restrictedOptions: {},
 });
 
 const createController = (model) => {
     const controllerDef = CONTROLLERS.find(c => c.model === model);
     if (!controllerDef) return null;
     const doors = [];
     for (let i = 1; i <= controllerDef.doorsSupported; i++) {
         const newDoor = createDoor(i);
         if (!controllerDef.supportsWiegand) { newDoor.config.readerProtocol = 'OSDP'; } // Set OSDP default for non-Wiegand
         doors.push(newDoor);
     }
     return {
         id: uuid(), model: controllerDef.model, description: controllerDef.description,
         inputs: controllerDef.inputs, outputs: controllerDef.outputs,
         doorsSupported: controllerDef.doorsSupported, readersSupported: controllerDef.readersSupported,
         supportsWiegand: controllerDef.supportsWiegand, isSiteController: controllerDef.isSiteController,
         maxDeps: controllerDef.maxDeps, maxDepReaders: controllerDef.maxDepReaders,
         doors: doors,
         dependentControllers: controllerDef.model === 'SynApp' ? [] : undefined, // Only SynApp gets array
         parentId: null
     };
 };

 // ==================================================
//           DoorConfigurator Component
// ==================================================
function DoorConfigurator({ siteId, controllerId, door, onUpdateConfig, onToggleEnable }) {
    const { id: doorId, doorNumber, enabled, config, isDisabledByRule, forcedEnableState, restrictedOptions = {} } = door;
    const isEffectivelyEnabled = forcedEnableState !== null ? forcedEnableState : enabled;
    const isUserInteractionDisabled = isDisabledByRule || forcedEnableState !== null;
    const handleChange = (field, value) => { onUpdateConfig(siteId, controllerId, doorId, field, value); };
    const getSelectOptions = (options, restricted = []) => {
         const safeRestricted = Array.isArray(restricted) ? restricted : [];
        return options.map(opt => (<option key={opt} value={opt} disabled={safeRestricted.includes(opt)}>{opt} {safeRestricted.includes(opt) && "(Rule)"}</option>));
    };
    const containerClass = `door-config-box ${isEffectivelyEnabled ? 'enabled' : 'disabled'} ${isUserInteractionDisabled ? 'disabled-by-rule' : ''}`;

    // Render simplified for brevity, logic is the same
    return (
        <div className={containerClass}>
            <div className="door-header">
                <span className="door-title">{isEffectivelyEnabled ? <FaDoorOpen /> : <FaDoorClosed />} Door {doorNumber}</span>
                <button className={`enable-disable-btn ${isEffectivelyEnabled ? 'enabled' : 'disabled'}`} onClick={() => !isUserInteractionDisabled && onToggleEnable(siteId, controllerId, doorId)} disabled={isUserInteractionDisabled} title={isUserInteractionDisabled ? "State controlled by rules" : (isEffectivelyEnabled ? "Disable" : "Enable")}>{forcedEnableState !== null ? (forcedEnableState ? 'Forced ON' : 'Forced OFF') : (enabled ? 'Disable' : 'Enable')}</button>
            </div>
            <div className="door-config-grid">
                <label><FaExchangeAlt /> Protocol: <select className="config-select" value={config.readerProtocol} onChange={(e) => handleChange('readerProtocol', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled} title={restrictedOptions?.readerProtocol?.length ? `Restricted: ${restrictedOptions.readerProtocol.join(', ')}` : ""}>{getSelectOptions(READER_PROTOCOLS, restrictedOptions?.readerProtocol)}</select></label>
                <label><BsArrowLeftRight /> Mode: <select className="config-select" value={config.readerMode} onChange={(e) => handleChange('readerMode', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled} title={restrictedOptions?.readerMode?.length ? `Restricted: ${restrictedOptions.readerMode.join(', ')}` : ""}>{getSelectOptions(READER_MODES, restrictedOptions?.readerMode)}</select></label>
                <div></div>
                <label title="Input 1"><FaPlug /> Input 1: <select className="config-select" value={config.input1} onChange={(e) => handleChange('input1', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled}>{getSelectOptions(INPUT_TYPES, restrictedOptions?.input1)}</select></label>
                <label title="Input 2"><FaPlug /> Input 2: <select className="config-select" value={config.input2} onChange={(e) => handleChange('input2', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled}>{getSelectOptions(INPUT_TYPES, restrictedOptions?.input2)}</select></label>
                <label title="Input 3"><FaPlug /> Input 3: <select className="config-select" value={config.input3} onChange={(e) => handleChange('input3', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled}>{getSelectOptions(INPUT_TYPES, restrictedOptions?.input3)}</select></label>
                <label title="Output 1"><FaPlug /> Output 1: <select className="config-select" value={config.output1} onChange={(e) => handleChange('output1', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled}>{getSelectOptions(OUTPUT_TYPES, restrictedOptions?.output1)}</select></label>
                <label title="Output 2"><FaPlug /> Output 2: <select className="config-select" value={config.output2} onChange={(e) => handleChange('output2', e.target.value)} disabled={isUserInteractionDisabled || !isEffectivelyEnabled}>{getSelectOptions(OUTPUT_TYPES, restrictedOptions?.output2)}</select></label>
                <div></div>
            </div>
            {isDisabledByRule && (<div className="rule-disable-overlay"><FaExclamationTriangle /> Config limited by rules</div>)}
        </div>
    );
}


// ==================================================
//          ControllerDisplay Component (with Collapse)
// ==================================================
function ControllerDisplay({
    siteId,
    controller,
    controllerIndex,
    siteIndex,
    onUpdateDoorConfig,
    onToggleDoor,
    onAddDependentController,
    onDeleteController,
    calculateSynAppDoorCount,
    maxDoorsPerSystem // Use the prop passed down
 }) {
    const { id: controllerId, model, description, doors = [], dependentControllers, isSiteController, maxDeps, maxDepReaders, parentId } = controller;
    const [isCollapsed, setIsCollapsed] = useState(false); // Collapsible state
    const ctrlDef = CONTROLLERS.find(c => c.model === model);
    const safeDependentControllers = model === 'SynApp' && Array.isArray(dependentControllers) ? dependentControllers : [];

    // Calculate Enabled/Disabled Door Summary for this controller's direct doors
    let enabledDoorCount = 0; let disabledDoorCount = 0;
    if (Array.isArray(doors)) { doors.forEach(door => { const isEffectivelyEnabled = door.forcedEnableState !== null ? door.forcedEnableState : door.enabled; if (isEffectivelyEnabled) { enabledDoorCount++; } else { disabledDoorCount++; } }); }
    const doorSummary = doors.length > 0 ? `(${enabledDoorCount} On / ${disabledDoorCount} Off)` : '';

    // Status Box Calculations
    let statusBoxContent = null;
    if (model === "SynApp") { const currentDeps = safeDependentControllers.length; const currentDepReaders = safeDependentControllers.reduce((sum, dep) => sum + (CONTROLLERS.find(c => c.model === dep.model)?.readersSupported || 0), 0); statusBoxContent = (<><span title={`Site ${siteIndex + 1} / Ctrl ${controllerIndex + 1}`}>SynApp {controllerIndex + 1}</span><span title={`Dep Readers`}>R: {currentDepReaders}/{maxDepReaders ?? 'N/A'}</span><span title={`Dep Controllers`}>C: {currentDeps}/{maxDeps ?? 'N/A'}</span></>); }
    else if (!isSiteController && parentId) { statusBoxContent = (<><span>Type: Dependent</span></>); }
    else if (isSiteController && model !== "SynApp") { statusBoxContent = (<><span>Site Ctrl {controllerIndex + 1}</span><span>Type: Site</span></>); }

    const toggleCollapse = () => setIsCollapsed(prev => !prev);

    return (
        <div className={`controller-container ${isSiteController ? 'site-controller-container' : 'dependent-controller-container'} ${model === 'SynApp' ? 'synapp-container' : ''}`}>
             <div className="controller-header clickable" onClick={toggleCollapse} title={isCollapsed ? "Expand" : "Collapse"}>
                 <span className="controller-title" title={description}>
                    <span className="collapse-icon">{isCollapsed ? <FaChevronDown /> : <FaChevronUp />}</span> <FaServer /> {model} {doorSummary && <span className="door-summary">{doorSummary}</span>}
                 </span>
                 {statusBoxContent && <div className="controller-status-box">{statusBoxContent}</div>}
                 <button onClick={(e) => { e.stopPropagation(); onDeleteController(siteId, controllerId); }} className="delete-controller-btn" title={`Delete ${model}`}><FaTrashAlt /></button>
            </div>
             {!isCollapsed && ( <>
                    <div className="controller-body">
                        {doors.map((door) => (<DoorConfigurator key={door.id} siteId={siteId} controllerId={controllerId} door={door} onUpdateConfig={onUpdateDoorConfig} onToggleEnable={onToggleDoor} />))}
                        {doors.length === 0 && model !== 'SynIO' && <p className="no-doors-message">No doors.</p>} {model === 'SynIO' && <p className="no-doors-message">SynIO: No doors.</p>}
                    </div>
                    {model === "SynApp" && (
                        <div className="dependent-controllers-area">
                            <h5 className="dependent-title"><FaNetworkWired /> Dependents ({safeDependentControllers.length}/{maxDeps ?? 'N/A'})</h5>
                             {safeDependentControllers.map((depCtrl, depIndex) => (<ControllerDisplay key={depCtrl.id} siteId={siteId} controller={depCtrl} controllerIndex={depIndex} siteIndex={siteIndex} onUpdateDoorConfig={onUpdateDoorConfig} onToggleDoor={onToggleDoor} onAddDependentController={() => {}} onDeleteController={onDeleteController} calculateSynAppDoorCount={calculateSynAppDoorCount} maxDoorsPerSystem={maxDoorsPerSystem} /> ))}
                             {(safeDependentControllers.length < (maxDeps ?? 0)) && ( <div className="add-dependent-controller indented"> <select value="" onChange={e => { if(e.target.value) onAddDependentController(siteId, controllerId, e.target.value); }} title="Add Dependent"> <option value="" disabled>Add Dependent...</option> {CONTROLLERS.filter(c => !c.isSiteController).map(c => { const ctrlToAddDef = CONTROLLERS.find(cd => cd.model === c.model); if (!ctrlToAddDef) return null; const readerCost = ctrlToAddDef.readersSupported || 0; const doorCost = ctrlToAddDef.doorsSupported || 0; const currentDepReaders = safeDependentControllers.reduce((sum, dep) => sum + (CONTROLLERS.find(cd => cd.model === dep.model)?.readersSupported || 0), 0); const currentTotalDoors = calculateSynAppDoorCount ? calculateSynAppDoorCount(controllerId) : 0; const readerLimit = maxDepReaders ?? Infinity; const doorLimit = maxDoorsPerSystem ?? Infinity; const exceedsReaderLimit = currentDepReaders + readerCost > readerLimit; const exceedsDoorLimit = currentTotalDoors + doorCost > doorLimit; const isDisabled = exceedsReaderLimit || exceedsDoorLimit; let disabledTitle = c.description; if (exceedsReaderLimit) disabledTitle += ` | Exceeds reader limit (${currentDepReaders + readerCost}/${readerLimit})`; if (exceedsDoorLimit) disabledTitle += ` | Exceeds system door limit (${currentTotalDoors + doorCost}/${doorLimit})`; return (<option key={c.model} value={c.model} disabled={isDisabled} title={isDisabled ? disabledTitle : c.description}>{c.model} {isDisabled && "(Limit)"}</option>); })} </select> </div> )}
                             {safeDependentControllers.length >= (maxDeps ?? Infinity) && (<p className="limit-reached-text indented">Max dependents ({maxDeps}) reached.</p>)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ==================================================
//          Main AdvancedConfig Component
// ==================================================
export default function AdvancedConfig() {
    // --- Use Contexts ---
    const { addQuote, currentUser, selectedCurrency, setSelectedCurrency } = useQuotes();
    const { getProductDetails } = useProducts(); // Get lookup function
    // --- End Use Contexts ---

    const navigate = useNavigate();

    /* ========== State ========== */
    const [projectName, setProjectName] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const [requiredInputs, setRequiredInputs] = useState(0);
    const [requiredOutputs, setRequiredOutputs] = useState(0);
    const [newSiteName, setNewSiteName] = useState("");
    const [sites, setSites] = useState([]);

    /* ========== Utility Functions ========== */
    const calculateSynAppDoorCount = useCallback((synAppControllerId) => {
        let doorCount = 0;
        for (const site of sites) {
            const parentSynApp = site.controllers.find(c => c.id === synAppControllerId && c.model === 'SynApp');
            if (parentSynApp) {
                doorCount += parentSynApp.doorsSupported || 0; // Count SynApp's own door
                const dependents = Array.isArray(parentSynApp.dependentControllers) ? parentSynApp.dependentControllers : [];
                dependents.forEach(dep => { doorCount += CONTROLLERS.find(c => c.model === dep.model)?.doorsSupported || 0; });
                break; // Found the SynApp
            }
        }
        return doorCount;
    }, [sites]);


    /* ========== State Update Handlers ========== */

    // Update door config field
    const handleUpdateDoorConfig = useCallback((siteId, controllerId, doorId, field, value) => {
        setSites(prevSites => prevSites.map(site => site.id !== siteId ? site : { ...site, controllers: site.controllers.map(controller => { if (controller.id === controllerId) { return { ...controller, doors: controller.doors.map(door => door.id === doorId ? { ...door, config: { ...door.config, [field]: value } } : door) }; } if (controller.model === 'SynApp' && Array.isArray(controller.dependentControllers)) { let match = false; const updatedDeps = controller.dependentControllers.map(dep => { if (dep.id === controllerId) { match = true; return { ...dep, doors: dep.doors.map(door => door.id === doorId ? { ...door, config: { ...door.config, [field]: value } } : door) }; } return dep; }); if (match) return { ...controller, dependentControllers: updatedDeps }; } return controller; }) })
        );
    }, []);

    // Toggle user enable/disable for a door
     const handleToggleDoor = useCallback((siteId, controllerId, doorId) => {
        setSites(prevSites => prevSites.map(site => site.id !== siteId ? site : { ...site, controllers: site.controllers.map(controller => { if (controller.id === controllerId) { return { ...controller, doors: controller.doors.map(door => door.id === doorId ? { ...door, enabled: !door.enabled } : door) }; } if (controller.model === 'SynApp' && Array.isArray(controller.dependentControllers)) { let match = false; const updatedDeps = controller.dependentControllers.map(dep => { if (dep.id === controllerId) { match = true; return { ...dep, doors: dep.doors.map(door => door.id === doorId ? { ...door, enabled: !door.enabled } : door) }; } return dep; }); if (match) return { ...controller, dependentControllers: updatedDeps }; } return controller; }) })
        );
     }, []);

    // Rule Application Logic (Memoized & Corrected for SynConSC/DuoDuo)
    const applyDoorRules = useCallback((door, controllerModel, allDoorsOnController = []) => { // Added allDoorsOnController
        let isDisabledByRule = false; let forcedEnableState = null; let restrictedOptions = {};
        const ctrlDef = CONTROLLERS.find(c => c.model === controllerModel);

        // Rule 1 (Corrected): Wiegand + In/Out on SynConSC/DuoDuo
        const appliesWiegandInOutRestriction = ['SynConSC', 'SynConDuoDuo'].includes(controllerModel);
        if (appliesWiegandInOutRestriction) {
            const isAnyDoorWiegandInOut = allDoorsOnController.some(
                d => d.config.readerProtocol === 'Wiegand' && d.config.readerMode === 'In/Out'
            );
            // If the mode is active on any door, and this *specific* door is > 1, disable it
            if (isAnyDoorWiegandInOut && door.doorNumber > 1) {
                forcedEnableState = false;
                isDisabledByRule = true;
            }
        }

        // Rule 1b: Wiegand + In/Out on SynApp/SynOne (disables the door itself)
        if (door.config.readerProtocol === 'Wiegand' && door.config.readerMode === 'In/Out') {
            if (['SynApp', 'SynOne'].includes(controllerModel)) {
                 forcedEnableState = false; isDisabledByRule = true;
            }
        }

        // Rule 2: Controller doesn't support Wiegand (e.g., SynConEvo)
        if (ctrlDef && !ctrlDef.supportsWiegand) {
            const wiegandOption = 'Wiegand';
            restrictedOptions.readerProtocol = [...new Set([...(restrictedOptions.readerProtocol || []), wiegandOption])];
            if (door.config.readerProtocol === 'Wiegand') { forcedEnableState = false; isDisabledByRule = true; } // Invalid state
        }
        // Add more rules here...

        return { ...door, isDisabledByRule, forcedEnableState, restrictedOptions };
    }, []);

    // useEffect to Apply Rules (MODIFIED to pass allDoorsOnController)
    useEffect(() => {
        let changesMade = false;
        const newSites = sites.map(site => {
            let siteControllersChanged = false;
            const updatedControllers = site.controllers.map(controller => {
                let controllerItselfChanged = false;
                // Pass controller.doors to applyDoorRules for context
                const controllerDoors = Array.isArray(controller.doors) ? controller.doors : [];
                const updatedDoors = controllerDoors.map(door => {
                    const newDoorState = applyDoorRules(door, controller.model, controllerDoors); // Pass controllerDoors
                    if (newDoorState.isDisabledByRule !== door.isDisabledByRule || newDoorState.forcedEnableState !== door.forcedEnableState || JSON.stringify(newDoorState.restrictedOptions) !== JSON.stringify(door.restrictedOptions || {})) {
                        changesMade = true; controllerItselfChanged = true;
                    } return newDoorState;
                });
                // Apply rules to dependents
                let updatedDependentControllers = controller.dependentControllers;
                let dependentsListChanged = false;
                if (controller.model === "SynApp" && Array.isArray(controller.dependentControllers)) {
                    updatedDependentControllers = controller.dependentControllers.map(depCtrl => {
                         let depCtrlDoorsChanged = false;
                         const dependentDoors = Array.isArray(depCtrl.doors) ? depCtrl.doors : []; // Ensure array
                         // Pass dependent's doors array for context
                         const updatedDepDoors = dependentDoors.map(door => {
                            const newDoorState = applyDoorRules(door, depCtrl.model, dependentDoors); // Pass dependentDoors
                             if (newDoorState.isDisabledByRule !== door.isDisabledByRule || newDoorState.forcedEnableState !== door.forcedEnableState || JSON.stringify(newDoorState.restrictedOptions) !== JSON.stringify(door.restrictedOptions || {})) {
                                 changesMade = true; depCtrlDoorsChanged = true;
                             } return newDoorState;
                         });
                         if(depCtrlDoorsChanged) { dependentsListChanged = true; return { ...depCtrl, doors: updatedDepDoors }; }
                         return depCtrl;
                    });
                }
                if (controllerItselfChanged || dependentsListChanged) { siteControllersChanged = true; return { ...controller, doors: updatedDoors, dependentControllers: updatedDependentControllers }; } return controller;
            });
            if (siteControllersChanged) { return { ...site, controllers: updatedControllers }; } return site;
        });
        if (changesMade) { setSites(newSites); }
    }, [sites, applyDoorRules]);

    // Dashboard Metrics Calculation (Memoized)
    const dashboardMetrics = useMemo(() => {
        const counts = { SynApp: 0, SynOne: 0, SynConSC: 0, SynConDuoDuo: 0, SynConEvo: 0, SynIO: 0 }; let totalEffectivelyEnabledDoors = 0, totalReadersForEnabledDoors = 0, capacityDoors = 0, capacityReaders = 0, capacityInputsNonIO = 0, capacityOutputsNonIO = 0;
        sites.forEach(site => { site.controllers.forEach(controller => { const ctrlDef = CONTROLLERS.find(c => c.model === controller.model); if (!ctrlDef) return; counts[controller.model]++; capacityDoors += ctrlDef.doorsSupported; capacityReaders += ctrlDef.readersSupported; if(controller.model !== 'SynIO') { capacityInputsNonIO += ctrlDef.inputs; capacityOutputsNonIO += ctrlDef.outputs; } controller.doors.forEach(door => { const isEffectivelyEnabled = door.forcedEnableState !== null ? door.forcedEnableState : door.enabled; if (isEffectivelyEnabled) { totalEffectivelyEnabledDoors++; if (door.config.readerMode === 'In/Out') totalReadersForEnabledDoors += 2; else if (door.config.readerMode === 'In') totalReadersForEnabledDoors += 1; } }); if (controller.model === "SynApp" && Array.isArray(controller.dependentControllers)) { controller.dependentControllers.forEach(depCtrl => { const depCtrlDef = CONTROLLERS.find(c => c.model === depCtrl.model); if (!depCtrlDef) return; counts[depCtrl.model]++; capacityDoors += depCtrlDef.doorsSupported; capacityReaders += depCtrlDef.readersSupported; if(depCtrl.model !== 'SynIO') { capacityInputsNonIO += depCtrlDef.inputs; capacityOutputsNonIO += depCtrlDef.outputs; } depCtrl.doors.forEach(door => { const isEffectivelyEnabled = door.forcedEnableState !== null ? door.forcedEnableState : door.enabled; if (isEffectivelyEnabled) { totalEffectivelyEnabledDoors++; if (door.config.readerMode === 'In/Out') totalReadersForEnabledDoors += 2; else if (door.config.readerMode === 'In') totalReadersForEnabledDoors += 1; } }); }); } }); });
        const inputsDeficit = Math.max(0, requiredInputs - capacityInputsNonIO); const outputsDeficit = Math.max(0, requiredOutputs - capacityOutputsNonIO); const synIODef = CONTROLLERS.find(c => c.model === "SynIO"); const synIOInputs = synIODef?.inputs || 1; const synIOOutputs = synIODef?.outputs || 1; const synIOsNeeded = Math.max( inputsDeficit > 0 ? Math.ceil(inputsDeficit / synIOInputs) : 0, outputsDeficit > 0 ? Math.ceil(outputsDeficit / synIOOutputs) : 0 ); counts.SynIO = synIOsNeeded; const finalCapacityInputs = capacityInputsNonIO + counts.SynIO * (synIODef?.inputs || 0); const finalCapacityOutputs = capacityOutputsNonIO + counts.SynIO * (synIODef?.outputs || 0);
        return { requiredDoors: totalEffectivelyEnabledDoors, requiredReaders: totalReadersForEnabledDoors, providedDoors: capacityDoors, providedReaders: capacityReaders, providedInputs: finalCapacityInputs, providedOutputs: finalCapacityOutputs, controllerCounts: counts };
    }, [sites, requiredInputs, requiredOutputs, calculateSynAppDoorCount]); // Added calculate callback as dep

    /* ========== Handlers for Adding/Deleting Sites & Controllers ========== */
    const handleAddSite = () => { if (!newSiteName.trim()) { alert("Site name needed."); return; } setSites(prev => [...prev, { id: uuid(), name: newSiteName.trim(), controllers: [] }]); setNewSiteName(""); };
    const handleDeleteSite = (siteId) => { if (window.confirm("Delete site & config?")) { setSites(prev => prev.filter(site => site.id !== siteId)); } };

    // Add Site Controller
    const handleAddController = (siteId, controllerModel) => {
         const controllerDef = CONTROLLERS.find(c => c.model === controllerModel); if (!controllerDef || !controllerDef.isSiteController) { alert("Invalid site controller type."); return; }
         setSites(prevSites => prevSites.map(site => site.id === siteId ? { ...site, controllers: [...site.controllers, createController(controllerModel)] } : site ));
    };

    // Add Dependent Controller (with limit checks)
     const handleAddDependentController = (siteId, parentSynAppId, dependentModel) => {
         const dependentDef = CONTROLLERS.find(c => c.model === dependentModel); if (!dependentDef || dependentDef.isSiteController) { alert("Invalid dependent type."); return; }
         let targetSynApp = null; let parentDef = null;
         for (const site of sites) { if (site.id === siteId) { targetSynApp = site.controllers.find(c => c.id === parentSynAppId && c.model === 'SynApp'); break; } }
         if (!targetSynApp) { console.error("Parent SynApp not found"); alert("Error: Parent not found."); return; }
         parentDef = CONTROLLERS.find(c => c.model === targetSynApp.model); if (!parentDef) { console.error("Parent def not found"); return; }
         const safeDependents = Array.isArray(targetSynApp.dependentControllers) ? targetSynApp.dependentControllers : [];
         const currentDeps = safeDependents.length; const currentReaders = safeDependents.reduce((sum, dep) => sum + (CONTROLLERS.find(c => c.model === dep.model)?.readersSupported || 0), 0); const currentDoors = calculateSynAppDoorCount(parentSynAppId);
         const readerCost = dependentDef.readersSupported || 0; const doorCost = dependentDef.doorsSupported || 0; const maxDepsLimit = parentDef.maxDeps ?? Infinity; const maxReadersLimit = parentDef.maxDepReaders ?? Infinity; const maxDoorsLimit = MAX_DOORS_PER_SYNAPP_SYSTEM;
         if (currentDeps >= maxDepsLimit) { alert(`Limit reached: ${maxDepsLimit} dependents.`); return; }
         if (currentReaders + readerCost > maxReadersLimit) { alert(`Limit reached: ${maxReadersLimit} readers (Current: ${currentReaders}, Adding: ${readerCost}).`); return; }
         if (currentDoors + doorCost > maxDoorsLimit) { alert(`Limit reached: ${maxDoorsLimit} doors (Current: ${currentDoors}, Adding: ${doorCost}).`); return; }
         setSites(prevSites => prevSites.map(site => { if (site.id !== siteId) return site; return { ...site, controllers: site.controllers.map(controller => { if (controller.id === parentSynAppId && controller.model === 'SynApp') { const newDependent = createController(dependentModel); if (newDependent) { newDependent.parentId = parentSynAppId; const currentDepsArr = Array.isArray(controller.dependentControllers) ? controller.dependentControllers : []; return { ...controller, dependentControllers: [...currentDepsArr, newDependent] }; } } return controller; }) }; }));
     };

     // Delete any controller
     const handleDeleteController = (siteId, controllerId) => {
         let controllerToDelete = null; let isDependent = false; let parentSynAppForDependent = null; const targetSite = sites.find(s => s.id === siteId); if(targetSite) { controllerToDelete = targetSite.controllers.find(c => c.id === controllerId); if (!controllerToDelete) { for (const ctrl of targetSite.controllers) { if (ctrl.model === 'SynApp' && Array.isArray(ctrl.dependentControllers)) { const dep = ctrl.dependentControllers.find(d => d.id === controllerId); if (dep) { controllerToDelete = dep; isDependent = true; parentSynAppForDependent = ctrl; break; } } } } } if (!controllerToDelete) { console.error("Controller to delete not found"); alert("Error: Controller not found."); return; } const controllerTypeDesc = isDependent ? '(Dependent)' : (controllerToDelete.isSiteController ? '(Site Ctrl)' : ''); if (!window.confirm(`Delete ${controllerToDelete.model} ${controllerTypeDesc}?`)) { return; }
         setSites(prevSites => prevSites.map(site => { if (site.id !== siteId) return site; if (isDependent && parentSynAppForDependent) { return { ...site, controllers: site.controllers.map(c => (c.id === parentSynAppForDependent.id) ? { ...c, dependentControllers: (Array.isArray(c.dependentControllers) ? c.dependentControllers : []).filter(dep => dep.id !== controllerId) } : c ) }; } else { return { ...site, controllers: site.controllers.filter(c => c.id !== controllerId) }; } }));
     };

     // Save Quote Handler (Uses Product Context)
    const handleSaveQuote = () => {
        if (!projectName.trim()) { alert("Project name needed."); return; }
        if (sites.length === 0) { alert("Add site config."); return; }

        const items = [];
        // Use counts calculated including dependents by dashboardMetrics
        const itemCounts = dashboardMetrics.controllerCounts;

        Object.entries(itemCounts).forEach(([model, qty]) => {
            if (qty > 0) {
                const productInfo = getProductDetails(model); // Use context lookup
                // Fallback description using CONTROLLERS if product lookup fails
                const fallbackDescription = CONTROLLERS.find(c => c.model === model)?.description ?? 'Unknown Item';

                const msrpKey = selectedCurrency === 'GBP' ? 'msrpGBP' : 'msrpEUR';
                // Ensure productInfo exists before accessing keys, provide default 0 for price
                const msrp = parseFloat(productInfo?.[msrpKey]) || 0;
                const description = productInfo?.descriptionEN ?? fallbackDescription;
                // Infer cost type more robustly
                const costType = (productInfo?.type === 'Cloud' || productInfo?.type === 'Monthly' || productInfo?.method === 'Monthly') ? 'monthly' : 'one-off';

                items.push({
                    uniqueId: uuid(), // Add unique ID for quote items
                    model: model,
                    description: description,
                    qty: qty,
                    msrp: msrp,
                    discountPercent: 0, // Default or fetch from profile later
                    costType: costType,
                });
            }
        });

        if (items.length === 0) { alert("No controllers calculated to add to quote."); return; }

        addQuote({
            name: projectName,
            items: items,
            currency: selectedCurrency, // Save selected currency with the quote
            status: "Advanced Config",
            company: currentUser?.company || "N/A",
            // Save the detailed configuration if needed for editing later
            advancedConfigState: { sites }, // Store the sites structure
            configuration: { projectName, totalUsers, requiredInputs, requiredOutputs } // Basic inputs
        });
        navigate("/"); // Go back to dashboard
    };


    /* ========== Render UI ========== */
    return (
        <div className="advanced-config-page">
            {/* Header */}
            <div className="header-bar">
                 <img src={synguardLogo} alt="Synguard Logo" className="header-logo" />
                 <div className="header-title">Advanced Config</div>
                 {/* Currency Toggle */}
                 <div className="currency-toggle">
                     <button onClick={() => setSelectedCurrency('GBP')} className={selectedCurrency === 'GBP' ? 'active' : ''} title="Set Currency to GBP">£</button>
                     <button onClick={() => setSelectedCurrency('EUR')} className={selectedCurrency === 'EUR' ? 'active' : ''} title="Set Currency to EUR">€</button>
                 </div>
                 {/* Removed Spacer */}
            </div>

            {/* Main Layout */}
            <div className="advanced-config-layout">
                {/* Left Panel */}
                <div className="panel config-inputs">
                    <h3><FaCog /> Project Details & Requirements</h3>
                    <label>Project Name <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g., Project Phoenix" /></label>
                    <label>Total Users (Approx) <input type="number" min={0} value={totalUsers} onChange={e => setTotalUsers(Math.max(0, +e.target.value))} /></label>
                     <label title="Generic inputs needed (for SynIO calc)"><FaInfoCircle /> Required Generic Inputs <input type="number" min={0} value={requiredInputs} onChange={e => setRequiredInputs(Math.max(0, +e.target.value))} /></label>
                    <label title="Generic outputs needed (for SynIO calc)"><FaInfoCircle /> Required Generic Outputs <input type="number" min={0} value={requiredOutputs} onChange={e => setRequiredOutputs(Math.max(0, +e.target.value))} /></label>
                    <div className="add-site-section"> <label>New Site Name <input value={newSiteName} onChange={e => setNewSiteName(e.target.value)} placeholder="e.g., HQ Building" /></label> <button onClick={handleAddSite} disabled={!newSiteName.trim()} title="Add site"><FaPlus /> Add Site</button> </div>
                </div>
                {/* Right Panel */}
                 <div className="panel dashboard-panel">
                     <h3><FaSitemap /> Resource Summary</h3>
                     <table className="resource-summary-table">
                         <thead><tr><th>Resource</th><th>Required</th><th>Provided</th><th>Status</th></tr></thead>
                         <tbody>
                             {[ { name: 'Doors', req: dashboardMetrics.requiredDoors, prov: dashboardMetrics.providedDoors }, { name: 'Readers', req: dashboardMetrics.requiredReaders, prov: dashboardMetrics.providedReaders }, { name: 'Inputs', req: requiredInputs, prov: dashboardMetrics.providedInputs, note: ' (Generic)' }, { name: 'Outputs', req: requiredOutputs, prov: dashboardMetrics.providedOutputs, note: ' (Generic)' }, ].map(item => { const isOk = item.prov >= item.req; return ( <tr key={item.name}><td>{item.name}{item.note || ''}</td><td>{item.req}</td><td>{item.prov}</td><td className={`status-indicator ${isOk ? 'ok' : 'deficient'}`} title={isOk ? 'Sufficient' : 'Deficient'}>{isOk ? <FaCheckCircle /> : <FaExclamationTriangle />}</td></tr> ); })}
                         </tbody>
                     </table>
                     <h4 style={{ marginTop: '15px' }}>Controller Counts</h4>
                      <ul className="controller-count-list">
                           {Object.entries(dashboardMetrics.controllerCounts).filter(([, qty]) => qty > 0).map(([model, qty]) => (<li key={model}>{model}: {qty}</li>))}
                           {Object.values(dashboardMetrics.controllerCounts).every(qty => qty === 0) && (<li>No controllers added.</li>)}
                      </ul>
                 </div>
            </div>
            {/* Site Containers Area */}
             <div className="site-containers-area">
                 <h3><FaNetworkWired /> System Structure ({sites.length} Sites)</h3>
                 {sites.length === 0 && <p className="no-sites-message">Add a site to begin.</p>}
                 {sites.map((site, siteIndex) => (
                     <div key={site.id} className="site-container panel">
                         <div className="site-header">
                             <h4><FaSitemap /> {site.name}</h4>
                             {/* Add Site Controller Buttons */}
                             <div className="add-site-controller-buttons">
                                 <span>Add Site Controller: </span>
                                 {/* Use CONTROLLERS const for available models */}
                                 {CONTROLLERS.filter(c => c.isSiteController).map(c => (<button key={c.model} onClick={() => handleAddController(site.id, c.model)} title={`Add ${c.description} to ${site.name}`}><FaPlus /> {c.model}</button>))}
                             </div>
                             <button onClick={() => handleDeleteSite(site.id)} className="delete-site-btn" title={`Delete Site: ${site.name}`}><FaTrashAlt /> Delete Site</button>
                         </div>
                         {/* Render Controllers List */}
                         <div className="site-controllers-list">
                            {site.controllers.length === 0 && <p className="no-controllers-message">No controllers added to this site yet.</p>}
                             {site.controllers.map((controller, controllerIndex) => (
                                 <ControllerDisplay
                                     key={controller.id} siteId={site.id} controller={controller} controllerIndex={controllerIndex} siteIndex={siteIndex}
                                     onUpdateDoorConfig={handleUpdateDoorConfig} onToggleDoor={handleToggleDoor} onAddDependentController={handleAddDependentController}
                                     onDeleteController={handleDeleteController} calculateSynAppDoorCount={calculateSynAppDoorCount}
                                     // Pass constant down as prop
                                     maxDoorsPerSystem={MAX_DOORS_PER_SYNAPP_SYSTEM}
                                 />
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
            {/* Floating Save Button Bar */}
             <div className="floating-bar">
                 <button onClick={handleSaveQuote} disabled={sites.length === 0 || sites.every(s => s.controllers.length === 0)} title={sites.length === 0 || sites.every(s => s.controllers.length === 0) ? "Add site/controllers" : "Save Quote"} > 💾 Save Quote </button>
            </div>
        </div>
    );
}
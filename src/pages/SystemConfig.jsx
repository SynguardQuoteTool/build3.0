// src/pages/SystemConfig.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuickConfig } from "../context/QuickConfigContext";
import ConfigModal from "./ConfigModal";
import "../pages/QuickConfig.css";

const protocolOptions = ["Wiegand", "OSDP"];
const deploymentOptions = ["In", "In & out"];
const defaultSelectOption = "- Select -";

// Define controllers with full specs from the table
const CONTROLLERS = [
    { model: "SynApp", isSiteController: true, connectionToServer: "IP", baseDoors: 1, baseWiegandReaders: 1, baseOSDPReaders: 2, wiegandInOutDoors: 0, osdpInOutDoors: 1, baseInputs: 3, baseOutputs: 2, maxDoorControllers: 32, maxReaders: 256, requiresSynApp: true },
    { model: "SynOne", isSiteController: true, connectionToServer: "IP", baseDoors: 1, baseWiegandReaders: 1, baseOSDPReaders: 2, wiegandInOutDoors: 0, osdpInOutDoors: 1, baseInputs: 3, baseOutputs: 2, maxDoorControllers: 0, requiresSynApp: false },
    { model: "SynConSC", isSiteController: false, connectsToSiteController: true, connectsRS485: true, baseDoors: 2, baseWiegandReaders: 2, baseOSDPReaders: 4, wiegandInOutDoors: 1, osdpInOutDoors: 2, baseInputs: 6, baseOutputs: 2, requiresSynApp: true },
    { model: "SynConDuoDuo", isSiteController: false, connectsToSiteController: true, connectsRS485: true, baseDoors: 4, baseWiegandReaders: 0, baseOSDPReaders: 8, wiegandInOutDoors: 0, osdpInOutDoors: 4, baseInputs: 6, baseOutputs: 4, requiresSynApp: true },
    { model: "SynConEvo", isSiteController: false, connectsToSiteController: true, connectsRS485: true, connectsIP: true, baseDoors: 8, baseWiegandReaders: 0, baseOSDPReaders: 16, wiegandInOutDoors: 0, osdpInOutDoors: 8, baseInputs: 20, baseOutputs: 8, requiresSynApp: true },
    { model: "SynIO", isSiteController: false, connectsToSiteController: true, connectsRS485: true, baseDoors: 0, baseWiegandReaders: 0, baseOSDPReaders: 0, baseInputs: 16, baseOutputs: 16, requiresSynApp: true },
];

export default function SystemConfig() {
    const { configState, updateConfigState } = useQuickConfig();
    const navigate = useNavigate();
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [availableDeployments, setAvailableDeployments] = useState(deploymentOptions);
    const [availableCommsTypes, setAvailableCommsTypes] = useState([]);
    const [availableTargetCapacities, setAvailableTargetCapacities] = useState([]);
    const [isOutReaderDisabled, setIsOutReaderDisabled] = useState(true);

    // Update available deployments based on protocol and commsType
    useEffect(() => {
        console.log("SystemConfig: Updating availableDeployments", { protocol: configState.protocol, commsType: configState.commsType });
        let dp = ["In", "In & out"];
        if (configState.protocol === "Wiegand" && configState.commsType === "IP") {
            dp = ["In"];
            if (configState.deployment === "In & out") {
                console.log("SystemConfig: Resetting deployment to 'In' due to Wiegand + IP");
                updateConfigState({ deployment: "In" });
            }
        }
        setAvailableDeployments(dp);
        if (configState.protocol && configState.deployment && !dp.includes(configState.deployment)) {
            console.log("SystemConfig: Resetting deployment to empty due to invalid selection");
            updateConfigState({ deployment: "" });
        }
    }, [configState.protocol, configState.commsType, configState.deployment, updateConfigState]);

    // Update available comms types based on protocol and deployment
    useEffect(() => {
        console.log("SystemConfig: Updating availableCommsTypes", { protocol: configState.protocol, deployment: configState.deployment });
        let co = [];
        let dis = true;
        if (configState.protocol === "Wiegand") {
            if (configState.deployment === "In") {
                co = ["IP", "RS-485"];
                dis = true;
            } else if (configState.deployment === "In & out") {
                co = ["RS-485"];
                dis = false;
            }
        } else if (configState.protocol === "OSDP") {
            co = ["IP", "RS-485", "Mixed (RS-485 & IP)"];
            dis = configState.deployment === "In";
        }
        setAvailableCommsTypes(co);
        if (configState.commsType && !co.includes(configState.commsType)) {
            console.log("SystemConfig: Resetting commsType to empty due to invalid selection");
            updateConfigState({ commsType: "" });
        }
        updateConfigState({ readersOut: dis ? 0 : configState.readersOut });
        setIsOutReaderDisabled(dis);
    }, [configState.protocol, configState.deployment, configState.commsType, updateConfigState]);

    // Compute available controllers and their effective door counts
    const availableControllerData = useMemo(() => {
        if (!configState.protocol || !configState.deployment || !configState.commsType) return [];
        let mdls = [];
        let caps = {};

        if (configState.protocol === 'Wiegand') {
            if (configState.deployment === 'In') {
                if (configState.commsType === 'IP') {
                    mdls = ['SynApp', 'SynOne'];
                    caps = {
                        'SynApp': { doors: 1, readers: 1, wiegand: 1, requiresSynApp: true },
                        'SynOne': { doors: 1, readers: 1, wiegand: 1, requiresSynApp: false }
                    };
                } else if (configState.commsType === 'RS-485') {
                    mdls = ['SynApp', 'SynConSC'];
                    caps = {
                        'SynApp': { doors: 1, readers: 1, wiegand: 1, requiresSynApp: true },
                        'SynConSC': { doors: 2, readers: 2, wiegand: 2, requiresSynApp: true }
                    };
                }
            } else if (configState.deployment === 'In & out') {
                if (configState.commsType === 'RS-485') {
                    mdls = ['SynConSC'];
                    caps = {
                        'SynConSC': { doors: 1, doorsInOnly: 2, readers: 2, wiegand: 2, requiresSynApp: true }
                    };
                }
            }
        } else if (configState.protocol === 'OSDP') {
            if (configState.deployment === 'In') {
                if (configState.commsType === 'IP') {
                    mdls = ['SynConEvo', 'SynOne'];
                    caps = {
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true },
                        'SynOne': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: false }
                    };
                } else if (configState.commsType === 'RS-485') {
                    mdls = ['SynApp', 'SynConSC', 'SynConDuoDuo', 'SynConEvo'];
                    caps = {
                        'SynApp': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: true },
                        'SynConSC': { doors: 2, readers: 4, wiegand: 0, requiresSynApp: true },
                        'SynConDuoDuo': { doors: 4, readers: 8, wiegand: 0, requiresSynApp: true },
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true }
                    };
                } else if (configState.commsType === 'Mixed (RS-485 & IP)') {
                    mdls = ['SynApp', 'SynConSC', 'SynConDuoDuo', 'SynConEvo', 'SynOne'];
                    caps = {
                        'SynApp': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: true },
                        'SynConSC': { doors: 2, readers: 4, wiegand: 0, requiresSynApp: true },
                        'SynConDuoDuo': { doors: 4, readers: 8, wiegand: 0, requiresSynApp: true },
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true },
                        'SynOne': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: false }
                    };
                }
            } else if (configState.deployment === 'In & out') {
                if (configState.commsType === 'IP') {
                    mdls = ['SynConEvo', 'SynOne'];
                    caps = {
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true },
                        'SynOne': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: false }
                    };
                } else if (configState.commsType === 'RS-485') {
                    mdls = ['SynApp', 'SynConSC', 'SynConDuoDuo', 'SynConEvo'];
                    caps = {
                        'SynApp': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: true },
                        'SynConSC': { doors: 2, readers: 4, wiegand: 0, requiresSynApp: true },
                        'SynConDuoDuo': { doors: 4, readers: 8, wiegand: 0, requiresSynApp: true },
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true }
                    };
                } else if (configState.commsType === 'Mixed (RS-485 & IP)') {
                    mdls = ['SynApp', 'SynConSC', 'SynConDuoDuo', 'SynConEvo', 'SynOne'];
                    caps = {
                        'SynApp': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: true },
                        'SynConSC': { doors: 2, readers: 4, wiegand: 0, requiresSynApp: true },
                        'SynConDuoDuo': { doors: 4, readers: 8, wiegand: 0, requiresSynApp: true },
                        'SynConEvo': { doors: 8, readers: 16, wiegand: 0, requiresSynApp: true },
                        'SynOne': { doors: 1, readers: 2, wiegand: 0, requiresSynApp: false }
                    };
                }
            }
        }

        return mdls.map(m => {
            const b = CONTROLLERS.find(c => c.model === m);
            const e = caps[m] || {};
            const r = e.requiresSynApp !== false;
            return {
                model: m,
                description: b?.description || 'Unknown',
                effectiveDoors: e.doors ?? b?.baseDoors ?? 0,
                effectiveDoorsInOnly: e.doorsInOnly ?? e.doors ?? b?.baseDoors ?? 0,
                effectiveReaders: e.readers ?? (tech === 'Wiegand' ? b?.baseWiegandReaders : b?.baseOSDPReaders) ?? 0,
                effectiveWiegand: e.wiegand ?? b?.baseWiegandReaders ?? 0,
                requiresSynAppInitially: r,
            };
        }).filter(c => !(configState.protocol === 'Wiegand' && c.model === 'SynConEvo'));
    }, [configState.protocol, configState.deployment, configState.commsType]);

    // Update target doors per controller options
    useEffect(() => {
        const controllers = availableControllerData.filter(c => c.model !== 'SynApp' && c.model !== 'SynIO' && c.effectiveDoors > 0);
        const uniqueCapacities = [...new Set(controllers.map(c => c.effectiveDoors))].sort((a, b) => a - b);

        const capacitiesWithLabels = uniqueCapacities.map(capacity => {
            const controller = controllers.find(c => c.effectiveDoors === capacity);
            if (configState.protocol === 'Wiegand' && configState.deployment === 'In & out' && controller.effectiveDoorsInOnly && controller.effectiveDoorsInOnly !== capacity) {
                return {
                    value: capacity,
                    label: `${controller.effectiveDoorsInOnly} (In) / ${capacity} (In & out)`
                };
            }
            return {
                value: capacity,
                label: `${capacity} Doors`
            };
        });

        setAvailableTargetCapacities(capacitiesWithLabels);
        if (configState.targetDoorsPerController && !uniqueCapacities.includes(parseInt(configState.targetDoorsPerController))) {
            updateConfigState({ targetDoorsPerController: "" });
        }
    }, [availableControllerData, configState.targetDoorsPerController, configState.protocol, configState.deployment, updateConfigState]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log("SystemConfig: handleChange", { name, value, type, checked });
        updateConfigState({ [name]: type === "checkbox" ? checked : value });
    };

    const handleConfigSave = (config) => {
        console.log("SystemConfig: Saving config from modal", config);
        updateConfigState({
            protocol: config.protocol,
            deployment: config.deployment === "In Only" ? "In" : "In & out",
            commsType: config.doorComms,
            targetDoorsPerController: config.targetDoorsPerController,
        });
        setIsOutReaderDisabled(config.deployment === "In Only");
        setShowConfigModal(false);
    };

    const handleConfigModalOpen = () => {
        if (!configState.protocol || !configState.deployment || !configState.commsType || availableTargetCapacities.length === 0) {
            alert("Please complete all system configuration selections before adjusting.");
            return;
        }
        setShowConfigModal(true);
    };

    const handleNext = () => {
        if (!configState.protocol || !configState.deployment || !configState.commsType) {
            alert("Please complete all system configuration selections.");
            return;
        }
        navigate("/quick/requirements");
    };

    return (
        <div className="quick-config-page">
            <div className="header-bar">
                <div className="header-title">Quick Config - System Configuration</div>
            </div>
            <div className="inputs-panel panel" style={{ maxWidth: "600px", margin: "20px auto" }}>
                <h3>System Configuration</h3>
                <button onClick={handleConfigModalOpen}>Open Configuration Modal</button>
                <div className="config-box">
                    <label>
                        Reader Protocol <span style={{ color: "red" }}>*</span>
                        <select
                            name="protocol"
                            value={configState.protocol}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                {defaultSelectOption}
                            </option>
                            {protocolOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Reader Deployment <span style={{ color: "red" }}>*</span>
                        <select
                            name="deployment"
                            value={configState.deployment}
                            onChange={handleChange}
                            disabled={!configState.protocol}
                            required
                        >
                            <option value="" disabled>
                                {defaultSelectOption}
                            </option>
                            {availableDeployments.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Comms Type <span style={{ color: "red" }}>*</span>
                        <select
                            name="commsType"
                            value={configState.commsType}
                            onChange={handleChange}
                            disabled={!configState.protocol || !configState.deployment}
                            required
                        >
                            <option value="" disabled>
                                {defaultSelectOption}
                            </option>
                            {availableCommsTypes.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Target Doors per Controller <small>(Optional)</small>
                        <select
                            name="targetDoorsPerController"
                            value={configState.targetDoorsPerController}
                            onChange={handleChange}
                            disabled={!configState.commsType || availableTargetCapacities.length === 0}
                        >
                            <option value="">Default (Highest Capacity)</option>
                            {availableTargetCapacities.map((cap) => (
                                <option key={cap.value} value={cap.value}>
                                    {cap.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="excludeSynAppDoor"
                            checked={configState.excludeSynAppDoor}
                            onChange={handleChange}
                        />
                        Exclude SynApp Built-in Door/Resources
                    </label>
                </div>
                <div className="floating-save">
                    <button onClick={() => navigate("/quick/project")}>Back</button>
                    <button onClick={handleNext}>Next: Requirements</button>
                </div>
            </div>
            {showConfigModal && (
                <ConfigModal
                    initial={{
                        protocol: configState.protocol,
                        systemType: configState.systemType === "balanced" ? "balanced" : "balanced",
                        doorComms: configState.commsType,
                        deployment: configState.deployment === "In" ? "In Only" : "In & Out",
                        targetDoorsPerController: configState.targetDoorsPerController,
                        cloudMode: configState.systemType.toLowerCase(),
                    }}
                    doorCountOptions={availableTargetCapacities}
                    onSave={handleConfigSave}
                    onClose={() => setShowConfigModal(false)}
                />
            )}
        </div>
    );
}
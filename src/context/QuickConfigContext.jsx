import React, { createContext, useContext, useState } from 'react';

const initialState = {
  name: "",
  systemType: "",
  date: new Date().toISOString().slice(0, 10),
  protocol: "",
  commsType: "",
  deployment: "In Only",
  targetDoorsPerController: "",
  excludeSynAppDoor: false,
  doors: 0,
  readersIn: 0,
  readersOut: 0,
  reqInputs: 0,
  reqOutputs: 0,
  systemUsers: 0,
  softwareSelections: {},
  softwareQuoteItems: [],
  client: "",
  notes: "",
};

const QuickConfigContext = createContext();

export const useQuickConfig = () => useContext(QuickConfigContext);

export function QuickConfigProvider({ children }) {
  const [configState, setConfigState] = useState({ ...initialState });

  const updateConfigState = (newValues) => {
    setConfigState(prev => ({ ...prev, ...newValues }));
  };
  
  // Add a reset function
  const resetConfigState = () => {
    setConfigState({ ...initialState });
  };

  return (
    <QuickConfigContext.Provider value={{ configState, updateConfigState, resetConfigState }}>
      {children}
    </QuickConfigContext.Provider>
  );
}
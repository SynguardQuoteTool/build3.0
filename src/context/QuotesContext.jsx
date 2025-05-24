import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const QuotesContext = createContext();

// Custom hook to use the quotes context
export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (!context) {
    throw new Error("useQuotes must be used within a QuotesProvider");
  }
  return context;
};

export const QuotesProvider = ({ children }) => {
  // Initialize quotes from localStorage if available
  const [quotes, setQuotes] = useState(() => {
    const savedQuotes = localStorage.getItem("quotes");
    return savedQuotes ? JSON.parse(savedQuotes) : [];
  });
  
  const [currentUser, setCurrentUser] = useState({ company: "Demo Company" });
  const [selectedCurrency, setSelectedCurrency] = useState("GBP");
  
  // Save quotes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }, [quotes]);
  
  const addQuote = (quote) => {
    console.log("QuotesContext: Adding quote", quote);
    setQuotes((prev) => [...prev, quote]);
  };
  
  const updateQuote = (updatedQuote) => {
    console.log("QuotesContext: Updating quote with ID", updatedQuote.id);
    console.log("Current quotes:", quotes);
    console.log("Updated quote data:", updatedQuote);
    
    setQuotes((prevQuotes) => {
      const updatedQuotes = prevQuotes.map((q) => {
        if (String(q.id) === String(updatedQuote.id)) {
          console.log("Found quote to update:", q.id);
          return updatedQuote;
        }
        return q;
      });
      
      console.log("Updated quotes array:", updatedQuotes);
      return updatedQuotes;
    });
    
    return true; // Return success flag
  };
  
  const deleteQuote = (quoteId) => {
    setQuotes((prev) => prev.filter((q) => String(q.id) !== String(quoteId)));
  };
  
  return (
    <QuotesContext.Provider
      value={{
        quotes,
        setQuotes,
        addQuote,
        updateQuote,
        deleteQuote,
        currentUser,
        setCurrentUser,
        selectedCurrency,
        setSelectedCurrency
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
};
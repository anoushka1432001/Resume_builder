import React, { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showJsonModal, setShowJsonModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showJsonModal, setShowJsonModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the context
export const useModal = () => useContext(ModalContext);

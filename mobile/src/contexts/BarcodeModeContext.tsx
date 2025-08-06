// Global context for managing barcode scanner mode vs manual input mode
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BarcodeModeContextType } from '../../shared/schema';

const BarcodeModeContext = createContext<BarcodeModeContextType | undefined>(undefined);

interface BarcodeModeProviderProps {
  children: ReactNode;
}

export const BarcodeModeProvider: React.FC<BarcodeModeProviderProps> = ({ children }) => {
  const [barcodeMode, setBarcodeMode] = useState(true); // Default to barcode mode

  return (
    <BarcodeModeContext.Provider value={{ barcodeMode, setBarcodeMode }}>
      {children}
    </BarcodeModeContext.Provider>
  );
};

export const useBarcodeMode = (): BarcodeModeContextType => {
  const context = useContext(BarcodeModeContext);
  if (context === undefined) {
    throw new Error('useBarcodeMode must be used within a BarcodeModeProvider');
  }
  return context;
};
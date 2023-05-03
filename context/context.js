// src/context/state.js
import { createContext, useContext } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  let sharedState = "psychological_chemist@hotmail.com"; //the context 

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
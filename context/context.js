// src/context/state.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [user, setUser] = useState("psychological_chemist@hotmail.com");
  let sharedState = {/* whatever you want */}

  return (
    <AppContext.Provider value={user}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
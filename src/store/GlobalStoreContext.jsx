import React, { createContext, useContext } from 'react';
import {useProvideGlobalStore} from "./useProvideGlobalStore";

const GlobalStoreContext = createContext(null);

export const GlobalStoreProvider = ({ children }) => {
    const store = useProvideGlobalStore();
    return (
        <GlobalStoreContext.Provider value={store}>
            {children}
        </GlobalStoreContext.Provider>
    );
};

export const useGlobalStore = () => {
    const ctx = useContext(GlobalStoreContext);
    if (!ctx) throw new Error('useGlobalStore must be inside GlobalStoreProvider');
    return ctx;
};

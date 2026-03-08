"use client";

import { createContext, useContext, useState } from "react";

export const FabContext = createContext({ fab: null, setFab: () => {} });

export function FabProvider({ children }) {
    const [fab, setFab] = useState(null); // { onClick: fn } | null
    return (
        <FabContext.Provider value={{ fab, setFab }}>
            {children}
        </FabContext.Provider>
    );
}

export function useFab() {
    return useContext(FabContext);
}

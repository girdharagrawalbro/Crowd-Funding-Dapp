"use client";  // Mark this as a Client Component

import { Provider } from "react-redux";
import { store } from "./store"; // Adjust path based on your project structure
import { useEffect } from "react";

// Suppress console errors in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.error = () => {};
    console.warn = () => {};
}

export default function Providers({ children }) {
    useEffect(() => {
        // Also suppress in development if needed
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.error = (...args) => {
            // Filter out specific errors or suppress all
            if (args[0]?.includes?.('Warning:') || args[0]?.includes?.('Error:')) {
                return;
            }
            // Uncomment below to completely suppress all errors
            // return;
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            // Suppress all warnings
            return;
        };

        return () => {
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    return <Provider store={store}>{children}</Provider>;
}

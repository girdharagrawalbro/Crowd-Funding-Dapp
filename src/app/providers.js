"use client";  // Mark this as a Client Component

import { Provider } from "react-redux";
import { store } from "./store"; // Adjust path based on your project structure

export default function Providers({ children }) {
    return <Provider store={store}>{children}</Provider>;
}

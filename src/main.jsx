import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./contexts/AppContext";
import "./index.css";
import IntroAnimation from "./components/IntroAnimation";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
      {/* <IntroAnimation /> */}
    </AppProvider>
  </React.StrictMode>
);
